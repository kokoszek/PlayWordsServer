import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class WordEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  lang_polish: string;

  @Column()
  lang_english: string;

  @Column()
  level: number;

  @Column({
    nullable: true,
    default: ''
  })
  desc: string;

}
