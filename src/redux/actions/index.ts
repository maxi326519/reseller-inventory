import { Item, Invoice, RootState } from "../../interfaces";
import { Dispatch, AnyAction } from "redux";
import { ThunkAction } from "redux-thunk";
import { db, fs, batch } from "../../firebase";
import { getAuth, signInWithEmailAndPassword, signOut } from "firebase/auth";
import {
  collection,
  doc,
  addDoc,
  setDoc,
  getDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  query,
  where,
} from "firebase/firestore";

export const POST_ITEMS = "POST_ITEMS";
export const POST_INVOICE = "POST_INVOICE";

export const LOADING = "LOADING";
export const CLOSE_LOADING = "CLOSE_LOADING";

export function logIn(
  invoice: Invoice
): ThunkAction<Promise<void>, RootState, null, AnyAction> {
  return async (dispatch: Dispatch<AnyAction>) => {
    try {
      dispatch({
        type: POST_INVOICE,
        payload: invoice,
      });
    } catch (e: any) {
      throw new Error(e);
    }
  };
}

export function logOut(
  invoice: Invoice
): ThunkAction<Promise<void>, RootState, null, AnyAction> {
  return async (dispatch: Dispatch<AnyAction>) => {
    try {
      dispatch({
        type: POST_INVOICE,
        payload: invoice,
      });
    } catch (e: any) {
      throw new Error(e);
    }
  };
}

export function loading() {
  return {
    type: LOADING,
  };
}

export function closeLoading() {
  return {
    type: CLOSE_LOADING,
  };
}

export function postItems(
  items: Item[]
): ThunkAction<Promise<void>, RootState, null, AnyAction> {
  return async (dispatch: Dispatch<AnyAction>) => {
    try {
      // Agregar documentos al batch
      for (let i: number = 0; i < items.length; i++) {
        const itemsRef = collection(db, "items");
        await setDoc(doc(itemsRef, items[i].id.toString()), items[i]);
      }

      dispatch({
        type: POST_ITEMS,
        payload: items,
      });
    } catch (err: any) {
      throw new Error(err);
    }
  };
}

export function postInvoice(
  invoice: Invoice
): ThunkAction<Promise<void>, RootState, null, AnyAction> {
  return async (dispatch: Dispatch<AnyAction>) => {
    try {
      const date = invoice.date.split("-");
      const year = date[0];
      const month = date[2];

      const invoiceRef = collection(db, "invoices", year, month);
      setDoc(doc(invoiceRef, invoice.id.toString()), invoice);

      dispatch({
        type: POST_INVOICE,
        payload: invoice,
      });
    } catch (e: any) {
      throw new Error(e);
    }
  };
}
