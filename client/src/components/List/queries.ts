import { gql } from '@apollo/client';

export default function(){}

export const GET_MEANINGS = gql`
    query SearchMeaning($search: String!) {
        searchMeaning(search: $search) {
            meaning_lang1_desc
            meaning_lang1_language
            id
            words_lang1 {
                id
                word
                lang
            }
            words_lang2 {
                id
                word
                lang
            }
        }
    }
`;

// searchMeaning(search: String!): [MeaningEntity!]!
