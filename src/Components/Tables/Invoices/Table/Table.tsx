import { Invoice, InvoiceExpenses, InvoiceType } from "../../../../interfaces";

import Rows from "./Rows/Rows";

import styles from "./Table.module.css";

interface Props {
  invoices: Array<Invoice | InvoiceExpenses>;
  invoiceType: InvoiceType;
  handleDetails: (invoiceID: number) => void;
}

export default function Table({ invoices, invoiceType, handleDetails }: Props) {
  return (
    <div className={styles.table}>
      <div className={styles.responsive}>
        <div
          className={`${styles.firstRow} ${styles.rows} ${
            invoiceType === InvoiceType.Expenses ? styles.expenses : null
          }`}
        >
          <span>Invoice ID</span>
          <span>Date</span>
          <span>Total items</span>
          <span>Total cost</span>
          <span>
            {invoiceType === InvoiceType.Purchase
              ? "Form of payment"
              : "Category"}
          </span>
          {invoiceType === InvoiceType.Purchase ? <span>Source</span> : null}
          <span>View</span>
          <span>Delete</span>
        </div>
        <div className={styles.data}>
          {invoices.map((invoice) => (
            <Rows
              key={invoice.id}
              invoice={invoice}
              invoiceType={invoiceType}
              handleDetails={handleDetails}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
