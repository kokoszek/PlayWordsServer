import Meaning from '../Meaning';
import List from '../List';
import './styles.scss';

export default function Main() {

  return (
    <div className='main-container'>
      <List/>
      <main className='main-content'>
        <Meaning/>
      </main>
    </div>
  )
}
