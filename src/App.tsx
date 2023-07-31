import { useEffect } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { getUserData } from "./redux/actions/user";
import { loading, closeLoading } from "./redux/actions/loading";
import { getExpired, getStockItems } from "./redux/actions/items";
import { getReports } from "./redux/actions/reports";
import { getInvoices } from "./redux/actions/invoices";
import { getSales } from "./redux/actions/sales";
import { RootState } from "./interfaces/interfaces";
import { getAuth } from "firebase/auth";
import swal from "sweetalert";

import Login from "./Components/Login/Login";
import Menu from "./Components/Menu/Menu";
import Inventory from "./Components/Tables/Inventory/Inventory";
import Invoices from "./Components/Tables/Invoices/Invoices";
import NewPurchase from "./Components/Tables/NewPurchase/NewPurchase";
import AddExpense from "./Components/Tables/AddBusinessExpense/AddBusinessExpense";
import Reports from "./Components/Tables/Reports/Reports";
import Loading from "./Components/Loading/Loading";

import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";

function App() {
  const redirect = useNavigate();
  const dispatch = useDispatch();
  const setLoading = useSelector((state: RootState) => state.loading);

  useEffect(() => {
    dispatch(loading());
    setTimeout(() => {
      const auth = getAuth();
      if (auth.currentUser) {
        console.log(auth.currentUser);

        const year = new Date().getFullYear();
        Promise.all([
          dispatch<any>(getReports()),
          dispatch<any>(getStockItems()),
          /*           
          dispatch<any>(getUserData()),
          dispatch<any>(getInvoices(year, null)),
          dispatch<any>(getSales(year.toString(), null)),
          dispatch<any>(getExpired(year, null)),
          */
        ])
          .then(() => {
            redirect("/");
            dispatch(closeLoading());
          })
          .catch((err: any) => {
            dispatch(closeLoading());
            swal("Error", "Error to load info, try again later", "error");
            console.log(err);
          });
        dispatch(closeLoading());
      } else {
        redirect("/login");
        dispatch(closeLoading());
      }
    }, 1000);
  }, []);

  return (
    <div className="App">
      {setLoading ? <Loading /> : null}
      <Routes>
        <Route path="/" element={<Menu />} />
        <Route path="/login" element={<Login />} />
        <Route path="/inventory" element={<Inventory />} />
        <Route path="/invoices" element={<Invoices />} />
        <Route path="/newPurchase" element={<NewPurchase />} />
        <Route path="/addExpense" element={<AddExpense />} />
        <Route path="/reports" element={<Reports />} />
      </Routes>
    </div>
  );
}

export default App;
