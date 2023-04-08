import { useEffect, useState } from "react";
import { Item, Expense, InvoiceType } from "../../../../../interfaces";

import styles from "./Expenses.module.css";
import ExpenseData from "./ExpenseData/ExpenseData";

interface Props {
  expenses: Expense[];
  handleClose: () => void;
}

export default function Expenses({
  expenses,
  handleClose,
}: Props) {

  return (
    <div className={styles.background}>
      <div className={styles.container}>
        <div className={styles.close}>
          <h4>Expenses</h4>
          <button
            className="btn btn-danger"
            type="button"
            onClick={handleClose}
          >
            x
          </button>
        </div>
        <div className={styles.data}>
          <div className={styles.list}>
            {expenses.map((expense, i) =>
              <ExpenseData key={i} item={expense} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
