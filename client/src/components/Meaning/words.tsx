import produce from "immer";
import { newLinkWithEmptyWord } from "./utils";
import LinkItem from "./word-item";

export default function Words(props: any) {
  const { setMeaning, meaning } = props;
  console.log("meaning: ", meaning);
  return (
    <div className="words">
      <div className="lang1">
        <h2>polskie synonimy</h2>
        <ul>
          {meaning?.words_lang1.map((link: any, idx: number) => {
            return (
              <LinkItem
                link={link}
                key={link.word.id}
                meaning={meaning}
                idx={idx}
                showRemoveButtom={true}
                onInputChange={(value: any) => {
                  let newMeaning = produce(meaning, (draft: any) => {
                    draft.words_lang1[idx].word.word = value;
                  });
                  setMeaning(newMeaning);
                }}
                onLevelChange={(value: string) => {
                  let newMeaning = produce(meaning, (draft: any) => {
                    draft.words_lang1[idx].level = value;
                  });
                  setMeaning(newMeaning);
                }}
                onRemoveClicked={() => {
                  setMeaning(
                    produce(meaning, (draft: any) => {
                      draft.words_lang1.splice(idx, 1);
                    })
                  );
                }}
                setWordId={(wordId: number) => {
                  setMeaning(
                    produce(meaning, (draft: any) => {
                      draft.words_lang1[idx].word.id = wordId;
                    })
                  );
                }}
                setExistingWord={(word: object) => {
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
          tabIndex={-1}
          onClick={() => {
            setMeaning(
              produce(meaning, (draft: any) => {
                draft.words_lang1.push(newLinkWithEmptyWord());
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
          {meaning?.words_lang2.map((link: any, idx: number) => {
            return (
              <LinkItem
                link={link}
                key={link.word.id}
                lang="en"
                meaning={meaning}
                idx={idx}
                showRemoveButtom={true}
                onInputChange={(value: any) => {
                  setMeaning(
                    produce(meaning, (draft: any) => {
                      draft.words_lang2[idx].word.word = value;
                    })
                  );
                }}
                onLevelChange={(value: string) => {
                  let newMeaning = produce(meaning, (draft: any) => {
                    draft.words_lang2[idx].level = value;
                  });
                  setMeaning(newMeaning);
                }}
                onRemoveClicked={() => {
                  setMeaning(
                    produce(meaning, (draft: any) => {
                      draft.words_lang2.splice(idx, 1);
                    })
                  );
                }}
                setWordId={(wordId: number) => {
                  setMeaning(
                    produce(meaning, (draft: any) => {
                      draft.words_lang2[idx].word.id = wordId;
                    })
                  );
                }}
              />
            );
          })}
        </ul>
        <button
          tabIndex={-1}
          onClick={() => {
            setMeaning(
              produce(meaning, (draft: any) => {
                draft.words_lang2.push(newLinkWithEmptyWord());
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
