import { WordEntity } from "./word.entity";
import { Field, ObjectType } from "@nestjs/graphql";
import { GraphQLID, GraphQLInt, GraphQLString } from "graphql";
import { Maybe } from "graphql/jsutils/Maybe";
import { WordInputUpdate } from "./word.input.update";
import { MeaningType } from "../meaning/meaning.type";

@ObjectType()
export class WordType implements Omit<WordEntity, "meanings" | "wordParticles"> {

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

  @Field(type => [MeaningType], {
    nullable: false
  })
  meanings: MeaningType[];
}
