import { Field, InputType } from '@nestjs/graphql';
import { GraphQLInt } from 'graphql';

@InputType()
export class WordInput {

  @Field(() => GraphQLInt, {
    nullable: true
  })
  id: number;

  @Field()
  word: string;

  @Field()
  lang: string;
}
