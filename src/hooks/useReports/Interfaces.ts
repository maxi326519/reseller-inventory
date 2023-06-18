export interface YearReport {
  year: number;
  months: {
    1: MonthReport;
    2: MonthReport;
    3: MonthReport;
    4: MonthReport;
    5: MonthReport;
    6: MonthReport;
    7: MonthReport;
    8: MonthReport;
    9: MonthReport;
    10: MonthReport;
    11: MonthReport;
    12: MonthReport;
  };
}

export interface MonthReport {
  sales: Array<ItemReport>;
  expenses: Array<ItemReport>;
}

export interface ItemReport {
  id: number;
  type: string;
  date: string;
  price: number;
}

export enum ItemType {
  sales,
  expenses
}

export const initMonthReport: MonthReport = {
  sales: [],
  expenses: [],
};

export const initYearReport: YearReport = {
  year: 0,
  months: {
    1: initMonthReport,
    2: initMonthReport,
    3: initMonthReport,
    4: initMonthReport,
    5: initMonthReport,
    6: initMonthReport,
    7: initMonthReport,
    8: initMonthReport,
    9: initMonthReport,
    10: initMonthReport,
    11: initMonthReport,
    12: initMonthReport,
  },
};
