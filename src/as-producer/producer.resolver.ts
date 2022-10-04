import { Resolver } from "@nestjs/graphql";
import { PubSub } from "graphql-subscriptions";

const pubSub = new PubSub();

@Resolver()
export class ProducerResolver {

  constructor() {
  }

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
