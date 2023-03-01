import { useState } from "react";

import styles from "../../Tables.module.css";

/* interface Props{
  handleSetExpense: () => void;
} */

export default function Form({ handleSetExpense }: any) {
  const [expense, setExpense] = useState({});

  function handleSubmit(event: React.FormEvent<HTMLFormElement>): void{
    handleSetExpense();
  }

  function handleChange(event: React.ChangeEvent<HTMLInputElement>): void{
    setExpense({ ...expense, [event.target.name]: event.target.value });
  }

  function handleChangeSelect(event: React.ChangeEvent<HTMLSelectElement>): void{
    setExpense({ ...expense, [event.target.name]: event.target.value });
  }

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <label className="form-label" htmlFor="date">
        Date of Expenses:
      </label>
      <input
        className="form-control"
        type="date"
        id="date"
        name="date"
        onChange={handleChange}
      />

      <label className="form-label" htmlFor="description">
        Category:
      </label>
      <select
        className="form-select"
        id="description"
        name="description"
        onChange={handleChangeSelect}
      >
      
      </select>

      <label className="form-label" htmlFor="amount">
        Number of Expenses:
      </label>
      <input
        className="form-control"
        type="number"
        id="amount"
        name="amount"
        onChange={handleChange}
      />

      <label className="form-label" htmlFor="total">
        Total cost:
      </label>
      <input
        className="form-control"
        type="number"
        id="total"
        name="total"
        onChange={handleChange}
      />

      <label className="form-label" htmlFor="from">
        Form of Purchase:
      </label>

      <select className="form-select" id="from" onChange={handleChangeSelect}>
        <option>Cash</option>
        <option>Debit</option>
      </select>

      <button className="btn btn-primary" type="submit">Add Expense</button>
      <button className="btn btn-primary">Categories</button>
    </form>
  );
}
