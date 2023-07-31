import { useState, useEffect } from "react";
import { Chart } from "react-google-charts";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../interfaces/interfaces";

import styles from "./Charts.module.css";
import useReports from "../../../hooks/useReports";
import { closeLoading, loading } from "../../../redux/actions/loading";

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
  const dispatch = useDispatch();
  const reportsRedux = useSelector((state: RootState) => state.reports);
  const [yearsData, setYearData] = useState<number[]>([]);
  const [data, setData] = useState(initialData);
  const [year, setYear] = useState("");
  const [error, setError] = useState(false);

  // Set last year
  useEffect(() => {
    const years = reports.list
      .map((report) => Number(report.year))
      .sort((a, b) => {
        if (a > b) return -1;
        if (a < b) return 1;
        return 0;
      });

    setYearData(years);
  }, [reportsRedux]);

  // Set data
  useEffect(() => {
    if (reports.list?.length > 0 && year !== "") {
      let dataSelected = reports.list.find(
        (report) => report.year.toString() === year.toString()
      );

      if (dataSelected) {
        let newData: Array<Array<string | number>> = [
          ["Year", "Sales", "Expenses"],
        ];
        newData.push([
          "Enero",
          dataSelected.months?.[1].sales.reduce(
            (acumulator, item) => acumulator + item.price,
            0
          ),
          dataSelected.months?.[1].expenses.reduce(
            (acumulator, item) => acumulator + item.price,
            0
          ),
        ]);

        newData.push([
          "Febrero",
          dataSelected.months?.[2].sales.reduce(
            (acumulator, item) => acumulator + item.price,
            0
          ),
          dataSelected.months?.[2].expenses.reduce(
            (acumulator, item) => acumulator + item.price,
            0
          ),
        ]);

        newData.push([
          "Marzo",
          dataSelected.months?.[3].sales.reduce(
            (acumulator, item) => acumulator + item.price,
            0
          ),
          dataSelected.months?.[3].expenses.reduce(
            (acumulator, item) => acumulator + item.price,
            0
          ),
        ]);

        newData.push([
          "Abril",
          dataSelected.months?.[4].sales.reduce(
            (acumulator, item) => acumulator + item.price,
            0
          ),
          dataSelected.months?.[4].expenses.reduce(
            (acumulator, item) => acumulator + item.price,
            0
          ),
        ]);

        newData.push([
          "Mayo",
          dataSelected.months?.[5].sales.reduce(
            (acumulator, item) => acumulator + item.price,
            0
          ),
          dataSelected.months?.[5].expenses.reduce(
            (acumulator, item) => acumulator + item.price,
            0
          ),
        ]);

        newData.push([
          "Junio",
          dataSelected.months?.[6].sales.reduce(
            (acumulator, item) => acumulator + item.price,
            0
          ),
          dataSelected.months?.[6].expenses.reduce(
            (acumulator, item) => acumulator + item.price,
            0
          ),
        ]);

        newData.push([
          "Julio",
          dataSelected.months?.[7].sales.reduce(
            (acumulator, item) => acumulator + item.price,
            0
          ),
          dataSelected.months?.[7].expenses.reduce(
            (acumulator, item) => acumulator + item.price,
            0
          ),
        ]);

        newData.push([
          "Agosto",
          dataSelected.months?.[8].sales.reduce(
            (acumulator, item) => acumulator + item.price,
            0
          ),
          dataSelected.months?.[8].expenses.reduce(
            (acumulator, item) => acumulator + item.price,
            0
          ),
        ]);

        newData.push([
          "Septiembre",
          dataSelected.months?.[9].sales.reduce(
            (acumulator, item) => acumulator + item.price,
            0
          ),
          dataSelected.months?.[9].expenses.reduce(
            (acumulator, item) => acumulator + item.price,
            0
          ),
        ]);

        newData.push([
          "Octubre",
          dataSelected.months?.[10].sales.reduce(
            (acumulator, item) => acumulator + item.price,
            0
          ),
          dataSelected.months?.[10].expenses.reduce(
            (acumulator, item) => acumulator + item.price,
            0
          ),
        ]);

        newData.push([
          "Noviembre",
          dataSelected.months?.[11].sales.reduce(
            (acumulator, item) => acumulator + item.price,
            0
          ),
          dataSelected.months?.[11].expenses.reduce(
            (acumulator, item) => acumulator + item.price,
            0
          ),
        ]);

        newData.push([
          "Diciembre",
          dataSelected.months?.[12].sales.reduce(
            (acumulator, item) => acumulator + item.price,
            0
          ),
          dataSelected.months?.[12].expenses.reduce(
            (acumulator, item) => acumulator + item.price,
            0
          ),
        ]);
        console.log(reports);
        console.log(newData);

        setData(newData);
      }
    }
  }, [year]);

  function handleChange(event: React.ChangeEvent<HTMLSelectElement>) {
    setYear(event.target.value);
  }

  function handleUpdateChart() {
    dispatch(loading());
    reports
      .updateReports(reports.list)
      .then((reports) => {
        console.log("Nuevo reporte", reports);
        dispatch(closeLoading());
      })
      .catch((error: Error) => {
        console.log(error.message);
        dispatch(closeLoading());
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
      <div className={styles.controls}>
        <div className={`form-floating ${styles.controls}`}>
          <select
            className="form-select"
            id="year"
            name="year"
            value={year}
            onChange={handleChange}
          >
            {yearsData.map((y: any) => (
              <option key={y} value={y}>
                {y}
              </option>
            ))}
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
    </div>
  );
}
