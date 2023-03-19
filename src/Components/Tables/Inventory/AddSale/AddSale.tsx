import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Item, Sale, RootState, Expense } from "../../../../interfaces";
import swal from "sweetalert";
import {
  postSales,
  loading,
  closeLoading,
  postExpenses,
  updateReports,
} from "../../../../redux/actions";

import ItemRow from "./ItemRow/ItemRow";
import SaleData from "./SaleData/SaleData";

import styles from "./AddSale.module.css";
import "../../../../animation.css";

interface OtherExpenses {
  saleId: number;
  adsFee: {
    check: boolean;
    description: string;
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

interface Props {
  handleClose: () => void;
  itemSelected: number[];
  setItem: (items: number[]) => void;
  handleSelected: (id: number, cost: null) => void;
  sales: Sale[];
  setSales: (sales: Sale[]) => void;
  other: OtherExpenses[];
  shipment: ShipingExpenses[];
  handleExpense: (
    event: React.ChangeEvent<HTMLInputElement>,
    id: number | undefined
  ) => void;
}

export default function AddSale({
  handleClose,
  itemSelected,
  setItem,
  handleSelected,
  sales,
  setSales,
  other,
  shipment,
  handleExpense,
}: Props) {
  const dispatch = useDispatch();
  const items = useSelector((state: RootState) => state.items);
  const reports = useSelector((state: RootState) => state.reports);
  const [rows, setRows] = useState<Item[]>([]);
  const [rowSelected, setSelected] = useState<number>(itemSelected[0]);

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
      console.log("Sales", newData.sales);
      console.log("Expenses", newData.expenses);
      dispatch<any>(postSales(newData.sales))
        .then(() => {
          dispatch<any>(postExpenses(newData.expenses))
            .then(() => {
              dispatch<any>(
                updateReports(newData.expenses, reports, newData.sales)
              )
                .then(() => {
                  handleClose();
                  swal("Save", "Items sold successfully", "success");
                  setItem([]);
                })
                .catch((err: any) => {
                  swal(
                    "Error",
                    "Error to update reports, try again later",
                    "error"
                  );
                  console.log(err);
                });
            })
            .catch((err: any) => {
              swal(
                "Error",
                "Error to create expenses, try again later",
                "error"
              );
              console.log(err);
            });
        })
        .catch((err: any) => {
          swal("Error", "Error to sale items, try again later", "error");
          console.log(err);
        });
      dispatch(closeLoading());
    }
  }

  function handleRowSelect(id: number) {
    setSelected(id);
  }

  function handleSetPrice(id: number, price: string) {
    setSales(
      sales.map((s) => {
        if (s.id === id) {
          return {
            ...s,
            price: Number(price),
          };
        }
        return s;
      })
    );
  }

  function handleChange(
    event: React.ChangeEvent<HTMLInputElement>,
    saleId: number | undefined
  ) {
    const id = event.target.id;
    const name = event.target.name;

    console.log(id);
    console.log(saleId);

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
    return true;
  }

  function convertData(
    sales: Sale[],
    other: OtherExpenses[],
    shipment: ShipingExpenses[]
  ) {
    let error: number[] = [];
    let allExpenses: Expense[] = [];

    const newSales = sales.map((sale) => {
      const otherExpenses: OtherExpenses | undefined = other.find(
        (o) => o.saleId === sale.id
      );
      const shipmentExpenses: ShipingExpenses | undefined = shipment.find(
        (s) => s.saleId === sale.id
      );
      let expenses: Expense[] = [];

      if (otherExpenses && shipmentExpenses) {
        expenses.push({
          id: sale.id,
          date: sale.date,
          price: Number(shipmentExpenses.shipLabel),
          category: "Ship Label",
          description: "Ship label expense",
        });
        expenses.push({
          id: sale.id,
          date: sale.date,
          price: Number(shipmentExpenses.ebayFees),
          category: "Ebay Fees",
          description: "Ebay fees expense",
        });
        if (otherExpenses.adsFee.check) {
          expenses.push({
            id: sale.id,
            date: sale.date,
            price: Number(otherExpenses.adsFee.cost),
            category: "Ads Fee",
            description: "Ads fee expense",
          });
        }
        if (otherExpenses.other.check) {
          expenses.push({
            id: sale.id,
            date: sale.date,
            price: Number(otherExpenses.other.cost),
            category: "Other",
            description: otherExpenses.other.description,
          });
        }
        expenses.push({
          id: sale.id,
          date: sale.date,
          price: sale.cost,
          category: "Sale",
          description: "Sale cost expense",
        });

        expenses.forEach((ex) => allExpenses.push(ex));

        return {
          ...sale,
          expenses: expenses.map((ex) => {
            return {
              id: ex.id,
              cost: ex.price,
            };
          }),
        };
      } else {
        error.push(sale.id);
        console.log(`Error to post ${sale.id}`);
      }
    });

    return {
      sales: newSales,
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
          {rows.map((item) => (
            <ItemRow
              key={item.id}
              item={item}
              rowSelected={rowSelected}
              handleRowSelect={handleRowSelect}
              handleSelected={handleSelected}
              handleSetPrice={handleSetPrice}
            />
          ))}
        </div>
        <SaleData
          sale={sales.find((s: Sale) => s.productId === rowSelected)}
          handleChange={handleChange}
          shipment={shipment.find(
            (s: ShipingExpenses) => s.saleId === rowSelected
          )}
          other={other.find((o: OtherExpenses) => o.saleId === rowSelected)}
          handleExpense={handleExpense}
        />
        <hr></hr>
        <div>
          <span>Items: {rows.length}</span>
          {/*           <span>Total: {sale.total}</span> */}
        </div>
        <button className="btn btn-primary" type="submit">
          Add Solds
        </button>
      </form>
    </div>
  );
}
