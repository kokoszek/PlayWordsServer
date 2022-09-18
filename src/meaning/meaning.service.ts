import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { MeaningEntity } from "./meaning.entity";
import { DeepPartial, Repository } from "typeorm";
import { WordEntity } from "../word/word.entity";
import { WordService } from "../word/word-service";
import { LinkEntity } from "./link.entity";

@Injectable()
export default class MeaningService {

  constructor(
    @InjectRepository(MeaningEntity)
    private meaningRepo: Repository<MeaningEntity>,
    @InjectRepository(WordEntity)
    private wordRepo: Repository<WordEntity>,
    @InjectRepository(LinkEntity)
    private linkRepo: Repository<LinkEntity>,
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
    const meaningSnapshowBeforeDelete = await this.findMeaningWithWords(meaningId);
    await this.meaningRepo.delete({ id: meaningId });
    // for (let idx in meaningSnapshowBeforeDelete?.words) {
    //   await this.wordService.deleteWordIfOrphan(meaningSnapshowBeforeDelete.words[idx].word.id);
    // }
    return true;
  }

  async insertMeaning(meaning: MeaningEntity): Promise<MeaningEntity> {
    const meaningSnapshotBeforeSave = await this.findMeaningWithWords(meaning.id);
    console.log("before save: ", meaning);
    let meaningId = await this.meaningRepo.insert(meaning);
    console.log("meaningId: ", meaningId.raw.insertId);
    for (let link of meaning.words) {
      let wordId = await this.wordRepo.insert(link.word);
      console.log("wordId: ", wordId.raw.insertId);
      await this.linkRepo.insert({
        level: link.level,
        wordId: wordId.raw.insertId,
        meaningId: meaningId.raw.insertId
      });
    }
    console.log("after save");
    // for (let idx in meaningSnapshotBeforeSave?.words) {
    //   await this.wordService.deleteWordIfOrphan(meaningSnapshotBeforeSave.words[idx].word.id);
    // }
    return await this.findMeaningWithWords(meaning.id);
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
        // create link if does not exist yet
        console.log("LINK: ", link);
        await this.wordRepo.update({
          id: link.word.id
        }, link.word);
      } else {
        // create word and create link
        let insertResult = await this.wordRepo.insert({
          word: link.word.word,
          lang: link.word.lang
        });
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
