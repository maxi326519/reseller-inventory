import {
  InvoiceType,
  Item,
  RootState,
  Sale,
} from "../../interfaces/interfaces";
import { AnyAction } from "redux";
import { LOADING, CLOSE_LOADING } from "../actions/loading";
import { POST_SOURCES, POST_CATEGORIES, GET_USER_DATA } from "../actions/user";
import {
  POST_ITEMS,
  GET_ITEMS,
  EXPIRED_ITEMS,
  REFOUND_ITEMS,
  GET_ITEMS_EXPIRED,
  RESTORE_ITEMS,
  GET_ITEMS_INVOICE_DETAILS,
  DELETE_ITEMS_INVOICE_DETAILS,
  UPDATE_ITEM,
  DELETE_ITEM,
} from "../actions/items";
import {
  POST_INVOICE,
  GET_INVOICE,
  DELETE_INVOICE,
  GET_INVOICE_DETAILS,
} from "../actions/invoices";
import { DELETE_SALE, GET_SALES, POST_SALE } from "../actions/sales";
import { POST_EXPENSES, GET_SOLD_EXPENSES } from "../actions/expenses";
import {
  GET_REPORTS,
  GET_EXPIRED_ITEMS,
  UPDATE_REPORTS,
  DELETE_ITEMS_REPORTS,
} from "../actions/reports";
import { Timestamp } from "firebase/firestore";

const initialState: RootState = {
  user: {
    categories: ["General"],
    sources: [],
  },
  items: {
    data: [],
    details: {
      invoice: {
        id: 0,
        type: InvoiceType.Purchase,
        date: Timestamp.now(),
        items: 0,
        form: "",
        source: "",
        total: 0,
        image: "",
        imageRef: "",
      },
      items: [],
    },
  },
  invoices: {
    data: [],
    details: [],
  },
  sales: {
    items: [],
    sales: [],
    expenses: [],
  },
  expired: [],
  reports: [],
  loading: false,
};

