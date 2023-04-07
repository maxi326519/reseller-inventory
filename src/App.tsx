import { useEffect } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import {
  loading,
  closeLoading,
  getItems,
  getInvoices,
  getUserData,
  getReports,
  getExpenses,
  getSales,
  getItemsByDate,
} from "./redux/actions";
import { RootState } from "./interfaces";
import { getAuth } from "firebase/auth";

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
import swal from "sweetalert";

function App() {
  const redirect = useNavigate();
  const dispatch = useDispatch();
  const setLoading = useSelector((state: RootState) => state.loading);

  useEffect(() => {
    dispatch(loading());
    setTimeout(() => {
      const auth = getAuth();
      if (auth.currentUser) {
        const year = new Date().getFullYear();
        const month = new Date().getMonth() + 1;
        Promise.all([
          dispatch<any>(getUserData()),
          dispatch<any>(getItems()),
          dispatch<any>(getItemsByDate(year, month)),
          dispatch<any>(getExpenses(year, month)),
          dispatch<any>(getSales(year, month)),
          dispatch<any>(getInvoices(year, null)),
          dispatch<any>(getReports()),
        ])
          .then(() => {
            dispatch(closeLoading());
          })
          .catch((err: any) => {
            swal("Error", "Error to load info, try again later", "error");
            console.log(err);
          });
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
