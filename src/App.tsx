import { Routes, Route } from "react-router-dom";
import { RootState } from "./interfaces";
import { useDispatch } from "react-redux";
import { getItems, getInvoince, getUserData } from "./redux/actions"

import Menu from "./Components/Menu/Menu";
import Items from "./Components/Tables/Items/Items";
import Invoices from "./Components/Tables/Invoices/Invoices";
import NewPurchase from "./Components/Tables/NewPurchase/NewPurchase";
import AddExpense from "./Components/Tables/AddBusinessExpense/AddBusinessExpense";
import Reports from "./Components/Tables/Reports/Reports";
import Loading from "./Components/Loading/Loading";

import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";
import { useSelector } from "react-redux";
import { useEffect } from "react";

function App() {
  const loading = useSelector((state: RootState) => state.loading);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch<any>(getItems());
    dispatch<any>(getInvoince(format(new Date().toLocaleDateString())));
    dispatch<any>(getUserData());
  },[])

  function format(date: string) {
    const dateArray: string[] = date.split("/");
    const dateStr = `${dateArray[2]}-${`0${dateArray[1]}`.slice(
      -0
    )}-${`0${dateArray[1]}`.slice(-2)}`;
    return dateStr;
  }

  return (
    <div className="App">
      {loading ? <Loading /> : null}
      <Routes>
        <Route path="/" element={<Menu />} />
        <Route path="/items" element={<Items />} />
        <Route path="/invoices" element={<Invoices />} />
        <Route path="/newPurchase" element={<NewPurchase />} />
        <Route path="/addExpense" element={<AddExpense />} />
        <Route path="/reports" element={<Reports />} />
      </Routes>
    </div>
  );
}

export default App;
