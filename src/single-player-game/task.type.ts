import { Field, ObjectType } from "@nestjs/graphql";
import { GraphQLInt, GraphQLString } from "graphql";
import { WordType } from "../word/word.type";
import { CorrectWordType } from "./correct-word.type";

@ObjectType()
export class TaskType {

  @Field(type => GraphQLString)
  word: string;

  @Field(type => GraphQLString, {
    nullable: true
  })
  word_desc: string;

  @Field(type => GraphQLInt)
  meaningId: number;

  @Field(type => WordType)
  correctWord: WordType;

  @Field(type => [WordType])
  wordOptions: WordType[];

}
