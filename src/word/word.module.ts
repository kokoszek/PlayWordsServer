import { Module } from "@nestjs/common";
import { WordService } from "./word-service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { WordEntity } from "./word.entity";
import { WordResolver } from "./word.resolver";
import { MeaningEntity } from "../meaning/meaning.entity";
import WordParticle from "./word-particle.entity";

@Module({
  imports: [
    TypeOrmModule.forFeature([
      WordEntity,
      WordParticle,
      MeaningEntity
    ])
  ],
  providers: [WordService, WordResolver],
  exports: [WordService]
})
export class WordModule {
}
