import { Expense } from "../../../../../interfaces";

import styles from "../Table.module.css";

interface Props {
  expense: Expense;
}

export default function Rows({ expense }: Props) {
  return (
    <div key={expense.id} className={styles.rows}>
      <div>
        <label htmlFor="description">Description</label>
        <input id="description" value={expense.description} />
      </div>
      <span>{expense.description}</span>
      <span>{expense.const}</span>
      <span>{expense.category}</span>
      <span>{expense.id}</span>
    </div>
  );
}