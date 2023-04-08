import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Timestamp } from "firebase/firestore";
import { Item, Sale, RootState, Expense } from "../../../../interfaces";
import { loading, closeLoading } from "../../../../redux/actions/loading";
import { postSales } from "../../../../redux/actions/sales"
import { postExpenses } from "../../../../redux/actions/expenses"
import { updateReports } from "../../../../redux/actions/reports"
import swal from "sweetalert";

import ItemRow from "./ItemRow/ItemRow";
import SaleData from "./SaleData/SaleData";

import styles from "./AddSale.module.css";
import "../../../../animation.css";

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

interface Errors {
  price: null | string;
  shipment: null | string;
  expenses: {
    shipLabel: null | string;
    ebayFees: null | string;
    adsFee: null | string;
    other: {
      description: null | string;
      cost: null | string;
    };
  };
}

const initialErrors: Errors = {
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
  const [errors, setErrors] = useState<Array<Errors | null>>([]);

  useEffect(() => {
    setSelected(itemSelected[0]);
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
      dispatch<any>(postSales(newData.sales))
        .then(() => {
          dispatch<any>(postExpenses(newData.expenses))
            .then(() => {
              dispatch<any>(
                updateReports(newData.expenses, reports, newData.sales)
              )
                .then(() => {
                  dispatch(closeLoading());
                  handleClose();
                  swal("Save", "Items sold successfully", "success");
                  setItem([]);
                })
                .catch((err: any) => {
                  dispatch(closeLoading());
                  swal(
                    "Error",
                    "Error to update reports, try again later",
                    "error"
                  );
                  console.log(err);
                });
            })
            .catch((err: any) => {
              dispatch(closeLoading());
              swal(
                "Error",
                "Error to create expenses, try again later",
                "error"
              );
              console.log(err);
            });
        })
        .catch((err: any) => {
          dispatch(closeLoading());
          swal("Error", "Error to sale items, try again later", "error");
          console.log(err);
        });
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
            price: price,
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
          if (s.id === saleId) {
            return {
              ...s,
              date: Timestamp.fromDate(new Date(event.target.value)),
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
          invoiceId: 0,
        });
        expenses.push({
          id: sale.id,
          date: sale.date,
          price: Number(shipmentExpenses.ebayFees),
          category: "Ebay Fees",
          description: "Ebay fees expense",
          invoiceId: 0,
        });
        if (otherExpenses.adsFee.check) {
          expenses.push({
            id: sale.id,
            date: sale.date,
            price: Number(otherExpenses.adsFee.cost),
            category: "Ads Fee",
            description: "Ads fee expense",
            invoiceId: 0,
          });
        }
        if (otherExpenses.other.check) {
          expenses.push({
            id: sale.id,
            date: sale.date,
            price: Number(otherExpenses.other.cost),
            category: "Other",
            description: otherExpenses.other.description,
            invoiceId: 0,
          });
        }
        expenses.push({
          id: sale.id,
          date: sale.date,
          price: sale.cost,
          category: "Sale",
          description: "Sale cost expense",
          invoiceId: 0,
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
          sale={sales.find((s: Sale) => s.productId === rowSelected)}
          errors={
            itemSelected.findIndex((id) => id === rowSelected) >= 0
              ? errors[itemSelected.findIndex((id) => id === rowSelected)]
              : initialErrors
          }
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
