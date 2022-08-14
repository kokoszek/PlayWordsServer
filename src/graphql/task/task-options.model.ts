import { Field, Int, ObjectType } from '@nestjs/graphql';
//import { Post } from './post';

@ObjectType()
export class TaskOptionsModel {

  @Field(type => Int)
  id: number;

  @Field({ nullable: false })
  name: string;

}
