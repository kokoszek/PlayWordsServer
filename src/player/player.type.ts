import { PlayerEntity } from "./player.entity";
import { Field, ObjectType } from "@nestjs/graphql";
import { GraphQLInt, GraphQLString } from "graphql";

@ObjectType()
export class PlayerType implements Omit<PlayerEntity, "encounteredWords"> {

  @Field((type) => GraphQLInt, { nullable: false })
  id: number;

  @Field((type) => GraphQLString, { nullable: true })
  playerName: string;

  @Field((type) => GraphQLInt, { nullable: false })
  lost: number;

  @Field((type) => GraphQLInt, { nullable: false })
  won: number;
}
