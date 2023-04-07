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
import { Sale, RootState } from "../../../interfaces";

export const POST_SALE = "POST_SALE";
export const GET_SALES = "GET_SALES";

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

export function getSales(
  year: number,
  month: number | null
): ThunkAction<Promise<void>, RootState, null, AnyAction> {
  return async (dispatch: Dispatch<AnyAction>) => {
    try {
      if (auth.currentUser === null) throw new Error("unauthenticated user");
      console.log(year, month);
      const salesRef = collection(db, "Users", auth.currentUser.uid, "Sales");

      // Date range
      let startDate: Date;
      let endDate: Date;

      // Per year or month
      if (month !== null) {
        startDate = startOfMonth(new Date(year, month - 1));
        endDate = endOfMonth(new Date(year, month - 1));
      } else {
        startDate = startOfYear(new Date(year, 0));
        endDate = endOfYear(new Date(year, 11));
      }

      // Query and get docs
      const snapshot = await getDocs(
        query(
          salesRef,
          where("date", ">=", startDate),
          where("date", "<=", endDate)
        )
      );

      // Get data
      let sales: any = [];
      snapshot.forEach((doc: any) => {
        sales.push(doc.data());
      });

      dispatch({
        type: GET_SALES,
        payload: sales,
      });
    } catch (e: any) {
      throw new Error(e);
    }
  };
}
