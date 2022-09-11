import { Injectable } from "@nestjs/common";
import { PlayerEntity } from "./player.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

@Injectable()
export default class PlayerService {

  constructor(
    @InjectRepository(PlayerEntity)
    private playerRepo: Repository<PlayerEntity>
  ) {
  }

  public async createPlayer(): Promise<PlayerEntity> {
    const player = this.playerRepo.create({
      playerName: null
    });
    return await this.playerRepo.save(player);
  }
}

