import { YearReport, MonthReport, Expense, Sale, ReportItem } from "../interfaces";

export function calculeReports(
  reports: YearReport[],
  data: any,
  isExpense: boolean
) {
  let years: string[] = []; // Save years of matching expenses
  let missingYears: string[] = []; // Save years of missing expenses
  let newReports: YearReport[] = []; // Save all reports

  if (reports.length <= 0)
    reports.push(reportGenerator(new Date().getFullYear().toString()));

  /* Matching and missing date search */
  data.forEach((d: any) => {
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
                        d.date.split("-")[0] === r.year.toString() &&
                        d.date.split("-")[1] ===
                          `0${month.month.toString()}`.slice(-2)
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

export function deleteDataAndUpdateTotals(id: number[], reports: YearReport[]) {
  const updatedReports: YearReport[] = [...reports];
  const editedYears: string[] = [];
  
  for (let i = 0; i < updatedReports.length; i++) {
    const yearReport: YearReport = updatedReports[i];
    
    for (let j = 0; j < yearReport.month.length; j++) {
      const monthReport: MonthReport = yearReport.month[j];
      const sales: ReportItem[] = monthReport.sales.filter((item) => !id.includes(item.id));
      const expenses: ReportItem[] = monthReport.expenses.filter((item) => !id.includes(item.id));
      const totalSales: number = sales.reduce((total, item) => total + item.amount, 0);
      const totalExpenses: number = expenses.reduce((total, item) => total + item.amount, 0);
      
      updatedReports[i].month[j] = {
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
  }
}