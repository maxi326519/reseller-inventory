import { useState } from "react";
import { Link } from "react-router-dom";

import ItemsSold from "./ItemsSold/ItemsSold";
import ItemInStock from "./ItemsInStock/ItemInStock";
import Taxes from "./Taxes/Taxes";

import styles from "../Tables.module.css";
import style from "./Reports.module.css";

export default function Reports() {
  const [typeReport, setTypeReport] = useState("1");

  function handleChange(event: React.ChangeEvent<HTMLSelectElement>) {
    setTypeReport(event.target.value);
  }

  return (
    <div className={styles.background}>
      <div className={styles.head}>
        <Link className="btn btn-primary" to="/">
          {"< Menu"}
        </Link>
        <h1>Reports</h1>
      </div>
      <div className={style.controls}>
        <div className="form-floating">
          <select
            className="form-select"
            id="filter"
            defaultValue={typeReport}
            onChange={handleChange}
          >
            <option value="1">Items in Stock</option>
            <option value="2">Items Sold</option>
            <option value="3">Taxes</option>
          </select>
          <label className="form-label" htmlFor="filter">
            Filter by:
          </label>
        </div>
        <button className="btn btn-primary" type="button">
          Export Report
        </button>
      </div>
      <div className={style.container}>
        {typeReport === "1" ? <ItemInStock /> : null}
        {typeReport === "2" ? <ItemsSold /> : null}
        {typeReport === "3" ? <Taxes /> : null}
      </div>
    </div>
  );
}
