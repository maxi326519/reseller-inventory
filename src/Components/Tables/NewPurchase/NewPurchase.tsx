import { useState } from "react";
import { Link } from "react-router-dom";

import Form from "./Form/Form";
import Table from "./Table/Table";

import styles from "../Tables.module.css";

interface Expense {
  description: string;
  amount: string;
  price: string;
  status: string;
  id: string;
}

const initialState: Expense = {
  description: "a",
  amount: "a",
  price: "a",
  status: "a",
  id: "a",
}

export default function NewPurchase() {
  const [rows, setRows] = useState<Expense[]>([initialState]);

  function handleSetExpense(): void {
    const newValue: Expense = {
      description: "a",
      amount: "a",
      price: "a",
      status: "a",
      id: "a",
    }
    setRows([newValue]);
  }

  return (
    <div className={styles.background}>
      <h1>New purchase</h1>
      <Link className="btn btn-primary" to="/">
        Menu
      </Link>
      <div className={styles.container}>
        <Form /* handleSetExpense={handleSetExpense}  *//>
        <Table rows={rows} />
      </div>
    </div>
  );
}
