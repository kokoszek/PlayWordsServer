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
    meaning,
    idx,
    showRemoveButtom,
    onInputChange,
    onRemoveClicked,
    setExistingWord,
    unsetExistingWord
  } = props;

  console.log('skip: ', !!word.id)
  const {data, loading, error} = useQuery(WORD_EXISTS, {
    variables: {
      word: word.word
    },
    skip: !!word.id
  });
  function wordExistsInMeaning(): boolean {
    return (
      data?.wordExists.meanings
        .map((el: any) => el.id)
        .includes(meaning.id)
    );
  }
  useEffect(() => {
    if(!loading && data?.wordExists) {
      console.log('set existing word');
      setExistingWord(data.wordExists);
    } else {
      if(unsetExistingWord) {
        unsetExistingWord();
      }
    }
  }, data?.wordExists);
  // useEffect(() => {
  //   console.log('data: ', data);
  // }, [word])
  console.log('unsetExistingWord: ', unsetExistingWord)
  console.log('word-item -> data: ', data);
  console.log('word: ', word);
  console.log('wordExistsInMeaning: ', wordExistsInMeaning());

  return (
    <li key={idx}>
      { !wordExistsInMeaning() && data?.wordExists && <WordExistsHint/> }
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
