import { Column, Entity, Index, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { WordEntity } from "./word.entity";

@Entity()
export default class WordParticle {

  @PrimaryGeneratedColumn()
  id: number;

  @Index()
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
