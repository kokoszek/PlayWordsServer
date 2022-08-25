import { WordEntity } from './word.entity';
import { Field, ObjectType } from '@nestjs/graphql';
import { GraphQLID, GraphQLInt, GraphQLString } from 'graphql';
import { Maybe } from 'graphql/jsutils/Maybe';

@ObjectType()
export class WordType implements Omit<WordEntity, 'meanings' | 'lang'> {

    @Field(type => GraphQLInt)
    id: number;

    @Field(type => GraphQLString)
    word: string;

    @Field(type => GraphQLString)
    desc: string;

    @Field(type => GraphQLString)
    level: Maybe<'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C1+'>;

    @Field(type => GraphQLInt)
    freq: number;

    @Field(type => GraphQLString)
    origin: string;
}
