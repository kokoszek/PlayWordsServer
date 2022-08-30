import { Field, InputType } from '@nestjs/graphql';
import { LangType, PartOfSpeechType, CategoryType } from './meaning.entity';
import { MeaningType } from './meaning.type';
import { GraphQLID, GraphQLInt, GraphQLString } from 'graphql';
import { Maybe } from 'graphql/jsutils/Maybe';
import { WordInputUpdate } from '../word/word.input.update';

@InputType()
export class UpdateMeaningInput
  implements Omit<MeaningType, 'words_lang1' | 'words_lang2'>
{
  @Field((type) => GraphQLInt, {
    nullable: false,
  })
  id: number;

  @Field((type) => GraphQLString, {
    nullable: true,
  })
  meaning_lang1_desc: Maybe<string>;

  @Field((type) => GraphQLString, {
    nullable: true,
  })
  meaning_lang1_language: Maybe<LangType>;

  @Field((type) => GraphQLString, {
    nullable: true,
  })
  meaning_lang2_desc: Maybe<string>;

  @Field((type) => GraphQLString, {
    nullable: true,
  })
  meaning_lang2_language: Maybe<LangType>;

  @Field((type) => GraphQLString, {
    nullable: true,
  })
  partOfSpeech: Maybe<PartOfSpeechType>;

  @Field((type) => GraphQLString, {
    nullable: true,
  })
  category: Maybe<CategoryType>;

  @Field((type) => [WordInputUpdate], {
    nullable: true,
  })
  public words_lang1: WordInputUpdate[];

  @Field((type) => [WordInputUpdate], {
    nullable: true,
  })
  public words_lang2: WordInputUpdate[];
}
