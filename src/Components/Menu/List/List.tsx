import { Link } from "react-router-dom";

import style from "./List.module.css";

interface Prop {
  active: boolean;
}

export default function List({ active }: Prop) {
  return (
    <ul className={`${style.btnContainer} ${active ? style.menu : ""}`}>
      <Link className="btn btn-primary" to="/newPurchase">
        Add New Purchase
      </Link>
      <Link className="btn btn-primary" to="/inventory">
        Inventory
      </Link>
      <Link className="btn btn-primary" to="/invoices">
        Invoices
      </Link>
      <Link className="btn btn-primary" to="/addExpense">
        Add Business Expense
      </Link>
      <Link className="btn btn-primary" to="/reports">
        Reports
      </Link>
    </ul>
  );
}
