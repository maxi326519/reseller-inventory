import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Timestamp } from "firebase/firestore";
import { closeLoading, loading } from "../../../redux/actions/loading";
import {
  OtherExpenses,
  ShipingExpenses,
  initOtherExpenses,
  initShipingExpenses,
} from "../../../interfaces/SaleForm";
import { Link } from "react-router-dom";
import {
  deleteInvoiceDetails,
  expiredItems,
  getItemsFromInvoice,
  getStockItems,
} from "../../../redux/actions/items";
import {
  RootState,
  Item,
  Sale,
  InvoiceType,
  initSale,
  Expense,
} from "../../../interfaces/interfaces";
import swal from "sweetalert";

import Table from "./Table/Table";
import List from "../../Menu/List/List";
import Details from "../Invoices/Details/Details";
import AddSale from "./AddSale/AddSale";

import style from "./Inventory.module.css";
import menuSvg from "../../../assets/svg/menu.svg";
import closeSvg from "../../../assets/svg/close.svg";
import reload from "../../../assets/svg/reload.svg";

export default function Inventory() {
  const dispatch = useDispatch();
  const items = useSelector((state: RootState) => state.items.data);
  const invoiceDetail = useSelector((state: RootState) => state.items.details);
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
        .sort((a, b) => b.date?.toMillis() - a.date?.toMillis())
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
          const newExpenses: Expense[] = dataItemSelected.map(
            (item: Item): Expense => {
              return {
                id: item.id,
                date: Timestamp.fromDate(new Date()),
                price: item.cost,
                category: "Expired",
                description: "Expired item",
                invoiceId: item.invoiceId,
                productId: item.id,
              };
            }
          );
          dispatch<any>(loading());
          dispatch<any>(expiredItems(itemSelected, newExpenses))
            .then(() => {
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

  function handleSelected(item: Item, cost: number | null) {
    // If the item alreay selected, deselected them
    if (itemSelected.some((s) => s === item.id)) {
      setItemSelected(itemSelected.filter((s) => s !== item.id));
      setSales(sales.filter((s) => s.productId !== item.id));
      setOther(other.filter((o) => o.itemId !== item.id));
      setShiping(shipment.filter((s) => s.itemId !== item.id));
    } else if (cost !== null) {
      let saleId = findUniqueSaleId(item);
      setItemSelected([...itemSelected, item.id]);
      setOther([...other, { ...initOtherExpenses, itemId: item.id }]);
      setShiping([...shipment, { ...initShipingExpenses, itemId: item.id }]);
      setSales([
        ...sales,
        {
          ...initSale,
          id: saleId,
          cost: cost,
          productId: item.id,
          invoiceId: item.invoiceId,
        },
      ]);
    }
  }

  function findUniqueSaleId(item: Item): number {
    let salesLength = item.sales ? item.sales.length : 0;
    let saleId = Number(`${item.id.toString().substring(6)}${salesLength}`);

    while (item.sales?.some((sale) => sale.id === saleId)) {
      salesLength++;
      saleId = Number(`${item.id.toString().substring(6)}${salesLength}`);
    }

    return saleId;
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
          if (s.itemId === id) {
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
          if (s.itemId === id) {
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
          if (o.itemId === id) {
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
          if (o.itemId === id) {
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
    if (details) {
      dispatch<any>(deleteInvoiceDetails());
    } else if (invoiceId) {
      dispatch<any>(getItemsFromInvoice(invoiceId));
    }
  }

  return (
    <div className={style.background}>
      <div className={style.menu}>
        <List active={active} />
      </div>
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
        <Details
          handleClose={handleInvoiceDetail}
          invoiceType={InvoiceType.Purchase}
          invoiceId={invoiceDetail.invoice.id}
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
