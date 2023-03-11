import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { Item, Invoice, RootState } from "../../../interfaces";

import Table from "./Table/Table";
import Details from "./Details/Details";

import styles from "../Tables.module.css";
import style from "./Invoices.module.css";

export default function Invoices() {
  const invoices = useSelector((state: RootState) => state.invoices);
  const items = useSelector((state: RootState) => state.items);
  const [itemsList, setItemsList] = useState<Item[]>([]);
  const [image, setImage] = useState<string>(""); 
  const [close, setClose] = useState(false);
  const [rows, setRows] = useState<Invoice[]>([]);
  const [search, setSearch] = useState<string>("");

  useEffect(() => {
    setRows(invoices.filter((i) => {
      if(search === "") return true;
      if(i.id.toString().toLowerCase().includes(search)) return true
      if(i.date.toLowerCase().includes(search)) return true
      if(i.form.toLowerCase().includes(search)) return true
      if(i.source.toLowerCase().includes(search)) return true
      return false
    }))
  }, [search, invoices])

  function handleDetails(invoiceID: number) {
    const showInvoice = invoices.find((i) => i.id === invoiceID);
    if (showInvoice) {
      setItemsList(
        items.filter((item) => showInvoice.items.some((id) => id === item.id))
      );
      console.log(showInvoice);
      setImage(showInvoice.image);
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
        <Details handleClose={handleClose} itemsList={itemsList} image={image}/>
      ) : null}
      <div className={styles.head}>
        <Link className="btn btn-primary" to="/">
          {"< Menu"}
        </Link>
        <h1>Invoices</h1>
      </div>
      <div className={style.container}>
        <div className={style.searchBar}>
          <input
            className="form-control"
            id="search"
            type="search"
            name="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search invoice..."
          />
        </div>
        <Table invoices={rows} handleDetails={handleDetails} />
      </div>
    </div>
  );
}
