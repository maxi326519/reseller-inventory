import { Dispatch, AnyAction } from "redux";
import { ThunkAction } from "redux-thunk";
import { db, auth } from "../../../firebase";
import { collection, doc, setDoc, getDocs } from "firebase/firestore";
import { Expense, Sale, RootState } from "../../../interfaces/interfaces";
import { YearReport } from "../../../hooks/useReports/Interfaces";
import {
  calculeReports,
  deleteDataAndUpdateTotals,
} from "../../../functions/reports";

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

export function updateReports(
  expenses: Expense[],
  reports: YearReport[],
  sales: Sale[] | null | any
): ThunkAction<Promise<void>, RootState, null, AnyAction> {
  return async (dispatch: Dispatch<AnyAction>) => {
    try {
/*       let response = calculeReports(reports, expenses, true);
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
      } */
      dispatch({
        type: UPDATE_REPORTS,
/*         payload: newReports, */
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
/*       const { updatedReports, editedYears } = deleteDataAndUpdateTotals(
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
      } */

      dispatch({
        type: DELETE_ITEMS_REPORTS,
  /*       payload: updatedReports, */
      });
    } catch (e: any) {
      throw new Error(e);
    }
  };
}
