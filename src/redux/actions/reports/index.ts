import { Dispatch, AnyAction } from "redux";
import { ThunkAction } from "redux-thunk";
import { db, auth } from "../../../firebase";
import {
  calculeReports,
  deleteDataAndUpdateTotals,
} from "../../../functions/reports";
import {
  collection,
  doc,
  setDoc,
  getDocs,
  where,
  query,
  Timestamp,
} from "firebase/firestore";
import {
  Expense,
  Sale,
  RootState,
  YearReport,
  Item,
} from "../../../interfaces";
import { endOfMonth, endOfYear, startOfMonth, startOfYear } from "date-fns";

export const GET_REPORTS = "GET_REPORTS";
export const GET_SOLD_REPORT_DATA = "GET_SOLD_REPORT_DATA";
export const GET_EXPIRED_ITEMS = "GET_EXPIRED_ITEMS";
export const UPDATE_REPORTS = "UPDATE_REPORTS";
export const DELETE_ITEMS_REPORTS = "DELETE_ITEMS_REPORTS";

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
      const query: any = await getDocs(reportRef);
      const reports: any[] = [];

      query.forEach((doc: any) => {
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

export function getSoldReportData(
  year: string,
  month: string | null
): ThunkAction<Promise<void>, RootState, null, AnyAction> {
  return async (dispatch: Dispatch<AnyAction>) => {
    try {
      if (auth.currentUser === null) throw new Error("unauthenticated user");
      const uid = auth.currentUser.uid;

      // Date range
      let startDate: Date;
      let endDate: Date;
      const itemsRef = collection(db, "Users", uid, "Items");
      const salesRef = collection(db, "Users", uid, "Sales");
      const expensesRef = collection(db, "Users", uid, "Expenses");

      // Per year or month
      if (month !== null) {
        startDate = startOfMonth(new Date(Number(year), Number(month) - 1));
        endDate = endOfMonth(new Date(Number(year), Number(month) - 1));
      } else {
        startDate = startOfYear(new Date(Number(year), 0));
        endDate = endOfYear(new Date(Number(year), 11));
      }

      // Calculate UTC start and end dates
      const utcStartDate = new Date(
        startDate.getTime() - startDate.getTimezoneOffset() * 60000
      );
      const utcEndDate = new Date(
        endDate.getTime() - endDate.getTimezoneOffset() * 60000
      );

      // Convert to firebase Timestamp
      const startTimeStamp = Timestamp.fromDate(utcStartDate);
      const endTimeStamp = Timestamp.fromDate(utcEndDate);

      // Query and get items docs
      const itemsQuery = await getDocs(
        query(
          itemsRef,
          where("saleDate", ">=", startTimeStamp),
          where("saleDate", "<=", endTimeStamp)
        )
      );

      const salesQuery = await getDocs(
        query(
          salesRef,
          where("date", ">=", startTimeStamp),
          where("date", "<=", endTimeStamp)
        )
      );

      const expensesQuery = await getDocs(
        query(
          expensesRef,
          where("date", ">=", startTimeStamp),
          where("date", "<=", endTimeStamp)
        )
      );

      // Get data to docs
      let items: any = [];
      itemsQuery.forEach((doc: any) => {
        items.push(doc.data());
      });

      let sales: any = [];
      salesQuery.forEach((doc: any) => {
        sales.push(doc.data());
      });

      let expenses: any = [];
      expensesQuery.forEach((doc: any) => {
        expenses.push(doc.data());
      });

      const data = {
        items: items.filter((i: Item) => i.state === "Sold"),
        sales,
        expenses,
      };

      dispatch({
        type: GET_SOLD_REPORT_DATA,
        payload: data,
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
      if (sales) response = calculeReports(response.reports, sales, false);
      const newReports = response.reports;
      const years = response.years;

      for (let i = 0; i < newReports.length; i++) {
        if (auth.currentUser === null) throw new Error("unauthenticated user");

        const year = years.find(
          (y: any) => y.toString() === newReports[i].year.toString()
        );

        if (year) {
          const reportRef = collection(
            db,
            "Users",
            auth.currentUser.uid,
            "Reports"
          );
          const yearReportRef = doc(reportRef, year.toString());
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

export function updateReportsItems(
  dataId: number[],
  category: string[] | null,
  reports: YearReport[]
): ThunkAction<Promise<void>, RootState, null, AnyAction> {
  return async (dispatch: Dispatch<AnyAction>) => {
    try {
      const { updatedReports, editedYears } = deleteDataAndUpdateTotals(
        dataId,
        category,
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
          const yearReportRef = doc(reportRef, year.toString());
          setDoc(yearReportRef, { ...updatedReports[i] });
        }
      }

      dispatch({
        type: DELETE_ITEMS_REPORTS,
        payload: updatedReports,
      });
    } catch (e: any) {
      throw new Error(e);
    }
  };
}
