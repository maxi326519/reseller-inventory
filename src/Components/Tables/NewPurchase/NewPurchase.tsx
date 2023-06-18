import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Item, Invoice, InvoiceType } from "../../../interfaces/interfaces";
import { useDispatch } from "react-redux";
import { Timestamp } from "@firebase/firestore";
import { loading, closeLoading } from "../../../redux/actions/loading";
import { postItems } from "../../../redux/actions/items";
import { postInvoice } from "../../../redux/actions/invoices";
import swal from "sweetalert";

import Form from "./Form/Form";
import Table from "./Table/Table";
import InvoiceImage from "./InvoiceImage/InvoiceImage";
import AddSource from "./AddSource/AddSource";
import DownloadExcel from "./DownloadExcel/DownloadExcel";

import menu from "../../../assets/svg/menu.svg";
import close from "../../../assets/svg/close.svg";

import style from "./NewPurchase.module.css";
import styles from "../Tables.module.css";
import List from "../../Menu/List/List";
interface ExportData {
  id: number;
  description: string;
}

export default function NewPurchase() {
  const initialState: Invoice = {
    id: 0,
    type: InvoiceType.Purchase,
    date: Timestamp.now(),
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
  const [active, setActive] = useState<boolean>(false);

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

  function handleActive() {
    setActive(!active);
  }

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
          const date = invoice.date.toDate();
          const formattedDate = Number(
            `${date.getFullYear()}${(date.getMonth() + 1)
              .toString()
              .padStart(2, "0")}${date.getDate().toString().padStart(2, "0")}`
          );
          const newInvoice = {
            ...invoice,
            id: generateInvoiceId(new Date().toLocaleDateString()),
            items: invoice.items.map((id) => Number(`${formattedDate}${id}`)),
          };
          dispatch(loading());
          dispatch<any>(postInvoice(newInvoice, file))
            .then(() => {
              dispatch<any>(
                postItems(
                  items.map((item) => {
                    return {
                      ...item,
                      id: Number(`${formattedDate}${item.id}`),
                      date: newInvoice.date,
                      invoiceId: newInvoice.id,
                    };
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
      <div className={styles.menu}>
        <List active={active} />
      </div>
      {source ? <AddSource handleClose={handleCloseSource} /> : null}
      {excel ? (
        <DownloadExcel handleClose={handleCloseExcel} data={exportData} />
      ) : null}
      <header className={styles.head}>
        <Link className="btn btn-primary" to="/">
          <span>{"< "}</span>
          <span>{"Menu"}</span>
        </Link>
        <h1>New purchase</h1>
        <div className={style.navBar} onClick={handleActive}>
          {active ? (
            <img src={active ? close : menu} alt="menu" />
          ) : (
            <img src={active ? close : menu} alt="menu" />
          )}
        </div>
      </header>
      <div className={style.container}>
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
              Add <span>invoice</span>
            </button>
            <button
              className="btn btn-primary"
              type="button"
              onClick={handleReset}
              disabled={items.length <= 0}
            >
              Reset <span>invoice</span>
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
