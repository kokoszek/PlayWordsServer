import { Module } from '@nestjs/common';
import { WordService } from './word-service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WordEntity } from './word.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      WordEntity
    ])
  ],
  providers: [WordService],
})
export class WordModule {}
