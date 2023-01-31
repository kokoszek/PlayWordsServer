import { GameModule } from "../game/game-service.module";
import GameService from "../game/game-service";
import { Module } from "@nestjs/common";
import { SinglePlayerGameResolver } from "./single-player-game.resolver";
import { TypeOrmModule } from "@nestjs/typeorm";
import { EncounteredWordEntity } from "./encountered-word.entity";

@Module({
  imports: [
    GameModule,
    TypeOrmModule.forFeature([
      EncounteredWordEntity
    ])
  ],
  providers: [SinglePlayerGameResolver]
})
export class SinglePlayerGameModule {
}
