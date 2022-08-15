import { Args, Field, ID, Mutation, Query, Resolver, Subscription } from '@nestjs/graphql';
import { TaskModel } from '../graphql/task/task.model';
import { TaskService } from '../graphql/task/task.service';
import { GraphQLInt, GraphQLString } from 'graphql';
import { PubSub } from 'graphql-subscriptions';
import { GameMatchModel } from './game-match.model';

const pubSub = new PubSub();

@Resolver()
export class ProducerResolver {

  constructor() {}

  // @Mutation(returns => Boolean)
  // subscribeForGame(
  //   @Args({name: 'taskId', type: () => GraphQLInt}) taskId: number,
  //   @Args({name: 'answer', type: () => GraphQLString}) answer: string
  // ) {
  //   console.log('taskId: ', taskId);
  //   console.log('answer: ', answer);
  //   return this.taskService.submitTask(taskId, answer);
  //   return answer === 'dog';
  // }

  // @Subscription(returns => GameMatchModel)
  // subscribeForGame() {
  //   setTimeout(() => {
  //     pubSub.publish('gameFound', {
  //       id: 'id-1',
  //       gameId: 1,
  //       creationDate: new Date(),
  //     });
  //   }, 2500);
  //   return pubSub.asyncIterator('gameFound');
  // }
}
