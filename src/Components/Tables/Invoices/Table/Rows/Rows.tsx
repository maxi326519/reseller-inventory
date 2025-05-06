import { closeLoading, loading } from "../../../../../redux/actions/loading";
import { deleteInvoice } from "../../../../../redux/actions/invoices";
import { useDispatch } from "react-redux";
import {
  Invoice,
  InvoiceExpenses,
  InvoiceType,
} from "../../../../../interfaces/interfaces";
import changeDateFormat from "../../../../../functions/changeDateFormat";
import swal from "sweetalert";

import styles from "../Table.module.css";

interface Props {
  invoice: Invoice | InvoiceExpenses;
  invoiceType: InvoiceType;
  handleDetails: (invoiceID: number) => void;
}

export default function Rows({ invoice, invoiceType, handleDetails }: Props) {
  const dispatch = useDispatch();

  function handleDelete() {
    swal({
      title: "Warning",
      text: "Are you sure you want to delete this invoice forever?",
      icon: "warning",
      buttons: {
        confirm: true,
        cancel: true,
      },
    }).then((response) => {
      if (response) {
        dispatch(loading());
        dispatch<any>(deleteInvoice(invoice))
          .then(() => {
            swal("Deleted", "Invoice deleted successfully", "success");
            dispatch(closeLoading());
          })
          .catch((error: any) => {
            console.log(error);
            dispatch(closeLoading());
            swal("Error", "Error deleting invoice, try again leter", "error");
          });
      }
    });
  }

  return (
    <div
      className={`${styles.rows} ${
        invoiceType === InvoiceType.Expenses ? styles.expenses : null
      }`}
    >
      <span>
        <b>INVOICE ID: </b>
        {invoice.id}
      </span>
      <span>
        <b>DATE: </b>
        {changeDateFormat(invoice.date.toDate().toISOString().split("T")[0])}
      </span>
      <span>
        <b>ITEMS: </b>
        {invoice.items}
      </span>
      <span>
        <b>TOTAL: </b>
        {invoice.total.toFixed(2)}
      </span>
      <span>
        <b>TYPE:</b>
        {invoiceType === InvoiceType.Purchase
          ? (invoice as Invoice).form
          : (invoice as InvoiceExpenses).category}
      </span>

      {invoiceType === InvoiceType.Purchase ? (
        <span>
          <b>SOURCE: </b>
          {(invoice as Invoice).source}
        </span>
      ) : null}
      <button
        className="btn btn-primary"
        type="button"
        onClick={() => handleDetails(invoice.id)}
      >
        View Items
      </button>
      <button
        className="btn btn-danger"
        type="button"
        onClick={() => handleDelete()}
      >
        -
      </button>
    </div>
  );
}
