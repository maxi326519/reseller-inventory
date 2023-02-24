import { useState } from "react";
import { Link } from "react-router-dom";

import Form from "./Form/Form";
import Table from "./Table/Table";

import styles from "../Tables.module.css";

export default function NewPurchase(){
  
  const [rows, setRows] = useState(Array<{
    description: string;
    amount: string;
    price: string;
    status: string;
    id: string;
  }>);

  return(
    <div className={styles.background}>
      <h1>New purchase</h1>
      <Link className="btn btn-primary" to="/">Menu</Link>
      <div className={styles.container}>
        <Form/>
        <Table rows={rows}/>
      </div>
    </div>
  )
}