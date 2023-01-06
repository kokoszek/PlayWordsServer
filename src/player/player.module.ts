import { PlayerEntity } from "./player.entity";
import { TypeOrmModule } from "@nestjs/typeorm";
import PlayerService from "./player.service";
import { Module } from "@nestjs/common";
import { PlayerResolver } from "./player.resolver";

@Module({
  imports: [
    TypeOrmModule.forFeature([
      PlayerEntity
    ])
  ],
  providers: [PlayerService, PlayerResolver],
  exports: [PlayerService]
})
export class PlayerModule {
}
