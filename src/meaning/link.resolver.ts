import { LinkType } from "./link.type";
import { Parent, ResolveField, Resolver } from "@nestjs/graphql";
import { WordType } from "../word/word.type";
import { InjectRepository } from "@nestjs/typeorm";
import { MeaningEntity } from "./meaning.entity";
import { WordEntity } from "../word/word.entity";
import { Repository } from "typeorm";
import WordConverter from "../word/word.converter";
import { MeaningType } from "./meaning.type";
import MeaningConverter from "./meaning.converter";

@Resolver(of => LinkType)
export class LinkResolver {

  constructor(
    @InjectRepository(MeaningEntity)
    private meaningRepo: Repository<MeaningEntity>,
    @InjectRepository(WordEntity)
    private wordRepo: Repository<WordEntity>
  ) {
  }

  @ResolveField()
  async word(@Parent() link: LinkType): Promise<WordType> {
    const word = await this.wordRepo.findOne({
      where: {
        id: link.wordId
      }
    });
    return WordConverter.entityToGQL(word);
  }

  @ResolveField()
  async meaning(@Parent() link: LinkType): Promise<MeaningType> {
    const meaningEntity = await this.meaningRepo.findOne({
      where: {
        id: link.meaningId
      }
    });
    return MeaningConverter.entityToGQL(meaningEntity);
  }

}
