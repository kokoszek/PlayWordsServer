import { useContext } from "react";
import { ChosenEntityContext } from "../../contexts/chosen-entity";

import "./styles.scss";


export default function Word() {

  const entityCtx = useContext<any>(ChosenEntityContext);
  console.log("entityCtx.word: ", entityCtx.word);
  return (
    <div className="word-content">
      <h2>{entityCtx?.word.word}, znaczenia słowa: </h2>
      <ul>
        {
          entityCtx?.word?.meanings && entityCtx.word.meanings.map((link: any) => (
            <li key={link.meaning.id} onClick={() => {
              entityCtx.setMeaning(link.meaning);
            }}>
              {
                link.meaning.meaning_lang1_desc
              }
              {
                link.meaning.meaning_lang1_desc && ", "
              }
              {
                link.meaning.partOfSpeech
              }
            </li>
          ))
        }
      </ul>
    </div>
  );
}
