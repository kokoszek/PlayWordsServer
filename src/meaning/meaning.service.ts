import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { MeaningEntity } from "./meaning.entity";
import { Repository } from "typeorm";
import { WordEntity } from "../word/word.entity";
import { WordService } from "../word/word-service";
import { LinkEntity } from "./link.entity";
import WordParticle from "../word/word-particle.entity";

@Injectable()
export default class MeaningService {

  constructor(
    @InjectRepository(MeaningEntity)
    private meaningRepo: Repository<MeaningEntity>,
    @InjectRepository(WordEntity)
    private wordRepo: Repository<WordEntity>,
    @InjectRepository(LinkEntity)
    private linkRepo: Repository<LinkEntity>,
    @InjectRepository(WordParticle)
    private wordParticleRepo: Repository<WordParticle>,
    private wordService: WordService
  ) {
  }

  async getById(id: number) {
    return await this.meaningRepo
      .createQueryBuilder()
      .where({
        id: id
      })
      .getOne();
  }

  async searchByText(search: string): Promise<MeaningEntity[]> {
    const result: MeaningEntity[] = await this.meaningRepo
      .createQueryBuilder()
      .where("meaning_lang1_desc LIKE :search", {
        search: search + "%"
      })
      .orWhere("meaning_lang2_desc LIKE :search", {
        search: search + "%"
      })
      .getMany();
    return result;
  }

  async findMeaningWithWords(meaningId: number): Promise<MeaningEntity> {
    return await this.meaningRepo
      .createQueryBuilder("meaning")
      .select()
      .leftJoinAndSelect("meaning.words", "links")
      .leftJoinAndSelect("links.word", "word")
      .where({ id: meaningId })
      .getOne();
  }

  async deleteMeaning(meaningId: number): Promise<boolean> {
    const meaningSnapshowBeforeDelete: MeaningEntity = await this.findMeaningWithWords(meaningId);
    console.log("MeaningService -> deleteMeanings(id)", meaningId);
    let deleteResult = await this.linkRepo.delete({
      meaningId: meaningId
    });
    console.log("deleteResult(linkRepo): ", deleteResult);
    await this.meaningRepo.delete({ id: meaningId });
    for (let link of meaningSnapshowBeforeDelete?.words) {
      await this.wordService.deleteWordIfOrphan(link.word.id);
    }
    return true;
  }

  async insertWordParticles(wordEntity: WordEntity) {
    for (const particle of wordEntity.word.split(/ +/)) {
      const wordParticle = this.wordParticleRepo.create({
        wordEntity: wordEntity,
        wordParticle: particle
      });
      await this.wordParticleRepo.save(wordParticle);
    }
  }

  async insertMeaning(meaning: MeaningEntity): Promise<MeaningEntity> {
    //const meaningSnapshotBeforeSave = await this.findMeaningWithWords(meaning.id);
    console.log("before save: ", meaning);
    let meaningId = (await this.meaningRepo.insert(meaning)).raw.insertId;
    for (let link of meaning.words) {
      let wordId = link.word.id;
      if (!wordId) {
        wordId = (await this.wordRepo.insert(link.word)).raw.insertId;
        await this.insertWordParticles(link.word);
        await this.linkRepo.insert({
          level: link.level,
          wordId: wordId,
          meaningId: meaningId
        });
      }
      await this.linkRepo.save({
        level: link.level,
        wordId: wordId,
        meaningId: meaningId
      });
    }
    console.log("after save");
    // for (let idx in meaningSnapshotBeforeSave?.words) {
    //   await this.wordService.deleteWordIfOrphan(meaningSnapshotBeforeSave.words[idx].word.id);
    // }
    return await this.findMeaningWithWords(meaningId);
  }

  private async handleLink(meaningId: number, wordId: number, level: string): Promise<LinkEntity> {
    let linkEntity: LinkEntity = await this.linkRepo.findOne({
      where: {
        meaningId: meaningId,
        wordId: wordId
      }
    });
    if (!linkEntity) {
      console.log("link does not exists, creating...(word id): ", wordId);
      linkEntity = this.linkRepo.create({
        meaningId: meaningId,
        wordId: wordId,
        level: level
      });
    }
    return await this.linkRepo.save({
      ...linkEntity,
      level: level
    });
  }

  async updateMeaning(meaning: MeaningEntity): Promise<MeaningEntity> {
    await this.meaningRepo.update({
      id: meaning.id
    }, {
      ...meaning,
      words: undefined
    });

    const addedWords: LinkEntity[] = [];
    for (const link of meaning.words) {
      if (link.word.id) {
        console.log("link: ", link);
        // create link if does not exist yet
        await this.handleLink(meaning.id, link.word.id, link.level);
        await this.wordRepo.update({
          id: link.word.id
        }, link.word);
      } else {
        // create word and create link
        let wordEntity = this.wordRepo.create({
          word: link.word.word,
          lang: link.word.lang
        });
        let insertResult = await this.wordRepo.insert(wordEntity);
        await this.insertWordParticles(wordEntity);
        let addedLink = this.linkRepo.create({
          meaningId: meaning.id,
          wordId: insertResult.raw.insertId as number,
          level: link.level
        });
        await this.linkRepo.insert(addedLink);
        addedWords.push(addedLink);
        // meaning.words.push(addedLink);
      }
    }

    const existingLinks: LinkEntity[] = await this.linkRepo.find({
      where: {
        meaningId: meaning.id
      }
    });
    for (const existingLink of existingLinks) {
      if (
        !meaning.words.map(link => link.wordId)
          .concat(addedWords.map(link => link.wordId))
          .includes(existingLink.wordId)
      ) {
        console.log("removed: ", existingLink);
        await this.linkRepo.delete({
          meaningId: existingLink.meaningId,
          wordId: existingLink.wordId
        });
        await this.wordService.deleteWordIfOrphan(existingLink.wordId);
      }
    }
    return meaning;
  }
}
