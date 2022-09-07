import { useContext } from "react";
import { ChosenEntityContext } from "../../contexts/chosen-entity";

import "./styles.scss";


export default function Word() {

  const entityCtx = useContext<any>(ChosenEntityContext);
  console.log("entityCtx.word: ", entityCtx.word);
  return (
    <div className="word-content">
      <h2>Znaczenia słowa: </h2>
      <ul>
        {
          entityCtx?.word?.meanings && entityCtx.word.meanings.map((el: any) => (
            <li onClick={() => {
              entityCtx.setMeaning(el);
            }}>
              {
                el.meaning_lang1_desc
              }
            </li>
          ))
        }
      </ul>
    </div>
  );
}
