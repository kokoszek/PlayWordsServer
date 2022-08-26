import {gql, } from '@apollo/client';

export default function(){}

export const GET_MEANING = gql`
    query GetMeaning($id: Int!) {
        getMeaning(id: $id) {
            id
        }
    }
`

export const CREATE_MEANING = gql`
    mutation CreateMeaning($meaningInput: NewMeaningInput!) {
        createMeaning( meaningInput: $meaningInput) {
            id
            meaning_lang1_desc
            meaning_lang1_language
            meaning_lang2_desc
            meaning_lang2_language
            words_lang1 {
                id
                word
                origin
            }
            words_lang2 {
                id
                word
                origin
            }
        }
    }
`
export const UPDATE_MEANING = gql`
    mutation UpsertMeaning($meaningInput: UpdateMeaningInput!) {
        upsertMeaning(meaningInput: $meaningInput) {
            id
            meaning_lang1_desc
            meaning_lang1_language
            meaning_lang2_desc
            meaning_lang2_language
            words_lang1 {
                id
                word
                origin
            }
            words_lang2 {
                id
                word
                origin
            }
        }
    }
`;

export const DELETE_MEANING = gql`
    mutation DeleteMeaning($meaningId: Int!) {
        deleteMeaning(meaningId: $meaningId)
    }
`;

export const WORD_EXISTS = gql`
    query WordExists($word: String!) {
        wordExists(word: $word) {
            id
            word
            origin
        }
    }
`;
