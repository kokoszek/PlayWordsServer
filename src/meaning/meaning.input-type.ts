import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class MeaningInput {

  @Field()
  meaning: string;

  @Field(() => [String])
  words: String[];
}
