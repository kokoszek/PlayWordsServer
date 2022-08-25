import { Args, Mutation, Parent, Query, ResolveField, Resolver } from '@nestjs/graphql';
import { MeaningEntity } from './meaning.entity';
import { GraphQLInt, GraphQLList, GraphQLString } from 'graphql';
import MeaningService from './meaning.service';
import { WordService } from '../word/word-service';
import { NewMeaningInput } from './meaning.input.new';
import { MeaningType } from './meaning.type';
import { UpdateMeaningInput } from './meaning.input.update';

function GraphQLInput2Entity(input: NewMeaningInput): MeaningEntity {
  return {
    id: null,
    ...input,
    words: input.words_lang1.map(word => ({
      ...word,
      lang: input.meaning_lang1_language,
      meanings: []
    }))
      .concat(input.words_lang2.map(word => ({
        ...word,
        lang: input.meaning_lang2_language,
        meanings: []
      })))
  }
}

function Entity2GraphQLType(typormEntity: MeaningEntity): MeaningType {
  return {
    ...typormEntity,
    words_lang1: [],
    words_lang2: []
  }
}

@Resolver(of => MeaningType)
export class MeaningResolver {

  constructor(
    private meaningService: MeaningService,
    private wordService: WordService
  ) {}

  @Mutation(returns => MeaningType)
  async createMeaning(
    @Args('meaningInput') meaningInput: NewMeaningInput,
  ) {

    console.log('meaningInput: ', meaningInput);
    let meaning: MeaningEntity = GraphQLInput2Entity(meaningInput);
    const saved = await this.meaningService.upsertMeaning(meaning);
    return saved;
  }

  @Mutation(returns => MeaningType)
  async upsertMeaning(
    @Args('meaningInput') meaningInput: UpdateMeaningInput,
  ) {
    console.log('upsertMeaning -> input: ', meaningInput);
    let meaning: MeaningEntity = GraphQLInput2Entity(meaningInput);
    const meaningEntity = await this.meaningService.upsertMeaning(meaning);
    console.log('upsertMeaning -> result', meaningInput);
    return meaningEntity;
  }

  @Query(returns => [MeaningType])
  async searchMeaning(
    @Args('search', { type: () => String }) search: string
  ): Promise<MeaningType[]> {
    let result = await this.meaningService.searchByText(search);
    console.log('search result: ', result);
    return result.map(Entity2GraphQLType);
  }

  @Query(returns => MeaningType)
  async getMeaning(
    @Args('id', { type: () => GraphQLInt }) id: number
  ): Promise<MeaningType> {
    let result = await this.meaningService.getById(id);
    return Entity2GraphQLType(result);
  }

  @ResolveField()
  async words_lang1(@Parent() meaning: MeaningType) {
    const { id } = meaning;
    console.log('words_lang1 -> meaning: ', meaning);
    const words = await this.wordService.findAllByMeaningId(id, meaning.meaning_lang1_language);
    return words;
  }

  @ResolveField()
  async words_lang2(@Parent() meaning: MeaningType) {
    const { id } = meaning;
    console.log('words_lang2 -> meaning: ', meaning);
    const words = await this.wordService.findAllByMeaningId(id, meaning.meaning_lang2_language);
    return words;
  }
}
