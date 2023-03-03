export interface User {
    categories: string[];
}

export interface Item {
    id: number;
    date: string;
    invoiceId: number;
    state: boolean;
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

export interface Sale {
    id: number;
    date: string;
    itemId: number;
    price: number;
    cost: number;
    shipment: boolean;
}

export interface Expense {
    id: number;
    date: string;
    category: string;
    description: string;
    cost: number;
    quantity: number;
}

export interface RootState {
    user: User;
    items: Item[];
    invoices: Invoice[];
    sales: Sale[]
    expenses: Expense[];
    loading: boolean;
}