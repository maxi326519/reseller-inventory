import { useState, useEffect } from "react";
import { closeLoading, loading } from "../../../redux/actions/loading";
import { useDispatch } from "react-redux";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

import styles from "./Charts.module.css";
import useReports from "../../../hooks/useReports";

const initialData = (): Array<{ month: string; sales: number; expenses: number }> => [
  { month: "Jan", sales: 0, expenses: 0 },
  { month: "Feb", sales: 0, expenses: 0 },
  { month: "Mar", sales: 0, expenses: 0 },
  { month: "Apr", sales: 0, expenses: 0 },
  { month: "May", sales: 0, expenses: 0 },
  { month: "Jun", sales: 0, expenses: 0 },
  { month: "Jul", sales: 0, expenses: 0 },
  { month: "Aug", sales: 0, expenses: 0 },
  { month: "Sep", sales: 0, expenses: 0 },
  { month: "Oct", sales: 0, expenses: 0 },
  { month: "Nov", sales: 0, expenses: 0 },
  { month: "Dec", sales: 0, expenses: 0 },
];

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
      .sort((a, b) => b - a);

    setYears(years);
    if (years.length > 0) setYear(years[0].toString());
  }, [reports.list]);

  // Set data
  useEffect(() => {
    if (reports.list?.length > 0 && year !== "") {
      const newData = initialData();

      const dataSelected = reports.list.find(
        (report) => report.year.toString() === year.toString()
      );

      if (dataSelected !== undefined) {
        newData.forEach((entry, i) => {
          entry.sales = dataSelected!.months?.[i]?.sales.reduce(
            (accumulator, item) => accumulator + item.price,
            0
          );
          entry.expenses = dataSelected!.months?.[i]?.expenses.reduce(
            (accumulator, item) => accumulator + item.price,
            0
          );
        });
      }

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
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" stroke="#ffffff" />
            <YAxis stroke="#ffffff" />
            <Tooltip />
            <Legend />
            <Bar dataKey="sales" fill="#f33" />
            <Bar dataKey="expenses" fill="#33f" />
          </BarChart>
        </ResponsiveContainer>
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
