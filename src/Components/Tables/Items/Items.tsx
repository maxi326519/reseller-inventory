import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import {
  postItems,
  postInvoice,
  loading,
  closeLoading,
} from "../../../redux/actions";
import { RootState, Item, Invoice, Sale } from "../../../interfaces";

import Table from "./Table/Table";
import AddSale from "./AddSale/AddSale";

import styles from "../Tables.module.css";
import style from "./Items.module.css";
import swal from "sweetalert";

export default function Items() {
  const items = useSelector((state: RootState) => state.items);
  const [rows, setRows] = useState<Item[]>([]);
  const [itemSelected, setSale] = useState<number[]>([]);
  const [close, setClose] = useState<boolean>(false);

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

  function handleClose() {
    setClose(!close);
  }

  function handleSelected(id: number) {
    console.log("sdas");
    if(itemSelected.some((s) => s === id)){
      setSale(itemSelected.filter((s) => s !== id));
    }else{
      setSale([...itemSelected, id]);
    }
  }

  return (
    <div className={styles.background}>
      {close ? (
        <AddSale handleClose={handleClose} itemSelected={itemSelected} handleSelected={handleSelected}/>
      ) : null}
      <h1>Item Sold</h1>
      <Link className="btn btn-primary" to="/">
        Menu
      </Link>
      <div>
        <div>
          <input
            className="form-control"
            id="search"
            type="search"
            placeholder="Search"
          />
          <button
            className="btn btn-primary"
            type="button"
            onClick={handleClose}
          >
            Sale
          </button>
        </div>
        <div className={style.sale}>
          <Table
            items={rows}
            itemSelected={itemSelected}
            handleSelected={handleSelected}
          />
        </div>
      </div>
    </div>
  );
}
