import { WordEntity } from './word.entity';
import { Field, InputType } from '@nestjs/graphql';
import { GraphQLInt } from 'graphql';
import { WordType } from './word.type';

@InputType()
export class WordInput extends WordType {

  @Field(type => GraphQLInt, {nullable: true})
  id: number | null;

}
