import { Link } from "react-router-dom";

import Form from "./Form/Form";

import styles from "../Tables.module.css";

export default function LookUpItems() {
  return (
    <div className={styles.background}>
      <h1>Look Up Items</h1>
      <Link className="btn btn-primary" to="/">
        Menu
      </Link>
      <div className={styles.container}>
        <Form />
      </div>
    </div>
  );
}
