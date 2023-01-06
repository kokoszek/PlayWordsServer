import { Args, Mutation, Query, Resolver } from "@nestjs/graphql";
import { PlayerType } from "./player.type";
import { InjectRepository } from "@nestjs/typeorm";
import { PlayerEntity } from "./player.entity";
import { Repository } from "typeorm";
import PlayerConverter from "./player.converter";
import { GraphQLBoolean, GraphQLInt } from "graphql";

@Resolver(of => PlayerType)
export class PlayerResolver {

  constructor(
    @InjectRepository(PlayerEntity)
    private playerRepo: Repository<PlayerEntity>
  ) {
  }

  @Query(returns => [PlayerType])
  async getPlayers(): Promise<PlayerType[]> {
    let result = await this.playerRepo
      .createQueryBuilder("player")
      .select()
      .orderBy("player.won", "DESC")
      .getMany();
    return result.map(PlayerConverter.entityToGQL);
  }

  @Query(returns => PlayerType)
  async getPlayerById(
    @Args("playerId", { type: () => GraphQLInt }) playerId: number
  ): Promise<PlayerType> {
    let result = await this.playerRepo
      .createQueryBuilder("player")
      .select()
      .where({
        id: playerId
      })
      .getOne();
    console.log("result: ", result, playerId);
    return PlayerConverter.entityToGQL(result);
  }

  @Mutation(returns => GraphQLBoolean)
  async setPlayerName(
    @Args("playerName") playerName: string,
    @Args({ name: "playerId", type: () => GraphQLInt }) playerId: number
  ): Promise<boolean> {
    console.log("set player name", playerName, playerId);
    await this.playerRepo.update(playerId, {
      playerName: playerName
    });
    return true;
  }


}
