import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToMany,
  ManyToMany,
  JoinTable,
  BeforeInsert,
  AfterInsert, BeforeUpdate, AfterUpdate
} from "typeorm";
import { WordEntity } from "../word/word.entity";
import { Field, InputType, Int, ObjectType } from "@nestjs/graphql";
import { GraphQLInt, GraphQLString } from "graphql";
import { RequestContext } from "nestjs-request-context";
import { Request } from "express";
import { LinkEntity } from "./link.entity";

export type LangType = "pl" | "en"
export const PartOfSpeechArray = [
  "verb",
  "phrasal verb",
  "idiom",
  "noun",
  "adjective",
  "adverb"
] as const;
export const CategoryArray = [
  "general",
  "colors, shapes and sizes",
  "emotions",
  "food",
  "law",
  "office"
];

export type PartOfSpeechType = typeof PartOfSpeechArray[number];
export type CategoryType = typeof CategoryArray[number];

declare global {
  namespace Express {
    interface Request {
      wordIdsBeforeSave: number[];
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

  @Column({ nullable: true })
  meaning_lang1_desc: string;

  @Column({ nullable: true })
  meaning_lang1_language: LangType;

  @Column({ nullable: true })
  meaning_lang2_desc: string;

  @Column({ nullable: true })
  meaning_lang2_language: LangType;

  @Column({
    nullable: true
  })
  partOfSpeech: PartOfSpeechType;

  @Column({
    nullable: false,
    default: "common"
  })
  @Field(type => GraphQLString)
  category: CategoryType;

  @OneToMany(
    () => LinkEntity,
    link => link.meaning,
    {
      cascade: false
    }
  )
  words: LinkEntity[];
}
