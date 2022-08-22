import { useState } from 'react';

export default function() {

  const [meaning, setMeaning] = useState('');
  return (
    <div>
      <label htmlFor='meaning'>znaczenie(pl)</label>
      <input id='meaning' type='text' value={meaning}
             onChange={e => setMeaning(e.target.value)}
      />
    </div>
  );
}
