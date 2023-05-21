import { Item } from "../../../../../interfaces";

import styles from "../Table.module.css";

interface Props {
  item: Item;
  handleRemove: (id: number) => void;
}

export default function Rows({ item, handleRemove}: Props) {
  return (
    <div key={item.id} className={styles.rows}>
      <span>{item.description}</span>
      <span>{item.cost}</span>
      <button className="btn btn-danger" type="button" onClick={() => handleRemove(item.id)}>X</button>
    </div>
  );
}
