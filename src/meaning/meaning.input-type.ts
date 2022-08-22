import { Field, InputType } from '@nestjs/graphql';
import { WordInput } from '../word/word.input-type';

@InputType()
export class MeaningInput {

  @Field()
  meaning: string;

  @Field(() => [WordInput])
  words: WordInput[];
}
