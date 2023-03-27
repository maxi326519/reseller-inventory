import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import {
  Item,
  Invoice,
  RootState,
  InvoiceType,
  InvoiceExpenses,
  Expense,
} from "../../../interfaces";
import {
  loading,
  closeLoading,
  getItems,
  getInvoices,
  getExpenses,
} from "../../../redux/actions";
import swal from "sweetalert";
import reload from "../../../assets/svg/reload.svg";

import Table from "./Table/Table";
import DateFilter from "./DateFilter/DateFilter";
import Details from "./Details/Details";

import styles from "../Tables.module.css";
import style from "./Invoices.module.css";

interface Filter {
  year: string | number;
  month: string | number;
  day: string | number;
}

export default function Invoices() {
  const dispatch = useDispatch();
  const reports = useSelector((state: RootState) => state.reports);
  const invoices = useSelector((state: RootState) => state.invoices);
  const items = useSelector((state: RootState) => state.items);
  const expenses = useSelector((state: RootState) => state.expenses);
  const [itemsList, setItemsList] = useState<Item[] | Expense[]>([]);
  const [image, setImage] = useState<string>("");
  const [close, setClose] = useState(false);
  const [rows, setRows] = useState<Array<Invoice | InvoiceExpenses>>([]);
  const [search, setSearch] = useState<string>("");
  const [dateFilter, setDateFilter] = useState<string>("");
  const [total, setTotal] = useState(0);
  const [invoiceType, setInvoiceType] = useState<InvoiceType>(
    InvoiceType.Purchase
  );

  useEffect(() => {
    invoices.forEach((invoice): invoice is Invoice => "form" in invoice);
    setRows(
      invoices.filter((i) => {
        if (dateFilter !== "" && i.date !== dateFilter) return false;
        if (i.type !== invoiceType) return false;
        if (search === "") return true;
        if (i.id.toString().toLowerCase().includes(search)) return true;
        if (i.date.toLowerCase().includes(search)) return true;
        if (i.type !== InvoiceType.Purchase) {
          const invoice = i as Invoice;
          if (invoice.form.toLowerCase().includes(search)) return true;
          if (invoice.source.toLowerCase().includes(search)) return true;
        }
        return false;
      })
    );
  }, [search, invoices, dateFilter, invoiceType]);

  useEffect(() => {
    let total = 0;
    rows.forEach((invoice) => (total += invoice.total));
    setTotal(total);
  }, [rows]);

  function handleSelect(event: React.ChangeEvent<HTMLSelectElement>) {
    const type = event.target.value;

    if (type === "0") {
      setInvoiceType(InvoiceType.Purchase);
    } else if (type === "1") {
      setInvoiceType(InvoiceType.Expenses);
    }
  }

  function handleDetails(invoiceID: number) {
    const showInvoice = invoices.find((i) => i.id === invoiceID);

    if (showInvoice) {
      if (invoiceType === InvoiceType.Purchase) {
        setItemsList(
          items.filter((item) => showInvoice.items.some((id) => id === item.id))
        );
        setImage(showInvoice.image);
        setClose(!close);
      } else if (invoiceType === InvoiceType.Expenses) {
        const expensesFilter = expenses.filter((expense) => {
          console.log(expense.id);
          return showInvoice.items.some((id) => id === expense.id);
        });
        console.log(expenses);
        console.log(expensesFilter);
        setItemsList(expensesFilter);
        setImage(showInvoice.image);
        setClose(!close);
      }
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



  function handleFilterDate(date: Filter) {
    const year = date.year;
    const month = date.month;
    const day = date.day;

    console.log(year, month);

    if (month !== "00") {
      dispatch(loading());
      dispatch<any>(getInvoices(year, month))
        .then(() => {
          if (day !== "00") {
            setDateFilter(`${year}-${month}-${day}`);
          } else {
            setDateFilter("");
          }
          dispatch<any>(getExpenses(Number(year), Number(month))).then(() => {
            dispatch(closeLoading());
          });
        })
        .catch((err: any) => {
          console.log(err);
          dispatch(closeLoading());
          swal(
            "Error",
            "Error trying to get the invoices, try again leter",
            "error"
          );
        });
    } else if (date.month === "00") {
      setDateFilter("");
      dispatch(loading());
      dispatch<any>(getInvoices(year, null))
        .then(() => {
          dispatch<any>(getExpenses(Number(year), null)).then(() => {
            dispatch(closeLoading());
          });
        })
        .catch((err: any) => {
          console.log(err);
          dispatch(closeLoading());
          swal(
            "Error",
            "Error trying to get the invoices, try again leter",
            "error"
          );
        });
    }
  }

  return (
    <div className={styles.background}>
      {close ? (
        <Details
          handleClose={handleClose}
          invoiceType={invoiceType}
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
          <div className={`form-floating ${style.typeFilter}`}>
            <select
              id="type"
              name="type"
              className="form-select "
              onChange={handleSelect}
            >
              <option value={InvoiceType.Purchase}>Purchase</option>
              <option value={InvoiceType.Expenses}>Expenses</option>
            </select>
            <label htmlFor="type" className="form-label">
              Type
            </label>
          </div>
          <DateFilter
            years={reports.map((report) => report.year)}
            handleFilterDate={handleFilterDate}
          />
          <span className={style.total}>
            Total cost of invoices: ${total.toFixed(2)}
          </span>
        </div>
        <Table
          invoices={rows}
          invoiceType={invoiceType}
          handleDetails={handleDetails}
        />
      </div>
    </div>
  );
}
