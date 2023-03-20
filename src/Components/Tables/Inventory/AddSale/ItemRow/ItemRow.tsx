import { Item } from "../../../../../interfaces";

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
  rowSelected: number;
  handleRowSelect: (id: number) => void;
  handleSelected: (id: number, cost: null) => void;
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
      ${item.id === rowSelected ? styles.selected : ""}
      ${error ? styles.error : ""}`}
      onClick={() => handleRowSelect(item.id)}
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
        onClick={() => handleSelected(item.id, null)}
      >
        -
      </button>
    </div>
  );
}
