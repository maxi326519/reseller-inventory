import { Link } from "react-router-dom";

import style from "./Menu.module.css";

export default function Menu() {
  return (
    <div className={style.container}>
      <h1>RESELLER PRO</h1>
      <h3>Main Menu</h3>
      <div className={style.dataContainer}>
        <div className={style.btnContainer}>
          <Link className="btn btn-primary" to="newPurchase">
            Add New Purchase
          </Link>
          <Link className="btn btn-primary" to="addExpense">
            Add Business Expense
          </Link>
          <Link className="btn btn-primary" to="itemSold">
            Item Sold
          </Link>
          <Link className="btn btn-primary" to="lookUpItems">
            Look Up Items
          </Link>
          <Link className="btn btn-primary" to="reports">
            Reports
          </Link>
        </div>
        <div className={style.chart}></div>
      </div>
    </div>
  );
}
