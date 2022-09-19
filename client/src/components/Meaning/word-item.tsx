import produce from "immer";
import { useEffect, useRef, useState } from "react";
import { GET_WORDS } from "../List/queries";
import { useQuery } from "@apollo/client";
import { WORD_EXISTS } from "./queries";

function WordExistsHint(props: any) {
  //const { exists } = props;
  return <div className="word-exists-hint"></div>;
}

export default function WordItem(props: any) {
  const {
    link,
    meaning,
    idx,
    showRemoveButtom,
    onInputChange,
    onRemoveClicked,
    setWordId,
    lang
  } = props;
  const word = link?.word;
  //console.log("word: ", word);

  const { data, loading, error } = useQuery(WORD_EXISTS, {
    variables: {
      word: word.word
    },
    //skip: !!word.id,
    skip: !word.word
  });

  if (idx === 0 && lang === "en") {
    //console.log("word(get): ", word);
  }

  function wordExistsInMeaning(): boolean {
    if (!data) {
      return true;
    }
    let a = data.wordExists.meanings
      .map((link: any) => link.meaning.id)
      .includes(meaning.id);
    return a;
  }

  const origWordIdRef = useRef(null);
  useEffect(() => {
    if (origWordIdRef.current === null) {
      if (idx === 0 && lang === "en") {
        //console.log("setting ref: ", word.id);
      }
      origWordIdRef.current = word.id;
    }
  }, [word.id]);

  useEffect(() => {
    if (data?.wordExists && !wordExistsInMeaning()) {
      if (idx === 0 && lang === "en") {
        //console.log("setWordId: ", data.wordExists.id);
      }
      setWordId(data.wordExists.id);
    } else {
      if (idx === 0 && lang === "en") {
        //console.log("setWordId to orig: ", origWordIdRef.current);
      }
      setWordId(origWordIdRef.current);
    }
  }, [word.word, data?.wordExists]);
  // useEffect(() => {
  //   console.log('data: ', data);
  // }, [word])
  // console.log('unsetExistingWord: ', unsetExistingWord);
  // console.log('word-item -> data: ', data);
  // console.log('word: ', word);
  // console.log('wordExistsInMeaning: ', wordExistsInMeaning());

  return (
    <li key={idx}>
      {!wordExistsInMeaning() && !!word.word && <WordExistsHint />}
      <input
        type="text"
        value={word.word}
        onChange={(e) => {
          onInputChange(e.target.value);
        }}
      />
      {showRemoveButtom && (
        <button
          onClick={() => {
            onRemoveClicked();
          }}
        >
          usuń
        </button>
      )}
    </li>
  );
}
