import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MeaningEntity } from './meaning.entity';
import { Repository } from 'typeorm';
import { MeaningInput } from './meaning.input-type';

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
      .where('meaning LIKE :search', {
        search: search + '%'
      })
      .getMany();
    return result;
  }

  async createMeaning(meaning: MeaningInput): Promise<MeaningEntity> {
    const newMeaning = this.meaningRepo.create({
      ...meaning,
      meaning_lang: 'pl',
      words: meaning.words.map(wordInput => ({
        lang: wordInput.lang,
        word: wordInput.word,
      }))
    });
    let meaningSaved = await this.meaningRepo.save(newMeaning);
    console.log('meaningSaved: ', meaningSaved);
    return meaningSaved;
  }
}
