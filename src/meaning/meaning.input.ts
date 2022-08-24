import { CategoryType, LangType, MeaningEntity, PartOfSpeechType } from './meaning.entity';
import { Field, InputType } from '@nestjs/graphql';
import { GraphQLInt, GraphQLString } from 'graphql';
import { MeaningType } from './meaning.type';
import { WordType } from '../word/word.type';
import { WordInput } from '../word/word.input';

@InputType()
export class MeaningInput implements Omit<MeaningType, 'words_lang1' | 'words_lang2'> {

  @Field(type => GraphQLInt, {nullable: true})
  id: number | null;

  @Field(type => GraphQLString)
  meaning_lang1_desc: string;

  @Field(type => GraphQLString)
  meaning_lang1_language: LangType;

  @Field(type => GraphQLString)
  meaning_lang2_desc: string;

  @Field(type => GraphQLString)
  meaning_lang2_language: LangType;

  @Field(type => GraphQLString)
  partOfSpeech: PartOfSpeechType;

  @Field(type => GraphQLString)
  category: CategoryType;

  @Field(type => [WordInput])
  public words_lang1: WordInput[];

  @Field(type => [WordInput])
  public words_lang2: WordInput[];

}
