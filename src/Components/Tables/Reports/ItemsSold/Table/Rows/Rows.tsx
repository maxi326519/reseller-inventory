import { Item } from "../../../../../../interfaces";

import styles from "../Table.module.css";

interface Props {
  item: Item;
  handleClose: () => void;
}

export default function Rows({ item, handleClose }: Props) {
  return (
    <div key={item.id} className={styles.rows}>
      <span>{item.invoiceId}</span>
      <span>{item.id}</span>
      <span>{item.date}</span>
      <span>{item.cost}</span>
      <span>{0}</span>
      <span>{0}</span>
      <span>{item.description}</span>
      <button className="btn btn-success" type="button" onClick={handleClose}>
        Refound
      </button>
    </div>
  );
}
