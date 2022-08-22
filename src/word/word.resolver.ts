import { Args, Query, Resolver } from '@nestjs/graphql';
import { MeaningEntity } from '../meaning/meaning.entity';
import { GraphQLInt } from 'graphql';
import { WordEntity } from './word.entity';

@Resolver(of => WordEntity)
export class WordResolver {

}
