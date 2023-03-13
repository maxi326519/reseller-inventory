export interface User {
  categories: string[];
}

export interface Item {
  id: number;
  date: string;
  invoiceId: number;
  state: string;
  cost: number;
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
export interface Expense {
  id: number;
  date: string;
  price: number;
  category: string;
  description: string;
}

export interface Sale {
  id: number;
  date: string;
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
  amount: number;
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

export interface RootState {
  user: User;
  items: Item[];
  invoices: Invoice[];
  sales: Sale[];
  expenses: Expense[];
  reports: YearReport[];
  loading: boolean;
}
