import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../../../../interfaces/interfaces";
import { postCategories } from "../../../../redux/actions/user";
import { loading, closeLoading } from "../../../../redux/actions/loading";
import swal from "sweetalert";

import styles from "./Categories.module.css";

interface Props {
  handleClose: () => void;
}

export default function Categories({ handleClose }: Props) {
  const dispatch = useDispatch();
  const [category, setCategory] = useState<string>("");
  const [categoriesList, setCategories] = useState<string[]>([]);
  const categories: string[] = useSelector(
    (state: RootState) => state.user.categories
  );

  useEffect(() => {
    setCategories(categories);
  }, []);

  function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    setCategory(event.target.value);
  }

  function handleAddCategory() {
    if (category !== "" && !categoriesList.some((c) => c === category)) {
      setCategories([...categoriesList, category]);
      setCategory("");
    }
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
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
      .catch((e: any) => {
        dispatch(closeLoading());
        swal(
          "Error",
          "Ocurrio un error al actualizar las caterogrias",
          "error"
        );
        console.log(e);
      });
  }

  function handleRemove(category: string) {
    setCategories(categoriesList.filter((c) => c !== category));
  }

  return (
    <div className={styles.background}>
      <form className={`toTop ${styles.container}`} onSubmit={handleSubmit}>
        <div className={styles.close}>
          <h4>Change location</h4>
          <button
            className="btn btn-danger"
            type="button"
            onClick={handleClose}
          >
            x
          </button>
        </div>
        <div className={styles.categoriesList}>
          {categoriesList.length > 0 ? (
            categoriesList.map((category, index) => (
              <div key={index} className={styles.row}>
                <span>{category}</span>
                <button
                  className="btn btn-danger"
                  type="button"
                  onClick={() => handleRemove(category)}
                  disabled={category === "General" || category === "Shipping"}
                >
                  -
                </button>
              </div>
            ))
          ) : (
            <span className={styles.empty}>Empty</span>
          )}
        </div>
        <div>
          <div className={styles.formContainer}>
            <label htmlFor="add">.</label>
            <input
              className="form-control"
              id="add"
              type="text"
              value={category}
              onChange={handleChange}
            />
            <button
              className="btn btn-success"
              type="button"
              onClick={handleAddCategory}
            >
              +
            </button>
          </div>
          <button className="btn btn-primary" type="submit">
            Guardar
          </button>
        </div>
      </form>
    </div>
  );
}
