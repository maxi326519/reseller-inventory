import { Link } from "react-router-dom";

import Charts from "./Charts/Charts";
import img from "../../assets/img/logo.png";

import style from "./Menu.module.css";

export default function Menu() {
  return (
    <div className={style.container}>
      <img className={style.image} src={img} alt="logo"/>
      <div className={style.dataContainer}>
        <div className={style.btnContainer}>
          <Link className="btn btn-primary" to="newPurchase">
            Add New Purchase
          </Link>
          <Link className="btn btn-primary" to="inventory">
            Inventory
          </Link>
          <Link className="btn btn-primary" to="invoices">
            Invoices
          </Link>
          <Link className="btn btn-primary" to="addExpense">
            Add Business Expense
          </Link>
          <Link className="btn btn-primary" to="reports">
            Reports
          </Link>
        </div>
        <Charts />
      </div>
    </div>
  );
}
