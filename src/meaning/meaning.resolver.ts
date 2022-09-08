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


@Resolver(of => MeaningType)
export class MeaningResolver {

  constructor(
    private meaningService: MeaningService,
    private wordService: WordService,
    @InjectRepository(MeaningEntity)
    private meaningRepo: Repository<MeaningEntity>
  ) {
  }

  GraphQLInput2Entity(input: NewMeaningInput | UpdateMeaningInput): MeaningEntity {
    return this.meaningRepo.create({
      ...input,
      id: "id" in input ? input.id : null,
      // meaning_lang1_language: input.meaning_lang1_language,
      // meaning_lang1_desc: input.meaning_lang1_desc,
      // meaning_lang2_language: input.meaning_lang2_language,
      // meaning_lang2_desc: input.meaning_lang2_desc,
      // category: input.category,
      // partOfSpeech: input.partOfSpeech,
      words: input.words_lang1.map(word => ({
        ...word,
        lang: input.meaning_lang1_language
      }))
        .concat(input.words_lang2.map(word => ({
          ...word,
          lang: input.meaning_lang2_language
        })))
    });
    //return this.meaningRepo.create()
  }

  Entity2GraphQLType(typormEntity: MeaningEntity): MeaningType {
    return {
      ...typormEntity,
      words_lang1: null, // resolved in resolver
      words_lang2: null // resolved in resolver
    };
  }

  @Mutation(returns => MeaningType)
  async createMeaning(
    @Args("meaningInput") meaningInput: NewMeaningInput
  ) {

    console.log("meaningInput: ", meaningInput);
    let meaning: MeaningEntity = this.GraphQLInput2Entity(meaningInput);
    const saved = await this.meaningService.upsertMeaning(meaning);
    return saved;
  }

  @Mutation(returns => MeaningType)
  async upsertMeaning(
    @Args("meaningInput") meaningInput: UpdateMeaningInput
  ) {
    console.log("upsertMeaning -> input: ", meaningInput);
    let meaning: MeaningEntity = this.GraphQLInput2Entity(meaningInput);
    const meaningEntity = await this.meaningService.upsertMeaning(meaning);
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
    return result.map(this.Entity2GraphQLType);
  }

  @Query(returns => MeaningType)
  async getMeaning(
    @Args("id", { type: () => GraphQLInt }) id: number
  ): Promise<MeaningType> {
    let result = await this.meaningService.getById(id);
    return this.Entity2GraphQLType(result);
  }

  @ResolveField()
  async words_lang1(@Parent() meaning: MeaningType) {
    const { id } = meaning;
    const words = await this.wordService.findAllByMeaningId(id, meaning.meaning_lang1_language);
    return words;
  }

  @ResolveField()
  async words_lang2(@Parent() meaning: MeaningType) {
    const { id } = meaning;
    const words = await this.wordService.findAllByMeaningId(id, meaning.meaning_lang2_language);
    return words;
  }
}
