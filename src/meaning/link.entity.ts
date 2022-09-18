import { Column, Entity, ManyToOne, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm";
import { MeaningEntity } from "./meaning.entity";
import { WordEntity } from "../word/word.entity";

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
  level: string;
}
