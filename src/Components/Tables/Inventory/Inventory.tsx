import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import {
  closeLoading,
  expiredItems,
  getItems,
  loading,
} from "../../../redux/actions";
import { RootState, Item, Sale } from "../../../interfaces";

import reload from "../../../assets/svg/reload.svg";

import Table from "./Table/Table";
import AddSale from "./AddSale/AddSale";

import style from "./Inventory.module.css";
import swal from "sweetalert";

interface OtherExpenses {
  saleId: number;
  other1: {
    check: boolean;
    description: string;
    cost: number | string;
  };
  other2: {
    check: boolean;
    description: string;
    cost: number | string;
  };
}

interface ShipingExpenses {
  saleId: number;
  shipment: number | string;
  ebayFees: number | string;
}

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

const initialOtherExpenses: OtherExpenses = {
  saleId: 0,
  other1: { check: false, description: "", cost: "" },
  other2: { check: false, description: "", cost: "" },
};

const initialShipingExpenses: ShipingExpenses = {
  saleId: 0,
  shipment: 0,
  ebayFees: 0,
};

export default function Inventory() {
  const dispatch = useDispatch();
  const items = useSelector((state: RootState) => state.items);
  const [rows, setRows] = useState<Item[]>([]);
  const [close, setClose] = useState<boolean>(false);
  const [itemSelected, setItem] = useState<number[]>([]);
  const [sales, setSales] = useState<Sale[]>([]);
  const [search, setSearch] = useState<string>("");
  const [other, setOther] = useState<OtherExpenses[]>([]);
  const [shipment, setShiping] = useState<ShipingExpenses[]>([]);
  const [total, setTotal] = useState(0);
  const [totalItems, setTotalItems] = useState(0);

  useEffect(() => {
    let total = 0;
    let totalItems = 0;
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
    items.forEach((i) => i.state === "In Stock" ? total += Number(i.cost) : null);
    items.forEach((i) => i.state === "In Stock" ? totalItems++ : null);
    setTotal(Number(total.toFixed(2)));
    setTotalItems(Number(totalItems.toFixed(2)));
  }, [items, search]);

  function handleClose() {
    setClose(!close);
  }

  function handleSelected(id: number) {
    if (itemSelected.some((s) => s === id)) {
      setItem(itemSelected.filter((s) => s !== id));
      setOther(other.filter((o) => o.saleId !== id));
      setShiping(shipment.filter((s) => s.saleId !== id));
      setSales(sales.filter((s) => s.productId !== id));
    } else {
      setItem([...itemSelected, id]);
      setOther([...other, { ...initialOtherExpenses, saleId: id }]);
      setShiping([...shipment, { ...initialShipingExpenses, saleId: id }]);
      setSales([
        ...sales,
        {
          ...initialSale,
          id: id,
          productId: id,
        },
      ]);
    }
    console.log("Items", itemSelected);
    console.log("Sales", sales);
    console.log("Other", other);
    console.log("shipment", shipment);
  }

  function handleExpense(
    event: React.ChangeEvent<HTMLInputElement>,
    id: number | undefined
  ): void {
    const name: string = event.target.name;
    const value: number | string = event.target.value;

    console.log(name, value);

    if (name.includes("shipment")) {
      console.log("Entro shipment");
      setShiping(
        shipment.map((s) => {
          if (s.saleId === id) {
            return {
              ...s,
              shipment: value,
            };
          }
          return s;
        })
      );
    } else if (name.includes("ebayFees")) {
      console.log("Entro ebayFees");
      setShiping(
        shipment.map((s) => {
          if (s.saleId === id) {
            return {
              ...s,
              ebayFees: value,
            };
          }
          return s;
        })
      );
    } else if (name.includes("other1")) {
      console.log("Entro other1");
      setOther(
        other.map((o) => {
          if (o.saleId === id) {
            return {
              ...o,
              other1: {
                check: name.includes("Check")
                  ? event.target.checked
                  : o.other1.check,
                description: name.includes("Description")
                  ? value
                  : o.other1.description,
                cost: name.includes("Cost") ? value : o.other1.cost,
              },
            };
          }
          return o;
        })
      );
    } else if (name.includes("other2")) {
      console.log("Entro other2");
      setOther(
        other.map((o) => {
          if (o.saleId === id) {
            return {
              ...o,
              other2: {
                check: name.includes("Check")
                  ? event.target.checked
                  : o.other2.check,
                description: name.includes("Description")
                  ? value
                  : o.other2.description,
                cost: name.includes("Cost") ? value : o.other2.cost,
              },
            };
          }
          return o;
        })
      );
    }
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

  function handleReload() {
    swal({
      title: "¡Attention!",
      text: `All items will be reloaded`,
      icon: "info",
      buttons: { confirm: true, cancel: true },
    }).then((response) => {
      if (response) {
        dispatch(loading());
        dispatch<any>(getItems())
          .then(() => {
            dispatch(closeLoading());
          })
          .catch((e: any) => {
            swal(
              "Error",
              "Error trying to get the inventory, try again leter",
              "error"
            );
            console.log(e);
          });
      }
    });
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
          other={other}
          shipment={shipment}
          handleExpense={handleExpense}
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
            className={`btn btn-primary ${style.reload}`}
            type="button"
            onClick={handleReload}
          >
            <img src={reload} alt="reload" />
          </button>
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
          <span className={style.totalStock}>Total Items: {totalItems}</span>
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
