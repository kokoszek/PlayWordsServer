import { MeaningEntity } from "./meaning.entity";
import { MeaningType } from "./meaning.type";


export default class MeaningConverter {

  public static entityToGQL(meaning: MeaningEntity): MeaningType {
    return {
      ...meaning,
      words_lang1: null, // resolved in resolver
      words_lang2: null // resolved in resolver
    };
  }
}
