import { Link } from "react-router-dom";

import styles from "../Tables.module.css";

export default function AddBusinessExpense(){
  return(
    <div className={styles.background}>
      <h1>Add Business Expense</h1>
      <Link className="btn btn-primary" to="/">Menu</Link>
    </div>
  )
}