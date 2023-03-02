import { Expense } from "../../../../interfaces";

import Rows from "./Rows/Rows";

import styles from "./Table.module.css";

interface Props {
  expenses: Expense[];
}

export default function Table({ expenses }: Props) {
  return (
    <div className={styles.table}>
      <div className={`${styles.firstRow} ${styles.rows}`}>
        <span>Description</span>
        <span>Cost</span>
        <span>Category</span>
      </div>
      <div>
        {expenses.map((expense) => <Rows expense={expense}/>)}
      </div>
    </div>
  );
}
