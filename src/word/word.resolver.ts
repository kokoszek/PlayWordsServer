import { Args, Parent, Query, ResolveField, Resolver } from "@nestjs/graphql";
import { MeaningEntity } from "../meaning/meaning.entity";
import { GraphQLBoolean, GraphQLInt } from "graphql";
import { WordEntity } from "./word.entity";
import { MeaningType } from "../meaning/meaning.type";
import { WordType } from "./word.type";
import { WordService } from "./word-service";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import WordConverter from "./word.converter";

@Resolver(of => WordType)
export class WordResolver {

  constructor(
    private wordService: WordService,
    @InjectRepository(WordEntity)
    private wordRepo: Repository<WordEntity>
  ) {
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
    return WordConverter.entityToGQL(result);
  }

  @Query(returns => [WordType])
  async searchWord(
    @Args("search", { type: () => String }) search: string
  ): Promise<WordType[]> {
    let result = await this.wordService.searchByText(search);
    console.log("searchWord: ", result);
    return result.map(WordConverter.entityToGQL);
  }
}
