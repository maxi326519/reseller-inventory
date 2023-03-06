import { useState } from "react";
import { Reports } from "../../../../interfaces";

import Excel from "./Excel/Excel.jsx";

import styles from "./Taxes.module.css";

export default function Taxes() {
  const [taxes, setTaxes] = useState<Reports[]>([]);

  return (
    <div className={styles.container}>
      <div className={styles.controls}>
        <div className="mb-3 form-floting">
          <input id="year" className="form-control" type="date" />
          <label htmlFor="year" className="form-label">
            Year
          </label>
        </div>
        <Excel taxes={taxes}/>
      </div>
      <div className={styles.head}>
        <span>
          Total Sales and Shipping {/* Sales and shiping variables */}
        </span>
        <span>Total Expenses {/* Expenses variable */}</span>
        <span>Total Profit {/* Profit result to sales and expenses */}</span>
      </div>
      <div className={styles.scroll}>
        <div className={styles.row}>
          <span> 1{/* Month */}</span>
          <div className={styles.sales}>
            <span>Sales: {/* Sales variables */}</span>
            <span>Shipping: {/* Shipping variables */}</span>
          </div>
          <div className={styles.expenses}>
            <div>
              <span>Shipping {/* Shippiing expenses variables */}</span>
              <span>Ebya Fees: {/* Evay fees variables */}</span>
            </div>
            <div>
              <span>Other Expenses 1: {/* Other Expenses 1 variables */}</span>
              <span>Other Expenses 2: {/* Other Expenses 2 variables */}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
