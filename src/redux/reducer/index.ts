import { RootState } from "../../interfaces";
import { AnyAction } from "redux";
import {
  POST_ITEMS,
  POST_INVOICE,
  POST_CATEGORIES,
  LOADING,
  CLOSE_LOADING,
  GET_USER_DATA,
  GET_ITEMS,
  GET_INVOICE,
  GET_EXPENSES,
} from "../actions";

const initialState: RootState = {
  user: {
    categories: [],
  },
  items: [],
  invoices: [],
  sales: [],
  expenses: [],
  reports: [],
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

    case POST_CATEGORIES:
      console.log(action.payload);
      return {
        ...state,
        user: { ...state.user, categories: action.payload },
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

    case GET_USER_DATA:
      return {
        ...state,
        user: action.payload,
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

    case GET_EXPENSES:
      return {
        ...state,
        expenses: action.payload,
      };

    default:
      return state;
  }
};
