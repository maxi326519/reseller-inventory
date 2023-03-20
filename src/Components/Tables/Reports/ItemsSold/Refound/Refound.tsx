import { useEffect, useState } from "react";
import styles from "./Refound.module.css";

interface Props {
  handleClose: () => void;
  handleSubmit: (amount: number) => void;
}

export default function Refound({ handleClose, handleSubmit }: Props) {
  const [amount, setAmount] = useState<string>("");
  const [error, setError] = useState<string | null>(null);

  function handleLocalSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if(handleValidation()){
      handleSubmit(Number(amount));
      handleClose();
    }
  }

  function handelChange(event: React.ChangeEvent<HTMLInputElement>) {
    setAmount(event.target.value);
    setError(null);
  }

  function handleValidation(){
    if(amount === ""){
      setError("Amount is empty");
      return false;
    }
    setError(null);
    return true;
  }

  return (
    <div className={styles.background}>
      <form className={styles.container} onSubmit={handleLocalSubmit}>
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
        <div className="mb-3 form-floating">
          <input
            id="amount"
            className={`form-control ${error ? "is-invalid" : ""}`}
            type="number"
            step="any"
            onChange={handelChange}
          />
          <label htmlFor="amount" className="form-label">
            Amount
          </label>
          {error ? <small>{ error }</small> : null}
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
