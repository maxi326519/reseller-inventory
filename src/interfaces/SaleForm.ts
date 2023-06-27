export interface OtherExpenses {
  itemId: number;
  adsFee: {
    check: boolean;
    cost: number | string;
  };
  other: {
    check: boolean;
    description: string;
    cost: number | string;
  };
}

export interface ShipingExpenses {
  itemId: number;
  shipLabel: number | string;
  ebayFees: number | string;
}

export interface Errors {
  price: null | string;
  shipment: null | string;
  expenses: {
    shipLabel: null | string;
    ebayFees: null | string;
    adsFee: null | string;
    other: {
      description: null | string;
      cost: null | string;
    };
  };
}

export const initOtherExpenses: OtherExpenses = {
  itemId: 0,
  adsFee: { check: false, cost: "" },
  other: { check: false, description: "", cost: "" },
};

export const initShipingExpenses: ShipingExpenses = {
  itemId: 0,
  shipLabel: "",
  ebayFees: "",
};

export const initErrors: Errors = {
  price: null,
  shipment: null,
  expenses: {
    shipLabel: null,
    ebayFees: null,
    adsFee: null,
    other: {
      description: null,
      cost: null,
    },
  },
};