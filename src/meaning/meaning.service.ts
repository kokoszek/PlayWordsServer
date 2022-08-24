import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MeaningEntity } from './meaning.entity';
import { Repository } from 'typeorm';

@Injectable()
export default class MeaningService {

  constructor(
    @InjectRepository(MeaningEntity)
    private meaningRepo: Repository<MeaningEntity>,
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
      .where('meaning_lang1_desc LIKE :search', {
        search: search + '%'
      })
      .orWhere('meaning_lang2_desc LIKE :search', {
        search: search + '%'
      })
      .getMany();
    return result;
  }

  async upsertMeaning(meaning: MeaningEntity): Promise<MeaningEntity> {
    const newMeaning = this.meaningRepo.create({
      ...meaning,
      // meaning_lang1_desc: meaningInput.meaning_lang1_desc,
      // meaning_lang1_language: meaningInput.meaning_lang1_language,
      words: meaning.words.map(wordInput => ({
        id: wordInput.id,
        lang: wordInput.lang,
        word: wordInput.word,
      }))
    });
    let meaningSaved = await this.meaningRepo.save(newMeaning);
    console.log('meaningSaved: ', meaningSaved);
    return meaningSaved;
  }
}
