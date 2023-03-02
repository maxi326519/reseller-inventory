import { Item } from "../../../../../interfaces";

import styles from "../Table.module.css";

interface Props {
  item: Item;
}

export default function Rows({ item }: Props) {
  return (
    <div key={item.id} className={styles.rows}>
      <span>{item.description}</span>
      <span>{item.cost}</span>
      <span>{item.id}</span>
      <button className="btn btn-success" type="button">
        Sale
      </button>
    </div>
  );
}
