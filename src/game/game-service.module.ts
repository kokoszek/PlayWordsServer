import { Module } from "@nestjs/common";
import GameGatewayWs from "./game-gateway-ws";
import { FindMatchResolver } from "./find-match.resolver";
import GameService from "./game-service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { MeaningEntity } from "../meaning/meaning.entity";
import { WordEntity } from "../word/word.entity";
import { PlayerModule } from "../player/player.module";
import { PlayerEntity } from "../player/player.entity";
import { LinkEntity } from "../meaning/link.entity";
import WordParticle from "../word/word-particle.entity";

@Module({
  imports: [
    TypeOrmModule.forFeature([MeaningEntity, WordEntity, PlayerEntity, LinkEntity, WordParticle]),
    PlayerModule
  ],
  providers: [GameGatewayWs, FindMatchResolver, GameService],
  exports: [GameService]
})
export class GameModule {
}
