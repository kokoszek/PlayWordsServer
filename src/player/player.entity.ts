import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { EncounteredWordEntity } from "../single-player-game/encountered-word.entity";

@Entity()
export class PlayerEntity {

  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  playerName: string;

  @Column({
    nullable: false,
    default: 0
  })
  won: number;

  @Column({
    nullable: false,
    default: 0
  })
  lost: number;

  @Column({
    nullable: false,
    default: 0
  })
  playedTasks: number;

  @OneToMany(
    () => EncounteredWordEntity,
    link => link.player,
    {
      cascade: false
    }
  )
  encounteredWords: EncounteredWordEntity[];
}
