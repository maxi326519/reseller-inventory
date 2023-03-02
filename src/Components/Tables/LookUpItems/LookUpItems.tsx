import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import  { RootState } from "../../../interfaces";

import Table from "./Table/Table";

import styles from "../Tables.module.css";

export default function LookUpItems() {

  const invoices = useSelector((state: RootState) => state.invoices);

  return (
    <div className={styles.background}>
      <h1>Look Up Items</h1>
      <Link className="btn btn-primary" to="/">
        Menu
      </Link>
      <div className={styles.container}>
        <Table invoices={invoices}/>
      </div>
    </div>
  );
}
