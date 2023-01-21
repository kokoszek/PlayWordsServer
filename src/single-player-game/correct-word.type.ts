import { Field, ObjectType } from "@nestjs/graphql";
import { GraphQLString } from "graphql";

@ObjectType()
export class CorrectWordType {

  @Field(type => GraphQLString)
  word: string;
}
