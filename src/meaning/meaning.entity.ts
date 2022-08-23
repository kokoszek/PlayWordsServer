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

  @Field(type => GraphQLString, { nullable: true })
  @Column({ nullable: true, })
  meaning_lang1_desc: string;

  @Column({ nullable: true })
  @Field(type => GraphQLString, { nullable: true })
  meaning_lang1_language: 'pl' | 'en';

  @Field(type => GraphQLString, {nullable: true})
  @Column({ nullable: true, })
  meaning_lang2_desc: string;

  @Column({ nullable: true, })
  @Field(type => GraphQLString, {nullable: true})
  meaning_lang2_language: 'pl' | 'en';

  @Column({
    nullable: true
  })
  @Field(type => GraphQLString)
  partOfSpeech: 'verb' | 'noun' | 'adj';

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
  @JoinTable({
    name: 'meaning_word_jointable'
  })
  @Field(type => [WordEntity])
  words: WordEntity[];

}
