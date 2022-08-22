import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WordEntity } from '../word/word.entity';
import { WordService } from '../word/word-service';
import { MeaningEntity } from './meaning.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      MeaningEntity
    ])
  ],
  providers: [],
})
export class MeaningModule {}
