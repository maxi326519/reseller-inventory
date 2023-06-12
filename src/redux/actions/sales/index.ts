import { Dispatch, AnyAction } from "redux";
import { ThunkAction } from "redux-thunk";
import { db, auth } from "../../../firebase";
import { arrayUnion, collection, doc, writeBatch } from "firebase/firestore";
import { Sale, RootState, Expense } from "../../../interfaces";

export const POST_SALE = "POST_SALE";
export const GET_SALES = "GET_SALES";

export function postSales(
  sales: Sale[] | any,
  expenses: Expense[] | any
): ThunkAction<Promise<void>, RootState, null, AnyAction> {
  return async (dispatch: Dispatch<AnyAction>) => {
    try {
      if (auth.currentUser === null) throw new Error("unauthenticated user");
      const batch = writeBatch(db);

      // Agregar documentos al batch
      const salesRef = collection(db, "Users", auth.currentUser.uid, "Sales");
      const itemsRef = collection(db, "Users", auth.currentUser.uid, "Items");
      const expensesRef = collection(
        db,
        "Users",
        auth.currentUser.uid,
        "Expenses"
      );

      // Set expense
      sales.forEach((sale: Sale) => {
        batch.set(doc(salesRef), sale);
        batch.update(doc(itemsRef, sale.productId.toString()), {
          state: "Sold",
          sales: arrayUnion({
            id: sale.id,
            saleDate: sale.date,
          }),
        });
      });

      // Set epxenses
      expenses.forEach((expense: Expense) => {
        batch.set(doc(expensesRef), expense);
      });

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
