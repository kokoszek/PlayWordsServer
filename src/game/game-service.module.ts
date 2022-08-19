import { Module } from '@nestjs/common';
import GameGatewayWs from './game-gateway-ws';
import { FindMatchResolver } from './find-match.resolver';
import GameService from './game-service';

@Module({
  providers: [GameGatewayWs, FindMatchResolver, GameService],
})
export class WsModule {}
