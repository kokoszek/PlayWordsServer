import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { WordEntity } from "../word/word.entity";
import { WordService } from "../word/word-service";
import { MeaningEntity } from "./meaning.entity";
import { MeaningResolver } from "./meaning.resolver";
import MeaningService from "./meaning.service";
import { WordModule } from "../word/word.module";
import { RequestContextModule } from "nestjs-request-context";
import { LinkEntity } from "./link.entity";
import { LinkResolver } from "./link.resolver";
import WordParticle from "../word/word-particle.entity";

@Module({
  imports: [
    RequestContextModule,
    TypeOrmModule.forFeature([
      MeaningEntity,
      LinkEntity,
      WordEntity,
      WordParticle
    ]),
    WordModule
  ],
  providers: [MeaningResolver, LinkResolver, MeaningService]
})
export class MeaningModule {
}
