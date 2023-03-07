import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Reports, RootState } from "../../../../interfaces";

import Excel from "./Excel/Excel.jsx";

import styles from "./Taxes.module.css";

export default function Taxes() {
  const [taxes, setTaxes] = useState<Reports[]>([]);
  const sales = useSelector((state: RootState) => state.sales);
  const [expenses, setExpenses] = useState([]);

  return (
    <div className={styles.container}>
      <div className={styles.controls}>
        <div className="mb-3 form-floating">
          <select id="year" className="form-select">
            <option value="2023">2023</option>
          </select>
          <label htmlFor="year" className="form-label">
            Year
          </label>
        </div>
        <Excel taxes={taxes} />
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
          <div className={styles.month}>
            <span>Enero{/* Month */}</span>
          </div>
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
        <div className={styles.row}>
          <div className={styles.month}>
            <span>Febrero{/* Month */}</span>
          </div>
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
