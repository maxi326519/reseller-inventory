import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Item, Sale, RootState } from "../../../../interfaces";
import swal from "sweetalert";
import {
  postSale,
  sellItems,
  loading,
  closeLoading,
} from "../../../../redux/actions";

import ItemRow from "./ItemRow/ItemRow";
import SaleData from "./SaleData/SaleData";

import styles from "./AddSale.module.css";
import "../../../../animation.css";

interface OtherExpenses {
  saleId: number;
  other1: {
    check: boolean,
    description: string;
    cost: number | string;
  };
  other2: {
    check: boolean,
    description: string;
    cost: number | string;
  };
}
interface ShipingExpenses {
  saleId: number;
  shipment: number | string;
  ebayFees: number | string;
}

interface Props {
  handleClose: () => void;
  itemSelected: number[];
  handleSelected: (id: number) => void;
  sales: Sale[];
  setSales: (sales: Sale[]) => void;
  other: OtherExpenses[];
  shipment: ShipingExpenses[];
  handleExpense: (
    event: React.ChangeEvent<HTMLInputElement>,
    id: number | undefined,
  ) => void;
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
}: Props) {
  const dispatch = useDispatch();
  const items = useSelector((state: RootState) => state.items);
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
                  name === "amount"
                    ? Number(event.target.value)
                    : s.shipment.amount,
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

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    console.log("Items", itemSelected);
    console.log("Sales", sales);
    console.log("Other", other);
    console.log("shipment", shipment);

    if(handleValidations()){
      dispatch(loading());
/*       const sales = convertData(sales, other, shipment); */
    }
  }

  function handleValidations(){
    return true
  }

/*   function convertData(sales, other, shipment){

  }
 */
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
