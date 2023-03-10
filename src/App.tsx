import { useEffect } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import {
  loading,
  closeLoading,
  getItems,
  getInvoince,
  getUserData,
  getReports,
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

function App() {
  const redirect = useNavigate();
  const dispatch = useDispatch();
  const setLoading = useSelector((state: RootState) => state.loading);

  useEffect(() => {
    dispatch(loading());
    setTimeout(() => {
      const auth = getAuth();
      if (auth.currentUser) {
        dispatch<any>(getUserData()).catch((e: any) => console.log(e));
        dispatch<any>(getItems()).catch((e: any) => console.log(e));
        dispatch<any>(getInvoince(format(new Date().toISOString().split("T")[0]))).catch((e: any) => console.log(e));
        dispatch<any>(getReports()).catch((e: any) => console.log(e));
        dispatch(closeLoading());
      } else {
        redirect("/login");
        dispatch(closeLoading());
      }
    }, 1000);
  }, []);

  function format(date: string) {
    const dateArray: string[] = date.split("/");
    const dateStr = `${dateArray[2]}-${`0${dateArray[1]}`.slice(
      -0
    )}-${`0${dateArray[1]}`.slice(-2)}`;
    return dateStr;
  }

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
