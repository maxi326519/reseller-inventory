import { Item } from "../../../../../../interfaces";

import styles from "../Table.module.css";

interface Props {
  item: Item;
  handleClose: () => void;
  handleRefoundSelected: (id: number) => void;
}

export default function Rows({ item, handleClose, handleRefoundSelected }: Props) {

  function handleClick(){
    handleRefoundSelected(item.id);
    handleClose();
  }

  return (
    <div key={item.id} className={styles.rows}>
      <span>{item.invoiceId}</span>
      <span>{item.id}</span>
      <span>{item.date}</span>
      <span>{item.cost}</span>
      <span>{0}</span>
      <span>{0}</span>
      <span>{item.description}</span>
      <button className="btn btn-success" type="button" onClick={handleClick}>
        Refound
      </button>
    </div>
  );
}
