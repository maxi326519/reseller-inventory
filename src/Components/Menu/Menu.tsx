import { useState } from "react";
import { Link } from "react-router-dom";

import Charts from "./Charts/Charts";
import img from "../../assets/img/logo.png";
import menu from "../../assets/svg/menu.svg";
import close from "../../assets/svg/close.svg";

import style from "./Menu.module.css";

export default function Menu() {
  const [active, setActive] = useState<boolean>(false);

  function handleActive() {
    setActive(!active);
  }

  return (
    <div className={style.container}>
      <img className={style.image} src={img} alt="logo" />
      <div className={style.dataContainer}>
        <div className={style.navBar} onClick={handleActive}>
          {active ? (
            <img src={active ? close : menu} alt="menu" />
          ) : (
            <img src={active ? close : menu} alt="menu" />
          )}
        </div>
        <div className={`${style.btnContainer} ${active ? style.menu : ""}`}>
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
