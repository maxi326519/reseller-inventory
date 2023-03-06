import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Item, RootState } from "../../../../interfaces";

import Table from "./Table/Table";
import Excel from "./Excel/Excel.jsx";

import styles from "./ItemsSold.module.css";

export default function ItemsSold() {
  const items: Item[] = useSelector((state: RootState) => state.items);
  const [itemsSold, setItemSold] = useState<Item[]>([]);

  useEffect(() => {
    setItemSold(items.filter((i) => i.state === "sold"));
  }, [items]);

  return (
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
        <Excel sales={itemsSold}/>
      </div>
      <Table items={itemsSold} />
    </div>
  );
}
