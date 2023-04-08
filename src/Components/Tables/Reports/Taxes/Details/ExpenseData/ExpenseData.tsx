import { useEffect } from "react";

import styles from "./ExpenseData.module.css";

interface Props {
  item: any;
}

export default function ExpenseData({ item }: Props) {

  useEffect(() => {
    console.log(item);
  }, [])

  return (
    <div key={item.id} className={styles.inputs}>
      <div className={styles.inputContainer}>
        <div className="mb-3 form-floating">
          <input
            id="category"
            className="form-control"
            value={item.category}
            disabled
          />
          <label htmlFor="category" className="form-label">
            Category:
          </label>
        </div>
        <div className="mb-3 form-floating">
          <input
            id="price"
            className="form-control"
            value={item.price}
            disabled
          />
          <label htmlFor="price" className="form-label">
            Cost:
          </label>
        </div>
      </div>
      <hr></hr>
    </div>
  );
}
