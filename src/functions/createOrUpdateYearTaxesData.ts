import { YearReport, YearTaxesData, MonthTaxesData, Sale, Expense } from "../interfaces/interfaces";

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
        shipLabel: 0,
        ebayFees: 0,
        adsFee: 0,
        otherExpense: 0,
        otherCategories: []
      },
    };
    monthReport.sales.forEach((item) => {
      switch (item.type) {
        case "Sale":
          monthTaxesData.sales.sales += Number(item.amount);
          break;
        case "Shipment":
          monthTaxesData.sales.shipment += Number(item.amount);
          break;
        default:
          // Do nothing for other types of sales items
          break;
      }
    });
    monthReport.expenses.forEach((item) => {
      switch (item.type) {
        case "COGS":
          monthTaxesData.expenses.COGS += Number(item.amount);
          break;
        case "Ship Label":
          monthTaxesData.expenses.shipLabel += Number(item.amount);
          break;
        case "Ebay Fees":
          monthTaxesData.expenses.ebayFees += Number(item.amount);
          break;
        case "Ads Fee":
          monthTaxesData.expenses.adsFee += Number(item.amount);
          break;
        case "Other":
          monthTaxesData.expenses.otherExpense += Number(item.amount);
          break;
        default:
          const updatedOtherCategories = updateOtherCategoryList(monthTaxesData.expenses.otherCategories, item.type, Number(item.amount));
          monthTaxesData.expenses.otherCategories = updatedOtherCategories;
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

function updateOtherCategoryList(list: Array<{category: string, total: number}>, category: string, amount: number): Array<{category: string, total: number}> {
  const camelCaseCategory = category.replace(/\W+(.)/g, (match, char) => char.toUpperCase());
  const matchingCategory = list.find(item => item.category === camelCaseCategory);
  
  if (matchingCategory) {
    matchingCategory.total += amount;
  } else {
    list.push({ category: camelCaseCategory, total: amount });
  }
  
  return list;
}

function generateYearTaxesData(year: number): YearTaxesData {
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
        shipLabel: 0,
        ebayFees: 0,
        adsFee: 0,
        otherExpense: 0,
        otherCategories: []
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
