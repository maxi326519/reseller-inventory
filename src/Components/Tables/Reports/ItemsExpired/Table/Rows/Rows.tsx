import { Item } from "../../../../../../interfaces/interfaces";

import styles from "../Table.module.css";
import invoiceSvg from "../../../../../../assets/svg/invoice.svg";

interface Props {
  item: Item;
  handleRestore: (id: number) => void;
  handleInvoiceDetail: (invoiceId: number) => void;
}

export default function Rows({
  item,
  handleRestore,
  handleInvoiceDetail,
}: Props) {
  return (
    <div key={item.id} className={styles.rows}>
      <span>
        <b>ID: </b>
        {item.invoiceId}
      </span>
      <span>
        <b>ID: </b>
        {item.id}
      </span>
      <span>
        <b>EXPIRED: </b>
        {item.expired!.toDate().toISOString().split("T")[0]}
      </span>
      <span>
        <b>COST: </b>
        {item.cost}
      </span>
      <span>
        <b>DESCRIPTION: </b>
        {item.description}
      </span>
      <button
        className="btn btn-success"
        type="button"
        onClick={() => handleInvoiceDetail(item.invoiceId)}
      >
        <img src={invoiceSvg} alt="invoice" />
      </button>
      <button
        className="btn btn-success"
        type="button"
        onClick={() => handleRestore(item.id)}
      >
        Restore
      </button>
    </div>
  );
}
