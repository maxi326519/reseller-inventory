import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Timestamp } from "@firebase/firestore";
import {
  Expense,
  InvoiceExpenses,
  RootState,
  InvoiceType,
} from "../../../interfaces/interfaces";
import { closeLoading, loading } from "../../../redux/actions/loading";
import { postInvoice } from "../../../redux/actions/invoices";
import { postExpenses } from "../../../redux/actions/expenses";
import { updateReports } from "../../../redux/actions/reports";
import swal from "sweetalert";

import Form from "./Form/Form";
import Table from "./Table/Table";
import InvoiceImage from "./InvoiceImage/InvoiceImage";
import Categories from "./Categories/Categories";

import style from "./AddBusinessExpense.module.css";
import styles from "../Tables.module.css";
import menuSvg from "../../../assets/svg/menu.svg";
import closeSvg from "../../../assets/svg/close.svg";
import List from "../../Menu/List/List";

export default function AddBusinessExpense() {
  const initialState: InvoiceExpenses = {
    id: generateInvoiceId(new Date().toLocaleDateString()),
    type: InvoiceType.Expenses,
    date: Timestamp.fromDate(new Date()),
    category: "0",
    items: [],
    total: 0,
    image: "",
    imageRef: "",
  };
  const dispatch = useDispatch();
  const reports = useSelector((state: RootState) => state.reports);
  const [invoice, setInvoice] = useState<InvoiceExpenses>(initialState);
  const [file, setFile] = useState<File | null>(null);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [total, setTotal] = useState<number>(0);
  const [close, setClose] = useState<boolean>(false);
  const [amount, setAmount] = useState<any>("");
  const [active, setActive] = useState<boolean>(false);

  useEffect(() => {
    let total: number = 0;
    expenses.forEach((expense) => (total += Number(expense.price) * amount));
    setTotal(total);
  }, [expenses, amount]);

  function generateInvoiceId(date: string) {
    const toDay: string[] = date.split("/");
    const day: string = `0${toDay[0].toString().slice(-2)}`;
    const month: string = `0${toDay[1].toString().slice(-2)}`;
    const year: string = `${toDay[2].toString().slice(-2)}`;
    const sequential: number = Math.floor(Math.random() * 100);
    const idStr: string = `${sequential}${day}${month}${year}`;
    const idNumber: number = Number(idStr);
    return idNumber;
  }

  function handleRemove(id: number) {
    setExpenses(expenses.filter((expense) => expense.id !== id));
  }

  function handleAddExpese() {
    if (expenses.length <= 0) return false;
    swal({
      text: "Do you want to save the expenses?",
      icon: "info",
      buttons: {
        confirm: true,
        cancel: true,
      },
    }).then((r) => {
      if (r) {
        const newInvoice: InvoiceExpenses = {
          ...invoice,
          items: expenses.map((expense) => expense.id),
          total: expenses.reduce((acc, expense) => {
            const price =
              typeof expense.price === "string"
                ? parseFloat(expense.price)
                : expense.price;
            return acc + price;
          }, 0),
        };
        dispatch<any>(loading());
        dispatch<any>(postInvoice(newInvoice, file))
          .then(() => {
            dispatch<any>(postExpenses(expenses))
              .then(() => {
                dispatch<any>(updateReports(expenses, reports, false))
                  .then(() => {
                    setExpenses([]);
                    dispatch<any>(closeLoading());
                    swal("Saved", "Saved expenses successfully", "success");
                  })
                  .catch((err: any) => {
                    dispatch<any>(closeLoading());
                    console.log(err);
                    swal(
                      "Error",
                      "Error to save expenses, try again later",
                      "error"
                    );
                  });
              })
              .catch((e: any) => {
                dispatch<any>(closeLoading());
                swal(
                  "Error",
                  "Error to save the expenses, try again later",
                  "error"
                );
                console.log(e);
              });
          })
          .catch((err: any) => {
            dispatch<any>(closeLoading());
            swal(
              "Error",
              "Error to save the invoice, try again later",
              "error"
            );
            console.log(err);
          });
      }
    });
  }

  function handleReset() {
    swal({
      text: "Are you sure you want to empty the invoice?",
      icon: "info",
      buttons: {
        confirm: true,
        cancel: true,
      },
    }).then((response) => {
      if (response) {
        setExpenses([]);
        setTotal(0);
      }
    });
  }

  function handleClose() {
    setClose(!close);
  }

  function handleActive() {
    setActive(!active);
  }

  return (
    <div className={styles.background}>
      {close ? <Categories handleClose={handleClose} /> : null}
      <div className={styles.menu}>
        <List active={active} />
      </div>
      <header className={styles.head}>
        <Link className="btn btn-primary" to="/">
          <span>{"< "}</span>
          <span>{"Menu"}</span>
        </Link>
        <h1>
          Add <span>Business</span> Expense
        </h1>
        <div className={style.navBar} onClick={handleActive}>
          {active ? (
            <img src={active ? closeSvg : menuSvg} alt="menu" />
          ) : (
            <img src={active ? closeSvg : menuSvg} alt="menu" />
          )}
        </div>
      </header>
      <div className={style.container}>
        <Form
          invoice={invoice}
          setInvoice={setInvoice}
          expenses={expenses}
          setExpenses={setExpenses}
          amount={amount}
          setAmount={setAmount}
        />
        <div className={style.expense}>
          <Table expenses={expenses} handleRemove={handleRemove} />
          <div className={style.sumary}>
            <button
              className="btn btn-primary"
              type="button"
              onClick={handleAddExpese}
              disabled={expenses.length <= 0}
            >
              Add <span>expenses</span>
            </button>
            <button
              className="btn btn-primary"
              type="button"
              onClick={handleReset}
              disabled={expenses.length <= 0}
            >
              Reset <span>expenses</span>
            </button>
            <button
              className="btn btn-primary"
              type="button"
              onClick={handleClose}
            >
              Categories
            </button>
            <span>{`Total:  $${total.toFixed(2)}`}</span>
          </div>
        </div>
        <InvoiceImage file={file} setFile={setFile} />
      </div>
    </div>
  );
}
