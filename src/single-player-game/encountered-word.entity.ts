import { JoinColumn, Column, Entity, ManyToOne, PrimaryColumn } from "typeorm";
import { PlayerEntity } from "../player/player.entity";
import { LinkEntity } from "../meaning/link.entity";

@Entity("encountered_word_jointable")
export class EncounteredWordEntity {

  @ManyToOne(() => PlayerEntity, player => player.encounteredWords, {
    nullable: true,
    orphanedRowAction: "delete"
  })
  @JoinColumn({ name: "playerId" })
  player: PlayerEntity;

  @ManyToOne(() => LinkEntity, {
    cascade: false,
    nullable: true,
    orphanedRowAction: "delete"
  })
  link: LinkEntity;

  @PrimaryColumn()
  playerId: number;

  @PrimaryColumn()
  linkWordId: number;

  @PrimaryColumn()
  linkMeaningId: number;

  @Column({
    default: 0
  })
  misses: number;
}
