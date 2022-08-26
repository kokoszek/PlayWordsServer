import produce from 'immer';
import { newWord } from './utils';
import WordItem from './word-item';


export default function Words(props: any) {
  const { setMeaning, meaning } = props;
  return (
    <div className='words'>
      <div className='lang1'>
        <h2>polskie synonimy</h2>
        <ul>
          {
            meaning?.words_lang1
              .map((el: any, idx: number) => {
                return (
                  <WordItem
                    word={el}
                    idx={idx}
                    showRemoveButtom={true}
                    onInputChange={(value: any) => {
                      setMeaning(produce(meaning, (draft: any) => {
                        draft.words_lang1[idx].word = value
                      }));
                    }}
                    onRemoveClicked={() => {
                      setMeaning(produce(meaning, (draft: any) => {
                        draft.words_lang1.splice(idx, 1);
                      }))
                    }}
                    setExistingWord={(word: object) => {
                      setMeaning(produce(meaning, (draft: any) => {
                        draft.words_lang1[idx] = word;
                      }))
                    }}
                  />
                )
              })
            }
        </ul>
        <button onClick={() => {
          setMeaning(produce(meaning, (draft: any) => {
            draft.words_lang1.push(newWord())
          }));
        }}>dodaj</button>
      </div>
      <div className='lang2'>
        <h2>angielskie synonimy</h2>
        <ul>
          {
            meaning?.words_lang2
              .map((el: any, idx: number) => {
                return (
                  <WordItem
                    word={el}
                    idx={idx}
                    showRemoveButtom={true}
                    onInputChange={(value: any) => {
                      setMeaning(produce(meaning, (draft: any) => {
                        draft.words_lang2[idx].word = value
                      }));
                    }}
                    onRemoveClicked={() => {
                      setMeaning(produce(meaning, (draft: any) => {
                        draft.words_lang2.splice(idx, 1);
                      }))
                    }}
                    setExistingWord={(word: object) => {
                      setMeaning(produce(meaning, (draft: any) => {
                        draft.words_lang2[idx] = word;
                      }))
                    }}
                  />
                )
              })
          }
        </ul>
        <button onClick={() => {
          setMeaning(produce(meaning, (draft: any) => {
            draft.words_lang2.push(newWord())
          }));
        }}>dodaj</button>
      </div>
    </div>
  )
}
