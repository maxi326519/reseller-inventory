import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Item, Sale, Sold, Shipment, RootState } from "../../../../interfaces";
import swal from "sweetalert";
import {
  postCategories,
  loading,
  closeLoading,
} from "../../../../redux/actions";

import styles from "./AddSale.module.css";

interface Props {
  handleClose: () => void;
  itemSelected: number[];
  handleSelected: (id: number) => void;
}

interface Check {
  feesEbay: boolean;
  other: boolean;
}

const initialSale: Sale = {
  date: new Date().toLocaleDateString(),
  sold: [],
  total: 0,
  shipment: {
    value: false,
    amount: 0,
  },
  expenses: [],
};

export default function AddSale({
  handleClose,
  itemSelected,
  handleSelected,
}: Props) {
  const dispatch = useDispatch();
  const items = useSelector((state: RootState) => state.items);
  const [rows, setRows] = useState<Item[]>([]);
  const [check, setCheck] = useState<Check>({
    feesEbay: false,
    other: false,
  });

  const [sale, setSale] = useState<Sale>(initialSale);
  const [solds, setSolds] = useState<Sold[]>([]);
  const [other, setOther] = useState({
    description: "",
    amount: 0,
    description2: "",
    amount2: 0,
  });

  /* Cargamos los items seleccionados */
  useEffect(() => {
    setRows(
      items.filter((item) =>
        itemSelected.some((selected) => item.id === selected)
      )
    );
  }, [itemSelected, items]);

  /* Seteamos las nuevas ventas con los items seleccioandos */
  useEffect(() => {
    setSolds(
      rows.map((i) => {
        return {
          itemID: i.id,
          price: 0,
        };
      })
    );
  }, [rows]);

  /* Calculamos el nuevo total */
  useEffect(() => {
    let total: number = 0;

    solds.forEach((s) => {
      total += s.price;
    });

    if (total !== sale.total) {
      setSale({
        ...sale,
        total: total,
      });
    }
  }, [solds, sale]);

  function handleCheck(event: React.ChangeEvent<HTMLInputElement>) {
    const name: string = event.target.name;
    if (name === "feesEbay")
      setCheck({ ...check, feesEbay: !check["feesEbay"] });
    if (name === "other") setCheck({ ...check, other: !check["other"] });
  }

  function handleShipment(event: React.ChangeEvent<HTMLInputElement>) {
    const name = event.target.name;
    const value = event.target.value;
    if (name === "value") {
      setSale({
        ...sale,
        shipment: {
          ...sale.shipment,
          [name]: !sale.shipment.value,
        },
      });
    } else {
      setSale({
        ...sale,
        shipment: {
          ...sale.shipment,
          [name]: value,
        },
      });
    }
  }

  function handleOther(event: React.ChangeEvent<HTMLInputElement>) {
    setOther({ ...other, [event.target.name]: event.target.value });
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const newSale = {
      ...sale,
      sold: solds,
      expenses: [
        { description: other.description, amount: other.amount },
        { description: other.description2, amount: other.amount2 },
      ],
    };

    console.log(newSale);

    /*
      dispatch(loading());
      dispatch<any>(postCategories(categoriesList))
      .then(() => {
        handleClose();
        dispatch(closeLoading());
        swal(
          "Actualizado",
          "Se actualizaron las categorias con exito",
          "success"
        );
      })
      .catch(() => {
        dispatch(closeLoading());
        swal(
          "Error",
          "Ocurrio un error al actualizar las caterogrias",
          "error"
        );
      }); */
  }

  return (
    <div className={styles.background}>
      <form className={styles.container} onSubmit={handleSubmit}>
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
          {rows.length > 0 ? (
            rows.map((item, index) => (
              <div key={index} className={styles.row}>
                <span>{item.id}</span>
                <span>{item.description}</span>
                <input placeholder="Price" />
                <button
                  className="btn btn-danger"
                  type="button"
                  onClick={() => handleSelected(item.id)}
                >
                  -
                </button>
              </div>
            ))
          ) : (
            <span className={styles.empty}>Empty</span>
          )}
        </div>
        <div className="mb-3 form-floating">
          <input className="form-control" id="date" type="date" />
          <label className="form-label" htmlFor="date">
            Date:
          </label>
        </div>
        <div className={styles.shipment}>
          <div>
            <input
              id="shipment"
              name="shipment"
              checked={sale.shipment.value}
              type="checkbox"
              onChange={handleCheck}
            />
            <label htmlFor="shipment">Envio</label>
            <input
              className="form-control"
              placeholder="$ 0.00"
              type="number"
              name="value"
              disabled={!sale.shipment.value}
              onChange={handleShipment}
            />
          </div>
          <div>
            <input
              id="feesEbay"
              name="feesEbay"
              checked={check.feesEbay}
              type="checkbox"
              onChange={handleCheck}
            />
            <label htmlFor="feesEbay">FeesEbay</label>
            <input
              className="form-control"
              placeholder="$ 0.00"
              type="number"
              disabled={!check.feesEbay}
              onChange={handleShipment}
            />
          </div>
        </div>
        <div className={styles.expenses}>
          <div>
            <input
              id="other"
              name="other"
              checked={check.other}
              type="checkbox"
              onChange={handleCheck}
            />
            <label className="form-label" htmlFor="other">
              Other expenses
            </label>
          </div>
          <div className={styles.inputs}>
            <div>
              <input
                className="form-control"
                placeholder="Description"
                type="text"
                name="description"
                value={other.description}
                disabled={!check.other}
                onChange={handleOther}
              />
              <input
                className="form-control"
                placeholder="$ 0.00"
                type="number"
                name="amount"
                value={other.amount}
                disabled={!check.other}
                onChange={handleOther}
              />
            </div>
            <div>
              <input
                className="form-control"
                placeholder="Description"
                type="text"
                name="description2"
                value={other.description2}
                disabled={!check.other}
                onChange={handleOther}
              />
              <input
                className="form-control"
                placeholder="$ 0.00"
                type="number"
                name="amount2"
                value={other.amount2}
                disabled={!check.other}
                onChange={handleOther}
              />
            </div>
          </div>
        </div>
        <hr></hr>
        <div>
          <span>Items: {rows.length}</span>
          <span>Total: {sale.total}</span>
        </div>
        <button className="btn btn-primary" type="submit">
          Add Solds
        </button>
      </form>
    </div>
  );
}
