import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WordEntity } from '../word/word.entity';
import { WordService } from '../word/word-service';
import { MeaningEntity } from './meaning.entity';
import { MeaningResolver } from './meaning.resolver';
import MeaningService from './meaning.service';
import { WordModule } from '../word/word.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      MeaningEntity
    ]),
    WordModule
  ],
  providers: [MeaningResolver, MeaningService],
})
export class MeaningModule {}
