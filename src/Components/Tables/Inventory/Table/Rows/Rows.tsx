import changeDateFormat from "../../../../../functions/changeDateFormat";

import { Item } from "../../../../../interfaces";

import styles from "../Table.module.css";

interface Props {
  item: Item;
  itemSelected: number[];
  handleSelected: (id: number) => void;
}

export default function Rows({ item, itemSelected, handleSelected }: Props) {

  function handleCheck(id: number) {
    handleSelected(id);
  }

  return (
    <div key={item.id} className={styles.rows}>
      <div>
        <label htmlFor="check">.</label>
        <input
          id="check"
          type="checkbox"
          checked={itemSelected.some((i) => i === item.id) ? true : false}
          onChange={() => handleCheck(item.id)}
        />
      </div>
      <span>{item.id}</span>
      <span>{changeDateFormat(item.date)}</span>
      <span>{item.description}</span>
      <span>{item.cost}</span>
    </div>
  );
}
