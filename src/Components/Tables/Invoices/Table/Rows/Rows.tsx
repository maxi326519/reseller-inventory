import { Invoice } from "../../../../../interfaces";

import styles from "../Table.module.css";

interface Props {
  invoice: Invoice;
  handleDetails: (invoiceID: number) => void;
}

export default function Rows({ invoice, handleDetails }: Props) {
  return (
    <div key={invoice.id} className={styles.rows}>
      <span>{invoice.id}</span>
      <span>{invoice.date}</span>
      <span>{invoice.items.length}</span>
      <span>{invoice.total}</span>
      <span>{invoice.form}</span>
      <span>{invoice.source}</span>
      <button className="btn btn-outline-success" type="button" onClick={() => handleDetails(invoice.id)}>View Items</button>
    </div>
  );
}