import produce from "immer";
import { newWord } from "./utils";
import WordItem from "./word-item";

export default function Words(props: any) {
  const { setMeaning, meaning } = props;
  console.log("meaning: ", meaning);
  return (
    <div className="words">
      <div className="lang1">
        <h2>polskie synonimy</h2>
        <ul>
          {meaning?.words_lang1.map((el: any, idx: number) => {
            return (
              <WordItem
                word={el}
                meaning={meaning}
                idx={idx}
                showRemoveButtom={true}
                onInputChange={(value: any) => {
                  console.log("BEFORE: ", meaning);
                  let newMeaning = produce(meaning, (draft: any) => {
                    draft.words_lang1[idx].word = value;
                  });
                  console.log("newMeaning: ", newMeaning);
                  setMeaning(
                    newMeaning
                  );
                }}
                onRemoveClicked={() => {
                  setMeaning(
                    produce(meaning, (draft: any) => {
                      draft.words_lang1.splice(idx, 1);
                    })
                  );
                }}
                setExistingWord={(wordId: number) => {
                  // setMeaning(
                  //   produce(meaning, (draft: any) => {
                  //     draft.words_lang1[idx] = word;
                  //   })
                  // );
                }}
                unsetExistingWord={() => {
                  // console.log("UNSET EXISTING MEANING");
                  // setMeaning(
                  //   produce(meaning, (draft: any) => {
                  //     if (draft.words_lang1[idx]) {
                  //       //delete draft.words_lang1[idx].id;
                  //       delete draft.words_lang1[idx].meanings;
                  //     }
                  //   })
                  // );
                }}
              />
            );
          })}
        </ul>
        <button
          onClick={() => {
            setMeaning(
              produce(meaning, (draft: any) => {
                draft.words_lang1.push(newWord());
              })
            );
          }}
        >
          dodaj
        </button>
      </div>
      <div className="lang2">
        <h2>angielskie synonimy</h2>
        <ul>
          {meaning?.words_lang2.map((el: any, idx: number) => {
            return (
              <WordItem
                word={el}
                meaning={meaning}
                idx={idx}
                showRemoveButtom={true}
                onInputChange={(value: any) => {
                  setMeaning(
                    produce(meaning, (draft: any) => {
                      draft.words_lang2[idx].word = value;
                    })
                  );
                }}
                onRemoveClicked={() => {
                  setMeaning(
                    produce(meaning, (draft: any) => {
                      draft.words_lang2.splice(idx, 1);
                    })
                  );
                }}
                setExistingWord={(word: object) => {
                  setMeaning(
                    produce(meaning, (draft: any) => {
                      draft.words_lang2[idx] = word;
                    })
                  );
                }}
                unsetExistingWord={() => {
                  setMeaning(
                    produce(meaning, (draft: any) => {
                      if (draft.words_lang2[idx]) {
                        delete draft.words_lang2[idx].id;
                        delete draft.words_lang2[idx].meanings;
                      }
                    })
                  );
                }}
              />
            );
          })}
        </ul>
        <button
          onClick={() => {
            setMeaning(
              produce(meaning, (draft: any) => {
                draft.words_lang2.push(newWord());
              })
            );
          }}
        >
          dodaj
        </button>
      </div>
    </div>
  );
}
