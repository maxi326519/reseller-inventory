import { useState } from "react";
import { Sale } from "../../../../../interfaces";

import styles from "./SaleData.module.css";

interface Props {
  sale: Sale | undefined;
  handleChange: (
    e: React.ChangeEvent<HTMLInputElement>,
    saleId: number | undefined
  ) => void;
}

export default function SaleData({ sale, handleChange }: Props) {
  const [other, setOther] = useState({
    other1: { description: "", cost: 0 },
    other2: { description: "", cost: 0 }
  }),


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
            /* disabled={sale ? true : false} */
          />
          <label htmlFor="shipment-value">Shipment</label>
          <input
            id="shipment-amount"
            className="form-control"
            type="number"
            name="amount"
            step="any"
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
            <label htmlFor="Ebayfees">Shipment</label>
            <input
              className="form-control"
              id="expense-Shipment"
              type="number"
              step="any"
              /* value={feesEbay} */
              placeholder="$ 0.00"
              onChange={(e) => handleChange(e, sale?.id)}
              disabled={!sale?.shipment.value}
            />
          </div>
          <div>
            <label htmlFor="Ebayfees">Ebay Fees</label>
            <input
              className="form-control"
              id="Ebayfees"
              type="number"
              step="any"
              /* value={feesEbay} */
              placeholder="$ 0.00"
              onChange={(e) => handleChange(e, sale?.id)}
              disabled={!sale?.shipment.value}
            />
          </div>
        </div>

        <div className={styles.otherExpenses}>
          <div>
            <span>Other expenses</span>
            <input
              className="form-control"
              placeholder="Description"
              type="text"
              name="description"
              /* value={sale?.description} */
              disabled={sale ? true : false}
              onChange={(e) => handleChange(e, sale?.id)}
            />
            <input
              className="form-control"
              placeholder="$ 0.00"
              type="number"
              name="amount"
              /* value={other.amount}
                  disabled={!check.other}*/
              onChange={(e) => handleChange(e, sale?.id)}
            />
          </div>
          <div>
            <span>Other expenses</span>
            <input
              className="form-control"
              placeholder="Description"
              type="text"
              name="description2"
              /* value={other.description2}
                  disabled={!check.other}
                  onChange={handleOther} */
              onChange={(e) => handleChange(e, sale?.id)}
            />
            <input
              className="form-control"
              placeholder="$ 0.00"
              type="number"
              name="amount2"
              /* value={other.amount2}
                  disabled={!check.other}
                  onChange={handleOther} */
              onChange={(e) => handleChange(e, sale?.id)}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
