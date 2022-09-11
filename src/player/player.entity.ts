import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class PlayerEntity {

  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  playerName: string;
}
