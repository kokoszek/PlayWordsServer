import { useContext, useEffect, useState } from 'react';
import { useMutation, useQuery } from '@apollo/client';
import { CREATE_MEANING, GET_MEANING, UPDATE_MEANING, DELETE_MEANING } from './queries';
import { ChosenEntityContext } from '../../contexts/chosen-entity';
import { GET_MEANINGS, GET_WORDS } from '../List/queries';
import './styles.scss';
import produce from 'immer';
import _ from 'lodash';
import { newWord, newMeaning } from './utils';
import Words from './words';

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
  const [deleteMeaning, mutateObjDelete] = useMutation(DELETE_MEANING);
  // const [lang1Words, setLang1Words] = useState<any>([]);
  // const [lang2Words, setLang2Words] = useState<any>([]);
  const { meaning, setMeaning } = useContext<any>(ChosenEntityContext);
  console.log('meaning: ', meaning);
  useEffect(() => {
    if(mutateObjDelete.called &&
      !mutateObjDelete.loading &&
      mutateObjDelete.data.deleteMeaning
    ) {
      setMeaning(newMeaning());
    }
  }, [mutateObjDelete.called, mutateObjDelete.loading]);

  useEffect(() => {
    console.log('useEffect create: ', mutateObjCreate.data);
    if(mutateObjCreate.data) {
      setMeaning(
        mutateObjCreate.data.createMeaning
      )
    }
  }, [mutateObjCreate.loading])

  useEffect(() => {
    console.log('useEffect update: ', mutateObjUpdate.data);
    if(mutateObjUpdate.data) {
      setMeaning(
        mutateObjUpdate.data.upsertMeaning
      )
    }
  }, [mutateObjUpdate.loading])

  useEffect(() => {
    setMeaning(newMeaning());
  },[]);

  return (
      <div className='meaning-content'>
        <label htmlFor='meaning-id'>id</label>
        <input id='meaning-id' disabled value={meaning?.id || '-'}/>
        <Words setMeaning={setMeaning} meaning={meaning}/>
        <label htmlFor='meaning'>opis słowa</label>
        <input id='meaning' type='text' value={meaning?.meaning_lang1_desc || ''}
               onChange={e => setMeaning(produce(meaning, (draft: any) => {
                 draft.meaning_lang1_desc = e.target.value;
               }))} />
        <footer>
          <button onClick={() => {
            setMeaning(newMeaning());
          }}>wyczyść formularz</button>
          {
            meaning?.id && <button
              onClick={async () => {
                await deleteMeaning({
                  variables: {
                    meaningId: meaning.id
                  },
                  refetchQueries: [GET_WORDS]
                })
              }}
            >
              usuń znaczenie
            </button>
          }
          <button onClick={async () => {
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
                refetchQueries: [GET_WORDS]
              })
            } else {
              await createMeaning({
                variables: {
                  meaningInput: copy
                },
                refetchQueries: [GET_WORDS]
              })
            }
          }}>wprowadź słowo</button>
        </footer>
      </div>
  );
}
