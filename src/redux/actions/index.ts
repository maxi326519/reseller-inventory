import {
  Item,
  Invoice,
  Expense,
  Sale,
  RootState,
  YearReport,
  MonthReport,
  ReportItem,
} from "../../interfaces";
import { Dispatch, AnyAction } from "redux";
import { ThunkAction } from "redux-thunk";
import { db, auth, storage } from "../../firebase";
import { uploadBytes, ref, getDownloadURL } from "firebase/storage";
import {
  collection,
  doc,
  addDoc,
  setDoc,
  getDoc,
  getDocs,
  updateDoc,
} from "firebase/firestore";
import { signInWithEmailAndPassword, signOut } from "firebase/auth";

export const LOGIN = "LOGIN";
export const LOGOUT = "LOGOUT";

export const POST_ITEMS = "POST_ITEMS";
export const POST_INVOICE = "POST_INVOICE";
export const POST_CATEGORIES = "POST_CATEGORIES";
export const GET_REPORTS = "GET_REPORTS";
export const POST_EXPENSES = "POST_EXPENSES";
export const POST_SALE = "POST_SALE";
export const POST_IMAGE = "POST_IMAGE";

export const UPDATE_REPORTS = "UPDATE_REPORTS";

export const SELL_ITEMS = "SELL_ITEMS";

