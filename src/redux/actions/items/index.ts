import {
  collection,
  doc,
  getDocs,
  query,
  updateDoc,
  where,
  writeBatch,
  deleteField,
} from "@firebase/firestore";
import { Expense, Item, RootState } from "../../../interfaces";
import { ThunkAction } from "redux-thunk";
import { AnyAction } from "redux";
import { Dispatch } from "react";
import { auth, db } from "../../../firebase";
import { Timestamp } from "firebase/firestore";
import { endOfMonth, endOfYear, startOfMonth, startOfYear } from "date-fns";

export const POST_ITEMS = "POST_ITEMS";
export const GET_ITEMS = "GET_ITEMS";
export const GET_ITEMS_EXPIRED = "GET_ITEMS_EXPIRED";
export const GET_ITEMS_INVOICE_DETAILS = "GET_ITEMS_INVOICE_DETAILS";
export const EXPIRED_ITEMS = "EXPIRED_ITEMS";
export const REFOUND_ITEMS = "REFOUND_ITEMS";
export const RESTORE_ITEMS = "RESTORE_ITEMS";
export const DELETE_SOLD_ITEMS = " DELETE_SOLD_ITEMS";
export const DELETE_ITEMS_INVOICE_DETAILS = "DELETE_ITEMS_INVOICE_DETAILS";

export function postItems(
  items: Item[]
): ThunkAction<Promise<void>, RootState, null, AnyAction> {
  return async (dispatch: Dispatch<AnyAction>) => {
    try {
      if (auth.currentUser === null) throw new Error("unauthenticated user");
      const batch = writeBatch(db);

      // Agregar documentos al batch
      const itemsRef = collection(db, "Users", auth.currentUser.uid, "Items");

      items.forEach((item) => {
        batch.set(doc(itemsRef, item.id.toString()), { ...item });
      });

      await batch.commit();

      dispatch({
        type: POST_ITEMS,
        payload: items,
      });
    } catch (err: any) {
      throw new Error(err);
    }
  };
}

export function getStockItems(): ThunkAction<
  Promise<void>,
  RootState,
  null,
  AnyAction
> {
  return async (dispatch: Dispatch<AnyAction>) => {
    try {
      if (auth.currentUser === null) throw new Error("unauthenticated user");

      let newItems: Array<any> = [];
      const itemRef = collection(db, "Users", auth.currentUser.uid, "Items");
      const newQuery = query(itemRef, where("state", "==", "In Stock"));
      const response = await getDocs(newQuery);

      response.forEach((doc) => {
        newItems.push(doc.data());
      });

      dispatch({
        type: GET_ITEMS,
        payload: newItems,
      });
    } catch (e: any) {
      throw new Error(e);
    }
  };
}

export function getItemInvoiceDetail(
  invoiceId: number
): ThunkAction<Promise<void>, RootState, null, AnyAction> {
  return async (dispatch: Dispatch<AnyAction>) => {
    try {
      if (auth.currentUser === null) throw new Error("unauthenticated user");

      let invoice = {};
      let items: any = [];

      // Get invoice
      const invoiceRef = collection(
        db,
        "Users",
        auth.currentUser.uid,
        "Invoices"
      );
      const newQueryInvoice = query(invoiceRef, where("id", "==", invoiceId));
      const invoiceResponse = await getDocs(newQueryInvoice);

      invoiceResponse.forEach((doc) => {
        invoice = doc.data();
      });

      // Get items
      const itemRef = collection(db, "Users", auth.currentUser.uid, "Items");
      const newQueryItems = query(itemRef, where("invoiceId", "==", invoiceId));
      const itemsResponse = await getDocs(newQueryItems);

      itemsResponse.forEach((doc) => {
        items.push(doc.data());
      });

      dispatch({
        type: GET_ITEMS_INVOICE_DETAILS,
        payload: {
          invoice,
          items,
        },
      });
    } catch (e: any) {
      throw new Error(e);
    }
  };
}

export function deleteItemInvoiceDetail() {
  return {
    type: DELETE_ITEMS_INVOICE_DETAILS,
  };
}

