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
import CoinStrike from "../../api/CoinStrike";

// LOGIN
export const login = (email, password) => async (dispatch) => {
  try {
    dispatch({ type: USER_LOGIN_REQUEST });

    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    };

    const { data } = await CoinStrike.post(
      `/api/user/login`,
      { email, password },
      config
    );
    dispatch({ type: USER_LOGIN_SUCCESS, payload: data.token });

    localStorage.setItem("userInfo", JSON.stringify(data.token));
  } catch (error) {
    dispatch({
      type: USER_LOGIN_FAIL,
      payload:
        error.response && error.response.data
          ? error.response.data
          : error.message,
    });
  }
};

// LOGOUT
export const logout = () => (dispatch) => {
  localStorage.removeItem("userInfo");
  dispatch({ type: USER_LOGOUT });
  dispatch({ type: USER_DETAILS_RESET });
};

export const wrongEmail = (id) => async (dispatch) => {
  await CoinStrike.delete(`/api/user/${id}`);
  console.log(id);
  dispatch({ type: "USER_REGISTER_RESET" });
};

//INCOME & EXPENSE
export const updateIE = () => async (dispatch, getState) => {
  try {
    const {
      userLogin: { userToken },
    } = getState();
    const config = {
      headers: {
        Authorization: `Bearer ${userToken}`,
      },
    };
    const { data } = await CoinStrike.get(`/api/user/ie`, config);
    dispatch({ type: "AMOUNT_SUCCESS", payload: data });
  } catch (error) {
    const message =
      error.response && error.response.data.message
        ? error.response.data.message
        : error.message;

    console.log(message);
  }
};
// REGISTER
export const register = (email, password) => async (dispatch) => {
  try {
    dispatch({ type: USER_REGISTER_REQUEST });

    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    };
    const data = await CoinStrike.post(
      `/api/user/`,
      { email, password },
      config
    );
    if (data.status === 200) {
      dispatch({
        type: USER_REGISTER_SUCCESS,
        payload: { isRegister: true, email: email, id: data.data.id },
      });
    }

    // dispatch({ type: USER_REGISTER_SUCCESS, payload: true });
    // dispatch({ type: USER_LOGIN_SUCCESS, payload: data });

    // localStorage.setItem("userInfo", JSON.stringify(data));
  } catch (error) {
    dispatch({
      type: USER_REGISTER_FAIL,
      payload:
        error.response && error.response.data
          ? error.response.data
          : error.message,
    });
  }
};

// Verify OTP
export const verify = (otp, userEmail) => async (dispatch) => {
  try {
    dispatch({ type: USER_LOGIN_REQUEST });

    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    };
    const { data } = await CoinStrike.post(
      `/api/user/verify`,
      { otp, email: userEmail },
      config
    );
    dispatch({ type: USER_LOGIN_SUCCESS, payload: data.token });

    localStorage.setItem("userInfo", JSON.stringify(data.token));
  } catch (error) {
    dispatch({
      type: USER_LOGIN_FAIL,
      payload:
        error.response && error.response.data
          ? error.response.data
          : error.message,
    });
  }
};

// USER DETAILS
export const getUserInfo = () => async (dispatch, getState) => {
  try {
    dispatch({ type: USER_DETAILS_REQUEST });
    const {
      userLogin: { userToken },
    } = getState();
    const config = {
      headers: {
        Authorization: `Bearer ${userToken}`,
      },
    };

    const { data } = await CoinStrike.get(`/api/user/profile`, config);
    console.log("userDetail", data);
    dispatch({ type: USER_DETAILS_SUCCESS, payload: data });
  } catch (error) {
    const message =
      error.response && error.response.data.message
        ? error.response.data.message
        : error.message;
    if (message === "Not authorized, token failed") {
      dispatch(logout());
    }
    dispatch({
      type: USER_DETAILS_FAIL,
      payload: message,
    });
  }
};

// UPDATE PROFILE
export const updateUserProfile = (user) => async (dispatch, getState) => {
  try {
    dispatch({ type: USER_UPDATE_PROFILE_REQUEST });

    const {
      userLogin: { userToken },
    } = getState();

    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${userToken}`,
      },
    };

    const { data } = await CoinStrike.put(`/api/user/profile`, user, config);
    dispatch({ type: USER_UPDATE_PROFILE_SUCCESS, payload: data });
  } catch (error) {
    const message =
      error.response && error.response.data.message
        ? error.response.data.message
        : error.message;
    if (message === "Not authorized, token failed") {
      dispatch(logout());
    }
    dispatch({
      type: USER_UPDATE_PROFILE_FAIL,
      payload: message,
    });
  }
};

// UPDATE PROFILE PHOTO
export const updateUserProfilePhoto = (user) => async (dispatch, getState) => {
  try {
    dispatch({ type: USER_UPDATE_PROFILE_REQUEST });

    const {
      userLogin: { userInfo },
    } = getState();

    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${userInfo.token}`,
      },
    };

    const { data } = await CoinStrike.post(
      `/api/users/profile/photo`,
      user,
      config
    );
    dispatch({ type: USER_UPDATE_PROFILE_SUCCESS, payload: data });
    dispatch({ type: USER_LOGIN_SUCCESS, payload: data });

    localStorage.setItem("userInfo", JSON.stringify(data));
  } catch (error) {
    const message =
      error.response && error.response.data.message
        ? error.response.data.message
        : error.message;
    if (message === "Not authorized, token failed") {
      dispatch(logout());
    }
    dispatch({
      type: USER_UPDATE_PROFILE_FAIL,
      payload: message,
    });
  }
};

//Get Pie data
export const getPieData = () => async (dispatch, getState) => {
  try {
    dispatch({ type: "PIE_DATA_REQUEST" });

    //Token Bearer authorization
    const {
      userLogin: { userToken },
    } = getState();
    const config = {
      headers: {
        Authorization: `Bearer ${userToken}`,
      },
    };
    const { data } = await CoinStrike.get(`/api/entry/chart/pie`, config);
    console.log(data);
    dispatch({ type: "PIE_DATA_SUCCESS", payload: data });
  } catch (error) {
    dispatch({
      type: "PIE_DATA_FAIL",
      payload:
        error.response && error.response.data
          ? error.response.data
          : error.message,
    });
  }
};
