import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Timestamp } from "firebase/firestore";
import { closeLoading, loading } from "../../../redux/actions/loading";
import { updateReports } from "../../../redux/actions/reports";
import { deleteItemInvoiceDetail, expiredItems, getItemInvoiceDetail, getStockItems } from "../../../redux/actions/items";
import { RootState, Item, Sale } from "../../../interfaces";
import { Link } from "react-router-dom";

import reload from "../../../assets/svg/reload.svg";

import Table from "./Table/Table";
import AddSale from "./AddSale/AddSale";

import menuSvg from "../../../assets/svg/menu.svg";
import closeSvg from "../../../assets/svg/close.svg";

import style from "./Inventory.module.css";
import swal from "sweetalert";
import InvoiceDetails from "./InvoiceDetails/InvoiceDetails";
import List from "../../Menu/List/List";

interface OtherExpenses {
  saleId: number;
  adsFee: {
    check: boolean;
    cost: number | string;
  };
  other: {
    check: boolean;
    description: string;
    cost: number | string;
  };
}

interface ShipingExpenses {
  saleId: number;
  shipLabel: number | string;
  ebayFees: number | string;
}

const initialSale: Sale = {
  id: 0,
  date: Timestamp.fromDate(new Date()),
  cost: 0,
  price: 0,
  productId: 0,
  shipment: {
    value: false,
    amount: "",
  },
  expenses: [],
};

const initialOtherExpenses: OtherExpenses = {
  saleId: 0,
  adsFee: { check: false, cost: "" },
  other: { check: false, description: "", cost: "" },
};

const initialShipingExpenses: ShipingExpenses = {
  saleId: 0,
  shipLabel: "",
  ebayFees: "",
};