export const rootReducer = (
  state: RootState = initialState,
  action: AnyAction
) => {
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
        items: {
          ...state.items,
          data: [...state.items.data, ...action.payload],
        },
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
      const salesData = action.payload.sales;
      const expensesData = action.payload.expenses;
      let stockItems: Item[] = [];
      let soldItems: Item[] = [];

      state.items.data.forEach((item) => {
        if (salesData.some((sale: Sale) => sale.productId === item.id)) {
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
        items: {
          ...state.items,
          data: stockItems,
        },
        sales: {
          items: [...state.sales.items, ...soldItems],
          sales: [...state.sales.sales, ...salesData],
          expenses: [...state.sales.expenses, ...expensesData],
        },
      };
    case POST_EXPENSES:
      return {
        ...state,
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
        items: {
          ...state.items,
          data: action.payload,
        },
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
          details: [...action.payload],
        },
      };

    case GET_ITEMS_INVOICE_DETAILS:
      return {
        ...state,
        items: {
          ...state.items,
          details: {
            invoice: action.payload.invoice,
            items: action.payload.items,
          },
        },
      };

    case GET_REPORTS:
      return {
        ...state,
        reports: action.payload,
      };
    case GET_SALES:
      return {
        ...state,
        sales: {
          items: action.payload.items,
          sales: action.payload.sales,
          expenses: action.payload.expenses,
        },
      };
    case GET_SOLD_EXPENSES:
      return {
        ...state,
        sales: {
          ...state.sales,
          expenses: [...action.payload],
        },
      };

    case GET_ITEMS_EXPIRED:
      return {
        ...state,
        expired: action.payload,
      };

    // UPDATES
    case UPDATE_REPORTS:
      return {
        ...state,
        reports: action.payload,
      };

    case UPDATE_ITEM:
      return {
        ...state,
        items: {
          ...state.items,
          data: state.items.data.map((item) =>
            item.id === action.payload.item.id ? action.payload.item : item
          ),
        },
        invoices: {
          data: state.invoices.data.map((invoice) =>
            invoice.id === action.payload.invoice.id
              ? action.payload.invoice
              : invoice
          ),
          details: state.invoices.details.map((item) =>
            item.id === action.payload.item.id ? action.payload.item : item
          ),
        },
      };

    case DELETE_ITEM:
      return {
        ...state,
        items: {
          ...state.items,
          data: state.items.data.filter(
            (item) => item.id !== action.payload.item.id
          ),
        },
        invoices: {
          data:
            action.payload.invoice.items === 0
              ? state.invoices.data.filter(
                  (invoice) => invoice.id !== action.payload.invoice.id
                )
              : state.invoices.data.map((invoice) =>
                  invoice.id === action.payload.invoice.id
                    ? action.payload.invoice
                    : invoice
                ),
          details: state.invoices.details
            .map((item) => item)
            .filter((item) => item.id !== action.payload.item.id),
        },
        sales: {
          items: state.sales.items.filter(
            (item) => item.id !== action.payload.item.id
          ),
          sales: state.sales.sales.filter(
            (sale) => sale.id !== action.payload.item.id
          ),
          expenses: state.sales.expenses.filter(
            (expense) => expense.id !== action.payload.item.id
          ),
        },
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
        items: {
          ...state.items,
          data: state.items.data.filter(
            (item) => item.invoiceId !== action.payload.id
          ),
        },
        sales: {
          items: state.sales.items.filter(
            (item) => item.invoiceId !== action.payload.id
          ),
          sales: state.sales.sales.filter(
            (sale) => sale.invoiceId !== action.payload.id
          ),
          expenses: state.sales.expenses.filter(
            (expense) => expense.invoiceId !== action.payload.id
          ),
        },
      };

    case DELETE_ITEMS_REPORTS:
      return {
        ...state,
        reports: action.payload,
      };

    case DELETE_SALE:
      let itemsData: Item[] = state.items.data;
      console.log(1);

      // if sale is not refounded
      if (!action.payload.refounded) {
        console.log(2);
        // Get item to restore
        const restoreItem: Item = state.sales.items.find((item) =>
          item.sales?.some((sale) => sale.id === action.payload.id)
        )!;
        console.log(3);
        // Update items list
        itemsData = [
          ...state.items.data,
          {
            ...restoreItem,
            state: "In Stock",
            sales: restoreItem.sales?.filter(
              (sale) => sale.id !== action.payload.id
            ),
          },
        ];
      }
      console.log(4);
      return {
        ...state,
        items: {
          ...state.items,
          data: itemsData,
        },
        sales: {
          ...state.sales,
          sales: state.sales.sales.filter(
            (sale) => sale.id !== action.payload.id
          ),
          expenses: state.sales.expenses.filter(
            (expense) => expense.id !== action.payload.id
          ),
        },
      };

    case DELETE_ITEMS_INVOICE_DETAILS:
      return {
        ...state,
        items: {
          ...state.items,
          details: {
            invoice: {
              id: 0,
              type: InvoiceType.Purchase,
              date: Timestamp.now(),
              items: [],
              form: "",
              source: "",
              total: 0,
              image: "",
              imageRef: "",
            },
            items: [],
          },
        },
      };
    // OTHER
    case EXPIRED_ITEMS:
      return {
        ...state,
        items: {
          ...state.items,
          data: state.items.data.filter(
            (item) => !action.payload?.includes(item.id)
          ),
        },
        expired: state.items.data
          .filter((item) => action.payload?.includes(item.id))
          .map((item) => ({
            ...item,
            state: "Expired",
            expired: Timestamp.now(),
          })),
      };

    case REFOUND_ITEMS:
      return {
        ...state,
        items: {
          ...state.items,
          data: [...state.items.data, action.payload.item],
        },
        sales: {
          items: state.sales.items.map((item) =>
            item.id === action.payload.item.id ? action.payload.item : item
          ),
          sales: state.sales.sales.map((sale) =>
            sale.id === action.payload.saleUpdate.id
              ? { ...sale, ...action.payload.saleUpdate }
              : sale
          ),
          expenses: [...state.sales.expenses, ...action.payload.newExpenses],
        },
      };

    case RESTORE_ITEMS:
      const itemToRestore = state.expired.find(
        (item) => item.id === action.payload
      );

      return {
        ...state,
        items: {
          ...state.items,
          data: [...state.items.data, { ...itemToRestore, state: "In Stock" }],
        },
        expired: state.expired.filter((item) => item.id !== action.payload),
      };

    default:
      return state;
  }
};
