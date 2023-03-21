import { Dispatch, AnyAction } from "redux";
import { ThunkAction } from "redux-thunk";
import { db, auth, storage } from "../../firebase";
import {
  calculeReports,
  deleteDataAndUpdateTotals,
} from "../../functions/reports";
import {
  uploadBytes,
  ref,
  getDownloadURL,
  deleteObject,
} from "firebase/storage";
import { signInWithEmailAndPassword, signOut } from "firebase/auth";
import {
  collection,
  doc,
  addDoc,
  setDoc,
  getDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  writeBatch,
  where,
  query,
} from "firebase/firestore";
import {
  Item,
  Invoice,
  Expense,
  Sale,
  RootState,
  YearReport,
  InvoiceExpenses,
} from "../../interfaces";

export const LOGIN = "LOGIN";
export const LOGOUT = "LOGOUT";

export const LOADING = "LOADING";
export const CLOSE_LOADING = "CLOSE_LOADING";

export const EXPIRED_ITEMS = "EXPIRED_ITEMS";
export const RESTORE_ITEMS = "RESTORE_ITEMS";
export const SELL_ITEMS = "SELL_ITEMS";
export const REFOUND_ITEMS = "REFOUND_ITEMS";

/* POST */
export const POST_CATEGORIES = "POST_CATEGORIES";
export const POST_SOURCES = "POST_SOURCES";
export const POST_ITEMS = "POST_ITEMS";
export const POST_INVOICE = "POST_INVOICE";
export const POST_EXPENSES = "POST_EXPENSES";
export const POST_SALE = "POST_SALE";
export const POST_IMAGE = "POST_IMAGE";

/* GET */
export const GET_USER_DATA = "GET_USER_DATA";
export const GET_ITEMS = "GET_ITEMS";
export const GET_INVOICE = "GET_INVOICE";
export const GET_EXPENSES = "GET_EXPENSES";
export const GET_SALES = "GET_SALES";
export const GET_REPORTS = "GET_REPORTS";

/* UPDATE */
export const UPDATE_REPORTS = "UPDATE_REPORTS";

/* DELETE */
export const DELETE_INVOICE = "DELETE_INVOICE";

export function logIn(
  user: any
): ThunkAction<Promise<void>, RootState, null, AnyAction> {
  return async (dispatch: Dispatch<AnyAction>) => {
    try {
      await signInWithEmailAndPassword(auth, user.email, user.password);
      dispatch({
        type: LOGIN,
      });
    } catch (e: any) {
      throw new Error(e);
    }
  };
}

export function logOut(): ThunkAction<
  Promise<void>,
  RootState,
  null,
  AnyAction
