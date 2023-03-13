import { Item } from "../../../../../interfaces";

import styles from "./ItemRow.module.css";

interface Prop {
  item: Item;
  rowSelected: number;
  handleRowSelect: (id: number) => void;
  handleSelected: (id: number) => void;
  handleSetPrice: (id: number, price: string) => void;
}

export default function ItemRow({
  item,
  rowSelected,
  handleRowSelect,
  handleSelected,
  handleSetPrice,
}: Prop) {
  return (
    <div
      key={item.id}
      className={`${styles.row} ${
        item.id === rowSelected ? styles.selected : ""
      }`}
      onClick={() => handleRowSelect(item.id)}
    >
      <span>{item.id}</span>
      <span>{item.description}</span>
      <input
        className="form-control"
        type="number"
        placeholder="Price"
        onChange={(e) => handleSetPrice(item.id, e.target.value)}
      />
      <button
        className="btn btn-danger"
        type="button"
        onClick={() => handleSelected(item.id)}
      >
        -
      </button>
    </div>
  );
}
