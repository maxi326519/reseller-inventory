import { Dispatch, AnyAction } from "redux";
import { ThunkAction } from "redux-thunk";
import { db, auth } from "../../../firebase";
import {
  Timestamp,
  arrayUnion,
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  where,
  writeBatch,
} from "firebase/firestore";
import { Sale, RootState, Expense, Item } from "../../../interfaces/interfaces";
import { endOfMonth, endOfYear, startOfMonth, startOfYear } from "date-fns";

export const POST_SALE = "POST_SALE";
export const GET_SALES = "GET_SALES";
export const DELETE_SALE = "DELETE_SALE";

export function postSales(
  sales: Sale[],
  expenses: Expense[]
): ThunkAction<Promise<void>, RootState, null, AnyAction> {
  return async (dispatch: Dispatch<AnyAction>) => {
    try {
      // Check if user is loggued in
      if (auth.currentUser === null) throw new Error("unauthenticated user");

      // Create collection refereneces
      const userDoc = doc(collection(db, "Users"), auth.currentUser.uid);
      const salesColl = collection(userDoc, "Sales");
      const itemsColl = collection(userDoc, "Items");
      const expensesColl = collection(userDoc, "Expenses");

      // Check if saleId already exist
      for (const sale of sales) {
        const snaptshop = await getDoc(doc(salesColl, sale.id.toString()));
        if (snaptshop.exists()) throw new Error("Sale id already exist");
      }

      // Set sale and update item
      const batch = writeBatch(db);
      sales.forEach((sale: Sale) => {
        batch.set(doc(salesColl, sale.id.toString()), sale);
        batch.update(doc(itemsColl, sale.productId.toString()), {
          state: "Sold",
          sales: arrayUnion({
            id: sale.id,
            saleDate: sale.date,
          }),
        });
      });

      // Set epxenses
      expenses.forEach((expense: Expense) =>
        batch.set(doc(expensesColl), expense)
      );

      // Post data
      await batch.commit();

      dispatch({
        type: POST_SALE,
        payload: {
          sales,
          expenses,
        },
      });
    } catch (e: any) {
      throw new Error(e);
    }
  };
}

export function getSales(
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
      const salesQuery = await getDocs(
        query(
          salesRef,
          where("date", ">=", startTimeStamp),
          where("date", "<=", endTimeStamp)
        )
      );

      let sales: Sale[] = [];
      salesQuery.forEach((doc: any) => {
        sales.push(doc.data());
      });

      const expensesQuery = await getDocs(
        query(
          expensesRef,
          where("date", ">=", startTimeStamp),
          where("date", "<=", endTimeStamp)
        )
      );

      // Get data to docs
      let items: any = [];
      for (const sale of sales) {
        const snapshot = await getDoc(doc(itemsRef, sale.productId.toString()));
        items.push(snapshot.data());
      }

      let expenses: any = [];
      expensesQuery.forEach((doc: any) => {
        expenses.push(doc.data());
      });

      const data = {
        items,
        sales,
        expenses,
      };

      console.log(items);

      dispatch({
        type: GET_SALES,
        payload: data,
      });
    } catch (e: any) {
      throw new Error(e);
    }
  };
}

export function deleteSale(
  sale: Sale
): ThunkAction<Promise<void>, RootState, null, AnyAction> {
  return async (dispatch: Dispatch<AnyAction>) => {
    try {
      // Check if user is loggued in
      if (auth.currentUser === null) throw new Error("unauthenticated user");

      // Firebase collections
      const userDoc = doc(collection(db, "Users"), auth.currentUser.uid);
      const itemsColl = collection(userDoc, "Items");
      const salesColl = collection(userDoc, "Sales");
      const expensesColl = collection(userDoc, "Expenses");

      // Batch instance
      const batch = writeBatch(db);
      
      // Get item
      const itemDoc = doc(itemsColl, sale.productId.toString());
      const itemSnap = await getDoc(itemDoc);
      const item: Item = itemSnap.data() as Item;

      // If this sale is refounded, update only item's sales list
      if (!sale.refounded) {
        // Update item
        batch.update(doc(itemsColl, item.id.toString()), {
          state: "In Stock",
          sales: item.sales?.filter((itemSale) => itemSale.id !== sale.id),
        });
      } else {
        // Update item
        batch.update(doc(itemsColl, item.id.toString()), {
          sales: item.sales?.filter((itemSale) => itemSale.id !== sale.id),
        });
      }

      // Get and delete sale
      const salesSnap = await getDoc(doc(salesColl, sale.id.toString()));
      batch.delete(salesSnap.ref);

      // Get and delete expenses
      const expensesQuery = query(expensesColl, where("id", "==", sale.id));
      const expensesSnap = await getDocs(expensesQuery);
      expensesSnap.forEach((doc) => batch.delete(doc.ref));

      await batch.commit();

      dispatch({
        type: DELETE_SALE,
        payload: sale,
      });
    } catch (e: any) {
      throw new Error(e);
    }
  };
}
