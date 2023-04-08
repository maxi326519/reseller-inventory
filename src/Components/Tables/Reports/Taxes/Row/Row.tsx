import { MonthTaxesData } from "../../../../../interfaces";
import styles from "./Row.module.css";

interface Props {
  taxesMonth: MonthTaxesData;
}

export default function Row({ taxesMonth }: Props) {
  return (
    <div className={styles.row}>
      <div className={styles.month}>
        <span>{taxesMonth.month.name}</span>
      </div>
      <div className={styles.sales}>
        <span>Sales: {taxesMonth.sales.sales}</span>
        <span>Shipment: {taxesMonth.sales.shipment}</span>
      </div>
      <div className={styles.expenses}>
        <span>Ship Label: {taxesMonth.expenses.shipLabel}</span>
        <span>Ads Fee: {taxesMonth.expenses.adsFee}</span>
        <span>Other Expenses: {taxesMonth.expenses.otherExpense}</span>
        <span>Ebya Fees: {taxesMonth.expenses.ebayFees}</span>
        <span>COGS: {taxesMonth.expenses.COGS}</span>
        <button className="btn btn-outline-primary" onClick={() => console.log(taxesMonth.expenses.otherCategories)}>View details</button>
      </div>
    </div>
  );
}
