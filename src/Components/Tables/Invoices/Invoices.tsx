import { useState } from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { Item, RootState } from "../../../interfaces";

import Table from "./Table/Table";
import Details from "./Details/Details";

import styles from "../Tables.module.css";

export default function Invoices() {
  const invoices = useSelector((state: RootState) => state.invoices);
  const items = useSelector((state: RootState) => state.items);
  const [itemsList, setItemsList] = useState<Item[]>([]);
  const [close, setClose] = useState(false);

  function handleDetails(invoiceID: number) {
    const showInvoice = invoices.find((i) => i.id === invoiceID);
    if (showInvoice) {
      setItemsList(
        items.filter((item) => showInvoice.items.some((id) => id === item.id))
      );
      setClose(!close);
    }
  }

  function handleClose() {
    setClose(!close);
    setItemsList([]);
  }

  return (
    <div className={styles.background}>
      {close ? (
        <Details handleClose={handleClose} itemsList={itemsList} />
      ) : null}
      <div className={styles.head}>
        <Link className="btn btn-primary" to="/">
          Menu
        </Link>
        <h1>Look Up Items</h1>
      </div>
      <div className={styles.container}>
        <Table invoices={invoices} handleDetails={handleDetails} />
      </div>
    </div>
  );
}
