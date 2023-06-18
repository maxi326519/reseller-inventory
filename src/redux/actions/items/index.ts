import {
  collection,
  doc,
  getDocs,
  getDoc,
  query,
  updateDoc,
  where,
  writeBatch,
  deleteField,
} from "@firebase/firestore";
import {
  Expense,
  Invoice,
  Item,
  Refounded,
  RootState,
} from "../../../interfaces/interfaces";
import { ThunkAction } from "redux-thunk";
import { AnyAction } from "redux";
import { Dispatch } from "react";
import { auth, db, storage } from "../../../firebase";
import { Timestamp } from "firebase/firestore";
import { endOfMonth, endOfYear, startOfMonth, startOfYear } from "date-fns";
import { deleteObject, ref } from "firebase/storage";

export const POST_ITEMS = "POST_ITEMS";
export const GET_ITEMS = "GET_ITEMS";
export const GET_ITEMS_EXPIRED = "GET_ITEMS_EXPIRED";
export const GET_ITEMS_INVOICE_DETAILS = "GET_ITEMS_INVOICE_DETAILS";
export const EXPIRED_ITEMS = "EXPIRED_ITEMS";
export const REFOUND_ITEMS = "REFOUND_ITEMS";
export const RESTORE_ITEMS = "RESTORE_ITEMS";
export const UPDATE_ITEM = "UPDATE_ITEM";
export const DELETE_ITEM = "DELETE_ITEM";
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

export function getItemsFromInvoice(
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

export function updateItem(
  updatedItem: Item
): ThunkAction<Promise<void>, RootState, null, AnyAction> {
  return async (dispatch: Dispatch<AnyAction>) => {
    try {
      if (auth.currentUser === null) throw new Error("unauthenticated user");

      const batch = writeBatch(db);
      const uid = auth.currentUser.uid;

      // Collections
      const itemColl = collection(db, "Users", uid, "Items");
      const invoiceColl = collection(db, "Users", uid, "Invoices");

      // ID
      const itemId = updatedItem.id.toString();
      const invoiceId = updatedItem.invoiceId.toString();

      // Get item and invoice
      const itemSnapshot = await getDoc(doc(itemColl, itemId));
      const invoiceSnapshot = await getDoc(doc(invoiceColl, invoiceId));
      const itemData = itemSnapshot.data();
      const invoiceData = invoiceSnapshot.data();

      // Validations
      if (!itemData) throw new Error("Item not found");
      if (!invoiceData) throw new Error("Invoice not found");

      // Update item and invoice
      const updatedInvoice = {
        ...invoiceData,
        total:
          Number(invoiceData.total) -
          Number(itemData.cost) +
          Number(updatedItem.cost),
      };
      batch.update(doc(itemColl, itemId), { ...updatedItem });
      batch.update(doc(invoiceColl, invoiceId), updatedInvoice);

      await batch.commit();

      dispatch({
        type: UPDATE_ITEM,
        payload: {
          item: updatedItem,
          invoice: updatedInvoice,
        },
      });
    } catch (e: any) {
      throw new Error(e);
    }
  };
}

export function deleteItem(
  item: Item
): ThunkAction<Promise<void>, RootState, null, AnyAction> {
  return async (dispatch: Dispatch<AnyAction>) => {
    try {
      if (auth.currentUser === null) throw new Error("unauthenticated user");

      const batch = writeBatch(db);
      const uid = auth.currentUser.uid;

      // Collections
      const itemColl = collection(db, "Users", uid, "Items");
      const invoiceColl = collection(db, "Users", uid, "Invoices");

      // ID
      const itemId = item.id.toString();
      const invoiceId = item.invoiceId.toString();

      // Get invoice
      const invoiceSnapshot = await getDoc(doc(invoiceColl, invoiceId));
      const invoiceData = invoiceSnapshot.data();
      if (!invoiceData) throw new Error("Invoice not found");

      // Delete item and update invoice
      const updatedInvoice: any = {
        ...invoiceData,
        items: invoiceData.items.filter((itemId: number) => itemId !== item.id),
        total: Number(invoiceData.total) - Number(item.cost),
      };
      batch.delete(doc(itemColl, itemId));

      if (updatedInvoice.items.length === 0) {
        batch.delete(doc(invoiceColl, invoiceId));
      } else {
        batch.update(doc(invoiceColl, invoiceId), updatedInvoice);
      }

      await batch.commit();

      // Delete the file, invoice image
      if (updatedInvoice.items.length === 0 && updatedInvoice.imageRef !== "") {
        const desertRef = ref(storage, updatedInvoice.imageRef);
        await deleteObject(desertRef);
      }

      dispatch({
        type: DELETE_ITEM,
        payload: {
          item: item,
          invoice: updatedInvoice,
        },
      });
    } catch (e: any) {
      throw new Error(e);
    }
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
  item: Item,
  saleId: number,
  refounded: Refounded,
  newExpenses: Expense[]
): ThunkAction<Promise<void>, RootState, null, AnyAction> {
  return async (dispatch: Dispatch<AnyAction>) => {
    try {
      if (auth.currentUser === null) throw new Error("unauthenticated user");

      console.log(item);
      console.log(saleId);
      console.log(refounded);
      console.log(newExpenses);

      const batch = writeBatch(db);
      const itemsRef = collection(db, "Users", auth.currentUser.uid, "Items");
      const salesRef = collection(db, "Users", auth.currentUser.uid, "Sales");

      const itemUpdate = {
        state: "In Stock",
        sales: item.sales!.map((sale) =>
          sale.id === saleId ? { ...sale, refounded: true } : sale
        ),
      };

      batch.update(doc(itemsRef, item.id.toString()), itemUpdate);
      batch.update(doc(salesRef, saleId.toString()), { refounded });

      await batch.commit();

      dispatch({
        type: REFOUND_ITEMS,
        payload: { item, saleId, refounded, itemUpdate, newExpenses },
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

export function deleteInvoiceDetails() {
  return {
    type: DELETE_ITEMS_INVOICE_DETAILS,
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
