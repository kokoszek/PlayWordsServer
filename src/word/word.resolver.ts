import { Args, Parent, Query, ResolveField, Resolver } from "@nestjs/graphql";
import { WordEntity } from "./word.entity";
import { WordType } from "./word.type";
import { WordService } from "./word-service";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import WordConverter from "./word.converter";
import { LinkType } from "../meaning/link.type";
import LinkConverter from "../meaning/link.converter";
import { LinkEntity } from "../meaning/link.entity";

@Resolver(of => WordType)
export class WordResolver {

  constructor(
    private wordService: WordService,
    @InjectRepository(WordEntity)
    private wordRepo: Repository<WordEntity>
  ) {
  }

  @ResolveField()
  async meanings(@Parent() word: WordType): Promise<LinkType[]> {
    const { id } = word;
    const wordEntity = await this.wordRepo
      .createQueryBuilder("word")
      .innerJoinAndSelect("word.meanings", "links")
      .innerJoinAndSelect("links.meaning", "meaning")
      .where({ id })
      .getOne();
    // console.log("LINKS: ", wordEntity.meanings);
    return wordEntity.meanings.map((link: LinkEntity) => {
      return LinkConverter.entityToGQL(link);
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
    //console.log("searchWord: ", result);
    return result.map(WordConverter.entityToGQL);
  }
}
