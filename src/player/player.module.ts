import { PlayerEntity } from "./player.entity";
import { TypeOrmModule } from "@nestjs/typeorm";
import PlayerService from "./player.service";
import { Module } from "@nestjs/common";

@Module({
  imports: [
    TypeOrmModule.forFeature([
      PlayerEntity
    ])
  ],
  providers: [PlayerService],
  exports: [PlayerService]
})
export class PlayerModule {
}
