import { Item } from "../../../../interfaces";

import Rows from "./Rows/Rows";

import styles from "./Table.module.css";

interface Props {
  items: Item[];
  handleRemove: (id: number) => void;
}

export default function Table({ items, handleRemove }: Props) {
  return (
    <div className={styles.table}>
      <div className={`${styles.firstRow} ${styles.rows}`}>
        <span>Description</span>
        <span>Unit cost</span>
        <span>Item ID</span>
        <span>Delete</span>
      </div>
      <div className={styles.data}>
        {items.map((item) => <Rows key={item.id} item={item} handleRemove={handleRemove}/>)}
      </div>
    </div>
  );
}