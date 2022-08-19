import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { GraphQLInt, GraphQLString } from 'graphql';

const MultiSemaphore = require('redis-semaphore').MultiSemaphore
const Redis = require('ioredis')

const redis = new Redis(6380);

const { sem } = require('./semaphore');

@Resolver()
export class FindMatchResolver {

  private semaphore;
  constructor() {
    setTimeout(async ()=> {
      await new Promise<void>(resolve => {
        sem.take(10, function() {
          resolve();
        })
      });
    }, 0);
  }

  @Mutation(returns => Boolean)
  async startFindGame(
    @Args({name: 'playerName', type: () => GraphQLString}) playerName: string
  ) {
    console.log('releasing semaphore');
    await redis.rpush("findMatchQueue", playerName);
    sem.leave()
    return true;
  }
}
