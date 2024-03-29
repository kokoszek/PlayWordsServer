import { WordEntity } from "./word.entity";
import { Field, ObjectType } from "@nestjs/graphql";
import { GraphQLBoolean, GraphQLInt, GraphQLString } from "graphql";
import { LinkType } from "../meaning/link.type";

@ObjectType()
export class WordType implements Omit<WordEntity, "meanings" | "wordParticles"> {

  @Field(type => GraphQLBoolean)
  needsTranslation: boolean;

  @Field(type => GraphQLBoolean)
  isPhrasalVerb: boolean;

  @Field(type => GraphQLBoolean)
  isIdiom: boolean;

  @Field(type => GraphQLInt)
  id: number;

  @Field(type => GraphQLString)
  word: string;

  @Field(type => GraphQLString)
  lang: string;

  @Field(type => GraphQLString)
  desc: string;

  @Field(type => GraphQLString)
  level: string;

  @Field(type => GraphQLInt)
  freq: number;

  @Field(type => GraphQLString)
  origin: string;

  @Field(type => [LinkType], {
    nullable: false
  })
  meanings: LinkType[];
}
