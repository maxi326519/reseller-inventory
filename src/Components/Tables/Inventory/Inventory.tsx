import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { closeLoading, expiredItems, loading } from "../../../redux/actions";
import { RootState, Item, Sale } from "../../../interfaces";

import Table from "./Table/Table";
import AddSale from "./AddSale/AddSale";

import style from "./Inventory.module.css";
import swal from "sweetalert";

const initialSale: Sale = {
  id: 0,
  date: new Date().toISOString().split("T")[0],
  price: 0,
  productId: 0,
  shipment: {
    value: false,
    amount: 0,
  },
  expenses: [],
};

export default function Inventory() {
  const dispatch = useDispatch();
  const items = useSelector((state: RootState) => state.items);
  const [rows, setRows] = useState<Item[]>([]);
  const [close, setClose] = useState<boolean>(false);
  const [itemSelected, setItem] = useState<number[]>([]);
  const [sales, setSales] = useState<Sale[]>([]);
  const [total, setTotal] = useState("0");
  const [search, setSearch] = useState<string>("");

  useEffect(() => {
    let total = 0;
    setRows(
      items.filter((i) => {
        if (i.state === "Sold") return false;
        if (i.state === "Expired") return false;
        if (search === "") return true;
        if (i.id.toString().toLowerCase().includes(search)) return true;
        if (i.date.toLowerCase().includes(search)) return true;
        if (i.description.toLowerCase().includes(search)) return true;
        return false;
      })
    );
    items.forEach((i) => (total += Number(i.cost)));
    if (items.length > 0) setTotal(Number(total).toFixed(3));
  }, [items, search]);

  function handleClose() {
    setClose(!close);
  }

  function handleSelected(id: number) {
    if (itemSelected.some((s) => s === id)) {
      setItem(itemSelected.filter((s) => s !== id));
      setSales(sales.filter((s) => s.productId !== id));
    } else {
      setItem([...itemSelected, id]);
      setSales([
        ...sales,
        {
          ...initialSale,
          id: id,
          productId: id,
        },
      ]);
    }
    console.log(itemSelected);
    console.log(sales);
  }

  function handleExpired() {
    if (itemSelected.length > 0) {
      swal({
        title: "Warning",
        text: `You want to change the status of ${itemSelected.length} products to "Expired"`,
        icon: "warning",
        buttons: { confirm: true, cancel: true },
      }).then((response) => {
        if (response) {
          dispatch<any>(loading());
          dispatch<any>(expiredItems(itemSelected))
            .then(() => {
              dispatch<any>(closeLoading());
            })
            .catch((e: any) => {
              swal(
                "Error",
                "Error trying to expire some items, try again leter",
                "error"
              );
              console.log(e);
            });
        }
      });
    }
  }

  return (
    <div className={style.background}>
      {close ? (
        <AddSale
          handleClose={handleClose}
          itemSelected={itemSelected}
          handleSelected={handleSelected}
          sales={sales}
          setSales={setSales}
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
