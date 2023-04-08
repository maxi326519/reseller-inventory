import { Timestamp } from "firebase/firestore";

export interface User {
  categories: string[];
  sources: string[];
}

export interface Item {
  id: number;
  date: Timestamp;
  invoiceId: number;
  state: string;
  cost: number | string;
  description: string;
}

export interface Invoice {
  id: number;
  type: InvoiceType;
  date: Timestamp;
  items: number[];
  form: string;
  source: string;
  total: number;
  image: string;
  imageRef: string;
}

export interface InvoiceExpenses {
  id: number;
  type: InvoiceType;
  date: Timestamp;
  category: string;
  items: number[];
  total: number;
  image: string;
  imageRef: string;
}

export enum InvoiceType {
  Purchase,
  Expenses,
}

export interface Expense {
  id: number;
  date: Timestamp;
  price: number | string;
  category: string;
  description: string;
  invoiceId: number;
}

export interface Sale {
  id: number;
  date: Timestamp;
  cost: number;
  price: number | string;
  productId: number;
  shipment: Shipment;
  expenses: ExpenseRef[];
}

interface ExpenseRef {
  id: number;
  cost: number;
}

export interface Shipment {
  value: boolean;
  amount: number | string;
}

/* REPORTS */
export interface YearReport {
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
  type: string;
  amount: number;
}

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
    otherCategories: Array<{
      category: string,
      total: number
    }>
  };
}

/* 
  Necesito una funcion en Typescript que:
  - Reciba list: OtherCategory, category: string, amount: number
  - Debera convertir el texto de category a CammelCase (Ej: Shipping Label => shippingLabel)
  - Guardar esa conversion y el total en un variable del Tipo OtherCategory
  - Luego revisar "list" y si existe algun objeto con la propiedad category igual a la que acabamos de crear, sumar sus totales y devolver el listado
  OtherCategory: Array<{
      category: string,
      total: number
    }
  */

export interface RootState {
  user: User;
  items: Item[];
  invoices: {
    data: Array<Invoice | InvoiceExpenses>;
    details: Array<Item> | Array<Expense>;
  };
  sales: {
    items: Item[];
    sales: Sale[];
    expenses: Expense[];
  };
  reports: YearReport[];
  loading: boolean;
}
