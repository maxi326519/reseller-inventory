export interface Items {
    id: number;
    invoiceId: number;
    amount: number;
    state: boolean;
    cost: number;
    description: string;
}

export interface Invoice {
    date: string;
    solds: Array<number>;
    form: string;
    source: string;
    total: number;
}

export interface Sales {
    itemId: number;
    price: number;
    cost: number;
    shipment: boolean;    
}

export interface Expenses {
    id: string;
    date: string;
    category: number;
    description: string;
    const: string;
}

export interface Categories {
    value: number;
    name: string;
}