import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MeaningEntity } from './meaning.entity';
import { DeepPartial, Repository } from 'typeorm';
import { WordEntity } from '../word/word.entity';
import { WordService } from '../word/word-service';

@Injectable()
export default class MeaningService {

  constructor(
    @InjectRepository(MeaningEntity)
    private meaningRepo: Repository<MeaningEntity>,
    @InjectRepository(WordEntity)
    private wordRepo: Repository<WordEntity>,
    private wordService: WordService
  ) {}

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
      .where('meaning_lang1_desc LIKE :search', {
        search: search + '%'
      })
      .orWhere('meaning_lang2_desc LIKE :search', {
        search: search + '%'
      })
      .getMany();
    return result;
  }

  async deleteMeaning(meaningId: number): Promise<boolean> {
    const existingWordIds: number[] = (
      await this.meaningRepo
        .createQueryBuilder('meaning')
        .innerJoinAndSelect('meaning.words', 'words')
        .where({ id: meaningId })
        .getOne()
    ).words.map(el => el.id);
    await this.meaningRepo.delete({
      id: meaningId
    })
    for(let wordId in existingWordIds) {
      await this.wordService.deleteWordIfOrphan(existingWordIds[wordId]);
    }
    return true;
  }

  async upsertMeaning(meaning: DeepPartial<MeaningEntity>): Promise<MeaningEntity> {
    const newMeaning = meaning;
    console.log('newMeaning to save: ', newMeaning);
    const existingWordIds: number[] = (
      await this.meaningRepo
        .createQueryBuilder('meaning')
        .innerJoinAndSelect('meaning.words', 'words')
        .where({ id: meaning.id })
        .getOne()
    )?.words?.map(el => el.id) || [];
    console.log('existingWordIds: ', existingWordIds);
    let meaningSaved = await this.meaningRepo.save(newMeaning);
    for(let wordId in existingWordIds) {
      await this.wordService.deleteWordIfOrphan(existingWordIds[wordId]);
    }
    console.log('meaningSaved: ', meaningSaved);
    let reselectedMeaning = await this.meaningRepo
      .createQueryBuilder()
      .select()
      .where({
        id: meaningSaved.id
      })
      .getOne();
    return reselectedMeaning;
  }
}
