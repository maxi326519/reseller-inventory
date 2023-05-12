import { useState } from "react";
import { Link } from "react-router-dom";

import ItemsSold from "./ItemsSold/ItemsSold";
import ItemsExpired from "./ItemsExpired/ItemsExpired";
import Taxes from "./Taxes/Taxes";

import styles from "../Tables.module.css";
import style from "./Reports.module.css";
import menuSvg from "../../../assets/svg/menu.svg";
import closeSvg from "../../../assets/svg/close.svg";

export default function Reports() {
  const [typeReport, setTypeReport] = useState("1");
  const [active, setActive] = useState<boolean>(false);

  function handleChange(event: React.ChangeEvent<HTMLSelectElement>) {
    setTypeReport(event.target.value);
  }

  function handleActive() {
    setActive(!active);
  }

  return (
    <div className={styles.background}>
      <div className={styles.head}>
        <Link className="btn btn-primary" to="/">
          <span>{"< "}</span>
          <span>{"Menu"}</span>
        </Link>
        <h1>Reports</h1>
        <div className={style.navBar} onClick={handleActive}>
          {active ? (
            <img src={active ? closeSvg : menuSvg} alt="menu" />
          ) : (
            <img src={active ? closeSvg : menuSvg} alt="menu" />
          )}
        </div>
      </div>
      <div className={style.container}>
        {typeReport === "1" ? (
          <ItemsSold typeReport={typeReport} handleChange={handleChange} />
        ) : null}
        {typeReport === "2" ? (
          <ItemsExpired typeReport={typeReport} handleChange={handleChange} />
        ) : null}
        {typeReport === "3" ? (
          <Taxes typeReport={typeReport} handleChange={handleChange} />
        ) : null}
      </div>
    </div>
  );
}
