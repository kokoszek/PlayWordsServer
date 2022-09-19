import { LinkEntity } from "./link.entity";
import { LinkType } from "./link.type";


export default class LinkConverter {

  public static entityToGQL(entity: LinkEntity): LinkType {
    return {
      ...entity,
      word: null,
      meaning: null
    };
  }
}
