import { useState } from "react";
import { Link } from "react-router-dom";
import { Expenses } from "../../../interfaces"; 

import Form from "./Form/Form";
import Table from "./Table/Table";

import styles from "../Tables.module.css";

export default function AddBusinessExpense() {
  const [expenses, setExpenses] = useState<Expenses[]>([]);

  return (
    <div className={styles.background}>
      <h1>Add Business Expense</h1>
      <Link className="btn btn-primary" to="/">
        Menu
      </Link>
      <div className={styles.container}>
        <Form />
        <Table expenses={expenses} />
      </div>
    </div>
  );
}
