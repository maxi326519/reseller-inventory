import { Item } from "../../../../../../interfaces";

import styles from "../Table.module.css";

interface Props {
  item: Item;
}

export default function Rows({ item }: Props) {

  return (
    <div key={item.id} className={styles.rows}>
      <span>{item.invoiceId}</span>
      <span>{item.id}</span>
      <span>{item.date}</span>
      <span>{item.cost}</span>
      <span>{item.description}</span>
    </div>
  );
}