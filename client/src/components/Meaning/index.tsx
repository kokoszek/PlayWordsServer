import { useContext, useState } from 'react';
import { useMutation, useQuery } from '@apollo/client';
import { CREATE_MEANING, GET_MEANING, UPSERT_MEANING } from './queries';
import { ChosenEntityContext } from '../../contexts/chosen-entity';
import { GET_MEANINGS } from '../List/queries';

function WordInput() {

  return (
    <input type='text' />
  )
}

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
  return (
    <div>
      <label htmlFor='meaning'>znaczenie(pl)</label>
      <input disabled value={meaning.id || '-'}/>
      <input id='meaning' type='text' value={meaning.meaning}
             onChange={e => setMeaning({meaning_desc: e.target.value, words: meaning.words})}
      />
      <h2>polski odpowiednik</h2>
      <ul>
        {
          meaning.words
            .filter((word: any) => word.lang === 'pl')
            .map((el: any, idx: number) => {
              return (
                <li key={idx}>
                  <input type='text' value={el.word}
                         onChange={e => {
                           let lang1List = [...meaning.words].filter(el => el.lang === 'pl');
                           let lang2List = [...meaning.words].filter(el => el.lang === 'en');
                           lang1List[idx] = {...lang1List[idx]}; // copy becase its freezed
                           lang1List[idx].word = e.target.value;
                           setMeaning({
                             ...meaning,
                             words: [...lang1List, ...lang2List]
                           })
                         }}
                  />
                  <button
                    onClick={() => {
                      let lang1List = [...meaning.words].filter(el => el.lang === 'pl');
                      let lang2List = [...meaning.words].filter(el => el.lang === 'en');
                      lang1List[idx] = null; // copy becase its freezed
                      setMeaning({
                        ...meaning,
                        words: [...lang1List.filter(el => !!el), ...lang2List]
                      })
                    }}>usuń</button>
                </li>
              )
            })
        }
      </ul>
      <button onClick={() => {
        let newWords = [...meaning.words];
        setMeaning({
          ...meaning,
          words: [...meaning.words, {
            word: '',
            lang: 'pl'
          }]
        })
      }}>dodaj</button>
      <h2>angielski odpowiednik</h2>
      <ul>
        {
          meaning.words
            .filter((word: any) => word.lang === 'en')
            .map((el: any, idx: number) => {
              return (
                <li key={idx}>
                  <input type='text' value={el.word}
                         onChange={e => {
                           let lang1List = [...meaning.words].filter(el => el.lang === 'pl');
                           let lang2List = [...meaning.words].filter(el => el.lang === 'en');
                           lang2List[idx] = {...lang2List[idx]}; // copy becase its freezed
                           lang2List[idx].word = e.target.value;
                           setMeaning({
                             ...meaning,
                             words: [...lang1List, ...lang2List]
                           })
                         }}
                  />
                  <button
                    onClick={() => {
                      let lang1List = [...meaning.words].filter(el => el.lang === 'pl');
                      let lang2List = [...meaning.words].filter(el => el.lang === 'en');
                      lang2List[idx] = null; // copy becase its freezed
                      setMeaning({
                        ...meaning,
                        words: [...lang1List, ...lang2List.filter(el => !!el)]
                      })
                    }}
                  >usuń</button>
                </li>
              )
            })
        }
      </ul>
      <button onClick={() => {
        let newWords = [...meaning.words];
        setMeaning({
          ...meaning,
          words: [...meaning.words, {
            word: '',
            lang: 'en'
          }]
        })
      }}>dodaj</button>
      <button onClick={() => {
        setMeaning({
          meaning_desc: '',
          words: []
        });
      }}>wyczyść formularz</button>
      <button onClick={async () => {
        console.log('meaning: ', meaning);
        await createFunction({
          variables: {
            meaningInput: {
              ...meaning,
              __typename: undefined,
              words: meaning.words.map((el: any) => ({
                ...el,
                __typename: undefined
              }))
            }
          },
          refetchQueries: [GET_MEANINGS]
        })
      }}>wprowadź słowo</button>
    </div>
  );
}
