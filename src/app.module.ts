import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { TaskModule } from './graphql/task/task.module';
import { ProducerModule } from './as-producer/producer.module';
import { WsModule } from './find-match/websocket.module';

const path = require('path');

@Module({
  imports: [
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
