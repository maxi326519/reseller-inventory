import { useState } from "react";
import styles from "./Refound.module.css";
import { Refounded } from "../../../../../interfaces";

interface Props {
  handleClose: () => void;
  handleSubmit: (data: Refounded) => void;
}

const initError = {
  date: new Date().toISOString().split("T")[0],
  amount: "",
};

export default function Refound({ handleClose, handleSubmit }: Props) {
  const [data, setData] = useState<Refounded>({
    date: new Date().toISOString().split("T")[0],
    amount: 0,
  });
  const [error, setError] = useState(initError);

  function handleLocalSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (handleValidation()) {
      handleSubmit(data);
      handleClose();
    }
  }

  function handelChange(event: React.ChangeEvent<HTMLInputElement>) {
    setData({ ...data, [event.target.name]: event.target.value });
    setError({ ...error, [event.target.name]: "" });
  }

  function handleValidation() {
    const error = initError;

    if (data.date === "") {
      error.date = "Amount is empty";
      return false;
    }

    if (data.amount === 0) {
      error.amount = "Amount is empty";
      return false;
    }

    setError(error);
    return true;
  }

  return (
    <div className={styles.background}>
      <form
        className={`toTop ${styles.container}`}
        onSubmit={handleLocalSubmit}
      >
        <div className={styles.close}>
          <h4>Refound item</h4>
          <button
            className="btn btn-danger"
            type="button"
            onClick={handleClose}
          >
            x
          </button>
        </div>

        {/* DATE */}
        <div className="mb-3 form-floating">
          <input
            id="date"
            name="date"
            className={`form-control ${error.date ? "is-invalid" : ""}`}
            type="date"
            onChange={handelChange}
          />
          <label htmlFor="date" className="form-label">
            Date:
          </label>
          {error.date ? <small>{error.date}</small> : null}
        </div>

        {/* AMOUNT */}
        <div className="mb-3 form-floating">
          <input
            id="amount"
            name="amount"
            className={`form-control ${error.amount ? "is-invalid" : ""}`}
            type="number"
            step="any"
            onChange={handelChange}
          />
          <label htmlFor="amount" className="form-label">
            Amount
          </label>
          {error.amount ? <small>{error.amount}</small> : null}
        </div>

        <div className={styles.bntContainer}>
          <button className="btn btn-success" type="submit">
            Refound
          </button>
          <button
            className={`btn btn-danger ${styles.cancel}`}
            type="button"
            onClick={handleClose}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
