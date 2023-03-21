import { useState, useEffect } from "react";

import styles from "./DateFilter.module.css";

const months = [
  { value: "00", name: "All" },
  { value: "01", name: "January" },
  { value: "02", name: "February" },
  { value: "03", name: "March" },
  { value: "04", name: "April" },
  { value: "05", name: "May" },
  { value: "06", name: "June" },
  { value: "07", name: "July" },
  { value: "08", name: "August" },
  { value: "09", name: "September" },
  { value: "10", name: "October" },
  { value: "11", name: "November" },
  { value: "12", name: "December" },
];

interface Filter {
  year: string | number;
  month: string | number;
  day: string | number;
}

interface Porps {
  years: string[] | number[];
  handleFilterDate: (date: Filter) => void;
}

export default function DateFilter({ years, handleFilterDate }: Porps) {
  const [days, setDays] = useState<string[] | number[]>([]);
  const [filter, setFilter] = useState<Filter>({
    year: new Date().toLocaleDateString().split("/")[2],
    month: `0${new Date().toLocaleDateString().split("/")[1]}`.slice(-2),
    day: "00",
  });

  useEffect(() => {
    // If any month selected
    if (filter.month !== "00") {
      // Number of days
      var days = new Date(
        Number(filter.year),
        Number(filter.month),
        0
      ).getDate();
      let dayArr = [];
      for (let i = 1; i <= days; i++) {
        dayArr.push(i);
      }
      setDays(dayArr);
    } else {
      setDays([]);
    }
  }, [filter]);

  function handleChange(event: React.ChangeEvent<HTMLSelectElement>) {
    setFilter({ ...filter, [event.target.name]: event.target.value });
  }

  function handleApply() {
    handleFilterDate(filter);
  }

  return (
    <div className={styles.dateFilter}>
      <div className={`form-floating mb-3 ${styles.date}`}>
        <select
          id="year"
          name="year"
          className="form-select"
          value={filter.year}
          onChange={handleChange}
        >
          {years.length > 0 ? (
            years.map((y) => (
              <option key={y} value={y}>
                {y}
              </option>
            ))
          ) : (
            <option>{new Date().toLocaleDateString().split("/")[2]}</option>
          )}
        </select>
        <label htmlFor="year">Year</label>
      </div>
      <div className={`form-floating mb-3 ${styles.date}`}>
        <select
          id="month"
          name="month"
          className="form-select"
          value={filter.month}
          onChange={handleChange}
        >
          {months.map((month) => (
            <option key={month.value} value={month.value}>
              {month.name}
            </option>
          ))}
        </select>
        <label htmlFor="month">Month</label>
      </div>
      <div className={`form-floating mb-3 ${styles.date}`}>
        <select
          id="day"
          name="day"
          className="form-select"
          value={filter.day}
          onChange={handleChange}
        >
          <option value="00">All</option>
          {days.map((day) => (
            <option key={day} value={`0${day}`.slice(-2)}>
              {`0${day}`.slice(-2)}
            </option>
          ))}
        </select>
        <label htmlFor="day">Day</label>
      </div>
      <button className="btn btn-success" type="button" onClick={handleApply}>
        Apply
      </button>
    </div>
  );
}
