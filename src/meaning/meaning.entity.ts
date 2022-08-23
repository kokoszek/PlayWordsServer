import { Entity, Column, PrimaryGeneratedColumn, OneToMany, ManyToMany, JoinTable } from 'typeorm';
import { WordEntity } from '../word/word.entity';
import { Field, InputType, Int, ObjectType } from '@nestjs/graphql';
import { GraphQLInt, GraphQLString } from 'graphql';

@Entity()
@ObjectType()
export class MeaningEntity {

  @PrimaryGeneratedColumn()
  @Field(type => GraphQLInt)
  id: number;

  @Field(type => GraphQLString)
  @Column({
    nullable: false,
  })
  meaning_desc: string;

  @Column()
  @Field(type => GraphQLString)
  meaning_desc_lang: 'pl' | 'en';

  @Column({
    nullable: true
  })
  @Field(type => GraphQLString)
  partOfSpeech: string;

  @Column({
    nullable: false,
    default: 'common'
  })
  @Field(type => GraphQLString)
  category: 'common' | 'colors';

  @ManyToMany(
    () => WordEntity,
    word => word.meanings,
    {
      cascade: true
    }
  )
  @JoinTable()
  @Field(type => [WordEntity])
  words: WordEntity[];

}
