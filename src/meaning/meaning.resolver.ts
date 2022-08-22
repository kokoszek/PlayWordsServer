import { Args, Mutation, Parent, Query, ResolveField, Resolver } from '@nestjs/graphql';
import { MeaningEntity } from './meaning.entity';
import { GraphQLInt, GraphQLList, GraphQLString } from 'graphql';
import MeaningService from './meaning.service';
import { MeaningInput } from './meaning.input-type';
import { WordService } from '../word/word-service';

@Resolver(of => MeaningEntity)
export class MeaningResolver {

  constructor(
    private meaningService: MeaningService,
    private wordService: WordService
) {}

  @Mutation(returns => MeaningEntity)
  async createMeaning(
    @Args('meaningInput') meaningInput: MeaningInput,
) {
    console.log('meaning: ', meaningInput.meaning);
    console.log('words: ', meaningInput.words);
    const meaningEntity = this.meaningService.createMeaning(meaningInput);
    return meaningEntity;
  }

  @Query(returns => [MeaningEntity])
  async searchMeaning(
    @Args('search', { type: () => String }) search: string
  ): Promise<MeaningEntity[]> {
    return await this.meaningService.searchByText(search);
  }

  @Query(returns => MeaningEntity)
  async getMeaning(
    @Args('id', { type: () => GraphQLInt }) id: number
  ): Promise<MeaningEntity> {

    return await this.meaningService.getById(id);
  }

  @ResolveField()
  async words(@Parent() meaning: MeaningEntity) {
    const { id } = meaning;
    console.log('meaning id: ', id);
    const words = await this.wordService.findAllByMeaningId(id);
    console.log('words: ', words);
    return words;
  }
}
