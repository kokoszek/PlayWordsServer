import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class WordEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    nullable: true
  })
  lang_polish: string;

  @Column()
  lang_english: string;

  @Column({
    nullable: true
  })
  level: string;

  @Column()
  freq: number;

  @Column({
    nullable: true,
    default: ''
  })
  origin: string;

  @Column({
    nullable: true,
  })
  desc_polish: string;

}
