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
    mutation CreateMeaning(
        $meaning: String!
    ) {
        createMeaning(
            meaning: String
        ) {
            id
        }
    }
`
