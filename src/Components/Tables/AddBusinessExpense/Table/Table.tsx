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
        <span>Date</span>
        <span>Category</span>
        <span>Description</span>
        <span>Const</span>
        <span>Qunatity</span>
        <span>Delete</span>
      </div>
      <div className={styles.data}>
        {expenses.map((expense, i) => <Rows key={i} expense={expense}/>)}
      </div>
    </div>
  );
}