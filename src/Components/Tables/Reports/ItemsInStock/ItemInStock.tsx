import { useSelector } from "react-redux";
import { Item, RootState } from "../../../../interfaces";

import Table from "./Table/Table";

import styles from "./ItemInStock.module.css";

export default function ItemInStock(){
  const items: Item[] = useSelector((state: RootState) => state.items);
  
  return(
    <div className={styles.itemsSold}>
      <div className={styles.controls}>
        <div className="form-floating">
          <input className="form-control" id="formDate" type="date" />
          <label className="form-label" htmlFor="formDate">
            From:
          </label>
        </div>
        <div className="form-floating">
          <input className="form-control" id="toDate" type="date" />
          <label className="form-label" htmlFor="toDate">
            From:
          </label>
        </div>
      </div>
      <Table items={items} />
    </div>
  )
}