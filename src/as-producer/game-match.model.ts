import { Field, ID, ObjectType } from "@nestjs/graphql";

@ObjectType({ description: "game match model" })
export class GameMatchModel {

  @Field(type => ID)
  id: string;

  // @Directive('@upper')
  // title: string;

  @Field({ nullable: false })
  gameId: number;

  @Field()
  creationDate: Date;

  // @Field(type => [String])
  // ingredients: string[];
}
