import { WordEntity } from "./word.entity";
import { WordType } from "./word.type";

export default class WordConverter {

  public static entityToGQL(entity: WordEntity): WordType {
    return {
      ...entity,
      level: null,
      meanings: null
    };
  }
}
