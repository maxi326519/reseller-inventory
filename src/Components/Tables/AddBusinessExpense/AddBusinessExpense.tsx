import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Expense } from "../../../interfaces";

import Form from "./Form/Form";
import Table from "./Table/Table";
import Categories from "./Categories/Categories";

import style from "./AddBusinessExpense.module.css";
import styles from "../Tables.module.css";

export default function AddBusinessExpense() {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [total, setTotal] = useState<number>(0);
  const [close, setClose] = useState<boolean>(false);

  useEffect(() => {
    let total: number = 0;

    expenses.forEach((expense) => (total += expense.cost * expense.quantity));

    setTotal(total);
  }, [expenses]);

  function handleAddExpese() {
    /* Dispatch para guardar el expense */
  }

  function handleReset() {
    setExpenses([]);
  }

  function handleClose() {
    setClose(!close);
  }

  return (
    <div className={styles.background}>
      {close ? <Categories handleClose={handleClose} /> : null}
      <h1>Add Business Expense</h1>
      <Link className="btn btn-primary" to="/">
        Menu
      </Link>
      <div className={styles.container}>
        <Form expenses={expenses} setExpenses={setExpenses} />
        <div className={style.expense}>
          <Table expenses={expenses} />
          <div className={style.sumary}>
            <button
              className="btn btn-primary"
              type="button"
              onClick={handleAddExpese}
            >
              Add Expenses
            </button>
            <button
              className="btn btn-primary"
              type="button"
              onClick={handleReset}
            >
              Reset Expenses
            </button>
            <button
              className="btn btn-primary"
              type="button"
              onClick={handleClose}
            >
              Categories
            </button>
            <span>{`Total:  $${total}`}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
