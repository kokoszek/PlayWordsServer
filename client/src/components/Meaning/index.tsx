import { useContext, useState } from 'react';
import { useMutation, useQuery } from '@apollo/client';
import { CREATE_MEANING, GET_MEANING } from './queries';
import { ChosenEntityContext } from '../../contexts/chosen-entity';

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
  const [createFunction, mutateObj] = useMutation(CREATE_MEANING);
  // const [lang1Words, setLang1Words] = useState<any>([]);
  // const [lang2Words, setLang2Words] = useState<any>([]);
  const { meaning, setMeaning} = useContext<any>(ChosenEntityContext);
  return (
    <div>
      <label htmlFor='meaning'>znaczenie(pl)</label>
      <input id='meaning' type='text' value={meaning.meaning}
             onChange={e => setMeaning({meaning: e.target.value, words: meaning.words})}
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
                           let newList = [...meaning.words.filter((el: any) => el.lang === 'pl')];
                           console.log('newList: ', newList);
                           newList[idx] = {...newList[idx]}; // copy becase its freezed
                           newList[idx].word = e.target.value;
                           setMeaning({
                             words: newList
                           })
                         }}
                  />
                </li>
              )
            })
        }
      </ul>
      <button onClick={() => {
        let newWords = [...meaning.words];
        newWords.push({
          word: '',
          lang: 'pl'
        })
      }}>dodaj</button>
      {/*<h2>angielski odpowiednik</h2>*/}
      {/*<ul>*/}
      {/*  {*/}
      {/*    lang2Words.map((el: any, idx: number) => {*/}
      {/*      return (*/}
      {/*        <li key={idx}>*/}
      {/*          <input type='text' value={el.word}*/}
      {/*                 onChange={e => {*/}
      {/*                   let newList = [...lang2Words];*/}
      {/*                   newList[idx].word = e.target.value;*/}
      {/*                   setLang2Words(newList);*/}
      {/*                 }}*/}
      {/*          />*/}
      {/*        </li>*/}
      {/*      )*/}
      {/*    })*/}
      {/*  }*/}
      {/*</ul>*/}
      {/*<button onClick={() => {*/}
      {/*  lang2Words.push({*/}
      {/*    word: '',*/}
      {/*    lang: 'pl'*/}
      {/*  })*/}
      {/*  setLang2Words([...lang2Words])*/}
      {/*}}>dodaj</button>*/}
      <button onClick={async () => {
        await createFunction({
          variables: {
            meaningInput: {
              meaning,
              words: meaning.words
            }
          }
        })
      }}>wprowadź słowo</button>
    </div>
  );
}
