import { Field, ObjectType } from "@nestjs/graphql";
import { GraphQLInt, GraphQLString } from "graphql";
import { WordType } from "../word/word.type";

@ObjectType()
export class TaskType {

  @Field(type => GraphQLString, {
    nullable: true
  })
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
