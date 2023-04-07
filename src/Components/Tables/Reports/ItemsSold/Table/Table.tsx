import { useEffect, useState } from "react";
import { Item, Sale } from "../../../../../interfaces";

import Rows from "./Rows/Rows";

import styles from "./Table.module.css";

interface Props {
  items: Item[];
  sales: Sale[];
  handleClose: () => void;
  handleRefoundSelected: (id: number) => void;
}

export default function Table({
  items,
  sales,
  handleClose,
  handleRefoundSelected,
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
        {items.map((item: any) => {
          return (
            <Rows
              key={item.id}
              item={item}
              handleClose={handleClose}
              handleRefoundSelected={handleRefoundSelected}
            />
          );
        })}
      </div>
    </div>
  );
}
