import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import swal from "sweetalert";
import { Item, RootState } from "../../../../interfaces";
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

export default function AddSale({
  handleClose,
  itemSelected,
  handleSelected,
}: Props) {
  const items = useSelector((state: RootState) => state.items);
  const [rows, setRows] = useState<Item[]>([]);
  const [shipment, setShipment] = useState<boolean>(false);
  const [other, setOther] = useState<boolean>(false);
  const dispatch = useDispatch();

  useEffect(() => {
    setRows(
      items.filter((item) =>
        itemSelected.some((selected) => item.id === selected)
      )
    );
  }, [itemSelected]);

  function handleChange(event: React.ChangeEvent<HTMLInputElement>) {}

  function handleShipment() {
    setShipment(!shipment);
  }

  function handleOther() {
    setOther(!other);
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
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
        <div className="form-floating">
          <input className="form-control" id="date" type="date" />
          <label className="form-label" htmlFor="date">
            Date:
          </label>
        </div>
        <div>
          <input id="envio" type="checkbox" />
          <label htmlFor="envio">Envio</label>
          <input
            className="form-control"
            placeholder="$ 0.00"
            type="number"
            checked={shipment}
            disabled={!shipment}
            onChange={handleShipment}
          />
        </div>
        <div>
          <div>
            <input id="other" type="checkbox" />
            <label className="form-label" htmlFor="other">
              Other expenses
            </label>
          </div>
          <div>
            <input
              className="form-control"
              placeholder="Description"
              type="text"
              checked={other}
              disabled={!other}
              onChange={handleOther}
            />
            <input
              className="form-control"
              placeholder="$ 0.00"
              type="number"
              checked={other}
              disabled={!other}
              onChange={handleOther}
            />
          </div>
        </div>
        <div>
          <span>Items:</span>
          <span>Total:</span>
        </div>
        <button className="btn btn-primary" type="submit">
          Add Solds
        </button>
      </form>
    </div>
  );
}
