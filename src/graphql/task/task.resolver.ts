import { Query, Resolver } from '@nestjs/graphql';
import { TaskModel } from './task.model';

@Resolver(of => TaskModel)
export class TaskResolver {

  @Query(() => TaskModel)
  getTask(): TaskModel {
    return {
      id: 1,
      name: 'PIES',
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
}
