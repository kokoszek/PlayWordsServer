import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { WordEntity } from '../word/word.entity';
import { Field, Int, ObjectType } from '@nestjs/graphql';
import { GraphQLInt, GraphQLString } from 'graphql';

@Entity()
@ObjectType()
export class MeaningEntity {

  @PrimaryGeneratedColumn()
  @Field(type => GraphQLInt)
  id: number;

  @Column()
  @Field(type => GraphQLString)
  meaning: string;

  @Column()
  @Field(type => GraphQLString)
  partOfSpeech: string;

  @Column({
    nullable: false,
    default: 'common'
  })
  @Field(type => GraphQLString)
  category: 'common' | 'colors';

  @Column()
  @Field(type => GraphQLString)
  meaning_lang: 'pl' | 'en';

  @Column({
    nullable: false
  })
  @Field(type => GraphQLString)
  level: 'A1' | 'A2' | 'B1' | 'B2' | 'C1';

  @OneToMany(
    () => WordEntity,
    meaning => meaning.meaning
  )
  @Field(type => [WordEntity])
  words: WordEntity[];

}
