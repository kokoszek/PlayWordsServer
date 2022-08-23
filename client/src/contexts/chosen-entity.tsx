import React from 'react';
import {createContext, useReducer, useState} from "react";

export const ChosenEntityContext = createContext({});

export const ChosenEntityContextProvider = ({children}: any) => {

  const [meaning, setMeaning] = useState({
    meaning_desc: '',
    words: []
  });
  const [word, setWord] = useState(null);
  return (
    <ChosenEntityContext.Provider value={{meaning, setMeaning, word, setWord}}>
      { children }
    </ChosenEntityContext.Provider>
  );
}
