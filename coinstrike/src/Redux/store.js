import { createStore, combineReducers, applyMiddleware } from "redux";
import thunk from "redux-thunk";
import { composeWithDevTools } from "redux-devtools-extension";
import {
  entryListReducer,
  subscriptionListReducer,
} from "./Reducers/EntryReducers";
import {
  userDetailsReducer,
  userLoginReducer,
  userRegisterReducer,
  userUpdateProfileReducer,
} from "./Reducers/userReducers";

const reducer = combineReducers({
  userLogin: userLoginReducer,
  userRegister: userRegisterReducer,
  userInfo: userDetailsReducer,
  userUpdateProfile: userUpdateProfileReducer,

  entryLists: entryListReducer,
  subscriptionLists: subscriptionListReducer,
});

const cartItemsFromLocalStorage = localStorage.getItem("cartItems")
  ? JSON.parse(localStorage.getItem("cartItems"))
  : [];

// login
const userInfoFromLocalStorage = localStorage.getItem("userInfo")
  ? JSON.parse(localStorage.getItem("userInfo"))
  : null;

// shippingAddress
const shippingAddressFromLocalStorage = localStorage.getItem("shippingAddress")
  ? JSON.parse(localStorage.getItem("shippingAddress"))
  : {};

const initialState = {
  // cart: {
  //   cartItems: cartItemsFromLocalStorage,
  //   shippingAddress: shippingAddressFromLocalStorage,
  // },
  userLogin: { userToken: userInfoFromLocalStorage },
  entryLists: { entries: [] },
  subscriptionLists: { subscriptions: [] },
};

const middleware = [thunk];

const store = createStore(
  reducer,
  initialState,
  composeWithDevTools(applyMiddleware(...middleware))
);

export default store;
