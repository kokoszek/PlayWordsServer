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
      .where('meaning_desc LIKE :search', {
        search: search + '%'
      })
      .getMany();
    return result;
  }

  async upsertMeaning(meaningInput: MeaningInput): Promise<MeaningEntity> {
    const newMeaning = this.meaningRepo.create({
      ...meaningInput,
      meaning_desc_lang: 'pl',
      words: meaningInput.words.map(wordInput => ({
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
