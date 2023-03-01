/* import { Expenses } from "../../../../interfaces"; */

/* import Rows from "./Rows/Rows"; */

import styles from "./Table.module.css";

export default function Table() {
  return (
    <div className={styles.table}>
      <div className="mb-3">
        <label htmlFor="search" className="form-label">Search</label>
        <input id="search" className="form-control" type="text"/>
      </div>
      <div className={`${styles.firstRow} ${styles.rows}`}>
        <span>Description</span>
        <span>Price</span>
        <span>Status</span>
        <span>Invoice ID</span>
      </div>
      <div>
{/*         {expenses.map((expense) => <Rows expense={expense}/>)} */}
      </div>
    </div>
  );
}
