import { useState, useEffect } from "react";
import { closeLoading, loading } from "../../../redux/actions/loading";
import { Chart } from "react-google-charts";
import { useDispatch } from "react-redux";

import styles from "./Charts.module.css";
import useReports from "../../../hooks/useReports";

const initialData = (): Array<Array<string | number>> => [
  ["Year", "Sales", "Expenses"],
  ["January", 0, 0],
  ["February", 0, 0],
  ["March", 0, 0],
  ["April", 0, 0],
  ["May", 0, 0],
  ["June", 0, 0],
  ["July", 0, 0],
  ["August", 0, 0],
  ["September", 0, 0],
  ["Octuber", 0, 0],
  ["November", 0, 0],
  ["December", 0, 0],
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
  const dispatch = useDispatch();
  const reports = useReports();
  const [years, setYears] = useState<number[]>([]);
  const [year, setYear] = useState("");
  const [data, setData] = useState(initialData());

  // Set last year
  useEffect(() => {
    const years = reports.list
      .map((report) => Number(report.year))
      .sort((a, b) => {
        if (a > b) return -1;
        if (a < b) return 1;
        return 0;
      });

    setYears(years);
    if (years.length > 0) setYear(years[0].toString());
  }, [reports.list]);

  // Set data
  useEffect(() => {
    // Check data and year selected
    if (reports.list?.length > 0 && year !== "") {
      // Create new chart data
      const newData = initialData();

      // Find yesr report
      let dataSelected = reports.list.find(
        (report) => report.year.toString() === year.toString()
      );

      // Check if year report exist
      if (dataSelected !== undefined) {

        // Iterate year report and update new chart data
        newData.forEach((data, i) => {
          // Skip the first iteration, because it's the header
          if (i !== 0) {
            data[1] = dataSelected!.months?.[i].sales.reduce((acumulator, item) => acumulator + item.price, 0);
            data[2] = dataSelected!.months?.[i].expenses.reduce((acumulator, item) => acumulator + item.price, 0);
          }
        });
      }

      // Save report
      setData(newData);
    }
  }, [year, reports.list]);

  function handleChange(event: React.ChangeEvent<HTMLSelectElement>) {
    setYear(event.target.value);
  }

  function handleUpdateChart() {
    dispatch(loading());
    reports
      .updateReports()
      .then(() => {
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
            {years.map((y: any) => (
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
