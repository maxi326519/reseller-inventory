import { useState } from "react";
import { Link } from "react-router-dom";
import { Items, Invoice } from "../../../interfaces";

import Form from "./Form/Form";
import Table from "./Table/Table";

import styles from "../Tables.module.css";
import style from "./NewPurchase.module.css";
import InvoiceImage from "./InvoiceImage/InvoiceImage";

const initialState: Invoice = {
  date: new Date().toLocaleDateString(),
  solds: [],
  form: "Cash",
  source: "",
  total: 0,
}

export default function NewPurchase() {
  const [items, setItems] = useState<Items[]>([]);
  const [invoice, setInvoice] = useState<Invoice>(initialState);

  function handleAddInventory(event: React.MouseEvent<HTMLButtonElement>){
    /* Agregar dispatch */
  }
  
  function handleReset(){
    setInvoice(initialState);
    setItems([]);
  }

  return (
    <div className={styles.background}>
      <h1>New purchase</h1>
      <Link className="btn btn-primary" to="/">
        Menu
      </Link>
      <div className={styles.container}>
        <Form
          invoice={invoice}
          setInvoice={setInvoice}
          items={items}
          setItems={setItems}
        />
        <div className={style.invoice}>
          <Table items={items} />
          <div className={style.sumary}>
            <button className="btn btn-primary" type="button" onClick={handleAddInventory}>Add Invoice</button>
            <button className="btn btn-primary" type="button" onClick={handleReset}>Reset Invoice</button>
            <span>{`Total:  $${invoice.total}`}</span>
          </div>
        </div>
        <InvoiceImage />
      </div>
    </div>
  );
}
