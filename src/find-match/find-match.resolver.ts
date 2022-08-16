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
    // this.semaphore = new MultiSemaphore(redis, 'findMatchQueue', 10, 1, {
    //   lockTimeout: undefined,
    //   acquireTimeout: undefined
    // })
    setTimeout(async ()=> {
      for(let i=0; i<10; i++) {
        await new Promise<void>(resolve => {
          sem.take(1, function() {
            resolve();
          })
        });
        console.log('ctr taking sem: ', i + 1);
      }
    }, 0);
  }

  @Mutation(returns => Boolean)
  async startFindGame(
    @Args({name: 'playerName', type: () => GraphQLString}) playerName: string
  ) {
    console.log('releasing semaphore');
    await redis.lpush("findMatchQueue", playerName);
    sem.leave()
    return true;
  }
}