export const GET_USER_DATA = "GET_USER_DATA";
export const GET_ITEMS = "GET_ITEMS";
export const GET_INVOICE = "GET_INVOICE";
export const GET_EXPENSES = "GET_EXPENSES";

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
  invoice: Invoice,
  image: File | null
): ThunkAction<Promise<void>, RootState, null, AnyAction> {
  return async (dispatch: Dispatch<AnyAction>) => {
    try {
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
      const invoiceRef = collection(db, "invoices", year, month);
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

export function postExpenses(
  expenses: Expense[]
): ThunkAction<Promise<void>, RootState, null, AnyAction> {
  return async (dispatch: Dispatch<AnyAction>) => {
    try {
      let newReport: MonthReport[] = [];

      for (let i: number = 0; i < expenses.length; i++) {
        const date: string[] = expenses[0].date.split("-");
        const year: string = date[0];
        const month: string = date[1];
        const invoiceRef = collection(db, "Expenses", year, month);
        await setDoc(doc(invoiceRef, expenses[i].id.toString()), expenses[i]);
      }

      dispatch({
        type: POST_EXPENSES,
        payload: expenses,
      });
    } catch (e: any) {
      throw new Error(e);
    }
  };
}

export function postSale(
  sale: Sale
): ThunkAction<Promise<void>, RootState, null, AnyAction> {
  return async (dispatch: Dispatch<AnyAction>) => {
    try {
      const date = sale.date.split("-");
      const year = date[0];
      const month = date[1];

      const saleRef = collection(db, "Sales", year, month);
      await addDoc(saleRef, sale);

      dispatch({
        type: POST_SALE,
        payload: sale,
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
      await updateDoc(doc(db, "user", `${auth.currentUser?.uid}`), {
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
      const query = await getDoc(doc(db, "user", `${auth.currentUser?.uid}`));

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
      let newItems: Array<any> = [];
      const query = await getDocs(collection(db, "items"));

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
      let newInvoices: Array<any> = [];
      const dateArr = date.split("-");
      const year = dateArr[0];
      const month = dateArr[1];

      const query = await getDocs(collection(db, "invoices", year, month));

      query.forEach((doc) => {
        newInvoices.push(doc.data());
        console.log(doc.id);
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

export function getExpenses(): ThunkAction<
  Promise<void>,
  RootState,
  null,
  AnyAction
> {
  return async (dispatch: Dispatch<AnyAction>) => {
    try {
      /*       Realizar queries con filtros */

      const expensesData = null;

      dispatch({
        type: GET_EXPENSES,
        payload: expensesData,
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

      const reportRef = collection(db, "Reports");
      const query = await getDocs(reportRef);
      const reports: any[] = [];

      query.forEach((doc) => {
        reports.push(doc.data());
      });

      console.log(reports)

      dispatch({
        type: GET_REPORTS,
        payload: reports,
      });
    } catch (e: any) {
      throw new Error(e);
    }
  };
}

export function sellItems(
  itemsID: number[]
): ThunkAction<Promise<void>, RootState, null, AnyAction> {
  return async (dispatch: Dispatch<AnyAction>) => {
    try {
      for (let i: number = 0; i < itemsID.length; i++) {
        await updateDoc(doc(db, "items", `${itemsID[0]}`), { state: "sold" });
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

export function updateReports(
  expenses: Expense[],
  reports: YearReport[]
): ThunkAction<Promise<void>, RootState, null, AnyAction> {
  return async (dispatch: Dispatch<AnyAction>) => {
    try {
      console.log("update reports");
      const resposne = calculeReports(reports, expenses);
      const newReports = resposne.reports;
      const years = resposne.years;

      for(let i=0; i<newReports.length; i++){
        const year = years.find((y) => y.toString() === newReports[i].year.toString())
        if(year){
          console.log("upload report: ", newReports[i] );
          const yearReportRef = doc(db, "Reports", year);
          setDoc(yearReportRef, { ...newReports[i] });
        }
      }

      console.log(newReports);

      dispatch({
        type: UPDATE_REPORTS,
        payload: newReports,
      });
    } catch (e: any) {
      throw new Error(e);
    }
  };
}

function calculeReports(reports: YearReport[], data: Expense[]) {
  let years: string[] = []; // Save years of matching expenses
  let missingYears: string[] = []; // Save years of missing expenses
  let newReports: YearReport[] = []; // Save all reports

  if (reports.length <= 0)
    reports.push(reportGenerator(new Date().getFullYear().toString()));

  /* Matching and missing date search */
  data.forEach((d) => {
    let dataDate = d.date.split("-")[0];
    /* If exist any report with the date of the data */
    if (reports.some((r) => r.year.toString() === dataDate))
      years.push(dataDate);
    else missingYears.push(dataDate);
  });

  // Delete repeat elements
  missingYears = missingYears.filter((element, index, arr) => {
    return arr.indexOf(element) === index && !(element in arr.slice(index + 1));
  });

  /* Create missing reports  */
  newReports = [...reports, ...missingYears.map((y) => reportGenerator(y))];

  /* Update reports */
  newReports = newReports.map((r) => {
    /* If matching with expeneses year */
    if (years.includes(r.year) || missingYears.includes(r.year)) {
      const newYear = {
        year: r.year,
        month: r.month.map((month) => {
          /* Search maching date */
          let match = data.filter((d: Expense) => {
            if (
              d.date.split("-")[0] === r.year.toString() &&
              d.date.split("-")[1] === `0${month.month.toString()}`.slice(-2)
            ) {
              return true;
            }
            return false;
          });

          /* If exist, update */
          if (match.length > 0) {
            const newMonth = {
              ...month,
              expenses: [
                ...month.expenses,
                ...match.map((m) => {
                  return {
                    id: m.id,
                    amount: m.price,
                  };
                }),
              ],
              totalExpenses:
                month.totalExpenses +
                total(
                  data.filter(
                    (d) =>
                      d.date.split("-")[0] === r.year.toString() &&
                      d.date.split("-")[1] ===
                        `0${month.month.toString()}`.slice(-2)
                  )
                ),
            };
            return newMonth;
          } else {
            return month;
          }
        }),
      };
      return newYear;
    } else {
      return r;
    }
  });

  const updateYears = [...missingYears, ...years].filter((element, index, arr) => {
    return arr.indexOf(element) === index && !(element in arr.slice(index + 1));
  });

  return {
    reports: newReports,
    years: updateYears,
  };
}

function total(array: Array<any>) {
  console.log("suma", array);
  let total: number = 0;
  array.forEach((a) => {
    total += Number(a.price);
  });
  return total;
}

function reportGenerator(year: string): YearReport {
  let reportData: YearReport = {
    year: year,
    month: [],
  };

  for (let i = 1; i <= 12; i++) {
    const monthReport: MonthReport = {
      month: i.toString(),
      expenses: [],
      sales: [],
      totalExpenses: 0,
      totalSales: 0,
    };
    reportData.month.push(monthReport);
  }
  return reportData;
}
