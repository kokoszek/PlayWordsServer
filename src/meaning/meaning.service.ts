import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { MeaningEntity } from "./meaning.entity";
import { DeepPartial, Repository } from "typeorm";
import { WordEntity } from "../word/word.entity";
import { WordService } from "../word/word-service";

@Injectable()
export default class MeaningService {

  constructor(
    @InjectRepository(MeaningEntity)
    private meaningRepo: Repository<MeaningEntity>,
    @InjectRepository(WordEntity)
    private wordRepo: Repository<WordEntity>,
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
      .leftJoinAndSelect("meaning.words", "words")
      .where({ id: meaningId })
      .getOne();
  }

  async deleteMeaning(meaningId: number): Promise<boolean> {
    const meaningSnapshowBeforeDelete = await this.findMeaningWithWords(meaningId);
    await this.meaningRepo.delete({ id: meaningId });
    for (let idx in meaningSnapshowBeforeDelete?.words) {
      await this.wordService.deleteWordIfOrphan(meaningSnapshowBeforeDelete.words[idx].id);
    }
    return true;
  }

  async upsertMeaning(meaning: MeaningEntity): Promise<MeaningEntity> {
    const meaningSnapshotBeforeSave = await this.findMeaningWithWords(meaning.id);
    await this.meaningRepo.save(meaning);
    for (let idx in meaningSnapshotBeforeSave?.words) {
      await this.wordService.deleteWordIfOrphan(meaningSnapshotBeforeSave.words[idx].id);
    }
    return await this.findMeaningWithWords(meaning.id);
  }
}
