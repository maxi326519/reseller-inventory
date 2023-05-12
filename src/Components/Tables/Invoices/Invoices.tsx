import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import {
  Invoice,
  RootState,
  InvoiceType,
  InvoiceExpenses,
} from "../../../interfaces";
import { loading, closeLoading } from "../../../redux/actions/loading";
import {
  getInvoiceDetails,
  getInvoices,
} from "../../../redux/actions/invoices";
import { getExpenses } from "../../../redux/actions/expenses";
import swal from "sweetalert";

import Table from "./Table/Table";
import DateFilter from "./DateFilter/DateFilter";
import Details from "./Details/Details";

import menuSvg from "../../../assets/svg/menu.svg";
import closeSvg from "../../../assets/svg/close.svg";

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
  const invoices = useSelector((state: RootState) => state.invoices.data);
  const details = useSelector((state: RootState) => state.invoices.details);
  const [image, setImage] = useState<string>("");
  const [close, setClose] = useState(false);
  const [rows, setRows] = useState<Array<Invoice | InvoiceExpenses>>([]);
  const [search, setSearch] = useState<string>("");
  const [total, setTotal] = useState(0);
  const [dayFilter, setDayFilter] = useState<string>("");
  const [dateFilter, setDateFilter] = useState<any>();
  const [invoiceType, setInvoiceType] = useState<InvoiceType>(
    InvoiceType.Purchase
  );
  const [active, setActive] = useState<boolean>(false);

  useEffect(() => {
    invoices.forEach((invoice): invoice is Invoice => "form" in invoice);
    setRows(
      invoices
        .filter((i) => {
          if (
            dayFilter !== "" &&
            i.date.toDate().toISOString().split("T")[0] !== dayFilter
          )
            return false;
          if (i.type !== invoiceType) return false;
          if (search === "") return true;
          if (i.id.toString().toLowerCase().includes(search)) return true;
          if (i.type !== InvoiceType.Purchase) {
            const invoice = i as Invoice;
            if (invoice.form.toLowerCase().includes(search)) return true;
            if (invoice.source.toLowerCase().includes(search)) return true;
          }
          return false;
        })
        .sort((a, b) => b.date.toMillis()! - a.date.toMillis())
    );
  }, [search, invoices, dayFilter, invoiceType]);

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

  function handleActive() {
    setActive(!active);
  }

  function handleDetails(invoiceID: number) {
    const showInvoice = invoices.find((i) => i.id === invoiceID);
    if (showInvoice) {
      dispatch<any>(
        getInvoiceDetails(
          showInvoice.type === InvoiceType.Purchase,
          showInvoice.id
        )
      );
      setImage(showInvoice.image);
      setClose(!close);
    }
  }

  function handleClose() {
    setClose(!close);
  }

  function handleFilterDate(date: Filter) {
    const year = date.year;
    const month = date.month;
    const day = date.day;

    setDateFilter(date);

    if (month !== "00") {
      dispatch(loading());
      dispatch<any>(getInvoices(year, month))
        .then(() => {
          if (day !== "00") {
            setDayFilter(`${year}-${month}-${day}`);
          } else {
            setDayFilter("");
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
      setDayFilter("");
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

  function getYears() {
    const currentYear = new Date().getFullYear();
    const years = [];
    for (let i = 0; i < 50; i++) {
      const year = currentYear - i;
      years.push(year);
    }
    return years;
  }
  return (
    <div className={styles.background}>
      {close ? (
        <Details
          handleClose={handleClose}
          invoiceType={invoiceType}
          itemsList={details}
          image={image}
        />
      ) : null}
      <header className={styles.head}>
        <Link className="btn btn-primary" to="/">
          <span>{"< "}</span>
          <span>{"Menu"}</span>
        </Link>
        <h1>Invoices</h1>
        <div className={style.navBar} onClick={handleActive}>
          {active ? (
            <img src={closeSvg} alt="menu" />
          ) : (
            <img src={menuSvg} alt="menu" />
          )}
        </div>
      </header>
      <div className={style.container}>
        <div className={style.searchBar}>
          <div className={style.inputs}>
            <input
              className="form-control"
              id="search"
              type="search"
              name="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search invoice..."
            />
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
          </div>
          <DateFilter years={getYears()} handleFilterDate={handleFilterDate} />
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
