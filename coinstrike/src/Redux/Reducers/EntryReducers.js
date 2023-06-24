import {
  ENTRY_LIST_REQUEST,
  ENTRY_LIST_SUCCESS,
  ENTRY_CATEGORY_LIST_SUCCESS,
  ENTRY_LIST_FAIL,
  ENTRY_DETAILS_REQUEST,
  ENTRY_DETAILS_SUCCESS,
  ENTRY_DETAILS_FAIL,
  ENTRY_UPDATE_REQUEST,
  ENTRY_UPDATE_SUCCESS,
  ENTRY_UPDATE_FAIL,
  SUBSCRIPTION_LIST_REQUEST,
  SUBSCRIPTION_LIST_SUCCESS,
  SUBSCRIPTION_LIST_FAIL,
  SUBSCRIPTION_CREATE_SUCCESS,
  SUBSCRIPTION_UPDATE_SUCCESS,
  SUBSCRIPTION_DELETE_SUCCESS,
} from "../Constants/EntryConstants";

// ENTRY LIST
export const entryListReducer = (state = { entries: [] }, action) => {
  console.log("entryListReducer", state, action.type);
  switch (action.type) {
    case ENTRY_LIST_REQUEST:
      return { ...state, loading: true };

    //GET entries from api
    case ENTRY_LIST_SUCCESS:
      return {
        ...state,
        loading: false,
        isEntryLoaded: true, //to avoid multiple calls to api
        pages: action.payload.pages,
        page: action.payload.page,
        entries: action.payload.entries,
        count: action.payload.total,
        sortedEntries: [],
      };

    //GET Sorted entries from api
    case "ENTRY_SORTLIST_SUCCESS":
      return {
        ...state,
        loading: false,
        pages: action.payload.pages,
        page: action.payload.page,
        sortedEntries: action.payload.entries,
        count: action.payload.total,
      };

    //Reset Sorted entries local
    case "ENTRY_SORTLIST_RESET":
      return {
        ...state,
        loading: false,
        sortedEntries: [],
      };

    //ADD the transaction to entries
    case "ENTRY_CREATE_SUCCESS":
      if (state.entries.length === 10) {
        state.entries.pop(); //pop the last element
      }
      return {
        ...state,
        loading: false,
        count: state.entries.length === 10 ? 10 : state.count + 1,
        entries: [action.payload, ...state.entries],
        sortedEntries: [],
      };

    //UPDATE the transaction with the provided ID
    case "ENTRY_UPDATE_SUCCESS":
      if (state.sortedEntries && state.sortedEntries.length > 0) {
        const updatedSortedEntries = state.sortedEntries.map((entry) =>
          entry._id === action.payload._id ? action.payload : entry
        );
        return {
          ...state,
          loading: false,
          sortedEntries: updatedSortedEntries,
        };
      }
      const updatedTransactions = state.entries.map((entry) =>
        entry._id === action.payload._id ? action.payload : entry
      );
      return { ...state, loading: false, entries: updatedTransactions };

    // Delete the transaction with the provided ID
    case "ENTRY_DELETE_SUCCESS":
      if (state.sortedEntries && state.sortedEntries.length > 0) {
        const deletedTransactions = state.sortedEntries.filter(
          (entry) => entry._id !== action.payload.id
        );
        return {
          ...state,
          loading: false,
          sortedEntries: deletedTransactions,
          pages: action.payload.pages,
          count: action.payload.total,
        };
      }
      const deletedTransactions = state.entries.filter(
        (entry) => entry._id !== action.payload.id
      );
      return {
        ...state,
        loading: false,
        entries: deletedTransactions,
        pages: action.payload.pages,
        count: action.payload.total,
      };
    case ENTRY_LIST_FAIL:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };
    default:
      return state;
  }
};

// SUBSCRIPTION LIST
export const subscriptionListReducer = (
  state = { subscriptions: [] },
  action
) => {
  console.log("subscriptionListReducer", state, action.type);
  switch (action.type) {
    case SUBSCRIPTION_LIST_REQUEST:
      return { ...state, loadingSub: true };

    //GET subscriptions from api
    case SUBSCRIPTION_LIST_SUCCESS:
      return {
        ...state,
        loadingSub: false,
        subscriptions: action.payload.subscriptions,
        isSubscriptionsLoaded: true, //to avoid multiple calls to api
      };

    //ADD the subscription to subscriptions
    case SUBSCRIPTION_CREATE_SUCCESS:
      return {
        ...state,
        loadingSub: false,
        subscriptions: [action.payload, ...state.subscriptions],
      };

    //UPDATE the subscription with the provided ID
    case SUBSCRIPTION_UPDATE_SUCCESS:
      const updatedSubscription = state.subscriptions.map((entry) =>
        entry._id === action.payload._id ? action.payload : entry
      );
      return {
        ...state,
        loadingSub: false,
        subscriptions: updatedSubscription,
      };

    // Delete the subscription with the provided ID
    case SUBSCRIPTION_DELETE_SUCCESS:
      const deletedSubscription = state.subscriptions.filter(
        (entry) => entry._id !== action.payload.id
      );
      return {
        ...state,
        loadingSub: false,
        subscriptions: deletedSubscription,
      };
    case SUBSCRIPTION_LIST_FAIL:
      return {
        ...state,
        loadingSub: false,
        error: action.payload,
      };
    default:
      return state;
  }
};
