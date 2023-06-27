import changeDateFormat from "../../../../../../functions/changeDateFormat";
import { Item, Sale } from "../../../../../../interfaces/interfaces";

import styles from "../Table.module.css";
import invoiceSvg from "../../../../../../assets/svg/invoice.svg";

interface Props {
  item: Item | undefined;
  sale: Sale;
  handleClose: () => void;
  handleRefoundSelected: (item: Item, saleId: number) => void;
  handleDeleteSale: (sale: Sale) => void;
  handleShowExpensesDetails: (productId: number) => void;
  handleInvoiceDetail: (invoiceId: number) => void;
}

export default function Rows({
  item,
  sale,
  handleClose,
  handleRefoundSelected,
  handleDeleteSale,
  handleShowExpensesDetails,
  handleInvoiceDetail,
}: Props) {
  function handleClick() {
    if (item) {
      handleRefoundSelected(item, sale.id);
      handleClose();
    }
  }

  return (
    <div className={styles.rows}>
      <span>
        <b>ITEM ID: </b>
        {item?.id}
      </span>
      <span>
        <b>DATE: </b>
        {changeDateFormat(
          new Date(sale.date.toDate()).toISOString().split("T")[0]
        )}
      </span>
      <span>
        <b>COST: </b>
        {item?.cost}
      </span>
      <span>
        <b>PRICE: </b>
        {sale.price}
      </span>
      <span>
        <b>SHIPMENT: </b>
        {sale.shipment.amount !== "" ? sale.shipment.amount : 0}
      </span>
      <span>
        <b>DESCRIPTION: </b>
        {item?.description}
      </span>
      <button
        className="btn btn-primary"
        type="button"
        onClick={() => handleInvoiceDetail(item!.invoiceId)}
      >
        <img src={invoiceSvg} alt="invoice" />
      </button>
      <button
        className={`btn btn-success ${sale.refounded ? styles.refounded : ""}`}
        type="button"
        onClick={handleClick}
        disabled={sale.refounded ? true : false}
      >
        {`${sale.refounded ? "Refounded" : "Refound"}`}
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
        onClick={() => handleDeleteSale(sale)}
      >
        -
      </button>
    </div>
  );
}
