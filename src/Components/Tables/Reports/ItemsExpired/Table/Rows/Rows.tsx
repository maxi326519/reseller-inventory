import { Item } from "../../../../../../interfaces";

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
      <span>{item.id}</span>
      <span>{item.expired!.toDate().toISOString().split("T")[0]}</span>
      <span>{item.cost}</span>
      <span>{item.description}</span>
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
