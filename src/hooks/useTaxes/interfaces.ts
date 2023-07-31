
export interface YearTaxesData {
  year: number;
  month: MonthTaxesData[];
}

export interface MonthTaxesData {
  month: {
    number: number;
    name: string;
  };
  sales: {
    total: number;
    sales: number;
    shipment: number;
  };
  expenses: {
    total: number;
    COGS: number;
    shipLabel: number;
    ebayFees: number;
    adsFee: number;
    otherExpense: number;
    otherCategories: OtherCategories[];
  };
}

export interface OtherCategories {
  category: string;
  total: number;
}

export const initYearTaxesData = (year?: number): YearTaxesData => ({
  year: year || 0,
  month: initAllMonthTaxesData()
});

export const initAllMonthTaxesData = (): MonthTaxesData[] => {
  const newMonthTaxesReport: MonthTaxesData[] = [];

  // Create the 12 months of the year
  for (let i = 1; i <= 12; i++) {
    newMonthTaxesReport.push(initMonthTaxesData(i));
  }

  return newMonthTaxesReport;
};

export const initMonthTaxesData = (month: number): MonthTaxesData => ({
  month: {
    number: month,
    name: names[month - 1],
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
    otherCategories: [],
  },
})

const names = [
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