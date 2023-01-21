import { GameModule } from "../game/game-service.module";
import GameService from "../game/game-service";
import { Module } from "@nestjs/common";
import { SinglePlayerGameResolver } from "./single-player-game.resolver";

@Module({
  imports: [
    GameModule
  ],
  providers: [SinglePlayerGameResolver]
})
export class SinglePlayerGameModule {
}
