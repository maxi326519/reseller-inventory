import styles from "../../Tables.module.css";

export default function Form() {
  return (
    <form className={styles.form}>
      <label className="form-label" htmlFor="date">Date of Purchase:</label>
      <input className="form-control" type="date" id="date" />

      <label className="form-label" htmlFor="amount">Number of Items:</label>
      <input className="form-control" type="number" id="amount" />

      <label className="form-label" htmlFor="total">Total cost:</label>
      <input className="form-control" type="number" id="total" />

      <label className="form-label" htmlFor="from">From of Purchase:</label>
      <input className="form-control" type="text" id="from" />

      <label className="form-label" htmlFor="source">Source:</label>
      <input className="form-control" type="text" id="source" />

      <button className="btn btn-primary" >Add Item</button>
    </form>
  );
}
