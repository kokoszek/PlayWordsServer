import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { TaskModel } from './task.model';
import { GraphQLInt, GraphQLString } from 'graphql';
import { TaskService } from './task.service';

@Resolver(of => TaskModel)
export class TaskResolver {

  constructor(
    private taskService: TaskService
  ) {}

  @Query(() => TaskModel)
  getTask(): Promise<TaskModel> {
    console.log('randomize task');
    return this.taskService.randomizeTask();
  }

  @Mutation(returns => Boolean)
  submitTask(
    @Args({name: 'taskId', type: () => GraphQLInt}) taskId: number,
    @Args({name: 'answer', type: () => GraphQLString}) answer: string
) {
    console.log('taskId: ', taskId);
    console.log('answer: ', answer);
    return this.taskService.submitTask(taskId, answer);
    //return answer === 'dog';
  }
}
