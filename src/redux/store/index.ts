import { /* Action, combineReducers, */ applyMiddleware, createStore } from "redux";
import { composeWithDevTools } from "redux-devtools-extension";
import thunk, { /* ThunkMiddleware */ } from "redux-thunk";
import { rootReducer } from "../reducer";
/* import { RootState } from "../../interfaces"; */

/* export interface DispatchActon extends Action {
  payload: Partial<RootState>;
}

const middleWare = thunk as ThunkMiddleware<RootState, DispatchActon>; */

const store = createStore(
  rootReducer,
  composeWithDevTools(applyMiddleware(thunk))
);

export default store;
