import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { MeaningEntity } from '../meaning/meaning.entity';

@Entity()
export class WordEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  word: string;

  @Column({
    nullable: true
  })
  desc: string;

  @Column()
  lang: string;

  @Column()
  freq: number;

  @Column({
    nullable: true,
    default: ''
  })
  origin: string;

  @ManyToOne(
    () => MeaningEntity,
    meaning => meaning.words
  )
  meaning: MeaningEntity;
}
