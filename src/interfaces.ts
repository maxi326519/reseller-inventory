export interface User {
  categories: string[];
  sources: string[];
}

export interface Item {
  id: number;
  date: string;
  invoiceId: number;
  state: string;
  cost: number | string;
  description: string;
}

export interface Invoice {
  id: number;
  date: string;
  items: number[];
  form: string;
  source: string;
  total: number;
  image: string;
  imageRef: string;
}

export interface InvoiceExpense {
  id: number;
  date: string;
  items: number[];
  form: string;
  source: string;
  total: number;
  image: string;
  imageRef: string;
}
export interface Expense {
  id: number;
  date: string;
  price: number | string;
  category: string;
  description: string;
}

export interface Sale {
  id: number;
  date: string;
  cost: number;
  price: number;
  productId: number;
  shipment: Shipment;
  expenses: ExpenseRef[];
}

interface ExpenseRef{
  id: number;
  cost: number;
}

export interface Shipment {
  value: boolean;
  amount: number | string;
}

/* REPORTS */
export interface YearReport{
  year: string;
  month: MonthReport[];
}

export interface MonthReport {
  month: string;
  expenses: ReportItem[];
  sales: ReportItem[];
  totalExpenses: number;
  totalSales: number;
}

export interface ReportItem {
  id: number;
  type: string,
  amount: number;
}

export interface YearTaxesData{
  year: number;
  month: MonthTaxesData[];
}

export interface MonthTaxesData {
  month: {
    number: number;
    name: string;
  };
  sales: {
    total: number,
    sales: number,
    shipment: number,
  },
  expenses: {
    total: number,
    COGS: number,
    shipLabel: number,
    ebayFees: number,
    adsFee: number,
    otherExpense: number,
  }
}

export interface RootState {
  user: User;
  items: Item[];
  invoices: Invoice[];
  sales: Sale[];
  expenses: Expense[];
  reports: YearReport[];
  loading: boolean;
}
