import { Dispatch, AnyAction } from "redux";
import { ThunkAction } from "redux-thunk";
import { db, auth, storage } from "../../firebase";
import { calculeReports } from "../../functions/reports";
import { uploadBytes, ref, getDownloadURL } from "firebase/storage";
import { signInWithEmailAndPassword, signOut } from "firebase/auth";
import {
  collection,
  doc,
  setDoc,
  getDoc,
  getDocs,
  updateDoc,
  writeBatch,
} from "firebase/firestore";
import {
  Item,
  Invoice,
  Expense,
  Sale,
  RootState,
  YearReport,
} from "../../interfaces";

export const LOGIN = "LOGIN";
export const LOGOUT = "LOGOUT";

export const POST_ITEMS = "POST_ITEMS";
export const POST_INVOICE = "POST_INVOICE";
export const POST_CATEGORIES = "POST_CATEGORIES";
export const POST_EXPENSES = "POST_EXPENSES";
export const POST_SALE = "POST_SALE";
export const POST_IMAGE = "POST_IMAGE";

export const UPDATE_REPORTS = "UPDATE_REPORTS";

export const EXPIRED_ITEMS = "EXPIRED_ITEMS";
export const SELL_ITEMS = "SELL_ITEMS";

export const GET_USER_DATA = "GET_USER_DATA";
export const GET_ITEMS = "GET_ITEMS";
export const GET_INVOICE = "GET_INVOICE";
export const GET_EXPENSES = "GET_EXPENSES";
export const GET_SALES = "GET_SALES";
export const GET_REPORTS = "GET_REPORTS";

export const LOADING = "LOADING";
export const CLOSE_LOADING = "CLOSE_LOADING";

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

      // Agregar documentos al batch
      const batch = writeBatch(db);
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
  invoice: Invoice,
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
      const newInvoice: Invoice = {
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

      // Agregar documentos al batch
      const batch = writeBatch(db);
      const expensesRef = collection(
        db,
        "Users",
        auth.currentUser.uid,
        "Expenses"
      );

      expenses.forEach((expense: Expense) => {
        const date: string[] = expense.date.split("-");
        const year: string = date[0];
        const month: string = date[1];
        const yearRef = doc(expensesRef, year);
        const monthRef = collection(yearRef, month);
        batch.set(doc(monthRef, expense.id.toString()), expense);
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

      // Agregar documentos al batch
      const batch = writeBatch(db);
      const salesRef = collection(db, "Users", auth.currentUser.uid, "Sales");
      const itemsRef = collection(
        db,
        "Users",
        auth.currentUser.uid,
        "Items"
      );

      sales.forEach((sale: Sale) => {
        const date: string[] = sale.date.split("-");
        const year: string = date[0];
        const month: string = date[1];
        
        const yearRef = doc(salesRef, year);
        const monthRef = collection(yearRef, month);

        batch.set(doc(monthRef, sale.id.toString()), sale);
        batch.update(doc(itemsRef, sale.productId.toString()), { state: "Sold" });
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

export function getInvoince(
  date: string
): ThunkAction<Promise<void>, RootState, null, AnyAction> {
  return async (dispatch: Dispatch<AnyAction>) => {
    try {
      if (auth.currentUser === null) throw new Error("unauthenticated user");

      let newInvoices: Array<any> = [];
      const dateArr = date.split("-");
      const year = dateArr[0];
      const month = dateArr[1];

      const invoiceRef = collection(
        db,
        "Users",
        auth.currentUser.uid,
        "Invoices"
      );
      const yearRef = doc(invoiceRef, year);
      const query = await getDocs(collection(yearRef, month));

      query.forEach((doc) => {
        newInvoices.push(doc.data());
      });

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
  sales: Sale[] | any,
): ThunkAction<Promise<void>, RootState, null, AnyAction> {
  return async (dispatch: Dispatch<AnyAction>) => {
    try {
      let response = calculeReports(reports, expenses, true);
      if(sales) response = calculeReports(response.reports, sales, false);
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

export function expiredItems(
  itemsID: number[]
): ThunkAction<Promise<void>, RootState, null, AnyAction> {
  return async (dispatch: Dispatch<AnyAction>) => {
    try {
      const batch = writeBatch(db);

      itemsID.forEach((id) => {
        if (auth.currentUser === null) throw new Error("unauthenticated user");
        const itemsRef = collection(
          db,
          "Users",
          auth.currentUser.uid,
          "Items"
        );
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

/* export function sellItems(
  itemsID: number[]
): ThunkAction<Promise<void>, RootState, null, AnyAction> {
  return async (dispatch: Dispatch<AnyAction>) => {
    try {
      for (let i: number = 0; i < itemsID.length; i++) {
        if (auth.currentUser === null) throw new Error("unauthenticated user");
        const itemsRef = collection(
          db,
          "Users",
          auth.currentUser.uid,
          "Items"
        );
        await updateDoc(doc(itemsRef, `${itemsID[0]}`), { state: "Sold" });
      }

      dispatch({
        type: SELL_ITEMS,
        payload: itemsID,
      });
    } catch (e: any) {
      throw new Error(e);
    }
  };
}
 */