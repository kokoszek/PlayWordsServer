import produce from 'immer';
import { useEffect, useState } from 'react';
import { GET_WORDS } from '../List/queries';
import { useQuery } from '@apollo/client';
import { WORD_EXISTS } from './queries';

function WordExistsHint(props: any) {
  //const { exists } = props;
  return (
    <div className='word-exists-hint'></div>
  )
}

export default function WordItem(props: any) {

  const {
    word,
    idx,
    showRemoveButtom,
    onInputChange,
    onRemoveClicked,
    setExistingWord
  } = props;

  const [wordExists, setWordExists] = useState(false);
  console.log('skip: ', !!word.id)
  const {data, loading, error} = useQuery(WORD_EXISTS, {
    variables: {
      word: word.word
    },
    skip: !!word.id
  })
  console.log('word-item -> data: ', data);
  const [showWordExistsHint, setShowWordExistsHint] = useState(false);
  if(!loading && data?.wordExists) {
    console.log('set existing word');
    if(!showWordExistsHint) {
      setShowWordExistsHint(true);
    }
    setExistingWord(data.wordExists);
  }
  // useEffect(() => {
  //   console.log('data: ', data);
  // }, [word])

  return (
    <li key={idx}>
      { showWordExistsHint && <WordExistsHint/> }
      <input type='text' value={word.word}
             onChange={e => {
               onInputChange(e.target.value);
             }}
      />
      {
        showRemoveButtom &&
        <button
          onClick={() => {
            onRemoveClicked();
          }}>usuń</button>
      }
    </li>
  )
}
