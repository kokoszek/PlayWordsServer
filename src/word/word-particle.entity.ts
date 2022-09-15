import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { WordEntity } from "./word.entity";

@Entity()
export default class WordParticle {

  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  wordParticle: string;

  @ManyToOne(
    () => WordEntity,
    word => word.wordParticles,
    {
      onDelete: "CASCADE",
      onUpdate: "CASCADE"
    }
  )
  wordEntity: WordEntity;
}
