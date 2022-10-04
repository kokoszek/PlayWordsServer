import { gql } from "@apollo/client";

export default function() {
}

export const GET_MEANING = gql`
    query GetMeaning($id: Int!) {
        getMeaning(id: $id) {
            id
        }
    }
`;

export const GET_PARTS_OF_SPEECH = gql`
    query GetPartsOfSpeech {
        getPartsOfSpeech
    }
`;

export const GET_LEVELS = gql`
    query GetLevels {
        getLevels
    }
`;

export const GET_CATEGORIES = gql`
    query GetCategories {
        getCategories
    }
`;

export const CREATE_MEANING = gql`
    mutation CreateMeaning($meaningInput: NewMeaningInput!) {
        createMeaning( meaningInput: $meaningInput) {
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
                    isIdiom
                    isPhrasalVerb
                }
            }
            words_lang2 {
                level
                word {
                    id
                    origin
                    word
                    isIdiom
                    isPhrasalVerb
                }
            }
        }
    }
`;
export const UPDATE_MEANING = gql`
    mutation UpsertMeaning($meaningInput: UpdateMeaningInput!) {
        upsertMeaning(meaningInput: $meaningInput) {
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
                    isIdiom
                    isPhrasalVerb
                }
            }
            words_lang2 {
                level
                word {
                    id
                    origin
                    word
                    isIdiom
                    isPhrasalVerb
                }
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
            meanings {
                meaning {
                    id
                }
            }
        }
    }
`;
