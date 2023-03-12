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

import style from "./Inventory.module.css";
import swal from "sweetalert";

export default function Inventory() {
  const items = useSelector((state: RootState) => state.items);
  const [rows, setRows] = useState<Item[]>([]);
  const [itemSelected, setSale] = useState<number[]>([]);
  const [close, setClose] = useState<boolean>(false);
  const [total, setTotal] = useState("0");
  const [search, setSearch] = useState<string>("");

  useEffect(() => {
    let total = 0;
    setRows(items.filter((i) => {
      if (search === "") return true;
/*       if (i.state === "sold") return false;
      if (i.state === "expired") return false; */
      if (i.id.toString().toLowerCase().includes(search)) return true
      if (i.date.toLowerCase().includes(search)) return true
      if (i.description.toLowerCase().includes(search)) return true
      return false
    }))
    items.forEach((i) => total += Number(i.cost));
    console.log(total);
    if(items.length > 0) setTotal(Number(total).toFixed(3));
  }, [items, search]);

  function handleClose() {
    setClose(!close);
  }

  function handleSelected(id: number) {
    if (itemSelected.some((s) => s === id)) {
      setSale(itemSelected.filter((s) => s !== id));
    } else {
      setSale([...itemSelected, id]);
    }
  }

  function handleExpired() {
    if (itemSelected.length > 0) {
      swal("Warning", `Seguro que desea cambiar el estados de ${itemSelected.length} a 'Expirated'`, "warning")
        .then((response) => {
          if (response) {
            /* Developer function to disable products */
          }
        })
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
        <h1>Inventory</h1>
      </div>
      <div className={style.table}>
        <div className={style.searchBar}>
          <input
            className="form-control"
            id="search"
            type="search"
            placeholder="Search"
            onChange={(e) => setSearch(e.target.value)}
          />
          <button
            className="btn btn-primary"
            type="button"
            onClick={handleClose}
            disabled={!(itemSelected.length > 0)}
          >
            Sale
          </button>
          <button
            className="btn btn-primary"
            type="button"
            onClick={handleExpired}
            disabled={!(itemSelected.length > 0)}
          >
            Expired
          </button>
          <span className={style.totalStock}>Stock price: ${total}</span>
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
