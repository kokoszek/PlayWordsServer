import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToMany,
  ManyToMany,
  JoinTable,
  BeforeInsert,
  AfterInsert, BeforeUpdate, AfterUpdate,
} from 'typeorm';
import { WordEntity } from '../word/word.entity';
import { Field, InputType, Int, ObjectType } from '@nestjs/graphql';
import { GraphQLInt, GraphQLString } from 'graphql';
import { RequestContext } from 'nestjs-request-context';
import { Request } from 'express';

export type LangType = 'pl' | 'en'
export type PartOfSpeechType = 'verb' | 'noun' | 'adj';
export type CategoryType = 'common' | 'colors';

declare global {
  namespace Express {
    interface Request {
      wordIdsBeforeSave: number[]
    }
  }
}

@Entity()
export class MeaningEntity {

  @AfterUpdate()
  async afterSave() {
  }

  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true, })
  meaning_lang1_desc: string;

  @Column({ nullable: true })
  meaning_lang1_language: LangType;

  @Column({ nullable: true, })
  meaning_lang2_desc: string;

  @Column({ nullable: true, })
  meaning_lang2_language: LangType;

  @Column({
    nullable: true
  })
  partOfSpeech: PartOfSpeechType;

  @Column({
    nullable: false,
    default: 'common'
  })
  @Field(type => GraphQLString)
  category: CategoryType;

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
  words: WordEntity[];
}
