import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, ManyToMany } from 'typeorm';
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

  @Column({
    nullable: true
  })
  @Field(type => GraphQLString)
  level: 'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C1+';

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

  @ManyToMany(
    () => MeaningEntity,
    meaning => meaning.words,
    {
      onDelete: 'CASCADE'
    }
  )
  @Field(type => [MeaningEntity])
  meanings: MeaningEntity[];
}
