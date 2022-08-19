import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { TaskModule } from './graphql/task/task.module';
import { ProducerModule } from './as-producer/producer.module';
import { WsModule } from './game/game-service.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WordEntity } from './word/word.entity';
import { WordModule } from './word/word.module';

import * as ormconfig from '../ormconfig';

const path = require('path');

@Module({
  imports: [
    WordModule,
    TypeOrmModule.forRoot(ormconfig),
    TaskModule,
    ProducerModule,
    WsModule,
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: path.join(process.cwd(), 'src/graphql/schema.gql'),
      sortSchema: true,
      // subscriptions: {
      //   'graphql-ws': true
      // },
      debug: true,
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
