import { useState } from "react";
import { Refounded } from "../../../../../interfaces/interfaces";

import styles from "./Refound.module.css";

interface Props {
  handleClose: () => void;
  handleSubmit: (data: Refounded, returnShipLabel: number | null) => void;
}

const initError = () => ({
  date: "",
  amount: "",
  returnShipLabel: "",
});

export default function Refound({ handleClose, handleSubmit }: Props) {
  const [data, setData] = useState<Refounded>({
    date: "",
    amount: 0,
  });
  const [returnShipLabel, setReturnShipLabel] = useState<number>(0);
  const [returnCheck, setReturnCheck] = useState<boolean>(false);
  const [error, setError] = useState(initError());

  function handleLocalSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (handleValidation()) {
      handleSubmit(data, returnCheck ? returnShipLabel : null);
      handleClose();
    }
  }

  function handleCheck() {
    // If returnCheck is false set return shiping label in 0
    if (!returnCheck) setReturnShipLabel(0);
    setReturnCheck(!returnCheck);
  }

  function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    setData({ ...data, [event.target.name]: event.target.value });
    setError({ ...error, [event.target.name]: "" });
  }

  function handleReturnShipLabel(event: React.ChangeEvent<HTMLInputElement>) {
    setReturnShipLabel(Number(event.target.value));
  }

  function handleValidation() {
    const error = initError();

    if (data.date === "") {
      error.date = "Date is empty";
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
            value={data.date}
            onChange={handleChange}
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
            value={data.amount}
            onChange={handleChange}
          />
          <label htmlFor="amount" className="form-label">
            Amount
          </label>
          {error.amount ? <small>{error.amount}</small> : null}
        </div>

        {/* RETURN SHIP LABEL */}
        <div className="form-check">
          <input
            id="returnCheck"
            name="returnCheck"
            className="form-check-input"
            type="checkbox"
            checked={returnCheck}
            onChange={handleCheck}
          />
          <label htmlFor="returnCheck" className="form-check-label">
            Return ship label
          </label>
        </div>

        {/* RETURN SHIP LABEL */}
        {returnCheck &&
          (<div className={`mb-3 form-floating ${styles.check}`}>
            <input
              id="returnShipLabel"
              name="returnShipLabel"
              className={`form-control ${error.returnShipLabel ? "is-invalid" : ""}`}
              type="number"
              step="any"
              value={returnShipLabel}
              onChange={handleReturnShipLabel}
            />
            <label htmlFor="returnShipLabel" className="form-label">
              Return ship label
            </label>
            {error.returnShipLabel ? <small>{error.returnShipLabel}</small> : null}
          </div>)
        }

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
