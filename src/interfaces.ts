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
}
export interface Expense {
  id: number;
  date: string;
  category: string;
  description: string;
  cost: number;
  quantity: number;
}

export interface Sale {
  date: string;
  sold: Sold[];
  total: number;
  shipment: Shipment;
  expenses: ExpenesesSold[];
}

export interface Sold {
  itemID: number;
  price: number;
}

export interface Shipment {
  value: boolean;
  amount: 0;
}
export interface ExpenesesSold {
  description: string;
  amount: number;
}

export interface Reports {}

export interface RootState {
  user: User;
  items: Item[];
  invoices: Invoice[];
  sales: Sale[];
  expenses: Expense[];
  reports: Reports[];
  loading: boolean;
}
