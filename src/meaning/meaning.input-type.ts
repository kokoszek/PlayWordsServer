import { Field, InputType } from '@nestjs/graphql';
import { WordInput } from '../word/word.input-type';
import { GraphQLInt } from 'graphql';

@InputType()
export class MeaningInput {

  @Field(() => GraphQLInt, {
    nullable: true
  })
  id: number;

  @Field({
    nullable: true
  })
  meaning_lang1_desc: string;

  @Field({
    nullable: true
  })
  meaning_lang1_language: 'pl' | 'en';

  @Field({
    nullable: true
  })
  meaning_lang2_desc: string;

  @Field({
    nullable: true
  })
  meaning_lang2_language: 'pl' | 'en';

  @Field(() => [WordInput])
  words: WordInput[];
}
