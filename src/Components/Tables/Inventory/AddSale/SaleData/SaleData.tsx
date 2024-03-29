import { Errors, OtherExpenses, ShipingExpenses } from "../../../../../interfaces/SaleForm";
import { Timestamp } from "firebase/firestore";
import { Sale } from "../../../../../interfaces/interfaces";

import styles from "./SaleData.module.css";
import "../../../../../animation.css";

interface Props {
  sale: Sale | undefined;
  errors: Errors | null;
  handleChange: (
    e: React.ChangeEvent<HTMLInputElement>,
    saleId: number | undefined
  ) => void;
  shipment: ShipingExpenses | undefined;
  other: OtherExpenses | undefined;
  handleExpense: (
    event: React.ChangeEvent<HTMLInputElement>,
    id: number | undefined
  ) => void;
}

export default function SaleData({
  sale,
  errors,
  handleChange,
  shipment,
  other,
  handleExpense,
}: Props) {
  return (
    <div>
      <div className="mb-3 form-floating">
        <input
          id="date"
          className="form-control"
          type="date"
          name="date"
          max={new Date().toISOString().split("T")[0]}
          value={
            sale
              ? new Date((sale?.date as Timestamp).toDate())
                  .toISOString()
                  .split("T")[0]
              : new Date().toISOString().split("T")[0]
          }
          onChange={(e) => handleChange(e, sale?.id)}
        />
        <label className="form-label" htmlFor="date">
          Date:
        </label>
      </div>

      {/* Shipment */}
      <div className={styles.shipment}>
        <div>
          <input
            id="shipment-value"
            type="checkbox"
            name="value"
            checked={sale?.shipment.value}
            onChange={(e) => handleChange(e, sale?.id)}
          />
          <label htmlFor="shipment-value">Shipment income</label>
          <input
            id="shipment-amount"
            className={`form-control ${errors?.shipment ? "is-invalid" : null}`}
            type="number"
            name="amount"
            step="any"
            value={sale?.shipment.amount}
            placeholder="$ 0.00"
            onChange={(e) => handleChange(e, sale?.id)}
            disabled={!sale?.shipment.value}
          />
          {errors?.shipment ? <small>{errors.shipment}</small> : null}
        </div>
      </div>
      <hr></hr>
      {/* Expenses */}
      <div className={styles.expenses}>
        <h4>Expenses</h4>

        <div className={styles.shipmentExpenses}>
          <div>
            <label htmlFor="ebayFees">Ship Label</label>
            <input
              className={`form-control ${
                errors?.expenses.shipLabel ? "is-invalid" : null
              }`}
              id="expense-shipLabel"
              name="expense-shipLabel"
              type="number"
              step="any"
              value={shipment?.shipLabel}
              placeholder="$ 0.00"
              onChange={(e) => handleExpense(e, sale?.productId)}
            />
            {errors?.expenses.shipLabel ? (
              <small>{errors.expenses.shipLabel}</small>
            ) : null}
          </div>
          <div>
            <label htmlFor="ebayFees">Ebay Fees</label>
            <input
              className={`form-control ${
                errors?.expenses.ebayFees ? "is-invalid" : null
              }`}
              id="ebayFees"
              name="ebayFees"
              type="number"
              step="any"
              value={shipment?.ebayFees}
              placeholder="$ 0.00"
              onChange={(e) => handleExpense(e, sale?.productId)}
            />
            {errors?.expenses.ebayFees ? (
              <small>{errors?.expenses.ebayFees}</small>
            ) : null}
          </div>
        </div>

        <div className={styles.otherExpenses}>
          <div className={styles.left}>
            <div>
              <input
                id="adsFeeCheck"
                name="adsFeeCheck"
                type="checkbox"
                checked={other?.adsFee.check}
                onChange={(e) => handleExpense(e, sale?.productId)}
              />
              <label htmlFor="adsFeeCheck">Ads Fee</label>
            </div>
            <div
              className={`${styles.otherContainer} ${
                other?.adsFee.check ? styles.showAds : ""
              }`}
            >
              <input
                className={`form-control ${
                  errors?.expenses.adsFee ? "is-invalid" : null
                }`}
                placeholder="$ 0.00"
                type="number"
                step="0.01"
                name="adsFeeCost"
                value={other?.adsFee.cost}
                onChange={(e) => handleExpense(e, sale?.productId)}
              />
              {errors?.expenses.adsFee ? (
                <small>{errors?.expenses.adsFee}</small>
              ) : null}
            </div>
          </div>
          <div className={styles.right}>
            <div>
              <input
                id="otherCheck"
                name="otherCheck"
                type="checkbox"
                checked={other?.other.check}
                onChange={(e) => handleExpense(e, sale?.productId)}
              />
              <label htmlFor="otherCheck">Other expenses</label>
            </div>
            <div
              className={`${styles.otherContainer}
              ${other?.other.check ? styles.showOther : ""}
              ${
                errors?.expenses.other.description &&
                errors?.expenses.other.cost
                  ? styles.showOtherError
                  : null
              }`}
            >
              <input
                className={`form-control ${
                  errors?.expenses.other.description ? "is-invalid" : null
                }`}
                placeholder="Description"
                type="text"
                name="otherDescription"
                value={other?.other.description}
                onChange={(e) => handleExpense(e, sale?.productId)}
              />
              {errors?.expenses.other.description ? (
                <small>{errors?.expenses.other.description}</small>
              ) : null}
              <input
                className={`form-control ${
                  errors?.expenses.other.cost ? "is-invalid" : null
                }`}
                placeholder="$ 0.00"
                type="number"
                step="0.01"
                name="otherCost"
                value={other?.other.cost}
                onChange={(e) => handleExpense(e, sale?.productId)}
              />
              {errors?.expenses.other.cost ? (
                <small>{errors?.expenses.other.cost}</small>
              ) : null}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
