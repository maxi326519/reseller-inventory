import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Timestamp } from "firebase/firestore";
import { loading, closeLoading } from "../../../../redux/actions/loading";
import { postSales } from "../../../../redux/actions/sales";
import { updateReports } from "../../../../redux/actions/reports";
import {
  Errors,
  OtherExpenses,
  ShipingExpenses,
  initErrors,
} from "../../../../interfaces/SaleForm";
import {
  Item,
  Sale,
  RootState,
  Expense,
} from "../../../../interfaces/interfaces";
import swal from "sweetalert";

import ItemRow from "./ItemRow/ItemRow";
import SaleData from "./SaleData/SaleData";

import styles from "./AddSale.module.css";
import "../../../../animation.css";

interface Props {
  handleClose: () => void;
  itemSelected: number[];
  handleSelected: (item: Item, cost: null) => void;
  sales: Sale[];
  setSales: (sales: Sale[]) => void;
  other: OtherExpenses[];
  shipment: ShipingExpenses[];
  handleExpense: (
    event: React.ChangeEvent<HTMLInputElement>,
    id: number | undefined
  ) => void;
  resetData: () => void;
}

export default function AddSale({
  handleClose,
  itemSelected,
  handleSelected,
  sales,
  setSales,
  other,
  shipment,
  handleExpense,
  resetData,
}: Props) {
  const dispatch = useDispatch();
  const items = useSelector((state: RootState) => state.items.data);
  const reports = useSelector((state: RootState) => state.reports);
  const [rows, setRows] = useState<Item[]>([]);
  const [rowSelected, setSelected] = useState<{ item: number; sale: number }>({
    item: 0,
    sale: 0,
  });
  const [errors, setErrors] = useState<Array<Errors | null>>([]);

  useEffect(() => {
    const saleId = sales.find((sale) => sale.productId === itemSelected[0]);
    if (saleId) {
      setSelected({
        item: itemSelected[0],
        sale: saleId.id,
      });
    }
  }, [itemSelected]);

  /* Cargamos los items seleccionados */
  useEffect(() => {
    setRows(
      items.filter((item) =>
        itemSelected.some((selected) => item.id === selected)
      )
    );
  }, [itemSelected, items]);

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (handleValidations()) {
      dispatch(loading());
      const newData = convertData(sales, other, shipment);
      dispatch<any>(postSales(newData.sales, newData.expenses))
        .then(() => {
          dispatch(closeLoading());
          handleClose();
          swal("Save", "Items sold successfully", "success");
          resetData();
        })
        .catch((err: any) => {
          dispatch(closeLoading());
          swal("Error", "Error to sale items, try again later", "error");
          console.log(err);
        });
    }
  }

  function handleRowSelect(selected: { item: number; sale: number }) {
    setSelected({
      item: selected.item,
      sale: sales.find((sale) => sale.productId === selected.item)?.id || 0,
    });
  }

  function handleSetPrice(id: number, price: string) {
    setSales(
      sales.map((sale) => {
        if (sale.productId === id) {
          return {
            ...sale,
            price: price,
          };
        }
        return sale;
      })
    );
  }

  function handleChange(
    event: React.ChangeEvent<HTMLInputElement>,
    saleId: number | undefined
  ) {
    const id = event.target.id;
    const name = event.target.name;

    if (id.includes("shipment")) {
      setSales(
        sales.map((s) => {
          if (s.id === saleId) {
            return {
              ...s,
              shipment: {
                value:
                  name === "value" ? event.target.checked : s.shipment.value,
                amount:
                  name === "amount" ? event.target.value : s.shipment.amount,
              },
            };
          }
          return s;
        })
      );
    } else if (name === "date") {
      setSales(
        sales.map((s) => {
          const fecha = new Date(event.target.value);
          fecha.setHours(fecha.getHours() + fecha.getTimezoneOffset() / 60);
          if (s.id === saleId) {
            return {
              ...s,
              date: Timestamp.fromDate(fecha),
            };
          }
          return s;
        })
      );
    } else {
      setSales(
        sales.map((s) => {
          if (s.id === saleId) {
            return {
              ...s,
              [name]: event.target.value,
            };
          }
          return s;
        })
      );
    }
  }

  function handleValidations() {
    let error = 0;

    const saleErrors = sales.map((sale, i) => {
      let empty = true;
      let validation: Errors = {
        price: null,
        shipment: null,
        expenses: {
          shipLabel: null,
          ebayFees: null,
          adsFee: null,
          other: {
            description: null,
            cost: null,
          },
        },
      };

      /* PRICE */
      if (sale.price === "") {
        validation.price = "Add price";
        empty = false;
      }

      /* SHIPMENT */
      if (sale.shipment.value === true && sale.shipment.amount === "") {
        validation.shipment = "Add price";
        empty = false;
      }

      /* SHIP lABEL */
      if (shipment[i].shipLabel === "") {
        validation.expenses.shipLabel = "Add ship cost";
        empty = false;
      }

      /* EBAY FEES */
      if (shipment[i].ebayFees === "") {
        validation.expenses.ebayFees = "Add ebay cost";
        empty = false;
      }

      /* ADS FEE */
      if (other[i].adsFee.check === true && other[i].adsFee.cost === "") {
        validation.expenses.adsFee = "Add ads cost";
        empty = false;
      }

      /* OTHER DESCRIPTION */
      if (other[i].other.check === true && other[i].other.description === "") {
        validation.expenses.other.description = "Add description";
        empty = false;
      }

      /* OTHER COST */
      if (other[i].other.check === true && other[i].other.cost === "") {
        validation.expenses.other.cost = "Add cost";
        empty = false;
      }
      if (!empty) {
        error++;
      }
      return empty ? null : validation;
    });
    setErrors(saleErrors);
    return error === 0 ? true : false;
  }

  function convertData(
    sales: Sale[],
    other: OtherExpenses[],
    shipment: ShipingExpenses[]
  ) {
    let error: number[] = [];
    let allExpenses: Expense[] = [];

    sales.forEach((sale) => {
      const otherExpenses: OtherExpenses | undefined = other.find(
        (o) => o.itemId === sale.productId
      );
      const shipmentExpenses: ShipingExpenses | undefined = shipment.find(
        (s) => s.itemId === sale.productId
      );
      let expenses: Expense[] = [];

      if (otherExpenses && shipmentExpenses) {
        expenses.push({
          id: sale.id,
          date: sale.date,
          price: Number(shipmentExpenses.shipLabel),
          category: "Ship Label",
          description: "Ship label expense",
          invoiceId: sale.invoiceId,
          productId: sale.productId,
        });
        expenses.push({
          id: sale.id,
          date: sale.date,
          price: Number(shipmentExpenses.ebayFees),
          category: "Ebay Fees",
          description: "Ebay fees expense",
          invoiceId: sale.invoiceId,
          productId: sale.productId,
        });
        if (otherExpenses.adsFee.check) {
          expenses.push({
            id: sale.id,
            date: sale.date,
            price: Number(otherExpenses.adsFee.cost),
            category: "Ads Fee",
            description: "Ads fee expense",
            invoiceId: sale.invoiceId,
            productId: sale.productId,
          });
        }
        if (otherExpenses.other.check) {
          expenses.push({
            id: sale.id,
            date: sale.date,
            price: Number(otherExpenses.other.cost),
            category: "Other",
            description: otherExpenses.other.description,
            invoiceId: sale.invoiceId,
            productId: sale.productId,
          });
        }
        expenses.push({
          id: sale.id,
          date: sale.date,
          price: sale.cost,
          category: "COGS",
          description: "COGS expense",
          invoiceId: sale.invoiceId,
          productId: sale.productId,
        });

        expenses.forEach((ex) => allExpenses.push(ex));
      } else {
        error.push(sale.id);
      }
    });

    return {
      sales,
      expenses: allExpenses,
    };
  }

  return (
    <div className={styles.background}>
      <form className={`toTop ${styles.container}`} onSubmit={handleSubmit}>
        <div className={styles.close}>
          <h4>Items</h4>
          <button
            className="btn btn-danger"
            type="button"
            onClick={handleClose}
          >
            x
          </button>
        </div>
        <div className={styles.list}>
          {rows.map((item, i) => (
            <ItemRow
              key={item.id}
              item={item}
              error={errors[i]}
              rowSelected={rowSelected}
              handleRowSelect={handleRowSelect}
              handleSelected={handleSelected}
              handleSetPrice={handleSetPrice}
            />
          ))}
        </div>
        <SaleData
          sale={sales.find((s: Sale) => s.id === rowSelected.sale)}
          errors={
            itemSelected.findIndex((id) => id === rowSelected.item) >= 0
              ? errors[itemSelected.findIndex((id) => id === rowSelected.item)]
              : initErrors
          }
          handleChange={handleChange}
          shipment={shipment.find(
            (s: ShipingExpenses) => s.itemId === rowSelected.item
          )}
          other={other.find(
            (o: OtherExpenses) => o.itemId === rowSelected.item
          )}
          handleExpense={handleExpense}
        />
        <hr></hr>
        <div>
          <span>Items: {rows.length}</span>
        </div>
        <button className="btn btn-primary" type="submit">
          Add Solds
        </button>
      </form>
    </div>
  );
}
