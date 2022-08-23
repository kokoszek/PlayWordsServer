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
    mutation CreateMeaning($meaningInput: MeaningInput!) {
        createMeaning( meaningInput: $meaningInput) {
            meaning_desc
        }
    }
`
export const UPSERT_MEANING = gql`
    mutation UpsertMeaning($meaningInput: MeaningInput!) {
        upsertMeaning(meaningInput: $meaningInput) {
            meaning_desc
        }
    }
`
