import { RootState, Sale } from "../../interfaces";
import { AnyAction } from "redux";
import {
  LOADING,
  CLOSE_LOADING,
  POST_SOURCES,
  POST_ITEMS,
  POST_INVOICE,
  POST_CATEGORIES,
  POST_SALE,
  GET_USER_DATA,
  GET_ITEMS,
  GET_INVOICE,
  GET_REPORTS,
  GET_EXPENSES,
  UPDATE_REPORTS,
  DELETE_INVOICE,
  EXPIRED_ITEMS,
  RESTORE_ITEMS,
} from "../actions";

const initialState: RootState = {
  user: {
    categories: ["General"],
    sources: [],
  },
  invoices: [],
  items: [],
  sales: [],
  expenses: [],
  reports: [],
  loading: false,
};

export const Reducer = (state: RootState = initialState, action: AnyAction) => {
  switch (action.type) {
    case POST_CATEGORIES:
      return {
        ...state,
        user: { ...state.user, categories: action.payload },
      };

    case POST_SOURCES:
      return {
        ...state,
        user: { ...state.user, sources: action.payload },
      };

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

    case POST_SALE:
      return {
        ...state,
        sales: [...state.sales, ...action.payload],
        items: state.items.map((item) => {
          if (action.payload.some((sale: Sale) => sale.productId === item.id)) {
            return {
              ...item,
              state: "Sold",
            };
          }
          return item;
        }),
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
        user: { ...state.user, ...action.payload },
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

    case GET_REPORTS:
      return {
        ...state,
        reports: action.payload,
      };

    case GET_EXPENSES:
      return {
        ...state,
        expenses: action.payload,
      };

    case UPDATE_REPORTS:
      return {
        ...state,
        reports: action.payload,
      };

    case EXPIRED_ITEMS:
      return {
        ...state,
        items: state.items.map((item) => {
          if (action.payload.some((id: number) => id === item.id)) {
            return {
              ...item,
              state: "Expired",
            };
          }
          return item;
        }),
      };

    case RESTORE_ITEMS:
      return {
        ...state,
        items: state.items.map((item) => {
          if (item.id === action.payload) {
            return {
              ...item,
              state: "In Stock",
            };
          }
          return item;
        }),
      };

    case DELETE_INVOICE:
      return {
        ...state,
        invoices: state.invoices.filter(
          (invoice) => invoice.id !== action.payload.id
        ),
        items: state.items.filter(
          (item) => !action.payload.items.some((id: number) => id === item.id)
        ),
        sales: state.sales.filter(
          (sale) =>
            !action.payload.items.some((id: number) => id === sale.productId)
        ),
        expenses: state.expenses.filter(
          (expense) =>
            !action.payload.items.some((id: number) => id === expense.id)
        ),
      };
    default:
      return state;
  }
};
