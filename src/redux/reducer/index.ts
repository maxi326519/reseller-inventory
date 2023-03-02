import { RootState } from "../../interfaces";
import { AnyAction } from "redux";
import {
  POST_ITEMS,
  POST_INVOICE,
  LOADING,
  CLOSE_LOADING,
  GET_ITEMS,
  GET_INVOICE,
} from "../actions";

const initialState: RootState = {
  user: {
    sequencial: 0,
    categories: [],
  },
  items: [],
  invoices: [],
  sales: [],
  expenses: [],
  loading: false,
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

    case LOADING:
      return {
        ...state,
        loading: true,
      };

    case CLOSE_LOADING:
      return {
        ...state,
        loading: false,
      };

    case GET_ITEMS:
      return {
        ...state,
        items: action.payload,
      };

    case GET_INVOICE:
      return {
        ...state,
        invoices: action.payload,
      };

    default:
      return state;
  }
};
