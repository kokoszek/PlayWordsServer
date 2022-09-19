import { Column, Entity, ManyToOne, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm";
import { MeaningEntity } from "./meaning.entity";
import { WordEntity } from "../word/word.entity";

export const LevelsArray = ["A1", "A2", "B1", "B2", "C1", "C2"];

export type LevelType = typeof LevelsArray[number];

@Entity("meaning_word_jointable")
export class LinkEntity {

  @ManyToOne(() => MeaningEntity, meaning => meaning.words, {
    nullable: true,
    orphanedRowAction: "delete"
  })
  meaning: MeaningEntity;

  @ManyToOne(() => WordEntity, word => word.meanings, {
    cascade: false,
    nullable: true,
    orphanedRowAction: "delete"
  })
  word: WordEntity;

  @PrimaryColumn()
  wordId: number;

  @PrimaryColumn()
  meaningId: number;

  @Column()
  level: LevelType;
}
