
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { WordEntity } from './word.entity';

@Injectable()
export class WordService {
  constructor(
    @InjectRepository(WordEntity)
    private workRepo: Repository<WordEntity>,
  ) {}

  async init(): Promise<void> {
  }

}
