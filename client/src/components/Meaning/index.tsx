import { useContext, useState } from 'react';
import { useMutation, useQuery } from '@apollo/client';
import { CREATE_MEANING, GET_MEANING, UPDATE_MEANING } from './queries';
import { ChosenEntityContext } from '../../contexts/chosen-entity';
import { GET_MEANINGS } from '../List/queries';
import './styles.scss';
import produce from 'immer';
import _ from 'lodash';

function recursive(obj: any, func: any) {
  for(let key in obj) {
    if(Array.isArray(obj[key])) {
      obj[key].forEach((el: any, idx: number) => {
        recursive(el, func);
      })
    } else {
      if(typeof obj[key] === 'object') {
        recursive(obj[key], func);
      } else {
        func(obj, key);
      }
    }
  }
}

export default function Meaning() {

  // const {loading, data, error} = useQuery(GET_MEANING, {
  //   variables: {
  //     id: 2
  //   }
  // });
  const [createMeaning, mutateObjCreate] = useMutation(CREATE_MEANING);
  const [updateMeaning, mutateObjUpdate] = useMutation(UPDATE_MEANING);
  // const [lang1Words, setLang1Words] = useState<any>([]);
  // const [lang2Words, setLang2Words] = useState<any>([]);
  const { meaning, setMeaning } = useContext<any>(ChosenEntityContext);

  const firstLang1Word = meaning?.words_lang1[0];
  console.log('firstLang1Word: ', firstLang1Word);
  console.log('meaning: ', meaning);

  // @ts-ignore
  // @ts-ignore
  // @ts-ignore
  return (
    <div className='main-content'>
      <div className='meaning-content'>
        <label htmlFor='meaning-id'>id</label>
        <input id='meaning-id' disabled value={meaning?.id || '-'}/>
        <label>polskie słowo</label>
        <input type='text' value={firstLang1Word?.word} onChange={e => {
          setMeaning(produce(meaning, (draft: any) => {
            draft.words_lang1[0].word = e.target.value;
          }));
        }}/>
        <label htmlFor='meaning'>opis słowa</label>
        <input id='meaning' type='text' value={meaning?.meaning_lang1_desc || ''}
               onChange={e => setMeaning({
                 meaning_lang1_desc: e.target.value,
               })}
        />
        <h2>polski odpowiednik</h2>
        <ul>
          {
            meaning?.words_lang1
              .slice(1)
              .map((el: any, idx: number) => {
                idx++; // because slice(1)
                return (
                  <li key={idx}>
                    <input type='text' value={el.word}
                           onChange={e => {
                             setMeaning(produce(meaning, (draft: any) => {
                               draft.words_lang1[idx].word = e.target.value
                             }));
                           }}
                    />
                    <button
                      onClick={() => {
                        setMeaning(produce(meaning, (draft: any) => {
                          draft.words_lang1.splice(idx, 1);
                        }))
                      }}>usuń</button>
                  </li>
                )
              })
          }
        </ul>
        <button onClick={() => {
          setMeaning(produce(meaning, (draft: any) => {
            draft.words_lang1.push({
              id: null,
              word: '',
              lang: 'pl',
              desc: '',
              level: null,
              freq: 1,
              origin: 'web-interface',
            })
          }));
        }}>dodaj</button>
        <h2>angielski odpowiednik</h2>
        <ul>
          {
            meaning?.words_lang2
              .filter((word: any) => word.lang === 'en')
              .map((el: any, idx: number) => {
                return (
                  <li key={idx}>
                    <input type='text' value={el.word}
                           onChange={e => {
                             let lang2List = meaning?.words_lang2;
                             if(lang2List) {
                               lang2List[idx] = {...lang2List[idx]}; // copy becase its freezed
                               lang2List[idx].word = e.target.value;
                               setMeaning({
                                 words_lang2: [...lang2List]
                               })
                             }
                           }}
                    />
                    <button
                      onClick={() => {
                        if(meaning) {
                          // @ts-ignore
                          let lang1List = [...meaning.words_lang1];
                          if(lang1List) {
                            lang1List.slice(idx, 1);
                            setMeaning({
                              words_lang1: lang1List
                            })
                          }
                        }
                      }}
                    >usuń</button>
                  </li>
                )
              })
          }
        </ul>
        <button onClick={() => {
          if(meaning?.words_lang2) {
            let newWords = [...meaning?.words_lang2];
            setMeaning({
              words_lang2: [...meaning?.words_lang2, {
                id: null,
                word: '',
                lang: 'pl',
                desc: '',
                level: null,
                freq: 1,
                origin: 'web-interface',
              }]
            })
          }
        }}>dodaj</button>
        <footer>
          <button onClick={() => {
            setMeaning({
              id: undefined,
              category: undefined,
              meaning_lang1_desc: '',
              meaning_lang1_language: 'pl',
              meaning_lang2_desc: '',
              meaning_lang2_language: 'en',
              partOfSpeech: undefined,
              words_lang1: [{
                word: '',
                origin: 'web-interface',
                lang: 'pl',
              }],
              words_lang2: [],
            });
          }}>wyczyść formularz</button>
          <button onClick={async () => {
            console.log('meaning: ', meaning);

            let copy = _.cloneDeep(meaning);
            recursive(copy, (obj: any, key: string) => {
              if(key === '__typename') {
                obj['__typename'] = undefined;
              }
            });

            if(meaning.id) {
              await updateMeaning({
                variables: {
                  meaningInput: copy
                },
                refetchQueries: [GET_MEANINGS]
              })
            } else {
              await createMeaning({
                variables: {
                  meaningInput: copy
                },
                refetchQueries: [GET_MEANINGS]
              })
            }
          }}>wprowadź słowo</button>
        </footer>
      </div>
    </div>
  );
}
