import { Item } from "../../../../../../interfaces";

import styles from "../Table.module.css";

interface Props {
  item: Item;
  handleRestore: (id: number) => void;
}

export default function Rows({ item, handleRestore }: Props) {

  return (
    <div key={item.id} className={styles.rows}>
      <span>{item.invoiceId}</span>
      <span>{item.id}</span>
      <span>{item.date.toDate().toISOString().split("T")[0]}</span>
      <span>{item.cost}</span>
      <span>{item.description}</span>
      <button className="btn btn-success" type="button" onClick={() => handleRestore(item.id)}>Restore</button>
    </div>
  );
}