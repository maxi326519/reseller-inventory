import { RootState } from "../../interfaces";
import { AnyAction } from "redux";
import { POST_ITEMS, POST_INVOICE } from "../actions";

const initialState: RootState = {
  user: {
    sequencial: 0,
    categories: [],
  },
  items: [],
  invoices: [],
  sales: [],
  expenses: [],
};

export const Reducer = (state: RootState = initialState, action: AnyAction) => {

  switch (action.type) {
    case POST_ITEMS:
      return {
        ...state,
        items: [...state.items, ...action.payload],
      };

    case POST_INVOICE:
      return {
        ...state,
        invoices: [...state.invoices, action.payload],
      };

    default:
      return state;
  }
};
