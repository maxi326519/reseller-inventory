import styles from "../Table.module.css";
import changeDateFormat from "../../../../../../functions/changeDateFormat";
import { Item, Sale } from "../../../../../../interfaces";

interface Props {
  item: Item | undefined;
  sale: Sale;
  handleClose: () => void;
  handleRefoundSelected: (id: number) => void;
  handleDeleteSold: (id: number) => void;
  handleShowExpensesDetails: (productId: number) => void;
}

export default function Rows({
  item,
  sale,
  handleClose,
  handleRefoundSelected,
  handleDeleteSold,
  handleShowExpensesDetails,
}: Props) {
  function handleClick() {
    if (item) {
      handleRefoundSelected(item.id);
      handleClose();
    }
  }

  return (
    <div key={item?.id} className={styles.rows}>
      <span>{item?.invoiceId}</span>
      <span>{item?.id}</span>
      <span>
        {changeDateFormat(
          new Date(sale.date.toDate()).toISOString().split("T")[0]
        )}
      </span>
      <span>{item?.cost}</span>
      <span>{sale.price}</span>
      <span>{sale.shipment.amount !== "" ? sale.shipment.amount : 0}</span>
      <span>{item?.description}</span>
      <button className="btn btn-success" type="button" onClick={handleClick}>
        Refound
      </button>
      <button
        className="btn btn-primary"
        type="button"
        onClick={() => handleShowExpensesDetails(sale.productId)}
      >
        Expenses
      </button>
      <button
        className="btn btn-danger"
        type="button"
        onClick={() => handleDeleteSold(sale.productId)}
      >
        -
      </button>
    </div>
  );
}
