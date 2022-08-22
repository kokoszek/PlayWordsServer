import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class WordInput {

  @Field()
  word: string;

  @Field()
  lang: string;
}
