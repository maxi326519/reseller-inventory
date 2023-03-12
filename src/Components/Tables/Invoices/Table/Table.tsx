import { Invoice } from "../../../../interfaces";

import Rows from "./Rows/Rows";

import styles from "./Table.module.css";

interface Props {
  invoices: Invoice[];
  handleDetails: (invoiceID: number) => void;
}

export default function Table({ invoices, handleDetails }: Props) {
  return (
    <div className={styles.table}>
      <div className={`${styles.firstRow} ${styles.rows}`}>
        <span>ID</span>
        <span>Date</span>
        <span>Total items</span>
        <span>Total cost</span>
        <span>Form of payment</span>
        <span>Source</span>
        <span>View</span>
      </div>
      <div className={styles.data}>
        {invoices.map((invoice) => (
          <Rows invoice={invoice} handleDetails={handleDetails}/>
        ))}
      </div>
    </div>
  );
}
