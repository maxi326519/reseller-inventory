import { useEffect, useState } from "react";
import { Item } from "../../../../../interfaces";

import styles from "./PurchaseData.module.css";
import { useDispatch } from "react-redux";
import { deleteItem, updateItem } from "../../../../../redux/actions/items";
import swal from "sweetalert";

interface Props {
  item: Item;
}

export default function PurchaseData({ item }: Props) {
  const dispatch = useDispatch();
  const [disabled, serDisabled] = useState<boolean>(true);
  const [data, setData] = useState<Item>(item);

  useEffect(() => {
    setData(item);
  }, [item]);

  function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    const name = event.target.name;
    const value = event.target.value;

    console.log(name, value);

    setData({ ...data, [name]: value });
  }

  function handleActiveEdit() {
    serDisabled(!disabled);
  }

  function handleSubmitEdit() {
    dispatch<any>(updateItem(data))
      .then(() => {
        serDisabled(false);
      })
      .catch((error: any) => {
        console.log(error);
        swal("Error", "Error editing the item, try again later", "error");
      });
  }

  function handleDelete() {
    swal({
      text: "Are you sure you want to delete this item? This process is irreversible.",
      icon: "warning",
      buttons: {
        Accept: true,
        Cancel: true,
      },
    }).then((response) => {
      if (response === "Accept") {
        dispatch<any>(deleteItem(data))
          .then(() => {
            serDisabled(false);
          })
          .catch((error: any) => {
            console.log(error);
            swal("Error", "Error deleting the item, try again later", "error");
          });
      }
    });
  }

  return (
    <div key={item.id} className={styles.inputs}>
      <div className="mb-3 form-floating">
        <input id="id" className="form-control" value={item.id} disabled />
        <label htmlFor="id" className="form-label">
          Id:
        </label>
      </div>
      <div>
        <div className={styles.inputContainer}>
          <div className="mb-3 form-floating">
            <input id="state" className="form-control" value={data.state} />
            <label htmlFor="state" className="form-label">
              State:
            </label>
          </div>
          <div className="mb-3 form-floating">
            <input
              id="cost"
              name="cost"
              className="form-control"
              value={data.cost}
              onChange={handleChange}
              disabled={disabled}
            />
            <label htmlFor="cost" className="form-label">
              Cost:
            </label>
          </div>
        </div>
        <div className="mb-3 form-floating">
          <input
            id="description"
            name="description"
            className="form-control"
            value={data.description}
            onChange={handleChange}
            disabled={disabled}
          />
          <label htmlFor="description" className="form-label">
            Description:
          </label>
        </div>
        {disabled ? (
          <div className={styles.bntContainer}>
            <button
              className="btn btn-outline-success"
              type="button"
              onClick={handleActiveEdit}
            >
              Edit
            </button>
            <button
              className="btn btn-outline-danger"
              type="button"
              onClick={handleDelete}
            >
              Delete
            </button>
          </div>
        ) : (
          <div className={styles.bntContainer}>
            <button
              className="btn btn-outline-success"
              type="button"
              onClick={handleSubmitEdit}
            >
              Save
            </button>
            <button
              className="btn btn-outline-danger"
              type="button"
              onClick={handleActiveEdit}
            >
              Cancel
            </button>
          </div>
        )}
        <hr></hr>
      </div>
    </div>
  );
}
