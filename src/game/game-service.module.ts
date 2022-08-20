import { Module } from '@nestjs/common';
import GameGatewayWs from './game-gateway-ws';
import { FindMatchResolver } from './find-match.resolver';
import GameService from './game-service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WordEntity } from '../word/word.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      WordEntity
    ])
  ],
  providers: [GameGatewayWs, FindMatchResolver, GameService],
})
export class WsModule {}
