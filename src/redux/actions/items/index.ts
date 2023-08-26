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
export const UPDATE_ITEM = "UPDATE_ITEM";
export const DELETE_ITEM = "DELETE_ITEM";

export const GET_ITEMS_EXPIRED = "GET_ITEMS_EXPIRED";
export const GET_ITEMS_INVOICE_DETAILS = "GET_ITEMS_INVOICE_DETAILS";
export const DELETE_ITEMS_INVOICE_DETAILS = "DELETE_ITEMS_INVOICE_DETAILS";

export const EXPIRED_ITEMS = "EXPIRED_ITEMS";
export const REFOUND_ITEMS = "REFOUND_ITEMS";
export const RESTORE_ITEMS = "RESTORE_ITEMS";


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

      let invoice: any = {};
      let items: any = [];

      // Get invoice
      const invoiceRef = collection(
        db,
        "Users",
        auth.currentUser.uid,
        "Invoices"
      );
      const invoiceResponse = await getDoc(doc(invoiceRef, invoiceId.toString()));
      invoice = invoiceResponse.data();

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
      const expensesColl = collection(db, "Users", uid, "Expenses");
      const salesColl = collection(db, "Users", uid, "Sales");

      // ID
      const itemId = item.id.toString();
      const invoiceId = item.invoiceId.toString();

      // Get invoice
      const invoiceSnapshot = await getDoc(doc(invoiceColl, invoiceId));
      const invoiceData = invoiceSnapshot.data();
      if (!invoiceData) throw new Error("Invoice not found");

      // Get expenses and deleted them
      const expenseQuery = query(
        expensesColl,
        where("productId", "==", item.id)
      );
      const expenseSnapshot = await getDocs(expenseQuery);
      expenseSnapshot.forEach((doc) => batch.delete(doc.ref));

      // Get sale and delete them
      const salesQuery = query(salesColl, where("productId", "==", item.id));
      const salesSnapshot = await getDocs(salesQuery);
      salesSnapshot.forEach((doc) => batch.delete(doc.ref));

      // Delete item and update invoice
      batch.delete(doc(itemColl, itemId));
      const updatedInvoice: any = {
        ...invoiceData,
        items: invoiceData.items - 1,
        total: Number(invoiceData.total) - Number(item.cost),
      };

      // If don't have any items, delete invoice too
      if (updatedInvoice.items === 0) {
        batch.delete(doc(invoiceColl, invoiceId));
      } else {
        batch.update(doc(invoiceColl, invoiceId), updatedInvoice);
      }

      // Delete the file, invoice image
      if (updatedInvoice.items.length === 0 && updatedInvoice.imageRef !== "") {
        const desertRef = ref(storage, updatedInvoice.imageRef);
        await deleteObject(desertRef);
      }

      await batch.commit();

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
      // Check if user id loggued in
      if (auth.currentUser === null) throw new Error("unauthenticated user");

      // Create collection reference
      const userDoc = doc(collection(db, "Users"), auth.currentUser.uid);
      const itemsColl = collection(userDoc, "Items");
      const salesColl = collection(userDoc, "Sales");
      const expensesColl = collection(userDoc, "Expenses");

      // Instance batch
      const batch = writeBatch(db);

      // Update item and sale
      const itemUpdate = {
        state: "In Stock",
        sales: item.sales!.map((sale) =>
          sale.id === saleId ? { ...sale, refounded: true } : sale
        ),
      };

      const saleUpdate = {
        refounded,
        cost: 0,
      };

      // Querys COGS Y Ebay Fees
      const queryCOGS = query(
        expensesColl,
        where("productId", "==", item.id),
        where("category", "==", "COGS")
      );

      const queryEbayFees = query(
        expensesColl,
        where("productId", "==", item.id),
        where("category", "==", "Ebay Fees")
      );

      // Get expensas
      const snapExpenseCOGS = await getDocs(queryCOGS);
      const snapExpenseFees = await getDocs(queryEbayFees);

      // Delete expensas
      snapExpenseCOGS.forEach((doc) => batch.delete(doc.ref));
      snapExpenseFees.forEach((doc) => batch.delete(doc.ref));

      // Actualizar venta para que quede en 0 el unit cost
      batch.update(doc(itemsColl, item.id.toString()), itemUpdate);
      batch.update(doc(salesColl, saleId.toString()), saleUpdate);

      // Add expenses
      newExpenses.forEach((expense) => batch.set(doc(expensesColl), expense));

      await batch.commit();

      dispatch({
        type: REFOUND_ITEMS,
        payload: {
          item: { ...item, ...itemUpdate },
          saleUpdate: {
            id: saleId,
            ...saleUpdate
          },
          newExpenses,
        },
      });
    } catch (e: any) {
      throw new Error(e);
    }
  };
}

export function restoreItem(
  itemId: number
): ThunkAction<Promise<void>, RootState, null, AnyAction> {
  return async (dispatch: Dispatch<AnyAction>) => {
    try {
      if (auth.currentUser === null) throw new Error("unauthenticated user");

      // Batch
      const batch = writeBatch(db);

      // Firebase collections
      const itemsColl = collection(db, "Users", auth.currentUser.uid, "Items");
      const expensesColl = collection(db, "Users", auth.currentUser.uid, "Expenses");

      // Data to update
      const itemUpdated = {
        state: "In Stock",
        expired: deleteField(),
      }

      // Get expense to remove
      const expenseSnap = await getDocs(query(expensesColl,
        where("productId", "==", Number(itemId)),
        where("category", "==", "Expired")
      ))

      // Set the remove
      expenseSnap.forEach((doc) => batch.delete(doc.ref));

      // Set the update
      batch.update(doc(itemsColl, itemId.toString()), itemUpdated);

      batch.commit();

      dispatch({
        type: RESTORE_ITEMS,
        payload: itemId,
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
