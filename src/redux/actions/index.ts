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
export const POST_EXPENSES = "POST_EXPENSES";
export const POST_SALE = "POST_SALE";
export const POST_IMAGE = "POST_IMAGE";

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
/*
function updateYearReports(
  YearReports_: YearReport[],
  expensesOrSales: (Expense | Sale)[]
): { YearReports: YearReport[]; createdYears: string[] } {
  let YearReports = [...YearReports_];
  let createdYears: string[] = [];

  expensesOrSales.forEach((item) => {
    const date: string[] = item.date.split("-");
    const year: string = date[0];
    const month: string = date[1];
    const yearIndex = YearReports.findIndex((report) => report.year === year);

    if (yearIndex === -1) {
      const newReport = reportGenerator(year);
      YearReports.push(newReport);
      createdYears.push(year);
    }

    const monthIndex = YearReports[yearIndex].month.findIndex(
      (monthReport) => monthReport.month === month
    );
    const newMonthReport = updateMonthReport(
      YearReports[yearIndex].month[monthIndex],
      item, true
    );
    YearReports[yearIndex].month[monthIndex] = newMonthReport;
  });

  return { YearReports, createdYears };
}

function updateMonthReport(
  report: MonthReport,
  item: Expense | Sale,
  isExpense: boolean
): MonthReport {
  const newItem: ReportItem = {
    id: item.id,
    amount: isExpense ? item.cost : item.amount
  };

  const itemIndex: number = report[isExpense ? 'expenses' : 'sales']
    .findIndex((i: ReportItem) => i.id === item.id);

  if (itemIndex === -1) {
    report[isExpense ? 'expenses' : 'sales'].push(newItem);
  } else {
    report[isExpense ? 'expenses' : 'sales'][itemIndex] = newItem;
  }

  const reportItems: ReportItem[] = report[isExpense ? 'expenses' : 'sales'];
  const totalAmount: number = reportItems.reduce((total: number, i: ReportItem) => total + i.amount, 0);
  report[isExpense ? 'totalExpenses' : 'totalSales'] = totalAmount;

  return report;
} */

function updateReports(reports: YearReport[], data: Expense[]) {
  console.log(reports);
  console.log("1");
  const years: string[] = [];
  let newReports: YearReport[] = [];

  /* Search date match */
  data.forEach((d) =>
    reports.forEach((r) => {
      if (r.year === d.date.split("-")[0]) years.push(r.year);
    })
  );

  /* If not found matches, create a new report */
  if (years.length > 0) {
    newReports = [...reports, ...years.map((y) => reportGenerator(y))];
  }

  /* Update reports data */
  newReports.map((r) => {
    return {
      ...r,
      month: r.month.map((month) => {
        let match = data.filter((d: Expense) => ((d.date.split("-")[0] === r.year.toString()) && (d.date.split("-")[1] === month.toString())) )
        if(match){
          return {
            ...month,
            expenses: [ ...month.expenses, ...match ],
            totalExpenses: month.totalExpenses + Number(data.reduce((a: any, b) => a + b.price ))
          }
        }
        return month;
      })
    }
  });

  return newReports;
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

export function postExpenses(
  expenses: Expense[],
  reports: YearReport[]
): ThunkAction<Promise<void>, RootState, null, AnyAction> {
  return async (dispatch: Dispatch<AnyAction>) => {
    try {
      let newReport: MonthReport[] = [];

      for (let i: number = 0; i < expenses.length; i++) {
        const date: string[] = expenses[0].date.split("-");
        const year: string = date[0];
        const month: string = date[1];
        const invoiceRef = collection(db, "expenses", year, month);
        await setDoc(doc(invoiceRef, expenses[i].id.toString()), expenses[i]);
      }

/*       updateReports(reports, expenses);

      const reportsRef = doc(db, "Reports");
      await updateDoc(reportsRef, { newReport }); */

      // calcular reporte

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
      await updateDoc(doc(db, "user", "RPEAI31RVWZN5AL2v8b9tkPqoDp2"), {
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

/* export function updateReports(epxense: Expense[], ): ThunkAction<Promise<void>, RootState, null, AnyAction> {
  return async (dispatch: Dispatch<AnyAction>) => {
    const dateArr = epxense.date.split("-");
    const year = dateArr[0];
    const month = dateArr[1];

    epxense
      const report = {
        month: string;
        expeneses: Array<{
          id: number;
          amount: number
        }>;
        sales: Array<{
          id: number;
          amount: number
        }>;
        totalExpeneses: number;
        totalSales: number;
      }
      dispatch({
        type: SELL_ITEMS,
        payload: itemsID,
      });
    } catch (e: any) {
      throw new Error(e);
    }
  };
} */
