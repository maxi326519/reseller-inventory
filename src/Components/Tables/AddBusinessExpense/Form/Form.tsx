import { useState } from "react";
import { Expense } from "../../../../interfaces";

import styles from "../../Tables.module.css";

interface Props{
  expenses: Expense[];
  setExpenses: (expenses: Expense[]) => void;
}

const initialState: Expense = {
    date:  new Date().toLocaleDateString(),
    category: "0",
    description: "",
    cost: 0,
    quantity: 1,
}

export default function Form({ expenses, setExpenses }: Props) {
  const [expense, setExpense] = useState<Expense>(initialState);

  function handleSubmit(event: React.FormEvent<HTMLFormElement>): void{
    event.preventDefault();
    setExpenses([ ...expenses, expense ]);
    console.log(expense);
  }

  function handleChange(event: React.ChangeEvent<HTMLInputElement>): void{
    setExpense({ ...expense, [event.target.name]: event.target.value });
  }

  function handleChangeSelect(event: React.ChangeEvent<HTMLSelectElement>): void{
    if(event.target.value !== '0'){
      setExpense({ ...expense, [event.target.name]: event.target.value });
    }
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
        value={expense.date}
        onChange={handleChange}
        required
      />

      <label className="form-label" htmlFor="category">
        Category:
      </label>
      <select
        className="form-select"
        id="category"
        name="category"
        value={expense.category}
        onChange={handleChangeSelect}
        required
      >
        <option value="0">Select category</option>
        <option value="a">a</option>
      </select>

      <label className="form-label" htmlFor="description">
        Description:
      </label>
      <input
        className="form-control"
        type="text"
        id="description"
        name="description"
        value={expense.description}
        onChange={handleChange}
        required
      />

      <label className="form-label" htmlFor="cost">
        Unit cost:
      </label>
      <input
        className="form-control"
        type="number"
        id="cost"
        name="cost"
        value={expense.cost}
        onChange={handleChange}
        required
      />

      <label className="form-label" htmlFor="quantity">
        Number of Expenses:
      </label>
      <input
        className="form-control"
        type="number"
        id="quantity"
        name="quantity"
        value={expense.quantity}
        onChange={handleChange}
        required
      />

      <button className="btn btn-primary" type="submit">Add Expense</button>
    </form>
  );
}
