import { Item } from "../../../../../interfaces/interfaces";

import styles from "./ItemRow.module.css";

interface Errors {
  price: null | string;
  shipment: null | string;
  expenses: {
    shipLabel: null | string;
    ebayFees: null | string;
    adsFee: null | string;
    other: {
      description: null | string;
      cost: null | string;
    };
  };
}

interface Prop {
  item: Item;
  error: Errors | null;
  rowSelected: { item: number; sale: number };
  handleRowSelect: (selected: { item: number; sale: number }) => void;
  handleSelected: (item: Item, cost: null) => void;
  handleSetPrice: (id: number, price: string) => void;
}

export default function ItemRow({
  item,
  error,
  rowSelected,
  handleRowSelect,
  handleSelected,
  handleSetPrice,
}: Prop) {
  return (
    <div
      key={item.id}
      className={`${styles.row}
      ${item.id === rowSelected.item ? styles.selected : ""}
      ${error ? styles.error : ""}`}
      onClick={() => handleRowSelect({ item: item.id, sale: 0 })}
    >
      <span>{item.id}</span>
      <span>{item.description}</span>
      <input
        className="form-control"
        type="number"
        step="any"
        placeholder="Price"
        onChange={(e) => handleSetPrice(item.id, e.target.value)}
      />
      <button
        className="btn btn-danger"
        type="button"
        onClick={() => handleSelected(item, null)}
      >
        -
      </button>
    </div>
  );
}
