import { PlayerEntity } from "./player.entity";
import { PlayerType } from "./player.type";

export default class MeaningConverter {

  public static entityToGQL(player: PlayerEntity): PlayerType {
    return {
      ...player
    };
  }
}
