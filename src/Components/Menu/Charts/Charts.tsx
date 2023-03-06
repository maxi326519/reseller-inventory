import { useState } from "react";
import { Chart } from "react-google-charts";

import styles from "./Charts.module.css";

const headData: Array<string> = ["Year", "Sales", "Expenses"];

const initialData: Array<Array<any>> = [
  ["Year", "Sales", "Expenses"],
  ["Enero", 1000, 400],
  ["Febrero", 1170, 460],
  ["Marzo", 660, 1120],
  ["Abril", 1030, 540],
  ["Mayo", 1000, 400],
  ["Junio", 1170, 460],
  ["Julio", 660, 1120],
  ["Agosto", 1030, 540],
  ["Septiembre", 1030, 540],
  ["Octubre", 1030, 540],
  ["Noviembre", 1030, 540],
  ["Diciembre", 1030, 540],
]

const years: any = {
  2023: [
    ["Year", "Sales", "Expenses"],
    ["Enero", 1000, 400],
    ["Febrero", 1170, 460],
    ["Marzo", 660, 1120],
    ["Abril", 1030, 540],
  ],
  2022: [
    ["Year", "Sales", "Expenses"],
    ["Enero", 800, 500],
    ["Febrero", 2300, 1500],
    ["Marzo", 1400, 300],
    ["Abril", 1800, 500],
  ],
};

const options = {
  title: "Company Performance",
  titleTextStyle: { color: "white" },
  hAxis: {
    title: "Year",
    titleTextStyle: { color: "white" },
    textStyle: { color: "white" },
  },
  vAxis: {
    title: "Sales / Expensas",
    titleTextStyle: { color: "white" },
    textStyle: { color: "white" },
    minValue: 0,
  },
  leyend: { color: "white" },
  backgroundColor: "#333",
  chartArea: { width: "70%", height: "500px", backgroundColor: "#444" },
  animation: { startup: true, duration: 300, easing: "ease-in" },
};

export default function Charts() {
  const [data, setData] = useState<Array<Array<any>>>(initialData);

  function handleChange(event: React.ChangeEvent<HTMLSelectElement>) {
    const selected: string = event.target.value;
    setData([headData, ...years[selected]]);
    console.log(years[selected]);
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
          onChange={handleChange}
        >
          <option value="2023">2023</option>
          <option value="2022">2022</option>
        </select>
        <label className="form-label" htmlFor="year">
          Year:
        </label>
      </div>
    </div>
  );
}
