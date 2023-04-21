import { Item, RootState, Sale } from "../../interfaces";
import { AnyAction } from "redux";
import { LOADING, CLOSE_LOADING } from "../actions/loading";
import { POST_SOURCES, POST_CATEGORIES, GET_USER_DATA } from "../actions/user";
import {
  POST_ITEMS,
  GET_ITEMS,
  EXPIRED_ITEMS,
  REFOUND_ITEMS,
} from "../actions/items";
import {
  POST_INVOICE,
  GET_INVOICE,
  DELETE_INVOICE,
  GET_INVOICE_DETAILS,
} from "../actions/invoices";
import { POST_SALE, GET_SALES } from "../actions/sales";
import { POST_EXPENSES, GET_EXPENSES } from "../actions/expenses";
import {
  GET_REPORTS,
  GET_SOLD_REPORT_DATA,
  GET_EXPIRED_ITEMS,
  UPDATE_REPORTS,
} from "../actions/reports";

const initialState: RootState = {
  user: {
    categories: ["General"],
    sources: [],
  },
  items: [],
  invoices: {
    data: [],
    details: [],
  },
  sales: {
    items: [],
    sales: [],
    expenses: [],
    expired: [],
  },
  reports: [],
  loading: false,
};

export const rootReducer = (state: RootState = initialState, action: AnyAction) => {
  switch (action.type) {
    /* LOADING */
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
        
        // POST
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
        invoices: {
          ...state.invoices,
          data: [...state.invoices.data, action.payload],
        },
      };
    case POST_SALE:
      let stockItems: Item[] = [];
      let soldItems: Item[] = [];

      state.items.forEach((item) => {
        if (action.payload.some((sale: Sale) => sale.productId === item.id)) {
          soldItems.push({
            ...item,
            state: "Sold",
          });
        } else {
          stockItems.push(item);
        }
      });

      return {
        ...state,
        items: stockItems,
        sales: {
          items: soldItems,
          sales: [...state.sales.sales, ...action.payload],
          expenses: state.sales.expenses,
          expired: state.sales.expired,
        },
      };
      
      // GET 
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
    case GET_EXPIRED_ITEMS:
      return {
        ...state,
        sales: {
          ...state.sales,
          expired: action.payload,
        },
      };
      case GET_INVOICE:
        return {
          ...state,
          invoices: {
            ...state.invoices,
            data: action.payload,
          },
        };
        case GET_INVOICE_DETAILS:
          return {
        ...state,
        invoices: {
          ...state.invoices,
          details: action.payload,
        },
      };
      case GET_REPORTS:
        return {
          ...state,
          reports: action.payload,
        };
        case GET_SOLD_REPORT_DATA:
          return {
        ...state,
        sales: {
          items: action.payload.items,
          sales: action.payload.sales,
          expenses: action.payload.expenses,
          expired: state.sales.expired,
        },
      };
      case GET_EXPENSES:
        return {
          ...state,
          expenses: [...action.payload],
        };

    // UPDATES
    case UPDATE_REPORTS:
      return {
        ...state,
        reports: action.payload,
      };

    // DELETE
    case DELETE_INVOICE:
      return {
        ...state,
        invoices: {
          data: state.invoices.data.filter(
            (invoice) => invoice.id !== action.payload.id
          ),
          details: [],
        },
        items: state.items.filter(
          (item) => !action.payload.items.some((id: number) => id === item.id)
        ),
        sales: {
          items: state.sales.items.filter(
            (item) => !action.payload.items.some((id: number) => id === item.id)
          ),
          sales: state.sales.sales.filter(
            (sale) =>
              !action.payload.items.some((id: number) => id === sale.productId)
          ),
          expenses: [],
          expired: state.sales.expired,
        },
      };

    // OTHER
    case EXPIRED_ITEMS:
      return {
        ...state,
        items: state.items.filter(
          (i) => !action.payload.some((itemId: number) => itemId === i.id)
        ),
        sales: {
          ...state.sales,
          expired: [
            ...state.sales.expired,
            ...state.items
              .filter((i) =>
                action.payload.some((itemId: number) => itemId === i.id)
              )
              .map((i) => ({
                ...i,
                state: "Expired",
              })),
          ],
        },
      };

    case REFOUND_ITEMS:
      return {
        ...state,
        items: [
          ...state.items,
          {
            ...state.sales.expired.find((i) => action.payload === i.id),
            state: "In Stock",
          },
        ],
        sales: {
          ...state.sales,
          expired: state.sales.expired.filter((e) => e.id !== action.payload),
        },
      };
    default:
      return state;
  }
};