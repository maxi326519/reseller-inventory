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

interface Props {
  handleClose: () => void;
  itemSelected: number[];
  handleSelected: (id: number) => void;
  sales: Sale[];
  setSales: (sales: Sale[]) => void;
}

export default function AddSale({
  handleClose,
  itemSelected,
  handleSelected,
  sales,
  setSales,
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
    let newData = {};

    console.log(id);
    console.log(saleId);

    if (id.includes("shipment")) {
      setSales(
        sales.map((s) => {
          if (s.id === saleId) {
            console.log("Se encontro");
            console.log("Name", name);
            console.log(
              "value",
              name === "value" ? event.target.checked : s.shipment.value
            );
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
      newData = { [event.target.name]: event.target.value };
    }
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    console.log(sales);
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
              item={item}
              rowSelected={rowSelected}
              handleRowSelect={handleRowSelect}
              handleSelected={handleSelected}
              handleSetPrice={handleSetPrice}
            />
          ))}
        </div>
        <SaleData
          sale={sales.find((s: Sale) => s.id === rowSelected)}
          handleChange={handleChange}
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