export function expiredItems(
  itemsID: number[],
  expenses: Expense[]
): ThunkAction<Promise<void>, RootState, null, AnyAction> {
  return async (dispatch: Dispatch<AnyAction>) => {
    try {
      if (auth.currentUser === null) throw new Error("unauthenticated user");

      const batch = writeBatch(db);
      const itemsRef = collection(db, "Users", auth.currentUser.uid, "Items");
      const expensesRef = collection(
        db,
        "Users",
        auth.currentUser.uid,
        "Expenses"
      );

      itemsID.forEach((id) => {
        batch.update(doc(itemsRef, id.toString()), {
          state: "Expired",
          expired: Timestamp.now(),
        });
      });

      expenses.forEach((expense) => {
        batch.set(doc(expensesRef, expense.id.toString()), expense);
      });

      await batch.commit();

      dispatch({
        type: EXPIRED_ITEMS,
        payload: itemsID,
      });
    } catch (e: any) {
      throw new Error(e);
    }
  };
}

export function getExpired(
  year: number,
  month: number | null
): ThunkAction<Promise<void>, RootState, null, AnyAction> {
  return async (dispatch: Dispatch<AnyAction>) => {
    try {
      if (auth.currentUser === null) throw new Error("unauthenticated user");

      // Date range
      let startDate: Date;
      let endDate: Date;

      // Per year or month
      if (month !== null) {
        startDate = startOfMonth(new Date(Number(year), Number(month) - 1));
        endDate = endOfMonth(new Date(Number(year), Number(month) - 1));
      } else {
        startDate = startOfYear(new Date(Number(year), 0));
        endDate = endOfYear(new Date(Number(year), 11));
      }

      // Convert to firebase Timestamp
      const startTimeStamp = Timestamp.fromDate(startDate);
      const endTimeStamp = Timestamp.fromDate(endDate);

      const itemsRef = collection(db, "Users", auth.currentUser.uid, "Items");

      const itemsQuery = await getDocs(
        query(
          itemsRef,
          where("expired", ">=", startTimeStamp),
          where("expired", "<=", endTimeStamp)
        )
      );

      let items: any = [];
      itemsQuery.forEach((doc: any) => {
        items.push(doc.data());
      });

      dispatch({
        type: GET_ITEMS_EXPIRED,
        payload: items,
      });
    } catch (e: any) {
      throw new Error(e);
    }
  };
}

export function refoundItems(
  itemID: number
): ThunkAction<Promise<void>, RootState, null, AnyAction> {
  return async (dispatch: Dispatch<AnyAction>) => {
    try {
      if (auth.currentUser === null) throw new Error("unauthenticated user");
      const itemsRef = collection(db, "Users", auth.currentUser.uid, "Items");
      await updateDoc(doc(itemsRef, itemID.toString()), { state: "In Stock" });

      dispatch({
        type: REFOUND_ITEMS,
        payload: itemID,
      });
    } catch (e: any) {
      throw new Error(e);
    }
  };
}

export function restoreItem(
  itemID: number
): ThunkAction<Promise<void>, RootState, null, AnyAction> {
  return async (dispatch: Dispatch<AnyAction>) => {
    try {
      if (auth.currentUser === null) throw new Error("unauthenticated user");
      const itemsRef = collection(db, "Users", auth.currentUser.uid, "Items");
      await updateDoc(doc(itemsRef, itemID.toString()), {
        state: "In Stock",
        expired: deleteField(),
      });

      dispatch({
        type: RESTORE_ITEMS,
        payload: itemID,
      });
    } catch (e: any) {
      throw new Error(e);
    }
  };
}

export function deleteSoldItem(
  itemID: number
): ThunkAction<Promise<void>, RootState, null, AnyAction> {
  return async (dispatch: Dispatch<AnyAction>) => {
    try {
      if (auth.currentUser === null) throw new Error("unauthenticated user");

      const batch = writeBatch(db);

      const itemsRef = collection(db, "Users", auth.currentUser.uid, "Items");
      const salesRef = collection(db, "Users", auth.currentUser.uid, "Sales");
      const expensesRef = collection(
        db,
        "Users",
        auth.currentUser.uid,
        "Expenses"
      );

      // Update item status
      batch.update(doc(itemsRef, itemID.toString()), {
        state: "In Stock",
      });

      // Delete items sales
      const salesQuery = await getDocs(
        query(salesRef, where("productId", "==", itemID))
      );
      if (!salesQuery.empty) {
        salesQuery.forEach((doc) => {
          batch.delete(doc.ref);
        });
      }

      // Delete items expenses
      const expensesQuery = await getDocs(
        query(expensesRef, where("id", "==", itemID))
      );
      if (!expensesQuery.empty) {
        expensesQuery.forEach((doc) => {
          batch.delete(doc.ref);
        });
      }

      await batch.commit();

      dispatch({
        type: DELETE_SOLD_ITEMS,
        payload: itemID,
      });
    } catch (e: any) {
      throw new Error(e);
    }
  };
}
