import {
  Invoice,
  InvoiceExpenses,
  InvoiceType,
  RootState,
} from "../../../../../interfaces";
import changeDateFormat from "../../../../../functions/changeDateFormat";
import { closeLoading, loading } from "../../../../../redux/actions/loading";
import { updateReportsItems } from "../../../../../redux/actions/reports";
import { deleteInvoice } from "../../../../../redux/actions/invoices";
import { useDispatch, useSelector } from "react-redux";
import swal from "sweetalert";

import styles from "../Table.module.css";

interface Props {
  invoice: Invoice | InvoiceExpenses;
  invoiceType: InvoiceType;
  handleDetails: (invoiceID: number) => void;
}

export default function Rows({ invoice, invoiceType, handleDetails }: Props) {
  const dispatch = useDispatch();
  const reports = useSelector((state: RootState) => state.reports);

  function handleDelete(invoiceId: number) {
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
            dispatch<any>(updateReportsItems(invoice.items, null, reports))
              .then(() => {
                swal("Deleted", "Invoice deleted successfully", "success");
                dispatch(closeLoading());
              })
              .catch((error: any) => {
                console.log(error);
                dispatch(closeLoading());
                swal(
                  "Error",
                  "Error to update reports, try again leter",
                  "error"
                );
              });
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
      className={`${styles.rows} ${invoiceType === InvoiceType.Expenses ? styles.expenses : null
        }`}
    >
      <span>{invoice.id}</span>
      <span>{changeDateFormat(invoice.date.toDate().toISOString().split("T")[0])}</span>
      <span>{invoice.items.length}</span>
      <span>{invoice.total}</span>
      <span>
        {invoiceType === InvoiceType.Purchase
          ? (invoice as Invoice).form
          : (invoice as InvoiceExpenses).category}
      </span>
      {invoiceType === InvoiceType.Purchase ? (
        <span>{(invoice as Invoice).source}</span>
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
        onClick={() => handleDelete(invoice.id)}
      >
        -
      </button>
    </div>
  );
}
