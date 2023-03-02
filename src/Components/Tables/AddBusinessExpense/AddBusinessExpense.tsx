import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { closeLoading, loading, postExpenses } from "../../../redux/actions";
import { Expense } from "../../../interfaces";

import Form from "./Form/Form";
import Table from "./Table/Table";
import Categories from "./Categories/Categories";

import style from "./AddBusinessExpense.module.css";
import styles from "../Tables.module.css";
import swal from "sweetalert";

export default function AddBusinessExpense() {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [total, setTotal] = useState<number>(0);
  const [close, setClose] = useState<boolean>(false);
  const dispatch = useDispatch();

  useEffect(() => {
    let total: number = 0;
    expenses.forEach((expense) => (total += expense.cost * expense.quantity));
    setTotal(total);
  }, [expenses]);

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
      <h1>Add Business Expense</h1>
      <Link className="btn btn-primary" to="/">
        Menu
      </Link>
      <div className={styles.container}>
        <Form expenses={expenses} setExpenses={setExpenses} />
        <div className={style.expense}>
          <Table expenses={expenses} />
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
