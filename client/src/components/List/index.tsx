import { useContext, useState } from "react";
import { GET_MEANINGS, GET_WORDS } from "./queries";
import { useQuery } from "@apollo/client";
import { ChosenEntityContext } from "../../contexts/chosen-entity";
import "./styles.scss";

export default function List() {
  const [searchText, setSearchText] = useState<string>("");
  const { data, loading, error } = useQuery(GET_WORDS, {
    variables: {
      search: searchText
    }
  });
  //console.log("data.searchWord: ", data.searchWord);
  const entityCtx = useContext<any>(ChosenEntityContext);
  return (
    <div className="search-list">
      <label htmlFor="search">Search:</label>
      <input
        id="search"
        value={searchText}
        onChange={(e) => setSearchText(e.target.value)}
      />
      <ul>
        {data?.searchWord.map((el: any) => {
          return (
            <li
              key={el.id}
              onClick={() => {
                if (el.meanings.length > 1) {
                  console.log("THIS");
                  entityCtx.setWord(el);
                } else {
                  console.log("el.meanings[0].meaning: ", el.meanings[0].meaning);
                  entityCtx.setMeaning(el.meanings[0].meaning);
                }
              }}
            >
              {el.word}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
