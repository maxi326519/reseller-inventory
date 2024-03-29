import { MonthTaxesData } from "../../../../../hooks/useTaxes/interfaces";
import { OtherCategories } from "../../../../../interfaces/interfaces";
import styles from "./Row.module.css";

interface Props {
  taxesMonth: MonthTaxesData;
  handleShowOtherCategories: (data: OtherCategories[] | null) => void;
}

export default function Row({ taxesMonth, handleShowOtherCategories }: Props) {
  return (
    <div className={styles.row}>
      <div className={styles.month}>
        <span>{taxesMonth.month.name}</span>
      </div>
      <div className={styles.sales}>
        <span>
          <b>Sales:</b> {taxesMonth.sales.sales.toFixed(2)}
        </span>
        <span>
          <b>Shipment:</b> {taxesMonth.sales.shipment.toFixed(2)}
        </span>
      </div>
      <div className={styles.expenses}>
        <span>
          <b>Ship Label:</b> {taxesMonth.expenses.shipLabel.toFixed(2)}
        </span>
        <span>
          <b>Ads Fee:</b> {taxesMonth.expenses.adsFee.toFixed(2)}
        </span>
        <span>
          <b>Other Expenses:</b> {taxesMonth.expenses.otherExpenses.toFixed(2)}
        </span>
        <span>
          <b>Ebay Fees:</b> {taxesMonth.expenses.ebayFees.toFixed(2)}
        </span>
        <span>
          <b>COGS:</b> {taxesMonth.expenses.COGS.toFixed(2)}
        </span>
        <button
          className="btn btn-outline-primary"
          type="button"
          onClick={() =>
            handleShowOtherCategories(taxesMonth.expenses.otherCategories)
          }
        >
          View other categories
        </button>
      </div>
    </div>
  );
}
