import { useEffect } from "react";

import styles from "../Table.module.css";
import changeDateFormat from "../../../../../../functions/changeDateFormat";

interface Props {
  item: any;
  handleClose: () => void;
  handleRefoundSelected: (id: number) => void;
}

export default function Rows({
  item,
  handleClose,
  handleRefoundSelected,
}: Props) {
  useEffect(() => {
    console.log(item);
  }, []);

  function handleClick() {
    handleRefoundSelected(item?.id);
    handleClose();
  }

  return (
    <div key={item?.id} className={styles.rows}>
      <span>{item?.invoiceId}</span>
      <span>{item?.id}</span>
      <span>
        {item.productId
          ? changeDateFormat(
              new Date(item?.date.toDate()).toISOString().split("T")[0]
            )
          : null}
      </span>
      <span>{item?.cost}</span>
      <span>{item?.price}</span>
      <span>{item?.shipment?.amount !== "" ? item?.shipment?.amount : 0}</span>
      <span>{item?.description}</span>
      <button className="btn btn-success" type="button" onClick={handleClick}>
        Refound
      </button>
    </div>
  );
}
