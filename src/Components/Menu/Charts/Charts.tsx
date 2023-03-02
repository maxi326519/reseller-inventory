import { useState } from "react";
import { Chart } from "react-google-charts";

import styles from "./Charts.module.css";

const headData: Array<string> = ["Year", "Sales", "Expenses"];

const initialData: Array<Array<any>> = [
  headData,
  ["Enero", 1000, 400],
  ["Febrero", 1170, 460],
  ["Marzo", 660, 1120],
  ["Abril", 1030, 540],
];

export const datas = [
  ["Year", "Sales", "Expenses"],
  ["2013", 1000, 400],
  ["2014", 1170, 460],
  ["2015", 660, 1120],
  ["2016", 1030, 540],
];

const years: any = {
  2023: [
    ["Enero", 1000, 400],
    ["Febrero", 1170, 460],
    ["Marzo", 660, 1120],
    ["Abril", 1030, 540],
  ],
  2022: [
    ["Enero", 800, 500],
    ["Febrero", 2300, 1500],
    ["Marzo", 1400, 300],
    ["Abril", 1800, 500],
  ],
};

const options = {
  title: "Company Performance",
  hAxis: { title: "Year", titleTextStyle: { color: "#333" } },
  vAxis: { minValue: 0 },
  chartArea: { width: "65%", height: "500px" },
};

export default function Charts() {
  const [data, setData] = useState<Array<Array<any>>>(datas);

  function handleChange(event: React.ChangeEvent<HTMLSelectElement>) {
    const selected: string = event.target.value;
    setData([headData, ...years[selected]]);
    console.log(years[selected]);
  }

  return (
    <div className={styles.container}>
      <div className={styles.chart}>
        <Chart
          chartType="AreaChart"
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
