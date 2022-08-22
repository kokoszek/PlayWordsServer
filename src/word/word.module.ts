import { Module } from '@nestjs/common';
import { WordService } from './word-service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WordEntity } from './word.entity';
import { WordResolver } from './word.resolver';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      WordEntity,
    ])
  ],
  providers: [WordService, WordResolver],
  exports: [WordService]
})
export class WordModule {}
