import React from 'react';
import {createContext, useReducer, useState} from "react";
import { MeaningEntity } from '../../../src/meaning/meaning.entity';
import { WordEntity } from '../../../src/word/word.entity';
import { MeaningInput } from '../../../src/meaning/meaning.input-type';
import { WordInput } from '../../../src/word/word.input-type';

export type ChosenEntityContextType = {
  meaning: Partial<MeaningInput> | null,
  setMeaning: (obj: Partial<MeaningInput>) => void,
  word: Partial<WordInput> | null,
  setWord: (obj: Partial<WordInput>) => void,
}

export const ChosenEntityContext = createContext<ChosenEntityContextType>({
  meaning: null,
  setMeaning: () => {},
  word: null,
  setWord: () => {},
});

export const ChosenEntityContextProvider = ({children}: any) => {

  const [meaning, setMeaning] = useState<Partial<MeaningInput> | null>({
    meaning_lang1_desc: '',
    meaning_lang1_language: 'pl',
    words: []
  });
  const [word, setWord] = useState<Partial<WordEntity> | null>(null);
  return (
    <ChosenEntityContext.Provider value={{
      meaning,
      setMeaning: (newMeaning: Partial<MeaningInput>) => {
        setMeaning({
          ...meaning,
          ...newMeaning
        })
      },
      word,
      setWord: (newWord: Partial<WordInput>) => {
        setWord({
          ...word,
          ...newWord
        })
      },
    }}>
      { children }
    </ChosenEntityContext.Provider>
  );
}
