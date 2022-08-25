import { CategoryType, LangType, MeaningEntity, PartOfSpeechType } from './meaning.entity';
import { Field, InputType } from '@nestjs/graphql';
import { GraphQLInt, GraphQLString } from 'graphql';
import { MeaningType } from './meaning.type';
import { WordType } from '../word/word.type';
import { WordInputUpdate } from '../word/word.input.update';
import { Maybe } from 'graphql/jsutils/Maybe';

@InputType()
export class NewMeaningInput implements Omit<MeaningType, 'id'> {

  @Field(type => GraphQLString, {
    nullable: false
  })
  meaning_lang1_desc: string;

  @Field(type => GraphQLString, {
    nullable: false
  })
  meaning_lang1_language: LangType;

  @Field(type => GraphQLString, {
    nullable: true
  })
  meaning_lang2_desc: Maybe<string>;

  @Field(type => GraphQLString, {
    nullable: false
  })
  meaning_lang2_language: LangType;

  @Field(type => GraphQLString, {
    nullable: true
  })
  partOfSpeech: Maybe<PartOfSpeechType>;

  @Field(type => GraphQLString, {
    nullable: true
  })
  category: Maybe<CategoryType>;

  @Field(type => [WordInputUpdate], {
    nullable: false
  })
  public words_lang1: WordInputUpdate[];

  @Field(type => [WordInputUpdate], {
    nullable: false
  })
  public words_lang2: WordInputUpdate[];

}
