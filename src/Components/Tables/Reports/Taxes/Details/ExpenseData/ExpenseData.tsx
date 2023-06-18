import { OtherCategories } from "../../../../../../interfaces/interfaces";

import styles from "./ExpenseData.module.css";

interface Props {
  expense: OtherCategories;
}

export default function ExpenseData({ expense }: Props) {

  return (
    <div className={styles.container}>
        <div className={styles.info}>
          <label className={styles.title}>Category:</label>
          <label className={styles.data}>{expense.category}</label>
        </div>
        <div className={styles.info}>
          <label className={styles.title}>Total:</label>
          <label className={styles.data}>{expense.total}</label>
        </div>
      <hr></hr>
    </div>
  );
}
