import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  closeLoading,
  loading,
  postExpenses,
  updateReports,
} from "../../../redux/actions";
import { Expense, RootState } from "../../../interfaces";

import Form from "./Form/Form";
import Table from "./Table/Table";
import Categories from "./Categories/Categories";

import style from "./AddBusinessExpense.module.css";
import styles from "../Tables.module.css";
import swal from "sweetalert";

export default function AddBusinessExpense() {
  const reports = useSelector((state: RootState) => state.reports);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [total, setTotal] = useState<number>(0);
  const [close, setClose] = useState<boolean>(false);
  const [amount, setAmount] = useState(0);
  const dispatch = useDispatch();

  useEffect(() => {
    let total: number = 0;
    expenses.forEach((expense) => (total += expense.price * amount));
    setTotal(total);
  }, [expenses]);

  function handleRemove(id: number) {
    setExpenses(expenses.filter((expense) => expense.id !== id));
  }

  function handleAddExpese() {
    swal({
      text: "¿Quiere guardar sus expensas?",
      icon: "info",
      buttons: {
        confirm: true,
        cancel: true,
      },
    }).then((r) => {
      if (r) {
        dispatch<any>(loading());
        dispatch<any>(postExpenses(expenses))
          .then(() => {
            dispatch<any>(updateReports(expenses, reports));
            setExpenses([]);
            setTotal(0);
            dispatch<any>(closeLoading());
            swal("Guardado", "Se guardaron sus expensas con exito", "success");
          })
          .catch((e: any) => {
            dispatch<any>(closeLoading());
            swal("Error", "Ocurrio un error al guardar sus expensas", "error");
            console.log(e);
          });
      }
    });
  }

  function handleReset() {
    swal({
      text: "¿Seguro que quiere eliminar las expensas actuales?",
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

  return (
    <div className={styles.background}>
      {close ? <Categories handleClose={handleClose} /> : null}
      <div className={styles.head}>
        <Link className="btn btn-primary" to="/">
          {"< Menu"}
        </Link>
        <h1>Add Business Expense</h1>
      </div>
      <div className={styles.container}>
        <Form
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
            >
              Add Expenses
            </button>
            <button
              className="btn btn-primary"
              type="button"
              onClick={handleReset}
            >
              Reset Expenses
            </button>
            <button
              className="btn btn-primary"
              type="button"
              onClick={handleClose}
            >
              Categories
            </button>
            <span>{`Total:  $${total}`}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
