import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Field } from "@nestjs/graphql";
import { GraphQLInt, GraphQLString } from "graphql";
import { InputTypeFromEntity } from "../common/input-type";
import WordParticle from "./word-particle.entity";
import { LinkEntity } from "../meaning/link.entity";

type WordInputType = InputTypeFromEntity<WordEntity>;

@Entity()
export class WordEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  word: string;
  /**
   * if (category === 'color')
   *  then category === 'color' and level === any
   * if (category === 'phrasal verb')
   *  then category === 'phrasal verb' and same word particles
   *
   */
  @Column({
    nullable: true
  })
  desc: string;

  @Column()
  @Field((type) => GraphQLString)
  lang: string;

  @Column({
    default: 1
  })
  @Field((type) => GraphQLInt)
  freq: number;

  @Column({
    nullable: true,
    default: ""
  })
  @Field((type) => GraphQLString)
  origin: string;

  @OneToMany(() => LinkEntity, (link) => link.word, {
    onDelete: "CASCADE"
  })
  @Field((type) => [LinkEntity])
  meanings: LinkEntity[];

  @OneToMany(
    () => WordParticle,
    wordParticle => wordParticle.wordEntity,
    {
      cascade: true
    }
  )
  wordParticles: WordParticle[];
}
