import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { MeaningEntity } from '../meaning/meaning.entity';
import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { GraphQLInt, GraphQLString } from 'graphql';
import { InputTypeFromEntity } from '../common/input-type';

type WordInputType = InputTypeFromEntity<WordEntity>;

@Entity()
@ObjectType()
export class WordEntity {

  @PrimaryGeneratedColumn()
  @Field(type => GraphQLInt)
  id: number;

  @Column()
  @Field(type => GraphQLString)
  word: string;

  @Column({
    nullable: true
  })
  @Field(type => GraphQLString)
  desc: string;

  @Column()
  @Field(type => GraphQLString)
  lang: string;

  @Column({
    default: 1
  })
  @Field(type => GraphQLInt)
  freq: number;

  @Column({
    nullable: true,
    default: ''
  })
  @Field(type => GraphQLString)
  origin: string;

  @ManyToOne(
    () => MeaningEntity,
    meaning => meaning.words
  )
  @Field(type => WordEntity)
  meaning: MeaningEntity;
}
