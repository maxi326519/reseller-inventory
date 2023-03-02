export interface User {
    sequencial: number;
    categories: Categories[];
}

export interface Categories {
    value: number;
    name: string;
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
    solds: Array<number>;
    form: string;
    source: string;
    total: number;
}

export interface Sale {
    itemId: number;
    price: number;
    cost: number;
    shipment: boolean;
}

export interface Expense {
    id: string;
    date: string;
    category: number;
    description: string;
    const: string;
}

export interface RootState {
    user: User;
    items: Item[];
    invoices: Invoice[];
    sales: Sale[]
    expenses: Expense[];
}