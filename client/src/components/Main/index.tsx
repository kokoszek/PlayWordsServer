import Meaning from "../Meaning";
import List from "../List";
import "./styles.scss";
import { useContext } from "react";
import { ChosenEntityContext } from "../../contexts/chosen-entity";
import Word from "../Word";

export default function Main() {
  const entityCtx = useContext<any>(ChosenEntityContext);
  return (
    <div className="main-container">
      <List />
      <main className="main-content">
        {
          entityCtx.meaning ? <Meaning /> : <Word />
        }
      </main>
    </div>
  );
}
