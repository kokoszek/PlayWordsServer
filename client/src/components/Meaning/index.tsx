import { useContext, useEffect, useState } from "react";
import { useMutation, useQuery } from "@apollo/client";
import {
  CREATE_MEANING,
  GET_MEANING,
  UPDATE_MEANING,
  DELETE_MEANING, GET_PARTS_OF_SPEECH, GET_CATEGORIES
} from "./queries";
import { ChosenEntityContext } from "../../contexts/chosen-entity";
import { GET_MEANINGS, GET_WORDS } from "../List/queries";
import "./styles.scss";
import produce from "immer";
import _ from "lodash";
import { newWord, newMeaning } from "./utils";
import Words from "./words";
import Select from "react-select";

function recursive(obj: any, func: any) {
  for (let key in obj) {
    if (Array.isArray(obj[key])) {
      obj[key].forEach((el: any, idx: number) => {
        recursive(el, func);
      });
    } else {
      if (typeof obj[key] === "object") {
        recursive(obj[key], func);
      } else {
        func(obj, key);
      }
    }
  }
}

export default function Meaning() {
  const [createMeaning, mutateObjCreate] = useMutation(CREATE_MEANING);
  const [updateMeaning, mutateObjUpdate] = useMutation(UPDATE_MEANING);
  const [deleteMeaning, mutateObjDelete] = useMutation(DELETE_MEANING);
  const { meaning, setMeaning } = useContext<any>(ChosenEntityContext);

  const { data, loading, error } = useQuery(GET_PARTS_OF_SPEECH);

  const {
    data: categoryData,
    loading: categoryLoading,
    error: categoryError
  } = useQuery(GET_CATEGORIES);

  useEffect(() => {
    if (
      mutateObjDelete.called &&
      !mutateObjDelete.loading &&
      mutateObjDelete.data.deleteMeaning
    ) {
      console.log("set new meaning");
      setMeaning(newMeaning());
    }
  }, [mutateObjDelete.called, mutateObjDelete.loading]);

  useEffect(() => {
    if (mutateObjCreate.data) {
      console.log("mutate obj create");
      setMeaning(mutateObjCreate.data.createMeaning);
    }
  }, [mutateObjCreate.loading]);

  useEffect(() => {
    if (mutateObjUpdate.data) {
      console.log("mutate obj update");
      setMeaning(mutateObjUpdate.data.upsertMeaning);
    }
  }, [mutateObjUpdate.loading]);

  // useEffect(() => {
  //   setMeaning(newMeaning());
  // }, []);

  console.log("category data: ", categoryData);
  return (
    <div className="meaning-content">
      <div className="group">
        <label htmlFor="meaning-id">id</label>
        <input id="meaning-id" disabled value={meaning?.id || "-"} />
      </div>
      <div className="group">
        <label htmlFor="select-part-of-speech">część mowy</label>
        <Select id="select-part-of-speech"
                options={data?.getPartsOfSpeech.map((el: string) => ({
                  value: el, label: el
                }))}
                value={{ value: meaning.partOfSpeech, label: meaning.partOfSpeech }}
                onChange={(event: any) => {
                  console.log("onChange->value: ", event.value);
                  setMeaning(
                    produce(meaning, (draft: any) => {
                      draft.partOfSpeech = event.value;
                    })
                  );
                }}
        />
      </div>
      <div className="group">
        <label htmlFor="select-category">kategoria</label>
        <Select id="select-category"
                options={categoryData?.getCategories?.map((el: string) => ({
                  value: el, label: el
                }))}
                value={{ value: meaning.category, label: meaning.category }}
                onChange={(event: any) => {
                  console.log("onChange->value: ", event.value);
                  setMeaning(
                    produce(meaning, (draft: any) => {
                      draft.category = event.value;
                    })
                  );
                }}
        />
      </div>

      <Words setMeaning={setMeaning} meaning={meaning} />
      <label htmlFor="meaning">
        Opis znaczenia, wyjaśnienie, doprecyzowanie
      </label>
      <textarea
        id="meaning"
        className="desc-text-area"
        value={meaning?.meaning_lang1_desc || ""}
        onChange={(e) =>
          setMeaning(
            produce(meaning, (draft: any) => {
              draft.meaning_lang1_desc = e.target.value;
            })
          )
        }
      />
      <footer>
        <button
          onClick={() => {
            setMeaning(newMeaning());
          }}
        >
          wyczyść formularz
        </button>
        {meaning?.id && (
          <button
            onClick={async () => {
              await deleteMeaning({
                variables: {
                  meaningId: meaning.id
                },
                refetchQueries: [GET_WORDS]
              });
            }}
          >
            usuń znaczenie
          </button>
        )}
        <button
          onClick={async () => {
            let copy = _.cloneDeep(meaning);
            recursive(copy, (obj: any, key: string) => {
              if (key === "__typename") {
                obj["__typename"] = undefined;
              }
              if (key === "meaning_lang1_desc") {
                if (!obj["meaning_lang1_desc"]) {
                  obj["meaning_lang1_desc"] = null;
                }
              }
            });
            if (meaning.id) {
              await updateMeaning({
                variables: {
                  meaningInput: copy
                },
                refetchQueries: [GET_WORDS]
              });
            } else {
              await createMeaning({
                variables: {
                  meaningInput: copy
                },
                refetchQueries: [GET_WORDS]
              });
            }
          }}
        >
          wprowadź słowo
        </button>
      </footer>
    </div>
  );
}
