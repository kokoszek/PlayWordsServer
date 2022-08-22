import { useState } from 'react';
import { useMutation, useQuery } from '@apollo/client';
import { CREATE_MEANING, GET_MEANING } from './queries';

export default function Meaning() {

  const {loading, data, error} = useQuery(GET_MEANING, {
    variables: {
      id: 1
    }
  });
  const [createFunction, mutateObj] = useMutation(CREATE_MEANING);
  console.log('data: ', data);
  const [meaning, setMeaning] = useState('');
  return (
    <div>
      <label htmlFor='meaning'>znaczenie(pl)</label>
      <input id='meaning' type='text' value={meaning}
             onChange={e => setMeaning(e.target.value)}
      />
      <button onClick={async () => {
        await createFunction({
          variables: {
            id: 1,
            meaning: 'wziąć(fizycznie)'
          }
        })
      }}>submit</button>
    </div>
  );
}
