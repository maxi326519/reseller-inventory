import { useEffect } from "react";

import styles from "../Table.module.css";
import changeDateFormat from "../../../../../../functions/changeDateFormat";
import { Item, Sale } from "../../../../../../interfaces";

interface Props {
  item: Item | undefined;
  sale: Sale;
  handleClose: () => void;
  handleRefoundSelected: (id: number) => void;
}

export default function Rows({
  item,
  sale,
  handleClose,
  handleRefoundSelected,
}: Props) {
  useEffect(() => {
    console.log(item);
  }, []);

  function handleClick() {
    if(item){
      handleRefoundSelected(item.id);
      handleClose();
    }
  }

  return (
    <div key={item?.id} className={styles.rows}>
      <span>{item?.invoiceId}</span>
      <span>{item?.id}</span>
      <span>{changeDateFormat(new Date(sale.date.toDate()).toISOString().split("T")[0])}</span>
      <span>{item?.cost}</span>
      <span>{sale.price}</span>
      <span>{sale.shipment.amount !== "" ? sale.shipment.amount : 0}</span>
      <span>{item?. description}</span>
      <button className="btn btn-success" type="button" onClick={handleClick}>
        Refound
      </button>
    </div>
  );
}
