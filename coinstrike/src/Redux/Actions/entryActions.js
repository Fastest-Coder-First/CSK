import {
  ENTRY_LIST_REQUEST,
  ENTRY_LIST_SUCCESS,
  ENTRY_CATEGORY_LIST_SUCCESS,
  ENTRY_LIST_FAIL,
  ENTRY_DETAILS_REQUEST,
  ENTRY_DETAILS_SUCCESS,
  SUBSCRIPTION_LIST_REQUEST,
  SUBSCRIPTION_LIST_SUCCESS,
  SUBSCRIPTION_CREATE_SUCCESS,
  SUBSCRIPTION_UPDATE_SUCCESS,
  SUBSCRIPTION_DELETE_SUCCESS,
  SUBSCRIPTION_LIST_FAIL,
  ENTRY_UPDATE_REQUEST,
  ENTRY_UPDATE_SUCCESS,
  ENTRY_UPDATE_FAIL,
} from "../Constants/EntryConstants";
import CoinStrike from "../../api/CoinStrike";

import { updateIE } from "./userActions";

// Add TRANSACTION
//Create a addEntry action that takes in entry as a parameter and dispatches an async function
export const addEntry = (entry) => async (dispatch, getState) => {
  try {
    // dispatch({ type: ENTRY_LIST_REQUEST });

    //Token Bearer authorization
    //get userToken from state and set it as bearer token
    const {
      userLogin: { userToken },
    } = getState();
    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${userToken}`,
      },
    };
    const { data } = await CoinStrike.post(`/api/entry`, entry, config);
    dispatch({ type: "ENTRY_CREATE_SUCCESS", payload: data.data });
    dispatch(updateIE());
  } catch (error) {
    dispatch({
      type: ENTRY_LIST_FAIL,
      payload:
        error.response && error.response.data
          ? error.response.data
          : error.message,
    });
  }
};

// Get TRANSACTION
//Create a getEntries action that takes in page as a parameter and dispatches an async function
export const getEntries = (page) => async (dispatch, getState) => {
  try {
    dispatch({ type: ENTRY_LIST_REQUEST });

    //Token Bearer authorization
    //get userToken from state and set it as bearer token
    const {
      userLogin: { userToken },
    } = getState();
    const config = {
      headers: {
        Authorization: `Bearer ${userToken}`,
      },
    };
    console.log("ea", userToken);
    const { data } = await CoinStrike.get(
      `/api/entry?page=${page}&limit=10`,
      config
    );
    dispatch({ type: ENTRY_LIST_SUCCESS, payload: data.data });
  } catch (error) {
    dispatch({
      type: ENTRY_LIST_FAIL,
      payload:
        error.response && error.response.data
          ? error.response.data
          : error.message,
    });
  }
};

// Get Sorted TRANSACTION
//Create a getSortedEntries action that takes in sortBy, sortOrder, as a parameter and dispatches an async function
export const getSortedEntries =
  ({ sortBy, sortOrder, page }) =>
  async (dispatch, getState) => {
    try {
      dispatch({ type: ENTRY_LIST_REQUEST });

      //Token Bearer authorization
    //get userToken from state and set it as bearer token
      const {
        userLogin: { userToken },
      } = getState();
      const config = {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      };
      const { data } = await CoinStrike.get(
        `/api/entry/sorted?page=${page}&limit=10&sortBy=${sortBy}&sortOrder=${sortOrder}`,
        config
      );
      dispatch({ type: "ENTRY_SORTLIST_SUCCESS", payload: data.data });
    } catch (error) {
      dispatch({
        type: ENTRY_LIST_FAIL,
        payload:
          error.response && error.response.data
            ? error.response.data
            : error.message,
      });
    }
  };

// Edit TRANSACTION
export const updateEntry = (entry) => async (dispatch, getState) => {
  try {
    dispatch({ type: ENTRY_UPDATE_REQUEST });

    //Token Bearer authorization
    //get userToken from state and set it as bearer token
    const {
      userLogin: { userToken },
    } = getState();
    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${userToken}`,
      },
    };
    const { data } = await CoinStrike.put(
      `/api/entry/${entry.id}`,
      entry,
      config
    );
    console.log("editEntry", data);
    dispatch({ type: "ENTRY_UPDATE_SUCCESS", payload: data });
  } catch (error) {
    dispatch({
      type: ENTRY_UPDATE_FAIL,
      payload:
        error.response && error.response.data
          ? error.response.data
          : error.message,
    });
  }
};

