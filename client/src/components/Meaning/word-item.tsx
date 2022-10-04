import { useEffect, useState } from "react";
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
    onLevelChange,
    onWordPropertyChange
  } = props;
  const word = link?.word;
  console.log("word.isPhrasalVerb: ", word.isPhrasalVerb);

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

  useEffect(() => {
    if (data?.wordExists.id != word.id && !loading) {
      setWordId(data?.wordExists.id);
    }
  }, [word.word, loading]);

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

  return (
    <li key={idx}>
      <div className="word-main-settings">
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
      </div>
      <div className="checkboxes">
        <div className="checkbox-group">
          <label>is phrasal verb:</label>
          <input
            type="checkbox"
            checked={word.isPhrasalVerb}
            onChange={() => {
              onWordPropertyChange(!word.isPhrasalVerb, "isPhrasalVerb");
            }}
          />
        </div>
        <div className="checkbox-group">
          <label>is idiom:</label>
          <input
            type="checkbox"
            checked={word.isIdiom}
            onChange={() => {
              onWordPropertyChange(!word.isIdiom, "isIdiom");
            }}
          />
        </div>
      </div>
    </li>
  );
}
