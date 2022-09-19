import { gql } from "@apollo/client";

export default function() {
}

export const GET_MEANINGS = gql`
    query SearchMeaning($search: String!) {
        searchMeaning(search: $search) {
            id
            meaning_lang1_desc
            meaning_lang1_language
            meaning_lang2_desc
            meaning_lang2_language
            partOfSpeech
            category
            words_lang1 {
                level
                word {
                    id
                    origin
                    word
                }
            }
            words_lang2 {
                level
                word {
                    id
                    origin
                    word
                }
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
                level
                meaning {
                    id
                    meaning_lang1_desc
                    meaning_lang1_language
                    meaning_lang2_desc
                    meaning_lang2_language
                    partOfSpeech
                    category
                    words_lang1 {
                        level
                        word {
                            id
                            origin
                            word
                        }
                    }
                    words_lang2 {
                        level
                        word {
                            id
                            origin
                            word
                        }
                    }
                }
            }
        }
    }
`;

// searchMeaning(search: String!): [MeaningEntity!]!
