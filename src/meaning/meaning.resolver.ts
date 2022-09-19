import { Args, Mutation, Parent, Query, ResolveField, Resolver } from "@nestjs/graphql";
import { CategoryArray, MeaningEntity, PartOfSpeechArray } from "./meaning.entity";
import { GraphQLBoolean, GraphQLInt, GraphQLList, GraphQLString } from "graphql";
import MeaningService from "./meaning.service";
import { WordService } from "../word/word-service";
import { NewMeaningInput } from "./meaning.input.new";
import { MeaningType } from "./meaning.type";
import { UpdateMeaningInput } from "./meaning.input.update";
import { DeepPartial, Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";
import { LinkEntity } from "./link.entity";
import { WordEntity } from "../word/word.entity";
import { LinkType } from "./link.type";
import MeaningConverter from "./meaning.converter";
import LinkConverter from "./link.converter";

@Resolver(of => MeaningType)
export class MeaningResolver {

  constructor(
    private meaningService: MeaningService,
    private wordService: WordService,
    @InjectRepository(MeaningEntity)
    private meaningRepo: Repository<MeaningEntity>,
    @InjectRepository(LinkEntity)
    private linkRepo: Repository<LinkEntity>,
    @InjectRepository(WordEntity)
    private wordRepo: Repository<WordEntity>
  ) {
  }

  GraphQL2Entity(input: NewMeaningInput | UpdateMeaningInput): MeaningEntity {
    return this.meaningRepo.create({
      ...input,
      id: "id" in input ? input.id : null,
      words: input.words_lang1.map(word => {
        return this.linkRepo.create({
          level: "A1",
          meaningId: "id" in input ? input.id : undefined,
          // meaning: this.meaningRepo.create({
          //   id: "id" in input ? input.id : undefined
          // }),
          wordId: word.id,
          word: this.wordRepo.create({
            id: word.id,
            word: word.word,
            lang: input.meaning_lang1_language,
            origin: "web-interface"
          })
        });
      }).concat(
        input.words_lang2.map(word => {
          return this.linkRepo.create({
            level: "A1",
            // meaningId: "id" in input ? input.id : undefined,
            // meaning: this.meaningRepo.create({
            //   id: "id" in input ? input.id : undefined
            // }),
            wordId: word.id,
            word: this.wordRepo.create({
              id: word.id,
              word: word.word,
              lang: input.meaning_lang2_language,
              origin: "web-interface"
            })
          });
        })
      )
      // meaning_lang1_language: input.meaning_lang1_language,
      // meaning_lang1_desc: input.meaning_lang1_desc,
      // meaning_lang2_language: input.meaning_lang2_language,
      // meaning_lang2_desc: input.meaning_lang2_desc,
      // category: input.category,
      // partOfSpeech: input.partOfSpeech,
      // words: input.words_lang1.map(word => ({
      //   ...word,
      //   lang: input.meaning_lang1_language
      // }))
      //   .concat(input.words_lang2.map(word => ({
      //     ...word,
      //     lang: input.meaning_lang2_language
      //   })))
    });
    //return this.meaningRepo.create()
  }

  @Mutation(returns => MeaningType)
  async createMeaning(
    @Args("meaningInput") meaningInput: NewMeaningInput
  ) {
    console.log("meaningInput: ", meaningInput);
    let meaning: MeaningEntity = this.GraphQL2Entity(meaningInput);
    const saved = await this.meaningService.insertMeaning(meaning);
    return saved;
  }

  @Mutation(returns => MeaningType)
  async upsertMeaning(
    @Args("meaningInput") meaningInput: UpdateMeaningInput
  ) {
    console.log("upsertMeaning -> input: ", meaningInput);
    let meaning: MeaningEntity = this.GraphQL2Entity(meaningInput);
    const meaningEntity = await this.meaningService.updateMeaning(meaning);
    return meaningEntity;
  }

  @Mutation(returns => GraphQLBoolean)
  async deleteMeaning(
    @Args("meaningId", { type: () => GraphQLInt }) meaningId: number
  ): Promise<boolean> {
    try {
      return await this.meaningService.deleteMeaning(meaningId);
    } catch (e) {
      console.log("error: ", e);
      return false;
    }
  }

  @Query(returns => [String])
  getPartsOfSpeech(): readonly string[] {
    return PartOfSpeechArray;
  }

  @Query(returns => [String])
  getCategories(): readonly string[] {
    return CategoryArray;
  }

  @Query(returns => [MeaningType])
  async searchMeaning(
    @Args("search", { type: () => String }) search: string
  ): Promise<MeaningType[]> {
    let result = await this.meaningService.searchByText(search);
    console.log("result: ", result);
    return result.map(MeaningConverter.entityToGQL);
  }

  @Query(returns => MeaningType)
  async getMeaning(
    @Args("id", { type: () => GraphQLInt }) id: number
  ): Promise<MeaningType> {
    let result = await this.meaningService.getById(id);
    return MeaningConverter.entityToGQL(result);
  }

  @ResolveField()
  async words_lang1(@Parent() meaning: MeaningType): Promise<LinkType[]> {
    const { id } = meaning;
    const links = await this.wordService.findAllByMeaningId(id, meaning.meaning_lang1_language);
    //console.log("words1: ", words);
    return links.map(LinkConverter.entityToGQL);
  }

  @ResolveField()
  async words_lang2(@Parent() meaning: MeaningType): Promise<LinkType[]> {
    const { id } = meaning;
    const links = await this.wordService.findAllByMeaningId(id, meaning.meaning_lang2_language);
    //console.log("words2: ", words);
    return links.map(LinkConverter.entityToGQL);
  }
}
