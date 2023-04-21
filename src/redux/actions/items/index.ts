import {
  collection,
  doc,
  getDocs,
  query,
  updateDoc,
  where,
  writeBatch,
} from "@firebase/firestore";
import { Item, RootState } from "../../../interfaces";
import { ThunkAction } from "redux-thunk";
import { AnyAction } from "redux";
import { Dispatch } from "react";
import { auth, db } from "../../../firebase";

export const POST_ITEMS = "POST_ITEMS";
export const GET_ITEMS = "GET_ITEMS";
export const EXPIRED_ITEMS = "EXPIRED_ITEMS";
export const REFOUND_ITEMS = "REFOUND_ITEMS";

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

export function getStockItems(): ThunkAction<
  Promise<void>,
  RootState,
  null,
  AnyAction
> {
  return async (dispatch: Dispatch<AnyAction>) => {
    try {
      if (auth.currentUser === null) throw new Error("unauthenticated user");

      let newItems: Array<any> = [];
      const itemRef = collection(db, "Users", auth.currentUser.uid, "Items");
      const newQuery = query(itemRef, where("state", "==", "In Stock"));
      const response = await getDocs(newQuery);

      response.forEach((doc) => {
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

export function refoundItems(
  itemID: number
): ThunkAction<Promise<void>, RootState, null, AnyAction> {
  return async (dispatch: Dispatch<AnyAction>) => {
    try {
      if (auth.currentUser === null) throw new Error("unauthenticated user");
      const itemsRef = collection(db, "Users", auth.currentUser.uid, "Items");
      await updateDoc(doc(itemsRef, itemID.toString()), { state: "In Stock" });

      dispatch({
        type: REFOUND_ITEMS,
        payload: itemID,
      });
    } catch (e: any) {
      throw new Error(e);
    }
  };
}