// Edit TRANSACTION
//Create a deleteEntry action that takes in entry id as parameter
export const deleteEntry =
  ({ id, amount, type, date }) =>
  async (dispatch, getState) => {
    try {
      // dispatch({ type: ENTRY_LIST_REQUEST });

      //Token Bearer authorization
    //get userToken from state and set it as bearer token
      const {
        userLogin: { userToken },
      } = getState();
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${userToken}`,
        },
      };
      console.log(id);
      const { data } = await CoinStrike.delete(
        `/api/entry/${id}?amount=${amount}&type=${type}&date=${date}`,
        config
      );
      // console.log(data);
      dispatch({
        type: "ENTRY_DELETE_SUCCESS",
        payload: { ...data, id },
      });
    } catch (error) {
      dispatch({
        type: ENTRY_UPDATE_FAIL,
        payload:
          error.response && error.response.data
            ? error.response.data
            : error.message,
      });
    }
  };



  //Get Subscriptions
export const getSubscriptions = () => async (dispatch, getState) => {
  try {
    dispatch({ type: SUBSCRIPTION_LIST_REQUEST });

    //Token Bearer authorization
    //get userToken from state and set it as bearer token
    const {
      userLogin: { userToken },
    } = getState();
    const config = {
      headers: {
        Authorization: `Bearer ${userToken}`,
      },
    };
    const { data } = await CoinStrike.get(`/api/entry/subscription`, config);
    dispatch({ type: SUBSCRIPTION_LIST_SUCCESS, payload: data.data });
  } catch (error) {
    dispatch({
      type: SUBSCRIPTION_LIST_FAIL,
      payload:
        error.response && error.response.data
          ? error.response.data
          : error.message,
    });
  }
};

//ADD Subscriptions
//Create a addSubscription action that is same as addEntry
export const addSubscription = (sub) => async (dispatch, getState) => {
  try {
    dispatch({ type: SUBSCRIPTION_LIST_REQUEST });

    //Token Bearer authorization
    //get userToken from state and set it as bearer token
    const {
      userLogin: { userToken },
    } = getState();
    const config = {
      headers: {
        Authorization: `Bearer ${userToken}`,
      },
    };
    console.log("sub", sub);
    const { data } = await CoinStrike.post(
      `/api/entry/subscription`,
      sub,
      config
    );
    console.log(data);
    dispatch({ type: SUBSCRIPTION_CREATE_SUCCESS, payload: data });
  } catch (error) {
    dispatch({
      type: SUBSCRIPTION_LIST_FAIL,
      payload:
        error.response && error.response.data
          ? error.response.data
          : error.message,
    });
  }
};

//UPDATE Subscriptions
//Create a addSubscription action that is same as updateEntry
export const updateSubscription = (sub) => async (dispatch, getState) => {
  try {
    dispatch({ type: SUBSCRIPTION_LIST_REQUEST });

    //Token Bearer authorization
    //get userToken from state and set it as bearer token
    const {
      userLogin: { userToken },
    } = getState();
    const config = {
      headers: {
        Authorization: `Bearer ${userToken}`,
      },
    };
    console.log("sub", sub);
    const { data } = await CoinStrike.put(
      `/api/entry/subscription/${sub.id}`,
      sub,
      config
    );
    console.log(data);
    dispatch({ type: SUBSCRIPTION_UPDATE_SUCCESS, payload: data });
  } catch (error) {
    dispatch({
      type: SUBSCRIPTION_LIST_FAIL,
      payload:
        error.response && error.response.data
          ? error.response.data
          : error.message,
    });
  }
};

//Delete Subscription
export const deleteSubscription =
  ({ id, amount }) =>
  async (dispatch, getState) => {
    try {
      //Token Bearer authorization
    //get userToken from state and set it as bearer token
      const {
        userLogin: { userToken },
      } = getState();
      const config = {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      };
      await CoinStrike.delete(
        `api/entry/subscription/${id}?amount=${amount}`,
        config
      );
      dispatch({ type: SUBSCRIPTION_DELETE_SUCCESS, payload: { id } });
    } catch (error) {
      dispatch({
        type: SUBSCRIPTION_LIST_FAIL,
        payload:
          error.response && error.response.data
            ? error.response.data
            : error.message,
      });
    }
  };
