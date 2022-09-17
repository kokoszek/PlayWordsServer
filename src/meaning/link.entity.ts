import { Entity, ManyToOne } from "typeorm";
import { MeaningEntity } from "./meaning.entity";

@Entity()
export class LinkEntity {

  @ManyToOne(() => MeaningEntity, m => m.words)
  meaning;
}
