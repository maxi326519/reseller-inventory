import { Items } from "../../../../interfaces";

import Rows from "./Rows/Rows";

import styles from "./Table.module.css";

interface Props {
  items: Items[];
}

export default function Table({ items }: Props) {
  return (
    <div className={styles.table}>
      <div className={`${styles.firstRow} ${styles.rows}`}>
        <span>Description</span>
        <span>Cost</span>
        <span>Item ID</span>
        <span>Delete</span>
      </div>
      <div className={styles.data}>
        {items.map((item) => <Rows item={item}/>)}
      </div>
    </div>
  );
}