import { Item } from "../../../../interfaces";

import Rows from "./Rows/Rows";

import styles from "./Table.module.css";

interface Props {
  items: Item[];
  itemSelected: number[];
  handleSelected: (id: number) => void;
}

export default function Table({ items, itemSelected, handleSelected }: Props) {
  return (
    <div className={styles.table}>
      <div className={`${styles.firstRow} ${styles.rows}`}>
        <span></span>
        <span>Description</span>
        <span>Unit cost</span>
        <span>Item ID</span>
      </div>
      <div className={styles.data}>
        {items.map((item) => (
          <Rows
            key={item.id}
            item={item}
            itemSelected={itemSelected}
            handleSelected={handleSelected}
          />
        ))}
      </div>
    </div>
  );
}
