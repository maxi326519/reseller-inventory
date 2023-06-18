import { Expense } from "../../../../../../interfaces/interfaces";

import styles from "./ExpenseData.module.css";

interface Props {
  item: Expense;
}

export default function ExpenseData({ item }: Props) {
  return (
    <div key={item.id} className={styles.dataContainer}>
      <div className={styles.data}>
        <span className={styles.text}>Category:</span>
        <span className={styles.title}>{item.category}</span>
      </div>
      <div className={styles.data}>
        <span className={styles.text}>Cost:</span>
        <span className={styles.title}>{item.price}</span>
      </div>
      <div className={styles.data}>
        <span className={styles.text}>Description:</span>
        <span className={styles.title}>{item.description}</span>
      </div>
      <hr></hr>
    </div>
  );
}
