import { startOfMonth, endOfMonth, startOfYear, endOfYear } from "date-fns";
import { Dispatch, AnyAction } from "redux";
import { ThunkAction } from "redux-thunk";
import { db, auth } from "../../../firebase";
import {
  collection,
  doc,
  getDocs,
  writeBatch,
  where,
  query,
} from "firebase/firestore";
import { Expense, RootState } from "../../../interfaces/interfaces";

export const GET_SOLD_EXPENSES = "GET_SOLD_EXPENSES";
export const POST_EXPENSES = "POST_EXPENSES";

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

export function getExpenses(
  year: number | string,
  month: number | string | null
): ThunkAction<Promise<void>, RootState, null, AnyAction> {
  return async (dispatch: Dispatch<AnyAction>) => {
    try {
      if (auth.currentUser === null) {
        throw new Error("unauthenticated user");
      }

      const expensesRef = collection(
        db,
        "Users",
        auth.currentUser.uid,
        "Expenses"
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
          expensesRef,
          where("date", ">=", startDate),
          where("date", "<=", endDate)
        )
      );

      // Get data
      let expenses: any = [];
      snapshot.forEach((doc: any) => {
        expenses.push(doc.data());
      });

      dispatch({
        type: GET_SOLD_EXPENSES,
        payload: expenses,
      });
    } catch (e: any) {
      throw new Error(e);
    }
  };
}
