import { gql } from '@apollo/client';

export default function(){}

export const GET_MEANINGS = gql`
    query SearchMeaning($search: String!) {
        searchMeaning(search: $search) {
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

export const GET_WORDS = gql`
    query SearchWord($search: String!) {
        searchWord(search: $search) {
            id
            word
            lang
            meanings {
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
    }
`;

// searchMeaning(search: String!): [MeaningEntity!]!
