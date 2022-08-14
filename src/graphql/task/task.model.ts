import { Field, Int, ObjectType } from '@nestjs/graphql';
import { TaskOptionsModel } from './task-options.model';
//import { Post } from './post';

@ObjectType()
export class TaskModel {

  @Field(type => Int)
  id: number;

  @Field({ nullable: false })
  name: string;

  @Field(type => [TaskOptionsModel])
  options: TaskOptionsModel[];
}
