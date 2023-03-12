import { YearReport, MonthReport, Expense } from "../interfaces";

export function calculeReports(reports: YearReport[], data: Expense[]) {
  let years: string[] = []; // Save years of matching expenses
  let missingYears: string[] = []; // Save years of missing expenses
  let newReports: YearReport[] = []; // Save all reports

  if (reports.length <= 0)
    reports.push(reportGenerator(new Date().getFullYear().toString()));

  /* Matching and missing date search */
  data.forEach((d) => {
    let dataDate = d.date.split("-")[0];
    /* If exist any report with the date of the data */
    if (reports.some((r) => r.year.toString() === dataDate))
      years.push(dataDate);
    else missingYears.push(dataDate);
  });

  // Delete repeat elements
  missingYears = missingYears.filter((element, index, arr) => {
    return arr.indexOf(element) === index && !(element in arr.slice(index + 1));
  });

  /* Create missing reports  */
  newReports = [...reports, ...missingYears.map((y) => reportGenerator(y))];

  /* Update reports */
  newReports = newReports.map((r) => {
    /* If matching with expeneses year */
    if (years.includes(r.year) || missingYears.includes(r.year)) {
      const newYear = {
        year: r.year,
        month: r.month.map((month) => {
          /* Search maching date */
          let match = data.filter((d: Expense) => {
            if (
              d.date.split("-")[0] === r.year.toString() &&
              d.date.split("-")[1] === `0${month.month.toString()}`.slice(-2)
            ) {
              return true;
            }
            return false;
          });

          /* If exist, update */
          if (match.length > 0) {
            const newMonth = {
              ...month,
              expenses: [
                ...month.expenses,
                ...match.map((m) => {
                  return {
                    id: m.id,
                    amount: m.price,
                  };
                }),
              ],
              totalExpenses:
                month.totalExpenses +
                total(
                  data.filter(
                    (d) =>
                      d.date.split("-")[0] === r.year.toString() &&
                      d.date.split("-")[1] ===
                        `0${month.month.toString()}`.slice(-2)
                  )
                ),
            };
            return newMonth;
          } else {
            return month;
          }
        }),
      };
      return newYear;
    } else {
      return r;
    }
  });

  const updateYears = [...missingYears, ...years].filter((element, index, arr) => {
    return arr.indexOf(element) === index && !(element in arr.slice(index + 1));
  });

  return {
    reports: newReports,
    years: updateYears,
  };
}

function total(array: Array<any>) {
  console.log("suma", array);
  let total: number = 0;
  array.forEach((a) => {
    total += Number(a.price);
  });
  return total;
}

export function reportGenerator(year: string): YearReport {
  let reportData: YearReport = {
    year: year,
    month: [],
  };

  for (let i = 1; i <= 12; i++) {
    const monthReport: MonthReport = {
      month: i.toString(),
      expenses: [],
      sales: [],
      totalExpenses: 0,
      totalSales: 0,
    };
    reportData.month.push(monthReport);
  }
  return reportData;
}
