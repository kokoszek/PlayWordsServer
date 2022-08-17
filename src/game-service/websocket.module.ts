import { Module } from '@nestjs/common';
import WsGateway from './ws-gateway';
import { FindMatchResolver } from './find-match.resolver';
import GameService from './game-service';

@Module({
  providers: [WsGateway, FindMatchResolver, GameService],
})
export class WsModule {}
