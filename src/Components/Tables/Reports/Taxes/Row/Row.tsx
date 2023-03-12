
import styles from "./Row.module.css";

export default function Row () {
  return (
    <div className={styles.row}>
    <div className={styles.month}>
      <span>Enero{/* Month */}</span>
    </div>
    <div className={styles.sales}>
      <span>Sales: {/* Sales variables */}</span>
      <span>Shipping: {/* Shipping variables */}</span>
    </div>
    <div className={styles.expenses}>
      <div>
        <span>Shipping {/* Shippiing expenses variables */}</span>
        <span>Ebya Fees: {/* Evay fees variables */}</span>
      </div>
      <div>
        <span>Other Expenses 1: {/* Other Expenses 1 variables */}</span>
        <span>Other Expenses 2: {/* Other Expenses 2 variables */}</span>
      </div>
    </div>
  </div>
  )
}