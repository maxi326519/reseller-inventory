import { getExpired, getStockItems } from "../../redux/actions/items";
import { loading, closeLoading } from "../../redux/actions/loading";
import { useDispatch } from "react-redux";
import { getUserData } from "../../redux/actions/user";
import { getInvoices } from "../../redux/actions/invoices";
import { useNavigate } from "react-router-dom";
import { getReports } from "../../redux/actions/reports";
import { getSales } from "../../redux/actions/sales";
import { useState } from "react";
import { logIn } from "../../redux/actions/login";
import swal from "sweetalert";

import "./Login.css";

interface Error {
  email: string | null;
  password: string | null;
}

const initialError: Error = {
  email: null,
  password: null,
};

export default function Signin() {
  const redirect = useNavigate();
  const dispatch = useDispatch();
  const [error, setError] = useState(initialError);
  const [user, setUser] = useState({
    email: "",
    password: "",
  });

  function handleChange(e: React.ChangeEvent<HTMLInputElement>): void {
    const name: string = e.target.name;
    const value: string = e.target.value;
    setUser({ ...user, [name]: value });
    handleValidations(name);
  }

  function handleValidations(name: string) {
    if (name === "email") {
      setError({ ...error, email: null });
    } else if (name === "password") {
      setError({ ...error, password: null });
    }
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>): void {
    event.preventDefault();

    if (user.email === "" || user.password === "") {
      let err: Error = {
        email: null,
        password: null,
      };
      if (user.email === "") err.email = "Debes ingresar un email";
      if (user.password === "") err.password = "Debes ingresar una contraseña";
      setError(err);
    } else {
      dispatch(loading());
      dispatch<any>(logIn(user))
        .then(() => {
          const year = new Date().getFullYear();
          Promise.all([
            dispatch<any>(getUserData()),
            dispatch<any>(getReports()),
            dispatch<any>(getInvoices(year, null)),
            dispatch<any>(getStockItems()),
            dispatch<any>(getSales(year.toString(), null)),
            dispatch<any>(getExpired(year, null)),
          ])
            .then(() => {
              redirect("/");
              dispatch(closeLoading());
            })
            .catch((err: any) => {
              swal("Error", "Error to load info, try again later", "error");
              console.log(err);
            });
        })
        .catch((e: any) => {
          dispatch(closeLoading());
          if (e.message?.includes("invalid-email")) {
            setError({ ...error, email: "El email es invalido" });
          } else if (e.message?.includes("user-not-found")) {
            setError({ ...error, email: "Usuario incorrecto" });
          } else if (e.message?.includes("wrong-password")) {
            setError({ ...error, password: "Contraseña incorrecta" });
          }
          console.log(e);
        });
    }
  }

  return (
    <div className="sesion">
      <form onSubmit={handleSubmit}>
        <h2>Iniciar sesion</h2>
        {/* EMAIL */}
        <div className="form-floating mb-3">
          <input
            type="email"
            name="email"
            value={user.email}
            className={`form-control ${!error.email ? "" : "is-invalid"}`}
            id={error.email ? "floatingInputInvalid" : "user"}
            placeholder="name"
            onChange={handleChange}
            /*             required */
          />
          <label htmlFor="floatingInput">Email</label>
          {!error.email ? null : <small>{error.email}</small>}
        </div>

        {/* CONTRASEÑA */}
        <div className="form-floating mb-3">
          <input
            type="password"
            name="password"
            value={user.password}
            className={`form-control ${!error.password ? "" : "is-invalid"}`}
            id={error.password ? "floatingInputInvalid" : "pass"}
            placeholder="Contraseña"
            onChange={handleChange}
            /*             required */
          />
          <label htmlFor="floatingInput">Contraseña</label>
          {!error.password ? null : <small>{error.password}</small>}
        </div>

        <button className="btn btn-primary" type="submit">
          Iniciar sesion
        </button>
      </form>
    </div>
  );
}
