import { Expense } from "../../../../../interfaces";

import styles from "../Table.module.css";

interface Props {
  expense: Expense;
}

export default function Rows({ expense }: Props) {
  return (
    <div className={styles.rows}>
      <span>{expense.date}</span>
      <span>{expense.category}</span>
      <span>{expense.description}</span>
      <span>{expense.cost}</span>
      <span>{expense.quantity}</span>
      <button className="btn btn-danger" type="button">
        x
      </button>
    </div>
  );
}
