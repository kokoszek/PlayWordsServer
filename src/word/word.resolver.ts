import { Args, Parent, Query, ResolveField, Resolver } from "@nestjs/graphql";
import { MeaningEntity } from "../meaning/meaning.entity";
import { GraphQLBoolean, GraphQLInt } from "graphql";
import { WordEntity } from "./word.entity";
import { MeaningType } from "../meaning/meaning.type";
import { WordType } from "./word.type";
import { WordService } from "./word-service";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

@Resolver(of => WordType)
export class WordResolver {

  constructor(
    private wordService: WordService,
    @InjectRepository(WordEntity)
    private wordRepo: Repository<WordEntity>
  ) {
  }

  private Entity2GraphQLType(entity: WordEntity): WordType {
    return {
      ...entity,
      level: null,
      meanings: null
    };
  }

  @ResolveField()
  async meanings(@Parent() word: WordType): Promise<MeaningType[]> {
    const { id } = word;
    const wordEntity = await this.wordRepo
      .createQueryBuilder("word")
      .innerJoinAndSelect("word.meanings", "links")
      .innerJoinAndSelect("links.meaning", "meaning")
      .where({ id })
      .getOne();
    return wordEntity.meanings.map(link => { // TODO: use mapping function from meaning resolver
      //link.meaning
      return {
        ...link.meaning,
        words_lang1: null, // resolved in resolver
        words_lang2: null // resolved in resolver
      };
    });
  }

  @Query(returns => WordType, {
    nullable: true
  })
  async wordExists(
    @Args("word", { type: () => String }) word: string
  ): Promise<WordType> {
    let result = await this.wordService.wordExists(word);
    return this.Entity2GraphQLType(result);
  }

  @Query(returns => [WordType])
  async searchWord(
    @Args("search", { type: () => String }) search: string
  ): Promise<WordType[]> {
    let result = await this.wordService.searchByText(search);
    return result.map(this.Entity2GraphQLType);
  }
}
