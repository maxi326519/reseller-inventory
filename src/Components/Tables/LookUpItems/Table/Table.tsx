import { Invoice } from "../../../../interfaces";

import Rows from "./Rows/Rows";

import styles from "./Table.module.css";

interface Props {
  invoices: Invoice[];
}

export default function Table({ invoices }: Props) {
  return (
    <div className={styles.table}>
      <div className={`${styles.firstRow} ${styles.rows}`}>
        <span>ID</span>
        <span>Date</span>
        <span>Solds</span>
        <span>Total</span>
        <span>Form</span>
        <span>Source</span>
        <span>View</span>
      </div>
      <div className={styles.data}>
        {invoices.map((invoice) => (
          <Rows invoices={invoice} />
        ))}
      </div>
    </div>
  );
}
