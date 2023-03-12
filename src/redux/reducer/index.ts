import { RootState } from "../../interfaces";
import { AnyAction } from "redux";
import {
  POST_ITEMS,
  POST_INVOICE,
  POST_CATEGORIES,
  POST_SALE,
  SELL_ITEMS,
  LOADING,
  CLOSE_LOADING,
  GET_USER_DATA,
  GET_ITEMS,
  GET_INVOICE,
  GET_REPORTS,
  GET_EXPENSES,
  UPDATE_REPORTS,
  EXPIRED_ITEMS,
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
      return {
        ...state,
        user: { ...state.user, categories: action.payload },
      };

    case POST_SALE:
      return {
        ...state,
        sales: [...state.sales, action.payload],
      };

    case SELL_ITEMS:
      const updateSate = state.items.map((item) => {
        if (action.payload.some((id: number) => id === item.id)) {
          return {
            ...item,
            state: "sold",
          };
        }
        return item;
      });

      return {
        ...state,
        items: updateSate,
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
          if(action.payload.some((id: number) => id === item.id)){
            return {
              ...item,
              state: "Expired",
            }
          }
          return item
        })
      }
    default:
      return state;
  }
};
