import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Item, Invoice } from "../../../interfaces";
import { useDispatch } from "react-redux";
import {
  postItems,
  postInvoice,
  loading,
  closeLoading,
} from "../../../redux/actions/";

import Form from "./Form/Form";
import Table from "./Table/Table";

import styles from "../Tables.module.css";
import style from "./NewPurchase.module.css";
import InvoiceImage from "./InvoiceImage/InvoiceImage";
import swal from "sweetalert";

export default function NewPurchase() {
  const initialState: Invoice = {
    id: generateInvoiceId(new Date().toLocaleDateString()),
    date: new Date().toISOString().split('T')[0],
    items: [],
    form: "Cash",
    source: "",
    total: 0,
    image: "",
    imageRef: "",
  };
  const [items, setItems] = useState<Item[]>([]);
  const [invoice, setInvoice] = useState<Invoice>(initialState);
  const [file, setFile] = useState<File | null>(null);
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

  useEffect((): void => {
    let total: number = 0;
    items.forEach((i) => (total += Number(i.cost)));

    setInvoice({
      ...invoice,
      total: total,
    });
  }, [items, setInvoice]);

  function handleRemove(id: number) {
    setItems(items.filter((item) => item.id !== id));
  }

  function handleAddInventory(e: React.MouseEvent<HTMLButtonElement>): void {
    swal({
      text: "¿Quiere guardar la factura?",
      icon: "info",
      buttons: {
        confirm: true,
        cancel: true,
      },
      dangerMode: true,
    }).then((response) => {
      if (response) {
        dispatch(loading());
        dispatch<any>(postInvoice(invoice, file))
          .then(() => {
            dispatch<any>(postItems(items)).then(() => {
              dispatch(closeLoading());
              swal({
                title: "Guardado",
                text: "Se guardo el inventario con exito",
                icon: "success",
              });
              setItems([]);
              setInvoice(initialState);
            });
          })
          .catch((e: any) => {
            dispatch(closeLoading());
            swal(
              "Error",
              "Ocurrio un error al guardar la factura o los items",
              "success"
            );
            console.log(e);
          });
      }
    });
  }

  function handleReset(): void {
    swal({
      text: "¿Seguro quiere eliminar la factura actual?",
      icon: "info",
      buttons: {
        confirm: true,
        cancel: true,
      },
    }).then((response) => {
      if (response) {
        setInvoice(initialState);
        setItems([]);
        setFile(null);
      }
    });
  }

  return (
    <div className={styles.background}>
      <div className={styles.head}>
        <Link className="btn btn-primary" to="/">
          {"< Menu"}
        </Link>
        <h1>New purchase</h1>
      </div>
      <div className={styles.container}>
        <Form
          invoice={invoice}
          setInvoice={setInvoice}
          items={items}
          setItems={setItems}
        />
        <div className={style.invoice}>
          <Table items={items} handleRemove={handleRemove} />
          <div className={style.sumary}>
            <button
              className="btn btn-primary"
              type="button"
              onClick={handleAddInventory}
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
        <InvoiceImage setFile={setFile} />
      </div>
    </div>
  );
}
