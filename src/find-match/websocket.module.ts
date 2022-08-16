import { Module } from '@nestjs/common';
import WsGateway from './ws-gateway';
import { FindMatchResolver } from './find-match.resolver';

@Module({
  providers: [WsGateway, FindMatchResolver],
})
export class WsModule {}
