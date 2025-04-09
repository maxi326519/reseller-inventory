import changeDateFormat from "../../../../../functions/changeDateFormat";

import { Item } from "../../../../../interfaces/interfaces";

import styles from "../Table.module.css";
import invoiceSvg from "../../../../../assets/svg/invoice.svg";

interface Props {
  item: Item;
  itemSelected: number[];
  handleSelected: (item: Item, cost: number) => void;
  handleInvoiceDetail: (invoiceId: number) => void;
}

export default function Rows({
  item,
  itemSelected,
  handleSelected,
  handleInvoiceDetail,
}: Props) {
  function handleCheck(item: Item, cost: number | string) {
    handleSelected(item, Number(cost));
  }

  return (
    <div key={item.id} className={styles.rows}>
      <div>
        <label htmlFor="check">.</label>
        <input
          id="check"
          type="checkbox"
          checked={itemSelected.some((i) => i === item.id) ? true : false}
          onChange={() => handleCheck(item, item.cost)}
        />
      </div>
      <span>
        <b>ITEM ID:</b>
        {item.id}
      </span>
      <span>
        <b>DATE: </b>
        {changeDateFormat(item.date.toDate().toISOString().split("T")[0])}
      </span>
      <span>
        <b>DESCRIPTION: </b>
        {item.description}
      </span>
      <span>
        <b>LOCATION: </b>
        {item.location}
      </span>
      <span>
        <b>COST: </b>
        {item.cost}
      </span>
      <button
        className="btn btn-success"
        type="button"
        onClick={() => handleInvoiceDetail(item.invoiceId)}
      >
        <img src={invoiceSvg} alt="invoice" />
      </button>
    </div>
  );
}
