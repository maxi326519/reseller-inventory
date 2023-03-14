import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { Item, Invoice, RootState } from "../../../interfaces";
import { loading, closeLoading, getItems } from "../../../redux/actions";
import swal from "sweetalert";
import reload from "../../../assets/svg/reload.svg";

import Table from "./Table/Table";
import Details from "./Details/Details";

import styles from "../Tables.module.css";
import style from "./Invoices.module.css";

export default function Invoices() {
  const dispatch = useDispatch();
  const reports = useSelector((state: RootState) => state.reports);
  const invoices = useSelector((state: RootState) => state.invoices);
  const items = useSelector((state: RootState) => state.items);
  const [itemsList, setItemsList] = useState<Item[]>([]);
  const [image, setImage] = useState<string>("");
  const [close, setClose] = useState(false);
  const [rows, setRows] = useState<Invoice[]>([]);
  const [search, setSearch] = useState<string>("");
  const [total, setTotal] = useState(0);

  useEffect(() => {
    setRows(
      invoices.filter((i) => {
        if (search === "") return true;
        if (i.id.toString().toLowerCase().includes(search)) return true;
        if (i.date.toLowerCase().includes(search)) return true;
        if (i.form.toLowerCase().includes(search)) return true;
        if (i.source.toLowerCase().includes(search)) return true;
        return false;
      })
    );
  }, [search, invoices]);

  useEffect(() => {
    let total = 0;
    rows.forEach((invoice) => total += invoice.total);
    setTotal(total);
  }, [rows])

  function handleDetails(invoiceID: number) {
    const showInvoice = invoices.find((i) => i.id === invoiceID);
    if (showInvoice) {
      setItemsList(
        items.filter((item) => showInvoice.items.some((id) => id === item.id))
      );
      setImage(showInvoice.image);
      setClose(!close);
    }
  }

  function handleClose() {
    setClose(!close);
    setItemsList([]);
  }

  function handleReload() {
    swal({
      title: "¡Attention!",
      text: `All invoices will be reloaded`,
      icon: "info",
      buttons: { confirm: true, cancel: true },
    }).then((response) => {
      if (response) {
        dispatch(loading());
        dispatch<any>(getItems())
          .then(() => {
            dispatch(closeLoading());
          })
          .catch((e: any) => {
            swal(
              "Error",
              "Error trying to get the invoices, try again leter",
              "error"
            );
            console.log(e);
          });
      }
    });
  }

  function handleSetDate() {

  }

  return (
    <div className={styles.background}>
      {close ? (
        <Details
          handleClose={handleClose}
          itemsList={itemsList}
          image={image}
        />
      ) : null}
      <div className={styles.head}>
        <Link className="btn btn-primary" to="/">
          {"< Menu"}
        </Link>
        <h1>Invoices</h1>
      </div>
      <div className={style.container}>
        <div className={style.searchBar}>
          <input
            className="form-control"
            id="search"
            type="search"
            name="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search invoice..."
          />
          <button
            className={`btn btn-primary ${style.reload}`}
            type="button"
            onClick={handleReload}
          >
            <img src={reload} alt="reload" />
          </button>
          {/* <div className="mb-3 form-floating">
            <select
              id="year"
              className="form-control"
              defaultValue={new Date().toISOString().split("T")[0]}
              onClick={handleSetDate}
            >
              {reports.map((report) => (
                <option key={report.year} value={report.year}>{report.year}</option>
              ))}
            </select>
            <label htmlFor="year">Year</label>
          </div> */}
          <span className={style.total}>Total cost of invoices: ${total}</span>
        </div>
        <Table invoices={rows} handleDetails={handleDetails} />
      </div>
    </div>
  );
}
