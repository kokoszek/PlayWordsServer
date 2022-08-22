import { useContext, useState } from 'react';
import { GET_MEANINGS } from './queries';
import { useQuery } from '@apollo/client';
import { ChosenEntityContext } from '../../contexts/chosen-entity';

export default function List() {
  const [searchText, setSearchText] = useState<string>('');
  const {data, loading, error } = useQuery(GET_MEANINGS, {
    variables: {
      search: searchText
    }
  })
  console.log('data: ', data?.searchMeaning);
  const entityCtx = useContext<any>(ChosenEntityContext);
  return (
    <div>
      <label htmlFor='search'>Search:</label>
      <input id='search' value={searchText} onChange={(e) => setSearchText(e.target.value)}  />
      <ul>
        {
          data?.searchMeaning.map((el: any) => {
            return (
              <li key={el.id} onClick={() => {
                console.log('el: ', el);
                entityCtx.setMeaning(el);
              }}>
                {el.meaning}
              </li>
            )
          })
        }
      </ul>
    </div>
  );
}
