import {
  YearReport,
  MonthReport,
  Expense,
  Sale,
  ReportItem,
} from "../interfaces";

export function calculeReports(
  reports: YearReport[],
  data: any,
  isExpense: boolean
) {
  let years: string[] = []; // Save years of matching expenses
  let missingYears: string[] = []; // Save years of missing expenses
  let newReports: YearReport[] = []; // Save all reports

  console.log(data);

  if (reports.length <= 0)
    reports.push(reportGenerator(new Date().getFullYear().toString()));

  /* Matching and missing date search */
  data.forEach((d: any) => {
    console.log(d.date.toDate());
    console.log(d.date.toDate().getFullYear());
    console.log(d.date.toDate().getMonth());
    let dataDate = d.date.toDate().getFullYear();
    /* If exist any report with the date of the data */
    if (reports.some((r) => Number(r.year) === Number(dataDate)))
      years.push(dataDate.toString());
    else missingYears.push(dataDate.toString());
  });

  // Delete repeat elements
  missingYears = missingYears.filter((element, index, arr) => {
    return arr.indexOf(element) === index && !(element in arr.slice(index + 1));
  });

  /* Create missing reports  */
  newReports = [...reports, ...missingYears.map((y) => reportGenerator(y))];

  console.log("Years:", years);
  console.log("Missing years:", missingYears);
  console.log("Reports:", reports);
  console.log("All Reports:", newReports);

  /* Update reports */
  newReports = newReports.map((r) => {
    /* If matching with expeneses year */
    console.log("Year:", r.year);
    console.log("Years include:", years.includes(r.year));
    console.log("Missing includes:", missingYears.includes(r.year));
    console.log(years.includes(r.year) || missingYears.includes(r.year));

    if (years.includes(r.year) || missingYears.includes(r.year)) {
      const newYear = {
        year: r.year,
        month: r.month.map((month) => {
          /* Search maching date data */
          let match = data.filter((d: Expense) => {
            const date = d.date.toDate();
            if (
              date.getFullYear() === Number(r.year) &&
              date.getMonth() === Number(month.month) - 1
            ) {
              return true;
            }
            return false;
          });

          console.log("");
          console.log("Year:", r.year, "Month:", month.month);
          console.log("Data:", data);
          console.log(match);
          console.log("");

          let newMonth: MonthReport;
          /* If exist, update */
          if (match.length > 0) {
            /* If are Expense */
            if (isExpense) {
              newMonth = {
                ...month,
                expenses: [
                  ...month.expenses,
                  ...match.map((m: Expense) => {
                    return {
                      id: m.id,
                      type: m.category,
                      amount: m.price,
                    };
                  }),
                ],
                totalExpenses:
                  Number(month.totalExpenses) +
                  total(
                    data.filter(
                      (d: Expense) =>
                        d.date.toDate().getFullYear() === Number(r.year) &&
                        d.date.toDate().getMonth() === Number(month.month) - 1
                    )
                  ),
              };
            } else {
              /* If are Sale */
              let totalSale = 0;
              /* Add sale */
              newMonth = {
                ...month,
                sales: [
                  ...month.sales,
                  ...match.map((m: Sale) => {
                    totalSale += Number(m.price);
                    return {
                      id: m.id,
                      type: "Sale",
                      amount: m.price,
                    };
                  }),
                ],
              };
              /* If existe, Add Shiping */
              newMonth = {
                ...newMonth,
                sales: [
                  ...newMonth.sales,
                  ...match.map((m: Sale) => {
                    totalSale += Number(m.shipment.amount);
                    return {
                      id: m.id,
                      type: "Shipment",
                      amount: m.shipment.amount,
                    };
                  }),
                ],
              };

              /* Save total */
              newMonth = {
                ...newMonth,
                totalSales: Number(month.totalSales) + Number(totalSale),
              };
            }
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

  const updateYears = [...missingYears, ...years].filter(
    (element, index, arr) => {
      return (
        arr.indexOf(element) === index && !(element in arr.slice(index + 1))
      );
    }
  );

  return {
    reports: newReports,
    years: updateYears,
  };
}

function total(array: Array<any>) {
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

export function deleteDataAndUpdateTotals(
  id: number[],
  category: string[] | null,
  reports: YearReport[]
) {
  const updatedReports: YearReport[] = [...reports];
  const editedYears: string[] = [];

  // Iterate years
  for (let y = 0; y < updatedReports.length; y++) {
    const yearReport: YearReport = updatedReports[y];

    // Iterate months
    for (let m = 0; m < yearReport.month.length; m++) {
      const monthReport: MonthReport = yearReport.month[m];

      console.log("_________________________________________________");
      console.log("\tMonth:", m + 1);
      console.log("_________________________________________________");
      console.log();
      console.log("Sales");

      const sales: ReportItem[] = monthReport.sales.filter((item) => {
        console.log(item.id, item.type);
        console.log(
          id.includes(item.id),
          !category || category?.includes(item.type)
        );
        console.log(
          id.includes(item.id) && (!category || category?.includes(item.type))
        );
        console.log("");

        if (
          id.includes(item.id) &&
          (!category || category?.includes(item.type))
        ) {
          return false;
        } else {
          return true;
        }
      });

      console.log("---------------------------");
      console.log("Expenses");

      const expenses: ReportItem[] = monthReport.expenses.filter((item) => {
        console.log(item.id, item.type);
        console.log(
          id.includes(item.id),
          !category || category?.includes(item.type)
        );
        console.log(
          id.includes(item.id) && (!category || category?.includes(item.type))
        );
        console.log("");

        if (
          id.includes(item.id) &&
          (!category || category?.includes(item.type))
        ) {
          return false;
        } else {
          return true;
        }
      });

      console.log("---------------------------");

      const totalSales: number = sales.reduce(
        (total, item) => total + Number(item.amount),
        0
      );
      const totalExpenses: number = expenses.reduce(
        (total, item) => total + Number(item.amount),
        0
      );

      updatedReports[y].month[m] = {
        ...monthReport,
        sales,
        expenses,
        totalSales,
        totalExpenses,
      };

      if (!editedYears.includes(yearReport.year)) {
        editedYears.push(yearReport.year);
      }
    }
  }

  return {
    updatedReports,
    editedYears,
  };
}
