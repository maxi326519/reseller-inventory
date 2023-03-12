import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../../../interfaces";

import Row from "./Row/Row";
import Excel from "./Excel/Excel.jsx";

import styles from "./Taxes.module.css";

export default function Taxes() {
  const reports = useSelector((state: RootState) => state.reports);
  const expenses = useSelector((state: RootState) => state.expenses);
  const sales = useSelector((state: RootState) => state.sales);
  const [expensesData, setExpenses] = useState({});
  const [salesData, setSales] = useState({});

  useEffect(() => {
    setExpenses({
      totalExpenses: 0 /* Calculte total */,
      totalSales: 0 /* Calculte total */,
    });
  }, [expenses, salesData]);

  return (
    <div className={styles.container}>
      <div className={styles.controls}>
        <div className="mb-3 form-floating">
          <select id="year" className="form-select">
            <option value="2023">2023</option>
          </select>
          <label htmlFor="year" className="form-label">
            Year
          </label>
        </div>
        {/*         <Excel taxes={taxes} /> */}
      </div>
      <div className={styles.head}>
        <span>
          Total Sales and Shipping {/* Sales and shiping variables */}
        </span>
        <span>Total Expenses {/* Expenses variable */}</span>
        <span>Total Profit {/* Profit result to sales and expenses */}</span>
      </div>
      <div className={styles.scroll}>
        <Row />
      </div>
    </div>
  );
}