export default function Inventory() {
  const dispatch = useDispatch();
  const items = useSelector((state: RootState) => state.items.data);
  const invoiceDetail = useSelector((state: RootState) => state.items.details);
  const reports = useSelector((state: RootState) => state.reports);
  const [rows, setRows] = useState<Item[]>([]);
  const [search, setSearch] = useState<string>("");
  const [totalItems, setTotalItems] = useState(0);
  const [total, setTotal] = useState(0);
  const [close, setClose] = useState<boolean>(false);
  const [active, setActive] = useState<boolean>(false);
  const [details, setDetails] = useState<boolean>(false);

  // Sale data
  const [itemSelected, setItemSelected] = useState<number[]>([]);
  const [sales, setSales] = useState<Sale[]>([]);
  const [other, setOther] = useState<OtherExpenses[]>([]);
  const [shipment, setShiping] = useState<ShipingExpenses[]>([]);

  useEffect(() => {
    let total = 0;
    let totalItems = 0;
    setRows(
      items
        .filter((i) => {
          if (i.state === "Sold") return false;
          if (i.state === "Expired") return false;
          if (search === "") return true;
          if (i.id.toString().toLowerCase().includes(search.toLowerCase()))
            return true;
          if (i.description.toLowerCase().includes(search.toLowerCase()))
            return true;
          return false;
        })
        .sort((a, b) => b.date.toMillis()! - a.date.toMillis())
    );
    items.forEach((i) =>
      i.state === "In Stock" ? (total += Number(i.cost)) : null
    );
    items.forEach((i) => (i.state === "In Stock" ? totalItems++ : null));
    setTotal(Number(total.toFixed(2)));
    setTotalItems(Number(totalItems.toFixed(2)));
  }, [items, search]);

  function handleActive() {
    setActive(!active);
  }

  function handleClose() {
    setClose(!close);
  }

  function resetData() {
    setItemSelected([]);
    setOther([]);
    setShiping([]);
    setSales([]);
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
        dispatch<any>(getStockItems())
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

  function handleExpired() {
    if (itemSelected.length > 0) {
      swal({
        title: "Warning",
        text: `Do you want to expire ${itemSelected.length} products?`,
        icon: "warning",
        buttons: { confirm: true, cancel: true },
      }).then((response) => {
        if (response) {
          const dataItemSelected = items.filter((item) =>
            itemSelected.some((id) => id === item.id)
          );
          const newExpenses = dataItemSelected.map((item: Item) => {
            return {
              id: item.id,
              date: Timestamp.fromDate(new Date()),
              price: item.cost,
              category: "Expired",
              description: "Expired item",
              invoiceId: 0,
            };
          });
          dispatch<any>(loading());
          dispatch<any>(expiredItems(itemSelected, newExpenses))
            .then(() => {
              dispatch<any>(updateReports(newExpenses, reports, null));
              resetData();
              dispatch(closeLoading());
            })
            .catch((e: any) => {
              swal(
                "Error",
                "Error trying to expire some items, try again leter",
                "error"
              );
              console.log(e);
              setItemSelected([]);
            });
        }
      });
    }
  }

  function handleSelected(id: number, cost: number | null) {
    if (itemSelected.some((s) => s === id)) {
      setItemSelected(itemSelected.filter((s) => s !== id));
      setSales(sales.filter((s) => s.productId !== id));
      setOther(other.filter((o) => o.saleId !== id));
      setShiping(shipment.filter((s) => s.saleId !== id));
    } else if (cost !== null) {
      setItemSelected([...itemSelected, id]);
      setOther([...other, { ...initialOtherExpenses, saleId: id }]);
      setShiping([...shipment, { ...initialShipingExpenses, saleId: id }]);
      setSales([
        ...sales,
        {
          ...initialSale,
          id: id,
          cost: cost,
          productId: id,
        },
      ]);
    }
  }

  function handleExpense(
    event: React.ChangeEvent<HTMLInputElement>,
    id: number | undefined
  ): void {
    const name: string = event.target.name;
    const value: number | string = event.target.value;

    if (name.includes("shipLabel")) {
      setShiping(
        shipment.map((s) => {
          if (s.saleId === id) {
            return {
              ...s,
              shipLabel: value,
            };
          }
          return s;
        })
      );
    } else if (name.includes("ebayFees")) {
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
    } else if (name.includes("adsFee")) {
      setOther(
        other.map((o) => {
          if (o.saleId === id) {
            return {
              ...o,
              adsFee: {
                check: name.includes("Check")
                  ? event.target.checked
                  : o.adsFee.check,
                cost: name.includes("Cost") ? value : o.adsFee.cost,
              },
            };
          }
          return o;
        })
      );
    } else if (name.includes("other")) {
      setOther(
        other.map((o) => {
          if (o.saleId === id) {
            return {
              ...o,
              other: {
                check: name.includes("Check")
                  ? event.target.checked
                  : o.other.check,
                description: name.includes("Description")
                  ? value
                  : o.other.description,
                cost: name.includes("Cost") ? value : o.other.cost,
              },
            };
          }
          return o;
        })
      );
    }
  }

  function handleInvoiceDetail(invoiceId?: number) {
    setDetails(!details);
    if(details){
      dispatch<any>(deleteItemInvoiceDetail());
    }else if(invoiceId){
      dispatch<any>(getItemInvoiceDetail(invoiceId));
    }
  }

  return (
    <div className={style.background}>
      <List active={active}/>
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
          resetData={resetData}
        />
      ) : null}
      {details ? (
        <InvoiceDetails
          handleClose={handleInvoiceDetail}
          itemsList={invoiceDetail.items}
          image={invoiceDetail.invoice.image}
        />
      ) : null}
      <header className={style.head}>
        <Link className="btn btn-primary" to="/">
          <span>{"< "}</span>
          <span>{"Menu"}</span>
        </Link>
        <h1>Inventory</h1>
        <div className={style.navBar} onClick={handleActive}>
          {active ? (
            <img src={closeSvg} alt="menu" />
          ) : (
            <img src={menuSvg} alt="menu" />
          )}
        </div>
      </header>
      <div className={style.table}>
        <div className={style.searchBar}>
          <input
            className="form-control"
            id="search"
            type="search"
            placeholder="Search"
            onChange={(e) => setSearch(e.target.value)}
          />
          <div>
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
          </div>
          <div>
            <span className={style.totalStock}>Total Items: {totalItems}</span>
            <span className={style.totalStock}>Stock price: ${total}</span>
          </div>
        </div>
        <Table
          items={rows}
          itemSelected={itemSelected}
          handleSelected={handleSelected}
          handleInvoiceDetail={handleInvoiceDetail}
        />
      </div>
    </div>
  );
}
