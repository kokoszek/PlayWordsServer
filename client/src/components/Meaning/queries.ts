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
        }
    }
`
