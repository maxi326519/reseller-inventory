import { Invoice } from "../../../../../interfaces";
import changeDateFormat from "../../../../../functions/changeDateFormat";
import { closeLoading, deleteInvoice, loading } from "../../../../../redux/actions";

import styles from "../Table.module.css";
import { useDispatch } from "react-redux";
import swal from "sweetalert";

interface Props {
  invoice: Invoice;
  handleDetails: (invoiceID: number) => void;
}

export default function Rows({ invoice, handleDetails }: Props) {

  const dispatch = useDispatch();

  function handleDelete(invoiceId: number) {
    swal({
      title: "Warning",
      text: "Are you sure you want to delete this invoice forever?",
      icon: "warning",
      buttons: {
        confirm: true,
        cancel: true,
      }
    }).then((response) => {
      if (response) {
        dispatch(loading());
        dispatch<any>(deleteInvoice(invoice)).then(() => {
          dispatch(closeLoading());
        }).then(() => {
          swal(
            "Deleted",
            "Invoice deleted successfully",
            "success"
          )
        }).catch((error: any) => {
          console.log(error);
          dispatch(closeLoading());
          swal(
            "Error",
            "Error deleting invoice, try again leter",
            "error"
          )
        })
      }
    })
  }

  return (
    <div className={styles.rows}>
      <span>{invoice.id}</span>
      <span>{changeDateFormat(invoice.date)}</span>
      <span>{invoice.items.length}</span>
      <span>{invoice.total}</span>
      <span>{invoice.form}</span>
      <span>{invoice.source}</span>
      <button className="btn btn-primary" type="button" onClick={() => handleDetails(invoice.id)}>View Items</button>
      <button className="btn btn-danger" type="button" onClick={() => handleDelete(invoice.id)}>-</button>
    </div>
  );
}