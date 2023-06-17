import { combineReducers, legacy_createStore as createStore, applyMiddleware, compose } from "redux";
import thunk from "redux-thunk";
import cartReducer from "./cart/cartReducer";

let rootReducer = combineReducers({
  cart: cartReducer
})

const devTools =
  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__();

let store = createStore(rootReducer, compose(applyMiddleware(thunk), devTools));

export default store;