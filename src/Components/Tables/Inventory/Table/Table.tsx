import { Item } from "../../../../interfaces";

import Rows from "./Rows/Rows";

import styles from "./Table.module.css";

interface Props {
  items: Item[];
  itemSelected: number[];
  handleSelected: (item: Item, cost: number) => void;
  handleInvoiceDetail: (invoiceId: number) => void;
}

export default function Table({
  items,
  itemSelected,
  handleSelected,
  handleInvoiceDetail,
}: Props) {
  return (
    <div className={styles.table}>
      <div className={styles.responsive}>
        <div className={`${styles.firstRow} ${styles.rows}`}>
          <span></span>
          <span>Item ID</span>
          <span>Date</span>
          <span>Description</span>
          <span>Unit cost</span>
          <span>Invoice</span>
        </div>
        <div className={styles.data}>
          {items.map((item) => (
            <Rows
              key={item.id}
              item={item}
              itemSelected={itemSelected}
              handleSelected={handleSelected}
              handleInvoiceDetail={handleInvoiceDetail}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
