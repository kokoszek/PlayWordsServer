import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { GraphQLInt, GraphQLString } from 'graphql';

// const MultiSemaphore = require('redis-semaphore').MultiSemaphore
// const Redis = require('ioredis')

//const redis = new Redis(6380);

//const { sem } = require('./semaphore');

@Resolver()
export class FindMatchResolver {

  private semaphore;
  constructor() {
  }

}
