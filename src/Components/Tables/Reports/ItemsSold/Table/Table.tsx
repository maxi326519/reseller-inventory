import { Item, Sale } from "../../../../../interfaces/interfaces";

import Rows from "./Rows/Rows";

import styles from "./Table.module.css";

interface Rows {
  item: Item | undefined;
  sale: Sale;
}

interface Props {
  rows: Rows[];
  handleClose: () => void;
  handleRefoundSelected: (item: Item, saleId: number) => void;
  handleDeleteSold: (id: number) => void;
  handleShowExpensesDetails: (productId: number) => void;
  handleInvoiceDetail: (invoiceId: number) => void;
}

export default function Table({
  rows,
  handleClose,
  handleRefoundSelected,
  handleDeleteSold,
  handleShowExpensesDetails,
  handleInvoiceDetail,
}: Props) {
  return (
    <div className={styles.table}>
      <div className={styles.responsive}>
        <div className={`${styles.firstRow} ${styles.rows}`}>
          <span>Item ID</span>
          <span>Date</span>
          <span>Unit cost</span>
          <span>Price</span>
          <span>Shipment income</span>
          <span>Description</span>
          <span>Invoice</span>
          <span>Refound</span>
        </div>
        <div className={styles.data}>
          {rows.map((row: Rows) => (
            <Rows
              key={row.sale.id}
              item={row.item}
              sale={row.sale}
              handleClose={handleClose}
              handleRefoundSelected={handleRefoundSelected}
              handleDeleteSold={handleDeleteSold}
              handleShowExpensesDetails={handleShowExpensesDetails}
              handleInvoiceDetail={handleInvoiceDetail}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
