import { Invoice, RootState } from "../../../../../interfaces";
import changeDateFormat from "../../../../../functions/changeDateFormat";
import {
  closeLoading,
  deleteInvoice,
  loading,
  updateReportsdItems,
} from "../../../../../redux/actions";

import styles from "../Table.module.css";
import { useDispatch, useSelector } from "react-redux";
import swal from "sweetalert";

interface Props {
  invoice: Invoice;
  handleDetails: (invoiceID: number) => void;
}

export default function Rows({ invoice, handleDetails }: Props) {
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
            dispatch<any>(updateReportsdItems(invoice.items, reports)).then(
              () => {
                swal("Deleted", "Invoice deleted successfully", "success");
                dispatch(closeLoading());
              }
            ).catch((error: any) => {
              console.log(error);
              dispatch(closeLoading());
              swal("Error", "Error to update reports, try again leter", "error");
            });
          }).catch((error: any) => {
            console.log(error);
            dispatch(closeLoading());
            swal("Error", "Error deleting invoice, try again leter", "error");
          });
      }
    });
  }

  return (
    <div className={styles.rows}>
      <span>{invoice.id}</span>
      <span>{changeDateFormat(invoice.date)}</span>
      <span>{invoice.items.length}</span>
      <span>{invoice.total}</span>
      <span>{invoice.form}</span>
      <span>{invoice.source}</span>
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
