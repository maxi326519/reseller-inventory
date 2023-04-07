import { Dispatch, AnyAction } from "redux";
import { ThunkAction } from "redux-thunk";
import { auth } from "../../../firebase";
import { signInWithEmailAndPassword, signOut } from "firebase/auth";
import { RootState } from "../../../interfaces";

export const LOGIN = "LOGIN";
export const LOGOUT = "LOGOUT";

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
