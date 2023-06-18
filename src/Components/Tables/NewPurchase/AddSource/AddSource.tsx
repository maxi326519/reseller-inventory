import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../../../../interfaces/interfaces";
import { postSources } from "../../../../redux/actions/user";
import { loading, closeLoading } from "../../../../redux/actions/loading";
import swal from "sweetalert";

import styles from "./AddSource.module.css";

interface Props {
  handleClose: () => void;
}

export default function AddSource({ handleClose }: Props) {
  const dispatch = useDispatch();
  const [source, setSource] = useState<string>("");
  const [sourcesList, setSources] = useState<string[]>([]);
  const [validation, setValidation] = useState(true);
  const sources: string[] = useSelector(
    (state: RootState) => state.user.sources
  );

  useEffect(() => {
    setSources(sources);
  }, [sources]);

  useEffect(() => {
    handleValidation();
  }, [sources, sourcesList]);

  function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    setSource(event.target.value);
  }

  function handleAddCategory() {
    if (source !== "" && !sourcesList.some((c) => c === source)) {
      setSources([...sourcesList, source]);
      setSource("");
    }
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (validation) {
      dispatch(loading());
      dispatch<any>(postSources(sourcesList))
        .then(() => {
          handleClose();
          dispatch(closeLoading());
          swal("Updated", "Updated source succefully", "success");
        })
        .catch((e: any) => {
          dispatch(closeLoading());
          swal("Error", "Error to update sources", "error");
          console.log(e);
        });
    }
  }

  function handleValidation() {
    if (sourcesList.length !== sources.length) {
      setValidation(true);
      return true;
    } else {
      if (sources.length <= 0 && sourcesList.length <= 0) {
        setValidation(false);
        return false;
      }
      if (sources.every((value, index) => value === sourcesList[index])) {
        setValidation(false);
        return false;
      }
    }
    setValidation(true);
  }

  function handleRemove(source: string) {
    setSources(sourcesList.filter((c) => c !== source));
  }

  return (
    <div className={styles.background}>
      <form className={`toTop ${styles.container}`} onSubmit={handleSubmit}>
        <div className={styles.close}>
          <h4>Sources</h4>
          <button
            className="btn btn-danger"
            type="button"
            onClick={handleClose}
          >
            x
          </button>
        </div>
        <div className={styles.sourcesList}>
          {sourcesList.length > 0 ? (
            sourcesList.map((source, index) => (
              <div key={index} className={styles.row}>
                <span>{source}</span>
                <button
                  className="btn btn-danger"
                  type="button"
                  onClick={() => handleRemove(source)}
                  disabled={source === "General" || source === "Shipping"}
                >
                  -
                </button>
              </div>
            ))
          ) : (
            <span className={styles.empty}>Empty</span>
          )}
        </div>
        <div>
          <div className={styles.formContainer}>
            <label htmlFor="add">.</label>
            <input
              className="form-control"
              id="add"
              type="text"
              value={source}
              onChange={handleChange}
            />
            <button
              className="btn btn-success"
              type="button"
              onClick={handleAddCategory}
            >
              +
            </button>
          </div>
          <button
            className="btn btn-primary"
            type="submit"
            disabled={!validation}
          >
            Guardar
          </button>
        </div>
      </form>
    </div>
  );
}
