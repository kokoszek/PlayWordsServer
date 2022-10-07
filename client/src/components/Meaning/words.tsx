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
                key={idx}
                lang="pl"
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
                onWordPropertyChange={(value: any, prop: string) => {
                  setMeaning(
                    produce(meaning, (draft: any) => {
                      draft.words_lang1[idx].word[prop] = value;
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
                key={idx}
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
                onWordPropertyChange={(value: any, prop: string) => {
                  setMeaning(
                    produce(meaning, (draft: any) => {
                      draft.words_lang2[idx].word[prop] = value;
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
