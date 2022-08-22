import { Field, InputType } from '@nestjs/graphql';

@InputType()
class MeaningInput {

  @Field()
  meaning: string;

  @Field()
  words: string[]
}
