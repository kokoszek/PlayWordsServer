import { Field, ObjectType } from "@nestjs/graphql";
import { LinkEntity } from "./link.entity";
import { GraphQLInt, GraphQLString } from "graphql";
import { MeaningType } from "./meaning.type";
import { WordType } from "../word/word.type";

@ObjectType()
export class LinkType implements Omit<LinkEntity, "meaning" | "word"> {

  @Field(() => GraphQLInt, { nullable: false })
  wordId: number;

  @Field((type) => WordType)
  word: WordType;

  @Field(() => GraphQLInt, { nullable: false })
  meaningId: number;

  @Field((type) => MeaningType)
  meaning: MeaningType;

  @Field((type) => GraphQLString, { nullable: true })
  level: string;
}
