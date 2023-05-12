import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { createOrUpdateYearTaxesData } from "../../../../functions/createOrUpdateYearTaxesData";
import { convertToExportYearTaxesData } from "../../../../functions/convertToExportYearTaxesData";
import {
  YearTaxesData,
  MonthTaxesData,
  RootState,
  OtherCategories,
  ExportYearTaxesData,
  ExportMonthTaxes,
} from "../../../../interfaces";

import Row from "./Row/Row";
import Excel from "./Excel/Excel.jsx";
import Details from "./Details/Details";

import styles from "./Taxes.module.css";

interface Props {
  typeReport: any;
  handleChange: (event: React.ChangeEvent<HTMLSelectElement>) => void;
}

export default function Taxes({ typeReport, handleChange }: Props) {
  const reports = useSelector((state: RootState) => state.reports);
  const [taxesData, setTaxesData] = useState<YearTaxesData[] | null>(null); // YearTaxesData list
  const [taxesYear, setTaxesYear] = useState<number[]>([]); // Taxes year list
  const [TaxesYearIndex, setTaxesYearIndex] = useState<number | null>(null); // Selected YearTaxesData Index
  const [excelData, setExcelData] = useState<any>();
  const [otherCategories, setOtherCategories] = useState<OtherCategories[]>([]);
  const [otherCategoriesDetails, setOtherCategoriesDetails] =
    useState<boolean>(false);
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

      setTotals({
        Sales: sales,
        Expenses: expenses,
        Profit: Number(sales) - Number(expenses),
      });
    }
  }, [taxesData, TaxesYearIndex]);

  // Data to export
  useEffect(() => {
    let newData: any = null;

    if (TaxesYearIndex !== null && taxesData)
      newData = convertToExportYearTaxesData(taxesData[TaxesYearIndex]);

    console.log(newData);

    if (newData) newData = desglosarOtherCategories(newData);

    console.log(newData);

    if (newData) setExcelData(newData);

    console.log(newData);
  }, [taxesData, TaxesYearIndex]);

  function desglosarOtherCategories(taxes: ExportYearTaxesData): void {
    let data: any = taxes;
    for (let i = 0; i < data.months.length; i++) {
      const month = data.months[i];
      for (let j = 0; j < month.otherCategories.length; j++) {
        const category = month.otherCategories[j];
        const propertyName = toCamelCase(category.category);
        month[propertyName] = category.total;
      }
      delete month.otherCategories;
    }
    return data;
  }

  function toCamelCase(text: string): string {
    return text
      .replace(/[-_]+/g, " ")
      .replace(/(?:^\w|[A-Z]|\b\w)/g, (word, index) => {
        return index === 0 ? word.toLowerCase() : word.toUpperCase();
      })
      .replace(/\s+/g, "");
  }

  const handleYearSelect = (event: React.ChangeEvent<HTMLSelectElement>) => {
    if (taxesData === null) return false;
    const year = parseInt(event.target.value, 10);
    const yearIndex = taxesData.findIndex((y) => y.year === year);
    setTaxesYearIndex(yearIndex);
  };

  function handleShowOtherCategories(data: OtherCategories[] | null) {
    if (data) setOtherCategories(data);
    else setOtherCategories([]);

    setOtherCategoriesDetails(!otherCategoriesDetails);
  }

  return (
    <div className={styles.container}>
      {otherCategoriesDetails ? (
        <Details
          expenses={otherCategories}
          handleClose={handleShowOtherCategories}
        />
      ) : null}
      <div className={styles.controls}>
        <div className="form-floating">
          <select
            className="form-select"
            id="filter"
            value={typeReport}
            onChange={handleChange}
          >
            <option value="1">Items Sold</option>
            <option value="2">Items Expired</option>
            <option value="3">Taxes</option>
          </select>
          <label className="form-label" htmlFor="filter">
            Filter by:
          </label>
        </div>
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
        {excelData ? <Excel taxes={excelData} /> : null}
      </div>
      <div className={styles.table}>
        <div className={styles.head}>
          <span>{`Total Sales and Shipment: ${totals.Sales.toFixed(2)}`}</span>
          <span>{`Total Expenses: ${totals.Expenses.toFixed(2)}`}</span>
          <span>{`Total Profit: ${totals.Profit.toFixed(2)}`}</span>
        </div>
        <div className={styles.responsive}>
          <div className={styles.scroll}>
            {TaxesYearIndex !== null && taxesData
              ? taxesData[TaxesYearIndex].month.map(
                  (taxesMonth: MonthTaxesData) => {
                    return (
                      <Row
                        key={taxesMonth.month.number}
                        taxesMonth={taxesMonth}
                        handleShowOtherCategories={handleShowOtherCategories}
                      />
                    );
                  }
                )
              : null}
          </div>
        </div>
      </div>
    </div>
  );
}
