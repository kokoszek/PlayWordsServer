import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { MeaningEntity } from './meaning.entity';
import { GraphQLInt, GraphQLList, GraphQLString } from 'graphql';
import MeaningService from './meaning.service';
import { MeaningInput } from './meaning.input-type';

@Resolver(of => MeaningEntity)
export class MeaningResolver {

  constructor(
    private meaningService: MeaningService
  ) {}

  @Mutation(returns => MeaningEntity)
  async createMeaning(
    @Args('meaningInput') meaningInput: MeaningInput,
) {
    console.log('meaning: ', meaningInput.meaning);
    console.log('words: ', meaningInput.words);
    const meaningEntity = this.meaningService.createMeaning('asdf');
    return meaningEntity;
  }

  @Query(returns => MeaningEntity)
  async getMeaning(
    @Args('id', { type: () => GraphQLInt }) id: number
  ): Promise<MeaningEntity> {

    return await this.meaningService.getById(id);
    // return {
    //   meaning: "get(dostać)",
    //   partOfSpeech: 'verb',
    //   id: 1,
    //   meaning_lang: 'pl',
    //   level: 'A1',
    //   category: 'common',
    //   words: []
    // }
  }
}
