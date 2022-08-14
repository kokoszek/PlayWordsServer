import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { TaskModel } from './task.model';

@Resolver(of => TaskModel)
export class TaskResolver {

  @Query(() => TaskModel)
  getTask(): TaskModel {
    return {
      id: 1,
      name: 'pies',
      correct: 'dog',
      options: [{
        id: 2,
        name: 'dog'
      }, {
        id: 3,
        name: 'cat'
      }, {
        id: 4,
        name: 'mouse'
      }]
    };
  }

  @Mutation(returns => Boolean)
  submitTask(@Args({name: 'answer', type: () => String}) answer: string) {
    console.log('answer: ', answer);
    return answer === 'dog';
  }
}
