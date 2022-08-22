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

  async createMeaning(meaning: string): Promise<MeaningEntity> {
    const newMeaning = this.meaningRepo.create({
      meaning
    });
    return newMeaning;
  }
}
