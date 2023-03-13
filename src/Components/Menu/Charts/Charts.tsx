import { useState, useEffect } from "react";
import { Chart } from "react-google-charts";
import { useSelector } from "react-redux";
import swal from "sweetalert";
import { RootState } from "../../../interfaces";

import styles from "./Charts.module.css";

const headData: Array<string> = ["Year", "Sales", "Expenses"];

const initialData: Array<Array<any>> = [
  ["Year", "Sales", "Expenses"],
  ["Enero", 0, 0],
  ["Febrero", 0, 0],
  ["Marzo", 0, 0],
  ["Abril", 0, 0],
  ["Mayo", 0, 0],
  ["Junio", 0, 0],
  ["Julio", 0, 0],
  ["Agosto", 0, 0],
  ["Septiembre", 0, 0],
  ["Octubre", 0, 0],
  ["Noviembre", 0, 0],
  ["Diciembre", 0, 0],
];

const options = {
  title: "Company Performance",
  backgroundColor: "#333",
  // Cambiar los colores de los textos
  titleTextStyle: {
    color: "white",
    fontSize: 18,
    bold: true,
  },
  legendTextStyle: {
    color: "white",
    fontSize: 14,
  },
  hAxis: {
    title: "Year",
    titleTextStyle: { color: "white" },

    textStyle: {
      color: "white",
    },
  },
  vAxis: {
    title: "Sales / Expensas",
    titleTextStyle: { color: "white" },

    textStyle: {
      color: "white",
    },
  },
  tooltip: {
    backgroundColor: "white",
    textStyle: {
      color: "black",
    },
  },
  leyend: { color: "white" },
  chartArea: { width: "70%", height: "500px", backgroundColor: "#444" },
  animation: { startup: true, duration: 300, easing: "ease-in" },
};

export default function Charts() {
  const reports = useSelector((state: RootState) => state.reports);
  const [yearsData, setYearData] = useState<any>([]);
  const [data, setData] = useState(initialData);
  const [year, setYear] = useState("");
  const [error, setError] = useState(false);

  useEffect(() => {
    const newData = reports.map((r) => {
      return {
        year: r.year,
        data: [
          ["Year", "Sales", "Expenses"],
          ...r.month.map((m) => [m.month, m.totalSales, m.totalExpenses]),
        ],
      };
    });
    const currentYear = newData.find(
      (y: any) => y.year.toString() === new Date().getFullYear().toString()
    );
    if (currentYear) {
      setData(currentYear.data);
      setYear(currentYear.year);
      setError(false);
    }
    setYearData(newData);
  }, [reports]);

  function handleChange(event: React.ChangeEvent<HTMLSelectElement>) {
    const selected: string = event.target.value;
    setData(yearsData.find((y: any) => y.year.toString() === selected).data);
  }

  return (
    <div className={styles.container}>
      <div className={styles.chart}>
        <Chart
          chartType="ColumnChart"
          width="100%"
          height="400px"
          data={data}
          options={options}
        />
      </div>
      <div className={`form-floating ${styles.controls}`}>
        <select
          className="form-select"
          id="year"
          name="year"
          value={year}
          onChange={handleChange}
        >
          {year.length <= 0 ? (
            <option value="loading">{error ? "Empty" : "Loading..."}</option>
          ) : (
            yearsData.map((y: any) => (
              <option key={y.year} value={y.year}>
                {y.year}
              </option>
            ))
          )}
        </select>
        <label className="form-label" htmlFor="year">
          Year:
        </label>
      </div>
    </div>
  );
}
