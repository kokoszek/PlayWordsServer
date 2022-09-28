import produce from "immer";
import { useEffect, useRef, useState } from "react";
import { GET_WORDS } from "../List/queries";
import { useQuery } from "@apollo/client";
import { GET_LEVELS, WORD_EXISTS } from "./queries";
import Select from "react-select";

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
    lang,
    onLevelChange
  } = props;
  const word = link?.word;
  //console.log("word: ", word);

  const { data: levelsData } = useQuery(GET_LEVELS);
  const [level, setLevel] = useState<any>(null);

  useEffect(() => {
    setLevel({
      label: link.level,
      value: link.level
    });
  }, [link.level]);

  const { data, loading, error } = useQuery(WORD_EXISTS, {
    variables: {
      word: word.word
    },
    fetchPolicy: "no-cache",
    //skip: !!word.id,
    skip: !word.word
  });

  if (idx === 0 && lang === "en") {
    //console.log("word(get): ", word);
  }

  //console.log("levelsData: ", levelsData);

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
        className="word-input"
        type="text"
        value={word.word}
        tabIndex={0}
        onChange={(e) => {
          onInputChange(e.target.value);
        }}
      />
      <Select
        className="level-select"
        options={levelsData?.getLevels.map((level: any) => ({
          label: level, value: level
        })).concat([{ label: "none", value: null }])}
        value={level}
        onChange={(event: any) => {
          console.log("event: ", event);
          setLevel(event);
          onLevelChange(event.value);
        }}
      />
      {showRemoveButtom && (
        <button
          tabIndex={-1}
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
