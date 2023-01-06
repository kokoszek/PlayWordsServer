import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

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
}
