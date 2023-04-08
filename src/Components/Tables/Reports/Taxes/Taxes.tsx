import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import {
  YearTaxesData,
  MonthTaxesData,
  RootState,
} from "../../../../interfaces";
import { createOrUpdateYearTaxesData } from "../../../../functions/createOrUpdateYearTaxesData";

import Row from "./Row/Row";
import Excel from "./Excel/Excel.jsx";

import styles from "./Taxes.module.css";

const intialMonthTaxesData: MonthTaxesData = {
  month: {
    number: 0,
    name: "",
  },
  sales: {
    total: 0,
    sales: 0,
    shipment: 0,
  },
  expenses: {
    total: 0,
    COGS: 0,
    shipLabel: 0,
    ebayFees: 0,
    adsFee: 0,
    otherExpense: 0,
    otherCategories: [],
  },
};

export default function Taxes() {
  const reports = useSelector((state: RootState) => state.reports);
  const [taxesData, setTaxesData] = useState<YearTaxesData[] | null>(null); // YearTaxesData list
  const [taxesYear, setTaxesYear] = useState<number[]>([]); // Taxes year list
  const [TaxesYearIndex, setTaxesYearIndex] = useState<number | null>(null); // Selected YearTaxesData Index
  const [totals, setTotals] = useState({
    Sales: 0,
    Expenses: 0,
    Profit: 0,
  });

  /* Update Taxes data */
  useEffect(() => {
    setTaxesData(
      reports.map((report) => createOrUpdateYearTaxesData(report, null))
    );
  }, [reports]);

  /* Save all year of taxes data */
  useEffect(() => {
    if (taxesData != null) setTaxesYear(taxesData?.map((taxes) => taxes.year));
  }, [taxesData]);

  /* Update the index to the last year of taxes data */
  useEffect(() => {
    if (taxesYear.length > 0 && taxesData != null) {
      const year = taxesYear[0];
      const yearIndex = taxesData.findIndex(
        (y) => Number(y.year) === Number(year)
      );
      setTaxesYearIndex(yearIndex);
    }
  }, [taxesData, taxesYear]);

  /* Calculate Totals */
  useEffect(() => {
    if (taxesData !== null && TaxesYearIndex !== null) {
      let sales = 0;
      let expenses = 0;

      taxesData[TaxesYearIndex].month.forEach((month) => {
        sales += Number(month.sales.total);
        expenses += Number(month.expenses.total);
      });

      console.log(sales);
      console.log(expenses);
      setTotals({
        Sales: sales,
        Expenses: expenses,
        Profit: Number(sales) - Number(expenses),
      })
    }
  }, [taxesData, TaxesYearIndex]);

  const handleYearSelect = (event: React.ChangeEvent<HTMLSelectElement>) => {
    if (taxesData === null) return false;
    const year = parseInt(event.target.value, 10);
    const yearIndex = taxesData.findIndex((y) => y.year === year);
    setTaxesYearIndex(yearIndex);
  };

  return (
    <div className={styles.container}>
      <div className={styles.controls}>
        <div className="mb-3 form-floating">
          <select id="year" className="form-select" onChange={handleYearSelect}>
            {taxesYear.map((year: number) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>
          <label htmlFor="year" className="form-label">
            Year
          </label>
        </div>
        {/*         <Excel taxes={taxes} /> */}
      </div>
      <div className={styles.head}>
        <span>{`Total Sales and Shipment: ${totals.Sales}`}</span>
        <span>{`Total Expenses: ${totals.Expenses}`}</span>
        <span>{`Total Profit: ${totals.Profit}`}</span>
      </div>
      <div className={styles.scroll}>
        {TaxesYearIndex !== null && taxesData
          ? taxesData[TaxesYearIndex].month.map(
            (taxesMonth: MonthTaxesData) => {
              console.log(1);
              return <Row taxesMonth={taxesMonth} />;
            }
          )
          : null}
      </div>
    </div>
  );
}
