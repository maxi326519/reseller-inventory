export interface Items {
    id: number;
    invoiceId: number;
    state: boolean;
    form: string;
    source: string;
    description: string;
}

export interface Sales {
    itemId: number;
    price: number;
    cost: number;
    shipment: boolean;    
}

export interface Expenses {
    date: string;
    category: number;
    description: string;
    const: string;
}

export interface Categories {
    value: number;
    name: string;
}

export interface invoice {
    date: string;
    solds: Array<number>;
    total: number;
}