import { Expense } from "../../../../../interfaces/interfaces";

import styles from "./ExpenseData.module.css";

interface Props {
  item: Expense;
}

export default function ExpenseData({ item }: Props) {

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
