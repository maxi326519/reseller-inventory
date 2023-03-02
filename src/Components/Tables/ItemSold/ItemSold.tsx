import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import {
  postItems,
  postInvoice,
  loading,
  closeLoading,
} from "../../../redux/actions/";
import { RootState, Item, Invoice, Sale } from "../../../interfaces";

import Table from "./Table/Table";

import styles from "../Tables.module.css";
import style from "./ItemSold.module.css";
import swal from "sweetalert";

export default function ItemSold() {
  const initialState: Invoice = {
    id: generateInvoiceId(new Date().toLocaleDateString()),
    date: format(new Date().toLocaleDateString()),
    solds: [],
    form: "Cash",
    source: "",
    total: 0,
  };
  const items = useSelector((state: RootState) => state.items);
  const [invoice, setInvoice] = useState<Invoice>(initialState);
  const [sales, setSale] = useState<Sale[]>([]);
  const [rows, setRows] = useState<Item[]>([]);
  const dispatch = useDispatch();

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

  /* De "/" a "-" */
  function format(date: string) {
    const dateArray: string[] = date.split("/");
    const dateStr = `${dateArray[2]}-${`0${dateArray[1]}`.slice(
      -0
    )}-${`0${dateArray[1]}`.slice(-2)}`;
    return dateStr;
  }

  useEffect(() => {
    setRows(items);
  }, [items]);

  function handleAddSale(e: React.MouseEvent<HTMLButtonElement>): void {
    swal({
      text: "¿Quiere guardar la venta?",
      icon: "warning",
      buttons: {
        confirm: true,
        cancel: true,
      },
      dangerMode: true,
    }).then((response) => {
      if (response) {
        dispatch(loading());
        dispatch<any>(postInvoice(invoice))
          .then(() => {
            dispatch<any>(postItems(items)).then(() => {
              dispatch(closeLoading());
              swal({
                title: "Guardado",
                text: "Se guardo la venta con exito",
                icon: "success",
              });
              setInvoice(initialState);
              setSale([]);
            });
          })
          .catch((e: any) => {
            dispatch(closeLoading());
            swal(
              "Error",
              "Ocurrio un error al guardar la venta de los items",
              "success"
            );
            console.log(e);
          });
      }
    });
  }

  function handleAddSold(){
    setSale([]);
    setInvoice(initialState);
  }

  function handleReset(): void {
    swal({
      text: "¿Seguro quiere eliminar la venta actual?",
      icon: "warning",
      buttons: {
        confirm: true,
        cancel: true,
      },
      dangerMode: true,
    }).then((response) => {
      if (response) {
        setInvoice(initialState);
        setSale([]);
      }
    });
  }

  return (
    <div className={styles.background}>
      <h1>Item Sold</h1>
      <Link className="btn btn-primary" to="/">
        Menu
      </Link>
      <div>
        <div className="form-floating">
          <label className="form-label" htmlFor="search">
            Search
          </label>
          <input className="form-control" id="search" type="search" />
        </div>
        <div>
          <Table items={rows} />
          <div className={style.sumary}>
            <button
              className="btn btn-primary"
              type="button"
              onClick={handleAddSold}
            >
              Add Invoice
            </button>
            <button
              className="btn btn-primary"
              type="button"
              onClick={handleReset}
            >
              Reset Invoice
            </button>
            <span>{`Total:  $${invoice.total}`}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
