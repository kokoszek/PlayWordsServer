import { useContext, useState } from 'react';
import { useMutation, useQuery } from '@apollo/client';
import { CREATE_MEANING, GET_MEANING, UPSERT_MEANING } from './queries';
import { ChosenEntityContext } from '../../contexts/chosen-entity';
import { GET_MEANINGS } from '../List/queries';
import './styles.scss';

export default function Meaning() {

  // const {loading, data, error} = useQuery(GET_MEANING, {
  //   variables: {
  //     id: 2
  //   }
  // });
  const [createFunction, mutateObj] = useMutation(UPSERT_MEANING);
  // const [lang1Words, setLang1Words] = useState<any>([]);
  // const [lang2Words, setLang2Words] = useState<any>([]);
  const { meaning, setMeaning } = useContext<any>(ChosenEntityContext);

  // @ts-ignore
  const firstLang1Word = meaning?.words
    .filter((word: any) => word.lang === 'pl')[0];
  // @ts-ignore
  // @ts-ignore
  // @ts-ignore
  return (
    <div className='main-content'>
      <div className='meaning-content'>
        <label htmlFor='meaning-id'>id</label>
        <input id='meaning-id' disabled value={meaning?.id || '-'}/>
        <label>polskie słowo</label>
        <input type='text' value={firstLang1Word?.word}/>
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
              .filter((word: any) => word.lang === 'pl')
              .map((el: any, idx: number) => {
                return (
                  <li key={idx}>
                    <input type='text' value={el.word}
                           onChange={e => {
                             let lang1List = meaning?.words_lang1;
                             if(lang1List) {
                               lang1List[idx] = {...lang1List[idx]}; // copy becase its freezed
                               lang1List[idx].word = e.target.value;
                               setMeaning({
                                 words_lang1: [...lang1List]
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
                      }}>usuń</button>
                  </li>
                )
              })
          }
        </ul>
        <button onClick={() => {
          if(meaning?.words_lang1) {
            let newWords = [...meaning.words_lang1];
            setMeaning({
              meaning_lang1_desc: '',
              words_lang1: [...newWords, {
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
              category: undefined,
              id: undefined,
              meaning_lang2_desc: '',
              meaning_lang2_language: undefined,
              partOfSpeech: undefined,
              words_lang2: [],
              words_lang1: [],
              meaning_lang1_desc: '',
              meaning_lang1_language: 'en',
            });
          }}>wyczyść formularz</button>
          <button onClick={async () => {
            console.log('meaning: ', meaning);
            await createFunction({
              variables: {
                meaningInput: {
                  ...meaning,
                  __typename: undefined,
                  words_lang1: meaning?.words_lang1?.map((el: any) => ({
                    ...el,
                    __typename: undefined
                  })),
                  words_lang2: meaning?.words_lang2?.map((el: any) => ({
                    ...el,
                    __typename: undefined
                  }))
                }
              },
              refetchQueries: [GET_MEANINGS]
            })
          }}>wprowadź słowo</button>
        </footer>
      </div>
    </div>
  );
}
