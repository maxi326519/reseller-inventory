import { Link } from "react-router-dom";

import styles from "../Tables.module.css";

export default function AddBusinessExpense(){
  return(
    <div className={styles.background}>
      <h1>Reports</h1>
      <Link className="btn btn-primary" to="/">Menu</Link>
      <div>
        <label htmlFor="filter">Filter by:</label>
        <select id="filter">
          <option>Items in Stock</option>
          <option>Items Sold</option>
          <option>Taxes</option>
        </select>
      </div>
    </div>
  )
}