> {
  return async (dispatch: Dispatch<AnyAction>) => {
    try {
      await signOut(auth);
      dispatch({
        type: LOGOUT,
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

export function postInvoice(
  invoice: Invoice | InvoiceExpenses,
  image: File | null
): ThunkAction<Promise<void>, RootState, null, AnyAction> {
  return async (dispatch: Dispatch<AnyAction>) => {
    try {
      if (auth.currentUser === null) throw new Error("unauthenticated user");

      // Date destructuring
      const date: string[] = invoice.date.split("-");
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
      const yearRef = doc(invoiceRef, year);
      const monthRef = collection(yearRef, month);
      await setDoc(doc(monthRef, invoice.id.toString()), newInvoice);

      dispatch({
        type: POST_INVOICE,
        payload: newInvoice,
      });
    } catch (e: any) {
      throw new Error(e);
    }
  };
}

export function postExpenses(
  expenses: Expense[]
): ThunkAction<Promise<void>, RootState, null, AnyAction> {
  return async (dispatch: Dispatch<AnyAction>) => {
    try {
      if (auth.currentUser === null) throw new Error("unauthenticated user");
      const batch = writeBatch(db);

      // Agregar documentos al batch
      const expensesRef = collection(
        db,
        "Users",
        auth.currentUser.uid,
        "Expenses"
      );

      expenses.forEach((expense: Expense) => {
        batch.set(doc(expensesRef), expense);
      });

      await batch.commit();

      dispatch({
        type: POST_EXPENSES,
        payload: expenses,
      });
    } catch (e: any) {
      throw new Error(e);
    }
  };
}

export function postSales(
  sales: Sale[] | any
): ThunkAction<Promise<void>, RootState, null, AnyAction> {
  return async (dispatch: Dispatch<AnyAction>) => {
    try {
      if (auth.currentUser === null) throw new Error("unauthenticated user");
      const batch = writeBatch(db);

      // Agregar documentos al batch
      const salesRef = collection(db, "Users", auth.currentUser.uid, "Sales");
      const itemsRef = collection(db, "Users", auth.currentUser.uid, "Items");

      sales.forEach((sale: Sale) => {
        batch.set(doc(salesRef), sale);
        batch.update(doc(itemsRef, sale.productId.toString()), {
          state: "Sold",
        });
      });

      await batch.commit();

      dispatch({
        type: POST_SALE,
        payload: sales,
      });
    } catch (e: any) {
      throw new Error(e);
    }
  };
}

export function postCategories(
  categories: string[]
): ThunkAction<Promise<void>, RootState, null, AnyAction> {
  return async (dispatch: Dispatch<AnyAction>) => {
    try {
      if (auth.currentUser === null) throw new Error("unauthenticated user");

      await updateDoc(doc(db, "Users", auth.currentUser.uid), {
        categories,
      });

      dispatch({
        type: POST_CATEGORIES,
        payload: categories,
      });
    } catch (e: any) {
      throw new Error(e);
    }
  };
}

export function postSources(
  sources: string[]
): ThunkAction<Promise<void>, RootState, null, AnyAction> {
  return async (dispatch: Dispatch<AnyAction>) => {
    try {
      if (auth.currentUser === null) throw new Error("unauthenticated user");

      await updateDoc(doc(db, "Users", auth.currentUser.uid), {
        sources,
      });

      dispatch({
        type: POST_SOURCES,
        payload: sources,
      });
    } catch (e: any) {
      throw new Error(e);
    }
  };
}

export function getUserData(): ThunkAction<
  Promise<void>,
  RootState,
  null,
  AnyAction
> {
  return async (dispatch: Dispatch<AnyAction>) => {
    try {
      if (auth.currentUser === null) throw new Error("unauthenticated user");

      const query = await getDoc(doc(db, "Users", auth.currentUser.uid));

      const userData = query.data();

      if (!query.exists()) {
        await setDoc(doc(db, "Users", auth.currentUser.uid), {
          categories: ["General"],
          sources: [],
        });
      }

      dispatch({
        type: GET_USER_DATA,
        payload: userData,
      });
    } catch (e: any) {
      throw new Error(e);
    }
  };
}

export function getItems(): ThunkAction<
  Promise<void>,
  RootState,
  null,
  AnyAction
> {
  return async (dispatch: Dispatch<AnyAction>) => {
    try {
      if (auth.currentUser === null) throw new Error("unauthenticated user");

      let newItems: Array<any> = [];
      const query = await getDocs(
        collection(db, "Users", auth.currentUser.uid, "Items")
      );

      query.forEach((doc) => {
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

export function getInvoices(
  year: string | number,
  month: string | number | null
): ThunkAction<Promise<void>, RootState, null, AnyAction> {
  return async (dispatch: Dispatch<AnyAction>) => {
    try {
      console.log("Invoice date", year, month);
      if (auth.currentUser === null) throw new Error("unauthenticated user");

      let newInvoices: Array<any> = [];
      const invoiceRef = collection(
        db,
        "Users",
        auth.currentUser.uid,
        "Invoices"
      );

      if (year && month) {
        console.log("por mes");
        const yearRef = doc(invoiceRef, year.toString());
        const query = await getDocs(collection(yearRef, month.toString()));

        query.forEach((doc) => {
          newInvoices.push(doc.data());
        });
      } else if (year && !month) {
        console.log("por year");
        const yearRef = doc(invoiceRef, year.toString());
        const monthQuerys = [];

        for (let i = 0; i < 12; i++) {
          const month = await getDocs(
            collection(yearRef, `0${i + 1}`.slice(-2))
          );
          monthQuerys.push(month);
        }

        monthQuerys
          .filter((month) => {
            if (month.empty) return false;
            return true;
          })
          .forEach((month) => {
            month.forEach((doc) => {
              newInvoices.push(doc.data());
            });
          });
      }

      dispatch({
        type: GET_INVOICE,
        payload: newInvoices,
      });
    } catch (e: any) {
      throw new Error(e);
    }
  };
}

export function getExpenses(
  year: number
): ThunkAction<Promise<void>, RootState, null, AnyAction> {
  return async (dispatch: Dispatch<AnyAction>) => {
    try {
      const expenses: any = {};

      for (let i = 0; i < 12; i++) {
        if (auth.currentUser === null) throw new Error("unauthenticated user");

        const expensesRef = collection(
          db,
          "Users",
          auth.currentUser.uid,
          "Expenses"
        );
        const yearRef = doc(expensesRef, year.toString());
        const query = await getDocs(collection(yearRef, `0${i}`.slice(-2)));

        query.forEach((doc) => {
          expenses[`${i + 1}`].push(doc.data());
        });
      }

      dispatch({
        type: GET_EXPENSES,
        payload: expenses,
      });
    } catch (e: any) {
      throw new Error(e);
    }
  };
}

export function getSales(
  year: number
): ThunkAction<Promise<void>, RootState, null, AnyAction> {
  return async (dispatch: Dispatch<AnyAction>) => {
    try {
      const sales: any = {};

      for (let i = 0; i < 12; i++) {
        if (auth.currentUser === null) throw new Error("unauthenticated user");

        const expensesRef = collection(
          db,
          "Users",
          auth.currentUser.uid,
          "Sales"
        );
        const yearRef = doc(expensesRef, year.toString());
        const query = await getDocs(collection(yearRef, `0${i}`.slice(-2)));

        query.forEach((doc) => {
          sales[`${i + 1}`].push(doc.data());
        });
      }

      dispatch({
        type: GET_SALES,
        payload: sales,
      });
    } catch (e: any) {
      throw new Error(e);
    }
  };
}

export function getReports(): ThunkAction<
  Promise<void>,
  RootState,
  null,
  AnyAction
> {
  return async (dispatch: Dispatch<AnyAction>) => {
    try {
      if (auth.currentUser === null) throw new Error("unauthenticated user");

      const reportRef = collection(
        db,
        "Users",
        auth.currentUser.uid,
        "Reports"
      );
      const query = await getDocs(reportRef);
      const reports: any[] = [];

      query.forEach((doc) => {
        reports.push(doc.data());
      });

      dispatch({
        type: GET_REPORTS,
        payload: reports,
      });
    } catch (e: any) {
      throw new Error(e);
    }
  };
}

export function updateReports(
  expenses: Expense[],
  reports: YearReport[],
  sales: Sale[] | null | any
): ThunkAction<Promise<void>, RootState, null, AnyAction> {
  return async (dispatch: Dispatch<AnyAction>) => {
    try {
      let response = calculeReports(reports, expenses, true);
      console.log(sales);
      if (sales) response = calculeReports(response.reports, sales, false);
      const newReports = response.reports;
      const years = response.years;

      console.log(response);

      for (let i = 0; i < newReports.length; i++) {
        if (auth.currentUser === null) throw new Error("unauthenticated user");

        const year = years.find(
          (y) => y.toString() === newReports[i].year.toString()
        );
        if (year) {
          const reportRef = collection(
            db,
            "Users",
            auth.currentUser.uid,
            "Reports"
          );
          const yearReportRef = doc(reportRef, year);
          setDoc(yearReportRef, { ...newReports[i] });
        }
      }

      dispatch({
        type: UPDATE_REPORTS,
        payload: newReports,
      });
    } catch (e: any) {
      throw new Error(e);
    }
  };
}

export function updateReportsdItems(
  dataId: number[],
  reports: YearReport[]
): ThunkAction<Promise<void>, RootState, null, AnyAction> {
  return async (dispatch: Dispatch<AnyAction>) => {
    try {
      const { updatedReports, editedYears } = deleteDataAndUpdateTotals(
        dataId,
        reports
      );

      for (let i = 0; i < updatedReports.length; i++) {
        if (auth.currentUser === null) throw new Error("unauthenticated user");

        const year = editedYears.find(
          (y) => y.toString() === updatedReports[i].year.toString()
        );
        if (year) {
          const reportRef = collection(
            db,
            "Users",
            auth.currentUser.uid,
            "Reports"
          );
          const yearReportRef = doc(reportRef, year);
          setDoc(yearReportRef, { ...updatedReports[i] });
        }
      }

      dispatch({
        type: UPDATE_REPORTS,
        payload: updatedReports,
      });
    } catch (e: any) {
      throw new Error(e);
    }
  };
}

export function expiredItems(
  itemsID: number[]
): ThunkAction<Promise<void>, RootState, null, AnyAction> {
  return async (dispatch: Dispatch<AnyAction>) => {
    try {
      const batch = writeBatch(db);

      itemsID.forEach((id) => {
        if (auth.currentUser === null) throw new Error("unauthenticated user");
        const itemsRef = collection(db, "Users", auth.currentUser.uid, "Items");
        batch.update(doc(itemsRef, id.toString()), { state: "Expired" });
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

export function restoreItems(
  itemsID: number
): ThunkAction<Promise<void>, RootState, null, AnyAction> {
  return async (dispatch: Dispatch<AnyAction>) => {
    try {
      if (auth.currentUser === null) throw new Error("unauthenticated user");
      const itemsRef = collection(db, "Users", auth.currentUser.uid, "Items");
      await updateDoc(doc(itemsRef, itemsID.toString()), { state: "In Stock" });

      dispatch({
        type: RESTORE_ITEMS,
        payload: itemsID,
      });
    } catch (e: any) {
      throw new Error(e);
    }
  };
}

export function deleteInvoice(
  invoice: Invoice
): ThunkAction<Promise<void>, RootState, null, AnyAction> {
  return async (dispatch: Dispatch<AnyAction>) => {
    try {
      if (auth.currentUser === null) throw new Error("unauthenticated user");

      const dateArr = invoice.date.split("-");
      const year = dateArr[0];
      const month = dateArr[1];

      const invoiceRef = collection(
        db,
        "Users",
        auth.currentUser.uid,
        "Invoices"
      );

      const batch = writeBatch(db);

      // Delete invoice
      const yearRef = doc(invoiceRef, year);
      const monthRef = collection(yearRef, month);
      batch.delete(doc(monthRef, invoice.id.toString()));

      // Delete items
      const itemsRef = collection(db, "Users", auth.currentUser.uid, "Items");
      invoice.items.forEach((id) => {
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
