import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import {
  RootState,
  OtherCategories,
} from "../../../../interfaces/interfaces";

import Row from "./Row/Row";
import Excel from "./Excel/Excel.jsx";
import Details from "./Details/Details";

import styles from "./Taxes.module.css";
import useTaxes from "../../../../hooks/useTaxes";
import { MonthTaxesData } from "../../../../hooks/useTaxes/interfaces";

interface Props {
  typeReport: any;
  handleChange: (event: React.ChangeEvent<HTMLSelectElement>) => void;
}

export default function Taxes({ typeReport, handleChange }: Props) {
  const taxes = useTaxes();
  const [year, setYear] = useState<number>(0);

  const [otherCategories, setOtherCategories] = useState<OtherCategories[]>([]);
  const [categoriesView, setCategoriesView] = useState<boolean>(false);

  const [excelData, setExcelData] = useState<any>();
  const [totals, setTotals] = useState({
    Sales: 0,
    Expenses: 0,
    Profit: 0,
  });

  // Update and ser data
  useEffect(() => {
    taxes.update()
  }, []);

  // Set last year
  useEffect(() => {
    if (taxes.list) {
      const years = taxes.list
        .map(taxe => taxe.year)
        .sort((a, b) => {
          if (a < b) return 1;
          if (a > b) return -1;
          return 0;
        });

      setYear(years[0]);
      console.log("asdasdasd");
    }
  }, [taxes.list]);

  /*   // Data to export
    useEffect(() => {
      let newData: any = null;
  
      if (TaxesYearIndex !== null && taxesData)
        newData = convertToExportYearTaxesData(taxesData[TaxesYearIndex]);
  
      if (newData) {
        newData = desglosarOtherCategories(newData);
        console.log(newData);
        setExcelData(newData);
      }
    }, [taxesData, TaxesYearIndex]); */

  /*   function desglosarOtherCategories(taxes: ExportYearTaxesData): void {
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
    } */

  function handleChangeYear(event: React.ChangeEvent<HTMLSelectElement>): void {
    setYear(Number(event.target.value))
  };

  function handleShowOtherCategories(data: OtherCategories[] | null) {
    if (data) setOtherCategories(data);
    else setOtherCategories([]);

    setCategoriesView(!categoriesView);
  }

  return (
    <div className={styles.container}>
      {categoriesView && (
        <Details
          expenses={otherCategories}
          handleClose={handleShowOtherCategories}
        />
      )}
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
          <select id="year" value={year} className="form-select" onChange={handleChangeYear}>
            {taxes.list.sort((a, b) => {
              if (a.year < b.year) return 1;
              if (a.year > b.year) return -1;
              return 0;
            }).map((taxe) => (
              <option key={taxe.year} value={taxe.year}>
                {taxe.year}
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
            {taxes.list && taxes.list.find(taxe => taxe.year === Number(year))?.month.map(
              (month: MonthTaxesData) => {
                return (
                  <Row
                    key={month.month.number}
                    taxesMonth={month}
                    handleShowOtherCategories={handleShowOtherCategories}
                  />
                );
              }
            )
            }
          </div>
        </div>
      </div>
    </div>
  );
}
