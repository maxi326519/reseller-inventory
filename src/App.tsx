import React from 'react';
import { Routes, Route } from "react-router-dom";

import Menu from "./Components/Menu/Menu";
import NewPurchase from "./Components/Tables/NewPurchase/NewPurchase";
import LookUpItems from "./Components/Tables/LookUpItems/LookUpItems";
import ItemSold from "./Components/Tables/ItemSold/ItemSold";
import AddExpense from "./Components/Tables/AddBusinessExpense/AddBusinessExpense";
import Reports from "./Components/Tables/Reports/Reports";

import "bootstrap/dist/css/bootstrap.min.css";
import './App.css';

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<Menu/>} />
        <Route path="/newPurchase" element={<NewPurchase/>} />
        <Route path="/addExpense" element={<AddExpense/>} />
        <Route path="/itemSold" element={<ItemSold/>} />
        <Route path="/lookUpItems" element={<LookUpItems/>} />
        <Route path="/reports" element={<Reports/>} />
      </Routes>
    </div>
  );
}

export default App;