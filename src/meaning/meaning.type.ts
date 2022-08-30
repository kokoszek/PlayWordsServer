import { WordEntity } from 'src/word/word.entity';
import {
  CategoryType,
  LangType,
  MeaningEntity,
  PartOfSpeechType,
} from './meaning.entity';
import { Field, ObjectType } from '@nestjs/graphql';
import { GraphQLInt, GraphQLString } from 'graphql';
import { WordType } from '../word/word.type';

@ObjectType()
export class MeaningType
  implements Omit<MeaningEntity, 'words' | 'beforeSave' | 'afterSave'>
{
  @Field((type) => GraphQLInt, { nullable: false })
  id: number;

  @Field((type) => GraphQLString, { nullable: true })
  meaning_lang1_desc: string;

  @Field((type) => GraphQLString, { nullable: false })
  meaning_lang1_language: LangType;

  @Field((type) => GraphQLString, { nullable: true })
  meaning_lang2_desc: string;

  @Field((type) => GraphQLString, { nullable: false })
  meaning_lang2_language: LangType;

  @Field((type) => GraphQLString)
  partOfSpeech: PartOfSpeechType;

  @Field((type) => GraphQLString, { nullable: true })
  category: CategoryType;

  @Field((type) => [WordType])
  words_lang1: WordType[];

  @Field((type) => [WordType])
  words_lang2: WordType[];
}
