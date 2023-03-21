import { Item } from "../../../../../interfaces";

import styles from "./PurchaseData.module.css";

interface Props {
  item: Item
}

export default function PurchaseData({ item }: Props) {
  return (
    <div key={item.id} className={styles.inputs}>
      <div className="mb-3 form-floating">
        <input id="id" className="form-control" value={item.id} disabled />
        <label htmlFor="id" className="form-label">
          Id:
        </label>
      </div>
      <div>
        <div className={styles.inputContainer}>
          <div className="mb-3 form-floating">
            <input
              id="state"
              className="form-control"
              value={item.state}
              disabled
            />
            <label htmlFor="state" className="form-label">
              State:
            </label>
          </div>
          <div className="mb-3 form-floating">
            <input
              id="cost"
              className="form-control"
              value={item.cost}
              disabled
            />
            <label htmlFor="cost" className="form-label">
              Cost:
            </label>
          </div>
        </div>
        <div className="mb-3 form-floating">
          <input
            id="description"
            className="form-control"
            value={item.description}
            disabled
          />
          <label htmlFor="description" className="form-label">
            Description:
          </label>
        </div>
        <hr></hr>
      </div>
    </div>
  );
}
