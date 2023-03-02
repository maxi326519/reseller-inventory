import { Invoice } from "../../../../../interfaces";

import styles from "../Table.module.css";

interface Props {
  invoices: Invoice;
}

export default function Rows({ invoices }: Props) {
  return (
    <div key={invoices.id} className={styles.rows}>
      <span>{invoices.id}</span>
      <span>{invoices.date}</span>
      <span>{invoices.solds.length}</span>
      <span>{invoices.total}</span>
      <span>{invoices.form}</span>
      <span>{invoices.source}</span>
      <button className="btn btn-outline-success" type="button">View Items</button>
    </div>
  );
}