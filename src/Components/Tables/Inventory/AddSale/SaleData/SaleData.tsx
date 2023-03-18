import { Sale } from "../../../../../interfaces";

import styles from "./SaleData.module.css";
import "../../../../../animation.css";

interface OtherExpenses {
  saleId: number;
  adsFee: {
    check: boolean;
    description: string;
    cost: number | string;
  };
  other: {
    check: boolean;
    description: string;
    cost: number | string;
  };
}

interface ShipingExpenses {
  saleId: number;
  shipLabel: number | string;
  ebayFees: number | string;
}

interface Props {
  sale: Sale | undefined;
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
          value={sale?.date}
          onChange={(e) => handleChange(e, sale?.id)}
          /* disabled={sale ? true : false} */
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
            className="form-control"
            type="number"
            name="amount"
            step="any"
            value={sale?.shipment.amount}
            placeholder="$ 0.00"
            onChange={(e) => handleChange(e, sale?.id)}
            disabled={!sale?.shipment.value}
          />
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
              className="form-control"
              id="expense-shipLabel"
              name="expense-shipLabel"
              type="number"
              step="any"
              value={shipment?.shipLabel}
              placeholder="$ 0.00"
              onChange={(e) => handleExpense(e, sale?.id)}
            />
          </div>
          <div>
            <label htmlFor="ebayFees">Ebay Fees</label>
            <input
              className="form-control"
              id="ebayFees"
              name="ebayFees"
              type="number"
              step="any"
              value={shipment?.ebayFees}
              placeholder="$ 0.00"
              onChange={(e) => handleExpense(e, sale?.id)}
            />
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
                onChange={(e) => handleExpense(e, sale?.id)}
              />
              <label htmlFor="adsFeeCheck">Ads Fee</label>
            </div>
            <div
              className={`${styles.otherContainer} ${
                other?.adsFee.check ? styles.showOther : ""
              }`}
            >
              <input
                className="form-control"
                placeholder="Description"
                type="text"
                name="adsFeeDescription"
                value={other?.adsFee.description}
                onChange={(e) => handleExpense(e, sale?.id)}
              />
              <input
                className="form-control"
                placeholder="$ 0.00"
                type="number"
                name="adsFeeCost"
                value={other?.adsFee.cost}
                onChange={(e) => handleExpense(e, sale?.id)}
              />
            </div>
          </div>
          <div className={styles.right}>
            <div>
              <input
                id="otherCheck"
                name="otherCheck"
                type="checkbox"
                checked={other?.other.check}
                onChange={(e) => handleExpense(e, sale?.id)}
              />
              <label htmlFor="otherCheck">Other expenses</label>
            </div>
            <div
              className={`${styles.otherContainer} ${
                other?.other.check ? styles.showOther : ""
              }`}
            >
              <input
                className="form-control"
                placeholder="Description"
                type="text"
                name="otherDescription"
                value={other?.other.description}
                onChange={(e) => handleExpense(e, sale?.id)}
              />
              <input
                className="form-control"
                placeholder="$ 0.00"
                type="number"
                name="otherCost"
                value={other?.other.cost}
                onChange={(e) => handleExpense(e, sale?.id)}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
