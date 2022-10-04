import { CategoryType, LangType, MeaningEntity, PartOfSpeechType } from "./meaning.entity";
import { Field, ObjectType } from "@nestjs/graphql";
import { GraphQLInt, GraphQLString } from "graphql";
import { LinkType } from "./link.type";

@ObjectType()
export class MeaningType implements Omit<MeaningEntity, "words" | "beforeSave" | "afterSave"> {
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

  @Field((type) => GraphQLString, { nullable: true })
  partOfSpeech: PartOfSpeechType;

  @Field((type) => GraphQLString, { nullable: true })
  category: CategoryType;

  @Field((type) => [LinkType])
  words_lang1: LinkType[];

  @Field((type) => [LinkType])
  words_lang2: LinkType[];
}
