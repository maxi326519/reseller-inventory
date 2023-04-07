import { startOfMonth, endOfMonth, startOfYear, endOfYear } from "date-fns";
import { Dispatch, AnyAction } from "redux";
import { ThunkAction } from "redux-thunk";
import { db, auth, storage } from "../../../firebase";
import {
  uploadBytes,
  ref,
  getDownloadURL,
  deleteObject,
} from "firebase/storage";
import {
  collection,
  doc,
  setDoc,
  getDocs,
  writeBatch,
  where,
  query,
  getDoc,
} from "firebase/firestore";
import { Invoice, RootState, InvoiceExpenses } from "../../../interfaces";

export const POST_INVOICE = "POST_INVOICE";
export const GET_INVOICE = "GET_INVOICE";
export const GET_INVOICE_DETAILS = "GET_INVOICE_DETAILS";
export const DELETE_INVOICE = "DELETE_INVOICE";

export function postInvoice(
  invoice: Invoice | InvoiceExpenses,
  image: File | null
): ThunkAction<Promise<void>, RootState, null, AnyAction> {
  return async (dispatch: Dispatch<AnyAction>) => {
    try {
      if (auth.currentUser === null) throw new Error("unauthenticated user");

      // Date destructuring
      const date: string[] = invoice.date
        .toDate()
        .toISOString()
        .split("T")[0]
        .split("-");
      const year: string = date[0];
      const month: string = date[1];

      let dir: string = "";
      let imageUrl: string = "";

      if (image) {
        // Set directory
        dir = `${year}/${month}/${invoice.id}`;

        // POST invoice image
        const storageRef = ref(storage, dir);
        const imageQuery = await uploadBytes(storageRef, image);

        // GET invoice image url
        imageUrl = await getDownloadURL(imageQuery.ref);
      }

      // New object with all data
      const newInvoice: Invoice | InvoiceExpenses = {
        ...invoice,
        image: imageUrl,
        imageRef: dir,
      };

      // Save invoice data
      const invoiceRef = collection(
        db,
        "Users",
        auth.currentUser.uid,
        "Invoices"
      );
      await setDoc(doc(invoiceRef, invoice.id.toString()), newInvoice);

      dispatch({
        type: POST_INVOICE,
        payload: newInvoice,
      });
    } catch (e: any) {
      throw new Error(e);
    }
  };
}

export function getInvoices(
  year: string | number,
  month: string | number | null
): ThunkAction<Promise<void>, RootState, null, AnyAction> {
  return async (dispatch: Dispatch<AnyAction>) => {
    try {
      if (auth.currentUser === null) throw new Error("unauthenticated user");

      const invoiceRef = collection(
        db,
        "Users",
        auth.currentUser.uid,
        "Invoices"
      );

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

      // Query and get docs
      const snapshot = await getDocs(
        query(
          invoiceRef,
          where("date", ">=", startDate),
          where("date", "<=", endDate)
        )
      );

      // Get data
      let invoices: any = [];
      snapshot.forEach((doc: any) => {
        invoices.push(doc.data());
      });

      dispatch({
        type: GET_INVOICE,
        payload: invoices,
      });
    } catch (e: any) {
      throw new Error(e);
    }
  };
}

export function getInvoiceDetails(
  isItem: boolean,
  invoiceId: number,
): ThunkAction<Promise<void>, RootState, null, AnyAction> {
  return async (dispatch: Dispatch<AnyAction>) => {
    try {
      if (auth.currentUser === null) throw new Error("unauthenticated user");

      console.log(isItem);

      const itemsRef = collection(db, "Users", auth.currentUser.uid, "Items");

      const expensesRef = collection(
        db,
        "Users",
        auth.currentUser.uid,
        "Expenses"
      );

      // Query and get docs
      let snapshot = await getDocs(query(isItem ? itemsRef : expensesRef, where("invoiceId", "==", invoiceId)));

      // Get data
      let data: any = [];
      snapshot.forEach((doc: any) => {
        data.push(doc.data());
      });

      console.log(data);

      dispatch({
        type: GET_INVOICE_DETAILS,
        payload: data,
      });
    } catch (e: any) {
      throw new Error(e);
    }
  };
}

export function deleteInvoice(
  invoice: Invoice | InvoiceExpenses
): ThunkAction<Promise<void>, RootState, null, AnyAction> {
  return async (dispatch: Dispatch<AnyAction>) => {
    try {
      if (auth.currentUser === null) throw new Error("unauthenticated user");

      const invoiceRef = collection(
        db,
        "Users",
        auth.currentUser.uid,
        "Invoices"
      );

      const batch = writeBatch(db);

      // Delete invoice
      batch.delete(doc(invoiceRef, invoice.id.toString()));

      // Delete items
      const itemsRef = collection(db, "Users", auth.currentUser.uid, "Items");
      invoice.items.forEach((id: any) => {
        batch.delete(doc(itemsRef, id.toString()));
      });

      // Get expenses and then delete them
      const expensesRef = collection(
        db,
        "Users",
        auth.currentUser.uid,
        "Expenses"
      );
      for (let i = 0; i < invoice.items.length; i++) {
        // Get sales matching id
        const expensesQuery = query(
          expensesRef,
          where("id", "==", invoice.items[i])
        );
        const expensesToDelete = await getDocs(expensesQuery);
        // Delete sales
        if (!expensesToDelete.empty) {
          expensesToDelete.forEach((docm) => {
            batch.delete(doc(expensesRef, docm.id));
          });
        }
      }

      // SALES
      const salesRef = collection(db, "Users", auth.currentUser.uid, "Sales");
      for (let i = 0; i < invoice.items.length; i++) {
        // Get sales matching id
        const salesQuery = query(salesRef, where("id", "==", invoice.items[i]));
        const salesToDelete = await getDocs(salesQuery);

        // Delete sales
        if (!salesToDelete.empty) {
          salesToDelete.forEach((docm) => {
            batch.delete(doc(salesRef, docm.id));
          });
        }
      }

      batch.commit();

      // Delete the file, invoice image
      if (invoice.imageRef !== "") {
        const desertRef = ref(storage, invoice.imageRef);
        await deleteObject(desertRef);
      }

      dispatch({
        type: DELETE_INVOICE,
        payload: invoice,
      });
    } catch (e: any) {
      throw new Error(e);
    }
  };
}
