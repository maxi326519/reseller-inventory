import { YearReport, YearTaxesData, MonthTaxesData } from "../interfaces";

export function createOrUpdateYearTaxesData(
  yearReport: YearReport | number,
  yearTaxesData: YearTaxesData | null
): YearTaxesData {
  let currentYearTaxesData: YearTaxesData;
  if (typeof yearReport === "number") return generateYearTaxesData(yearReport);

  if (yearTaxesData === null) currentYearTaxesData = generateYearTaxesData(Number(yearReport.year));
  else currentYearTaxesData = yearTaxesData;

  yearReport.month.forEach((monthReport) => {
    const monthTaxesData: MonthTaxesData = {
      month: {
        number: parseInt(monthReport.month),
        name: getEnglishMonthName(parseInt(monthReport.month)),
      },
      sales: {
        total: monthReport.totalSales,
        sales: 0,
        shipment: 0,
      },
      expenses: {
        total: monthReport.totalExpenses,
        COGS: 0,
        shipment: 0,
        ebayFees: 0,
        otherExpense1: 0,
        otherExpense2: 0,
      },
    };
    monthReport.sales.forEach((item) => {
      switch (item.type) {
        case "Sale":
          monthTaxesData.sales.sales += item.amount;
          break;
        case "Shipment":
          monthTaxesData.sales.shipment += item.amount;
          break;
        default:
          // Do nothing for other types of sales items
          break;
      }
    });
    monthReport.expenses.forEach((item) => {
      switch (item.type) {
        case "COGS":
          monthTaxesData.expenses.COGS += item.amount;
          break;
        case "Shipment":
          monthTaxesData.expenses.shipment += item.amount;
          break;
        case "Ebay Fees":
          monthTaxesData.expenses.ebayFees += item.amount;
          break;
        case "SaleOther1":
          monthTaxesData.expenses.otherExpense1 += item.amount;
          break;
        case "SaleOther2":
          monthTaxesData.expenses.otherExpense2 += item.amount;
          break;
        default:
          // Do nothing for other types of expense items
          break;
      }
    });

    const index = parseInt(monthReport.month) - 1;
    currentYearTaxesData.month[index] = {
      ...monthTaxesData,
    };
  });

  return currentYearTaxesData;
}

function generateYearTaxesData(year: number) {
  return {
    year: year,
    month: Array.from({ length: 12 }, (_, i) => ({
      month: {
        number: i + 1,
        name: "",
      },
      sales: {
        total: 0,
        sales: 0,
        shipment: 0,
      },
      expenses: {
        total: 0,
        COGS: 0,
        shipment: 0,
        ebayFees: 0,
        otherExpense1: 0,
        otherExpense2: 0,
      },
    })),
  };
}

function getEnglishMonthName(monthNumber: number): string {
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  return months[monthNumber - 1];
}
