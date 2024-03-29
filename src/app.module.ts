import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { GraphQLModule } from "@nestjs/graphql";
import { ApolloDriver, ApolloDriverConfig } from "@nestjs/apollo";
import { TaskModule } from "./graphql/task/task.module";
import { ProducerModule } from "./as-producer/producer.module";
import { GameModule } from "./game/game-service.module";
import { TypeOrmModule } from "@nestjs/typeorm";
import { WordModule } from "./word/word.module";

import * as ormconfig from "../ormconfig";
import { MeaningModule } from "./meaning/meaning.module";
import { PlayerModule } from "./player/player.module";
import { SinglePlayerGameModule } from "./single-player-game/single-player-game.module";

const path = require("path");

@Module({
  imports: [
    TypeOrmModule.forRoot(ormconfig),
    MeaningModule,
    WordModule,
    PlayerModule,
    TaskModule,
    ProducerModule,
    GameModule,
    SinglePlayerGameModule,
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: path.join(process.cwd(), "src/graphql/schema.gql"),
      sortSchema: true,
      cors: {
        origin: process.env.FRONTEND_ORIGIN,
        credentials: true
      },
      // subscriptions: {
      //   'graphql-ws': true
      // },
      debug: true
    })
  ],
  controllers: [AppController],
  providers: [AppService]
})
export class AppModule {
}
