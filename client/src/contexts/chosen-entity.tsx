import React from 'react';
import {createContext, useReducer, useState} from "react";

// export type ChosenEntityContextType = {
//   meaning: Partial<MeaningInputNew> | null,
//   setMeaning: (obj: Partial<MeaningInputNew>) => void,
//   word: Partial<WordInput> | null,
//   setWord: (obj: Partial<WordInput>) => void,
// }

export const ChosenEntityContext = createContext<any>({
  meaning: null,
  setMeaning: () => {},
  word: null,
  setWord: () => {},
});

export const ChosenEntityContextProvider = ({children}: any) => {

  // const [meaning, setMeaning] = useState<Partial<MeaningInputNew> | null>({
  //   meaning_lang1_desc: '',
  //   meaning_lang1_language: 'pl',
  //   words_lang1: [],
  //   words_lang2: []
  // });
  const [meaning, setMeaning] = useState<any>(null);
  const [word, setWord] = useState<any>(null);
  return (
    <ChosenEntityContext.Provider value={{
      meaning,
      setMeaning: (newMeaning: any) => {
        setMeaning({
          ...meaning,
          ...newMeaning
        })
      },
      word,
      setWord: (newWord: any) => {
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
