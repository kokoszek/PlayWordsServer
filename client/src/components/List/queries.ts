import { gql } from '@apollo/client';

export default function(){}

export const GET_MEANINGS = gql`
    query SearchMeaning($search: String!) {
        searchMeaning(search: $search) {
            meaning_desc
            id
            words {
                id
                word
                lang
            }
        }
    }
`;

// searchMeaning(search: String!): [MeaningEntity!]!
