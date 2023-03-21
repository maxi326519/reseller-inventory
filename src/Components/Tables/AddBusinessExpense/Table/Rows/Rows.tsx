import changeDateFormat from "../../../../../functions/changeDateFormat";
import { Expense } from "../../../../../interfaces";

import styles from "../Table.module.css";

interface Props {
  expense: Expense;
  handleRemove: (id: number) => void;
}

export default function Rows({ expense, handleRemove }: Props) {
  return (
    <div className={styles.rows}>
      <span>{changeDateFormat(expense.date)}</span>
      <span>{expense.category}</span>
      <span>{expense.description}</span>
      <span>{expense.price}</span>
      <button className="btn btn-danger" type="button" onClick={() => handleRemove(expense.id)}>
        x
      </button>
    </div>
  );
}
