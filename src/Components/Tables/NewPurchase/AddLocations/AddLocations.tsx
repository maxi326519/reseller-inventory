import { useSelector, useDispatch } from "react-redux";
import { loading, closeLoading } from "../../../../redux/actions/loading";
import { postLocations } from "../../../../redux/actions/user";
import { useState, useEffect } from "react";
import { RootState } from "../../../../interfaces/interfaces";
import swal from "sweetalert";

import styles from "./AddLocations.module.css";

interface Props {
  handleClose: () => void;
}

export default function AddLocations({ handleClose }: Props) {
  const dispatch = useDispatch();
  const [location, setLocations] = useState<string>("");
  const [locationsList, setLocationss] = useState<string[]>([]);
  const [validation, setValidation] = useState(true);
  const locations: string[] = useSelector(
    (state: RootState) => state.user.locations
  );

  useEffect(() => {
    setLocationss(locations);
  }, [locations]);

  useEffect(() => {
    handleValidation();
  }, [locations, locationsList]);

  function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    setLocations(event.target.value);
  }

  function handleAddCategory() {
    if (location !== "" && !locationsList.some((c) => c === location)) {
      setLocationss([...locationsList, location]);
      setLocations("");
    }
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (validation) {
      dispatch(loading());
      dispatch<any>(postLocations(locationsList))
        .then(() => {
          handleClose();
          dispatch(closeLoading());
          swal("Updated", "Updated location succefully", "success");
        })
        .catch((e: any) => {
          dispatch(closeLoading());
          swal("Error", "Error to update locations", "error");
          console.log(e);
        });
    }
  }

  function handleValidation() {
    if (locationsList.length !== locations.length) {
      setValidation(true);
      return true;
    } else {
      if (locations.length <= 0 && locationsList.length <= 0) {
        setValidation(false);
        return false;
      }
      if (locations.every((value, index) => value === locationsList[index])) {
        setValidation(false);
        return false;
      }
    }
    setValidation(true);
  }

  function handleRemove(location: string) {
    setLocationss(locationsList.filter((c) => c !== location));
  }

  return (
    <div className={styles.background}>
      <form className={`toTop ${styles.container}`} onSubmit={handleSubmit}>
        <div className={styles.close}>
          <h4>Locationss</h4>
          <button
            className="btn btn-danger"
            type="button"
            onClick={handleClose}
          >
            x
          </button>
        </div>
        <div className={styles.sourcesList}>
          {locationsList.length > 0 ? (
            locationsList.map((location, index) => (
              <div key={index} className={styles.row}>
                <span>{location}</span>
                <button
                  className="btn btn-danger"
                  type="button"
                  onClick={() => handleRemove(location)}
                  disabled={location === "General" || location === "Shipping"}
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
              value={location}
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
