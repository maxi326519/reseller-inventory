import { doc, setDoc, getDoc, updateDoc } from "firebase/firestore";
import { Dispatch, AnyAction } from "redux";
import { ThunkAction } from "redux-thunk";
import { RootState } from "../../../interfaces/interfaces";
import { db, auth } from "../../../firebase/config";

export const POST_CATEGORIES = "POST_CATEGORIES";
export const POST_SOURCES = "POST_SOURCES";
export const POST_LOCATIONS = "POST_LOCATIONS";
export const GET_USER_DATA = "GET_USER_DATA";

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

export function postSources(
  sources: string[]
): ThunkAction<Promise<void>, RootState, null, AnyAction> {
  return async (dispatch: Dispatch<AnyAction>) => {
    try {
      if (auth.currentUser === null) throw new Error("unauthenticated user");

      await updateDoc(doc(db, "Users", auth.currentUser.uid), {
        sources,
      });

      dispatch({
        type: POST_SOURCES,
        payload: sources,
      });
    } catch (e: any) {
      throw new Error(e);
    }
  };
}

export function postLocations(
  locations: string[]
): ThunkAction<Promise<void>, RootState, null, AnyAction> {
  return async (dispatch: Dispatch<AnyAction>) => {
    try {
      if (auth.currentUser === null) throw new Error("unauthenticated user");

      await updateDoc(doc(db, "Users", auth.currentUser.uid), {
        locations,
      });

      dispatch({
        type: POST_LOCATIONS,
        payload: locations,
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

      if (!query.exists()) {
        await setDoc(doc(db, "Users", auth.currentUser.uid), {
          categories: ["General"],
          sources: [],
        });
      }

      dispatch({
        type: GET_USER_DATA,
        payload: userData,
      });
    } catch (e: any) {
      throw new Error(e);
    }
  };
}
