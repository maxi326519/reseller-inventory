import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { YearTaxesData, MonthTaxesData, RootState } from "../../../../interfaces";
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
    shipment: 0,
    ebayFees: 0,
    otherExpense1: 0,
    otherExpense2: 0,
  }
}

export default function Taxes() {
  const reports = useSelector((state: RootState) => state.reports);
  const [taxesData, setTaxesData] = useState<YearTaxesData[] | null>(null);   // YearTaxesData list
  const [taxesYear, setTaxesYear] = useState<number[]>([]);                   // Taxes year list
  const [TaxesYearIndex, setTaxesYearIndex] = useState<number | null>(null);  // Selected YearTaxesData Index

  /* Update Taxes data */
  useEffect(() => {
    setTaxesData(reports.map((report) => createOrUpdateYearTaxesData(report, null)))
  }, [reports]);

  /* Save all year of taxes data */
  useEffect(() => {
    if (taxesData != null)
      setTaxesYear(taxesData?.map((taxes) => taxes.year));
  }, [taxesData])

  /* Update the index to the last year of taxes data */
  useEffect(() => {
    if ((taxesYear.length > 0) && (taxesData != null)) {
      const year = taxesYear[-1];
      const yearIndex = taxesData.findIndex(y => y.year === year);
      setTaxesYearIndex(yearIndex);
    }
  }, [taxesYear])

  const handleYearSelect = (event: React.ChangeEvent<HTMLSelectElement>) => {
    if (taxesData === null) return false;
    const year = parseInt(event.target.value, 10);
    const yearIndex = taxesData.findIndex(y => y.year === year);
    setTaxesYearIndex(yearIndex);
  };

  return (
    <div className={styles.container}>
      <div className={styles.controls}>
        <div className="mb-3 form-floating">
          <select id="year" className="form-select" onChange={handleYearSelect}>
            {
              taxesYear.map((year: number) => <option key={year} value={year}>{year}</option>)
            }
          </select>
          <label htmlFor="year" className="form-label">
            Year
          </label>
        </div>
        {/*         <Excel taxes={taxes} /> */}
      </div>
      <div className={styles.head}>
        <span>
          {`Total Sales and Shipment: {!taxesData ? 0 : (TaxesYearIndex === null ? 0 :taxesData[TaxesYearIndex].sales.shipment)}`}
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
