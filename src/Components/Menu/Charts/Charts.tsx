import { useState, useEffect } from "react";
import { Chart } from "react-google-charts";
import { useSelector } from "react-redux";
import { RootState } from "../../../interfaces/interfaces";

import styles from "./Charts.module.css";
import useReports from "../../../hooks/useReports";

const headData: Array<string> = ["Year", "Sales", "Expenses"];

const initialData: Array<Array<string | number>> = [
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
  const reports = useReports();
  const reportsRedux = useSelector((state: RootState) => state.reports);
  const [yearsData, setYearData] = useState<any>([]);
  const [data, setData] = useState(initialData);
  const [year, setYear] = useState("");
  const [error, setError] = useState(false);

  useEffect(() => {
    if (reports.list.length > 0) {
      let newData: Array<Array<string | number>> = [
        ["Year", "Sales", "Expenses"],
      ];
      newData.push([
        "Enero",
        reports.list[0].months?.[1].sales.reduce(
          (acumulator, item) => acumulator + item.price,
          0
        ),
        reports.list[0].months?.[1].expenses.reduce(
          (acumulator, item) => acumulator + item.price,
          0
        ),
      ]);

      newData.push([
        "Febrer",
        reports.list[0].months?.[2].sales.reduce(
          (acumulator, item) => acumulator + item.price,
          0
        ),
        reports.list[0].months?.[2].expenses.reduce(
          (acumulator, item) => acumulator + item.price,
          0
        ),
      ]);

      newData.push([
        "Marzo",
        reports.list[0].months?.[3].sales.reduce(
          (acumulator, item) => acumulator + item.price,
          0
        ),
        reports.list[0].months?.[3].expenses.reduce(
          (acumulator, item) => acumulator + item.price,
          0
        ),
      ]);

      newData.push([
        "Abril",
        reports.list[0].months?.[4].sales.reduce(
          (acumulator, item) => acumulator + item.price,
          0
        ),
        reports.list[0].months?.[4].expenses.reduce(
          (acumulator, item) => acumulator + item.price,
          0
        ),
      ]);

      newData.push([
        "Mayo",
        reports.list[0].months?.[5].sales.reduce(
          (acumulator, item) => acumulator + item.price,
          0
        ),
        reports.list[0].months?.[5].expenses.reduce(
          (acumulator, item) => acumulator + item.price,
          0
        ),
      ]);

      newData.push([
        "Junio",
        reports.list[0].months?.[6].sales.reduce(
          (acumulator, item) => acumulator + item.price,
          0
        ),
        reports.list[0].months?.[6].expenses.reduce(
          (acumulator, item) => acumulator + item.price,
          0
        ),
      ]);

      newData.push([
        "Julio",
        reports.list[0].months?.[7].sales.reduce(
          (acumulator, item) => acumulator + item.price,
          0
        ),
        reports.list[0].months?.[7].expenses.reduce(
          (acumulator, item) => acumulator + item.price,
          0
        ),
      ]);

      newData.push([
        "Agosto",
        reports.list[0].months?.[8].sales.reduce(
          (acumulator, item) => acumulator + item.price,
          0
        ),
        reports.list[0].months?.[8].expenses.reduce(
          (acumulator, item) => acumulator + item.price,
          0
        ),
      ]);

      newData.push([
        "Septiembre",
        reports.list[0].months?.[9].sales.reduce(
          (acumulator, item) => acumulator + item.price,
          0
        ),
        reports.list[0].months?.[9].expenses.reduce(
          (acumulator, item) => acumulator + item.price,
          0
        ),
      ]);

      newData.push([
        "Octubre",
        reports.list[0].months?.[10].sales.reduce(
          (acumulator, item) => acumulator + item.price,
          0
        ),
        reports.list[0].months?.[10].expenses.reduce(
          (acumulator, item) => acumulator + item.price,
          0
        ),
      ]);

      newData.push([
        "Noviembre",
        reports.list[0].months?.[11].sales.reduce(
          (acumulator, item) => acumulator + item.price,
          0
        ),
        reports.list[0].months?.[11].expenses.reduce(
          (acumulator, item) => acumulator + item.price,
          0
        ),
      ]);

      newData.push([
        "Diciembre",
        reports.list[0].months?.[12].sales.reduce(
          (acumulator, item) => acumulator + item.price,
          0
        ),
        reports.list[0].months?.[12].expenses.reduce(
          (acumulator, item) => acumulator + item.price,
          0
        ),
      ]);

      console.log(reports);
      console.log(newData);

      setData(newData);
    }
  }, [reportsRedux]);

  function handleChange(event: React.ChangeEvent<HTMLSelectElement>) {
    const selected = event.target.value;
    setYear(selected);
    setData(yearsData.find((y: any) => y.year.toString() === selected).data);
  }

  function handleUpdateChart() {
    reports
      .updateReports(reports.list)
      .then((reports) => {
        console.log("Nuevo reporte", reports);
      })
      .catch((error: Error) => {
        console.log(error.message);
      });
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
      <button
        className="btn btn-outline-primary"
        type="button"
        onClick={handleUpdateChart}
      >
        Actualizar
      </button>
    </div>
  );
}
