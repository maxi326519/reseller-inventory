import { OtherCategories } from "../../../../../interfaces";

import ExpenseData from "./ExpenseData/ExpenseData";

import styles from "./Details.module.css";

interface Props {
  expenses: OtherCategories[];
  handleClose: (data: OtherCategories[] | null) => void;
}

export default function Details({ expenses, handleClose }: Props) {
  return (
    <div className={styles.background}>
      <div className={`toTop ${styles.container}`}>
        <div className={styles.close}>
          <h4>Other categories</h4>
          <button
            className="btn btn-danger"
            type="button"
            onClick={() => handleClose(null)}
          >
            x
          </button>
        </div>
        <div className={styles.list}>
          {expenses.map((expense: OtherCategories, i) => (
            <ExpenseData key={i} expense={expense} />
          ))}
        </div>
      </div>
    </div>
  );
}
