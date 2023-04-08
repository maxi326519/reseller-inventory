import { useEffect, useState } from "react";
import { Item, Sale } from "../../../../../interfaces";

import Rows from "./Rows/Rows";

import styles from "./Table.module.css";

interface Rows {
  item: Item | undefined,
  sale: Sale,
}

interface Props {
  rows: Rows[];
  handleClose: () => void;
  handleRefoundSelected: (id: number) => void;
  handleShowExpensesDetails: (productId: number) => void;
}

export default function Table({
  rows,
  handleClose,
  handleRefoundSelected,
  handleShowExpensesDetails
}: Props) {

  return (
    <div className={styles.table}>
      <div className={`${styles.firstRow} ${styles.rows}`}>
        <span>Invoice ID</span>
        <span>Item ID</span>
        <span>Date</span>
        <span>Unit cost</span>
        <span>Price</span>
        <span>Shipment income</span>
        <span>Description</span>
        <span>Refound</span>
      </div>
      <div className={styles.data}>
        {rows.map((row: Rows) => {
          return (
            <Rows
              key={row.sale.id}
              item={row.item}
              sale={row.sale}
              handleClose={handleClose}
              handleRefoundSelected={handleRefoundSelected}
              handleShowExpensesDetails={handleShowExpensesDetails}
            />
          );
        })}
      </div>
    </div>
  );
}
