import {
  USER_DETAILS_FAIL,
  USER_DETAILS_REQUEST,
  USER_DETAILS_RESET,
  USER_DETAILS_SUCCESS,
  USER_LOGIN_FAIL,
  USER_LOGIN_REQUEST,
  USER_LOGIN_SUCCESS,
  USER_LOGOUT,
  USER_REGISTER_FAIL,
  USER_REGISTER_REQUEST,
  USER_REGISTER_SUCCESS,
  USER_UPDATE_PROFILE_FAIL,
  USER_UPDATE_PROFILE_REQUEST,
  USER_UPDATE_PROFILE_SUCCESS,
} from "../Constants/UserContants";

// LOGIN
export const userLoginReducer = (state = {}, action) => {
  switch (action.type) {
    case USER_LOGIN_REQUEST:
      return { loading: true };
    case USER_LOGIN_SUCCESS:
      return { loading: false, userToken: action.payload };
    case USER_LOGIN_FAIL:
      return { loading: false, error: action.payload };
    case USER_LOGOUT:
      return {};
    default:
      return state;
  }
};

// REGISTER
export const userRegisterReducer = (state = {}, action) => {
  switch (action.type) {
    case USER_REGISTER_REQUEST:
      return { loading: true };
    case USER_REGISTER_SUCCESS:
      return {
        loading: false,
        isRegister: action.payload.isRegister,
        userEmail: action.payload.email,
        id: action.payload.id,
      };
    case "USER_REGISTER_RESET":
      return {
        loading: false,
        isRegister: false,
        userEmail: "",
        id: "",
      };
    case USER_REGISTER_FAIL:
      return { loading: false, error: action.payload };
    default:
      return state;
  }
};

// USER DETAILS
export const userDetailsReducer = (state = { user: {} }, action) => {
  switch (action.type) {
    case USER_DETAILS_REQUEST:
      return { ...state, loading: true };
    case USER_DETAILS_SUCCESS:
      return { loading: false, user: action.payload };
    case USER_DETAILS_FAIL:
      return { loading: false, error: action.payload };
    case USER_DETAILS_RESET:
      return { user: {} };
    case "AMOUNT_SUCCESS":
      return {
        ...state,
        user: {
          ...state.user,
          income: action.payload.income,
          expense: action.payload.expense,
          balance: action.payload.income - action.payload.expense,
        },
      };
    case "PIE_DATA_REQUEST":
      return { ...state, loadingPie: true };
    case "PIE_DATA_SUCCESS":
      return { ...state, loadingPie: false, pieData: action.payload };
    case "PIE_DATA_FAIL":
      return { ...state, loadingPie: false, errorPie: action.payload };
    default:
      return state;
  }
};

// UPDATE PROFILE
export const userUpdateProfileReducer = (state = {}, action) => {
  switch (action.type) {
    case USER_UPDATE_PROFILE_REQUEST:
      return { loadingU: true };
    case USER_UPDATE_PROFILE_SUCCESS:
      console.log("user", action.payload);
      return { loadingU: false, success: true, userUpdate: action.payload };
    case USER_UPDATE_PROFILE_FAIL:
      return { loadingU: false, error: action.payload };
    default:
      return state;
  }
};
