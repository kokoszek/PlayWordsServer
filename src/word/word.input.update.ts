import { WordEntity } from './word.entity';
import { Field, InputType } from '@nestjs/graphql';
import { GraphQLInt, GraphQLString } from 'graphql';
import { WordType } from './word.type';

@InputType()
export class WordInputUpdate implements Omit<WordType, ''> {

  @Field(type => GraphQLInt, {nullable: true})
  id: number | null;

  @Field(type => GraphQLString, {nullable: true})
  word: string;

  @Field(type => GraphQLString, {nullable: true})
  desc: string;

  @Field(type => GraphQLString, {nullable: true})
  level: 'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C1+';

  @Field(type => GraphQLString, {nullable: true})
  lang: string;

  @Field(type => GraphQLInt, {nullable: true})
  freq: number;

  @Field(type => GraphQLString, {nullable: true})
  origin: string;

}
