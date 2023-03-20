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
import swal from "sweetalert";

import Form from "./Form/Form";
import Table from "./Table/Table";
import InvoiceImage from "./InvoiceImage/InvoiceImage";
import AddSource from "./AddSource/AddSource";
import DownloadExcel from "./DownloadExcel/DownloadExcel";

import style from "./NewPurchase.module.css";
import styles from "../Tables.module.css";
interface ExportData {
  id: number;
  description: string;
}

export default function NewPurchase() {
  const initialState: Invoice = {
    id: generateInvoiceId(new Date().toLocaleDateString()),
    date: new Date().toISOString().split("T")[0],
    items: [],
    form: "Cash",
    source: "0",
    total: 0,
    image: "",
    imageRef: "",
  };
  const dispatch = useDispatch();
  const [items, setItems] = useState<Item[]>([]);
  const [invoice, setInvoice] = useState<Invoice>(initialState);
  const [file, setFile] = useState<File | null>(null);
  const [source, setSource] = useState(false);
  const [excel, setExcel] = useState(false);
  const [exportData, setExportData] = useState<ExportData[]>([]);

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

  function handleSubmit(e: React.MouseEvent<HTMLButtonElement>): void {
    if (items.length > 0) {
      swal({
        text: "Do you want save the invoice?",
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
              dispatch<any>(
                postItems(
                  items.map((item) => {
                    return { ...item, date: invoice.date };
                  })
                )
              ).then(() => {
                dispatch(closeLoading());
                swal({
                  title: "Saved",
                  text: "Save the inventory successfull",
                  icon: "success",
                }).then(() => handleCloseExcel());
                setExportData(
                  items.map((item) => {
                    return { id: item.id, description: item.description };
                  })
                );
                setItems([]);
                setFile(null);
                setInvoice(initialState);
              });
            })
            .catch((e: any) => {
              dispatch(closeLoading());
              swal(
                "Error",
                "Error to save the invoice or items, try again later",
                "error"
              );
              console.log(e);
            });
        }
      });
    }
  }

  function handleReset(): void {
    swal({
      text: "Are you sure you want to empty the invoice?",
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

  function handleCloseSource() {
    setSource(!source);
  }

  function handleCloseExcel() {
    setExcel(!excel);
  }

  return (
    <div className={styles.background}>
      {source ? <AddSource handleClose={handleCloseSource} /> : null}
      {excel ? (
        <DownloadExcel handleClose={handleCloseExcel} data={exportData} />
      ) : null}
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
              onClick={handleSubmit}
              disabled={items.length <= 0}
            >
              Add Invoice
            </button>
            <button
              className="btn btn-primary"
              type="button"
              onClick={handleReset}
              disabled={items.length <= 0}
            >
              Reset Invoice
            </button>
            <button
              className="btn btn-primary"
              type="button"
              onClick={handleCloseSource}
            >
              Source
            </button>
            <span>{`Total:  $${invoice.total}`}</span>
          </div>
        </div>
        <InvoiceImage file={file} setFile={setFile} />
      </div>
    </div>
  );
}
