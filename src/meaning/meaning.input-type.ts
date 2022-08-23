import { Field, InputType } from '@nestjs/graphql';
import { WordInput } from '../word/word.input-type';
import { GraphQLInt } from 'graphql';

@InputType()
export class MeaningInput {

  @Field(() => GraphQLInt, {
    nullable: true
  })
  id: number;

  @Field()
  meaning_desc: string;

  @Field(() => [WordInput])
  words: WordInput[];
}
