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

import style from "./Items.module.css";
import swal from "sweetalert";

export default function Items() {
  const items = useSelector((state: RootState) => state.items);
  const [rows, setRows] = useState<Item[]>([]);
  const [itemSelected, setSale] = useState<number[]>([]);
  const [close, setClose] = useState<boolean>(false);

  useEffect(() => {
    setRows(items.filter((item) => (item.state === "sold" ? null : item)));
  }, [items]);

  function handleClose() {
    setClose(!close);
  }

  function handleSelected(id: number) {
    console.log("sdas");
    if (itemSelected.some((s) => s === id)) {
      setSale(itemSelected.filter((s) => s !== id));
    } else {
      setSale([...itemSelected, id]);
    }
  }

  return (
    <div className={style.background}>
      {close ? (
        <AddSale
          handleClose={handleClose}
          itemSelected={itemSelected}
          handleSelected={handleSelected}
        />
      ) : null}
      <div className={style.head}>
        <Link className="btn btn-primary" to="/">
          {"< Menu"}
        </Link>
        <h1>Items</h1>
      </div>
      <div className={style.table}>
        <div className={style.searchBar}>
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
        <Table
          items={rows}
          itemSelected={itemSelected}
          handleSelected={handleSelected}
        />
      </div>
    </div>
  );
}
