import { Link } from "react-router-dom";

import styles from "../Tables.module.css";

export default function ItemSold(){
  return(
    <div className={styles.background}>
      <h1>Item Sold</h1>
      <Link className="btn btn-primary" to="/">Menu</Link>
    </div>
  )
}