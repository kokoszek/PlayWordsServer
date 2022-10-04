import React, { createContext, useState } from "react";

// export type ChosenEntityContextType = {
//   meaning: Partial<MeaningInputNew> | null,
//   setMeaning: (obj: Partial<MeaningInputNew>) => void,
//   word: Partial<WordInput> | null,
//   setWord: (obj: Partial<WordInput>) => void,
// }

export const ChosenEntityContext = createContext<any>({
  meaning: null,
  setMeaning: () => {
  },
  word: null,
  setWord: () => {
  }
});

export const ChosenEntityContextProvider = ({ children }: any) => {

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
        setWord(null);
        setMeaning(newMeaning);
      },
      word,
      setWord: (newWord: any) => {
        setMeaning(null);
        setWord(newWord);
      }
    }}>
      {children}
    </ChosenEntityContext.Provider>
  );
};
