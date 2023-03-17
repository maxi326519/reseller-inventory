import { useState } from "react";
import { Sale } from "../../../../../interfaces";

import styles from "./SaleData.module.css";
import "../../../../../animation.css";

interface OtherExpenses {
  saleId: number;
  other1: {
    check: boolean;
    description: string;
    cost: number | string;
  };
  other2: {
    check: boolean;
    description: string;
    cost: number | string;
  };
}

interface ShipingExpenses {
  saleId: number;
  shipment: number | string;
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

        <div
          className={`${styles.shipmentExpenses} ${
            sale?.shipment.value ? styles.showShipEpense : ""
          }`}
        >
          <div>
            <label htmlFor="ebayFees">Ship Label</label>
            <input
              className="form-control"
              id="expense-shipment"
              name="expense-shipment"
              type="number"
              step="any"
              value={shipment?.shipment}
              placeholder="$ 0.00"
              onChange={(e) => handleExpense(e, sale?.id)}
              disabled={!sale?.shipment.value}
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
              disabled={!sale?.shipment.value}
            />
          </div>
        </div>

        <div className={styles.otherExpenses}>
          <div className={styles.left}>
            <div>
              <input
                id="other1Check"
                name="other1Check"
                type="checkbox"
                checked={other?.other1.check}
                onChange={(e) => handleExpense(e, sale?.id)}
              />
              <label htmlFor="other1Check">Other expenses</label>
            </div>
            <div
              className={`${styles.otherContainer} ${
                other?.other1.check ? styles.showOther : ""
              }`}
            >
              <input
                className="form-control"
                placeholder="Description"
                type="text"
                name="other1Description"
                value={other?.other1.description}
                onChange={(e) => handleExpense(e, sale?.id)}
              />
              <input
                className="form-control"
                placeholder="$ 0.00"
                type="number"
                name="other1Cost"
                value={other?.other1.cost}
                onChange={(e) => handleExpense(e, sale?.id)}
              />
            </div>
          </div>
          <div className={styles.right}>
            <div>
              <input
                id="other2Check"
                name="other2Check"
                type="checkbox"
                checked={other?.other2.check}
                onChange={(e) => handleExpense(e, sale?.id)}
              />
              <label htmlFor="AdsfeeCheck">Ads Fee</label>
            </div>
            <div
              className={`${styles.otherContainer} ${
                other?.other2.check ? styles.showOther : ""
              }`}
            >
              <input
                className="form-control"
                placeholder="Description"
                type="text"
                name="AdsfeeDescription"
                value={other?.other2.description}
                onChange={(e) => handleExpense(e, sale?.id)}
              />
              <input
                className="form-control"
                placeholder="$ 0.00"
                type="number"
                name="AdsfeeCost"
                value={other?.other2.cost}
                onChange={(e) => handleExpense(e, sale?.id)}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
