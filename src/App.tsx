import { Routes, Route } from "react-router-dom";
import { RootState } from "./interfaces";
import { useDispatch } from "react-redux";
import { getItems, getInvoince } from "./redux/actions"

import Menu from "./Components/Menu/Menu";
import NewPurchase from "./Components/Tables/NewPurchase/NewPurchase";
import LookUpItems from "./Components/Tables/LookUpItems/LookUpItems";
import ItemSold from "./Components/Tables/ItemSold/ItemSold";
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
/*     dispatch<any>(getItems());
    dispatch<any>(getInvoince(format(new Date().toLocaleDateString()))); */
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
        <Route path="/newPurchase" element={<NewPurchase />} />
        <Route path="/addExpense" element={<AddExpense />} />
        <Route path="/itemSold" element={<ItemSold />} />
        <Route path="/lookUpItems" element={<LookUpItems />} />
        <Route path="/reports" element={<Reports />} />
      </Routes>
    </div>
  );
}

export default App;
