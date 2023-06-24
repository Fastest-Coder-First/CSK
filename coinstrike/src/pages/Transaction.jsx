import React, { useState, useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";

import { getEntries, getSubscriptions } from "./../Redux/Actions/entryActions";

import NoUser from "./NoUser";
import Entry from "./../components/Entry";
import Subscription from "./../components/Subscription";
import AddExpenseModal from "./../components/AddExpense";
import AddSubscriptionModal from "./../components/AddSubscription";
import Sorting from "./../components/Sorting";

import NoList from "./../components/NoList";

import "./../css/transaction.css";

import { Input, Space, Pagination, Skeleton, message, Button } from "antd";
import {
  CompassOutlined,
  SearchOutlined,
  CaretDownOutlined,
  PlusOutlined,
} from "@ant-design/icons";

import { MemoizedBar, MemoizedNoChart } from "./../components/Chart";

export default function Transaction() {
  const [current, setCurrent] = useState(1);

  const [open, setOpen] = useState(false);
  const [openSub, setOpenSub] = useState(false);
  const [openSort, setOpenSort] = useState(false);

  const showModal = useCallback(() => {
    setOpen(true);
  }, [open]);
  const handleCancel = useCallback(
    (btn) => {
      setOpen(false);
      if (btn === 1) {
        popSuccess("Transaction added");
      }
    },
    [open]
  );
  const showModalSub = useCallback(() => {
    setOpenSub(true);
  }, [openSub]);
  const handleCancelSub = useCallback(() => {
    setOpenSub(false);
  }, [openSub]);

  //ERRORRR Manager
  const [messageApi, contextHolder] = message.useMessage();
  const popSuccess = (msg) => {
    messageApi.open({
      type: "success",
      content: msg,
    });
  };
  const popError = (msg) => {
    messageApi.open({
      type: "error",
      content: msg,
    });
  };

  //User Info
  const dispatch = useDispatch();
  // get user info from redux store using useSelector
  const { user } = useSelector((state) => state.userInfo);
  // get all entries from redux store using useSelector and sorted them
  const { loading, entries, sortedEntries, page, pages, count } = useSelector(
    (state) => state.entryLists
  );
  const { loadingSub, subscriptions, isSubscriptionsLoaded } = useSelector(
    (state) => state.subscriptionLists
  );

  useEffect(() => {
    //if user is logged in then only get entries
    if (user && Object.keys(user).length > 0) {
      //if entries are not loaded then only get entries
      if (entries && entries.length === 0) {
        //Getting Entries
        dispatch(getEntries(1));
        console.log("called entry transa");
      }
      //if subscriptions are not loaded then only get subscriptions
      if (
        subscriptions &&
        subscriptions.length === 0 &&
        !isSubscriptionsLoaded
      ) {
        //Getting Subscriptions
        dispatch(getSubscriptions());
        console.log("called subscription transa");
      }
    }
  }, [user]);

  const onPageChange = (page) => {
    console.log(page);
    setCurrent(page);
    //Check if current page is not equal to page then only get entries
    if (current !== page) {
      dispatch(getEntries(page));
    }
  };

  //if user is not logged in then show NoUser page
  if (user && Object.keys(user).length > 0) {
    return (
      <>
        {contextHolder}
        <section className="transaction">
          <div className="trans">
            <h3 className="trans--title">Expenses</h3>
            <div className="trans--categories">
              <div className="trans--categories-1">
                <div
                  className="btn btn-add"
                  style={{ color: "#fff", backgroundColor: "#0b1b34" }}
                  onClick={showModal}
                >
                  <PlusOutlined className="add-new-icon" />
                  Add New
                </div>
                <div
                  className="btn btn-add"
                  style={{
                    color: "#000",
                    backgroundColor: "#f3f3f3",
                  }}
                  onClick={() => setOpenSort(true)}
                >
                  <CaretDownOutlined className="add-new-icon" />
                  Sort By
                </div>
                <Button
                  key="submit"
                  className="last"
                  type="dashed"
                  onClick={() => dispatch({ type: "ENTRY_SORTLIST_RESET" })}
                  disabled={
                    sortedEntries && sortedEntries.length > 0 ? false : true
                  }
                >
                  Reset
                </Button>
              </div>
              <div className="trans--categories-2">
                <Space.Compact size="small">
                  <Input
                    addonBefore={
                      <SearchOutlined className="cur-p" onClick={() => {}} />
                    }
                    placeholder="Search by name, category, amount..."
                    style={{
                      backgroundColor: "#fff!important",
                    }}
                  />
                </Space.Compact>
              </div>
            </div>
            <div className="trans--entries">
              {loading ? ( //Loading Skeleton
                new Array(10)
                  .fill(0)
                  .map((_, i) => (
                    <Skeleton.Button
                      style={{ margin: ".5rem 0" }}
                      active={loading}
                      size="small"
                      block={true}
                      key={i}
                    />
                  ))
              ) : sortedEntries && sortedEntries.length > 0 ? ( //Sorted Entries
                sortedEntries.map((entry) => (
                  <Entry key={entry._id} entry={entry} />
                ))
              ) : entries && entries.length > 0 ? ( //Entries
                entries.map((entry) => <Entry key={entry._id} entry={entry} />)
              ) : (
                //No Entries
                <NoList
                  title={"Sorry! No Transaction to load."}
                  btnText={"Add Transaction"}
                  btnFunc={showModal}
                />
              )}
            </div>
            <div className="trans--footer">
              <p>
                showing {1} of {pages} pages of {count} entries
              </p>
              <Pagination
                size="small"
                style={{
                  color: "black",
                  backgroundColor: "#fff",
                }}
                current={current}
                onChange={onPageChange}
                total={count || 0}
              />
            </div>
          </div>
          <div className="subscription">
            <h3 className="trans--title">Subscription</h3>
            <div
              className="trans--categories trans--categories-1"
              style={{
                justifyContent: "flex-start",
                alignItems: "baseline",
              }}
            >
              <div
                className="btn btn-add last"
                style={{
                  color: "#fff",
                  backgroundColor: "#0b1b34",
                }}
                onClick={showModalSub}
              >
                <PlusOutlined className="add-new-icon" />
                Add New
              </div>
            </div>
            <div
              style={{ flex: "1", minHeight: "35%", maxHeight: "50%" }}
              className="trans--entries scroll-y"
            >
              {loadingSub ? (
                new Array(10)
                  .fill(0)
                  .map((_, i) => (
                    <Skeleton.Button
                      style={{ margin: ".5rem 0" }}
                      active={loading}
                      size="small"
                      block={true}
                      key={i}
                    />
                  ))
              ) : subscriptions && subscriptions.length > 0 ? (
                subscriptions.map((sub) => (
                  <Subscription key={sub._id} sub={sub} />
                ))
              ) : (
                // <NoList title={"Sorry! No Subscription to load."} text={"Add Subscition"} btnText={"Add Subscription"} btnFunc={} />
                <NoList
                  title={"Sorry! No Subscription to load."}
                  btnText={"Add Subscription"}
                  btnFunc={showModalSub}
                />
              )}
            </div>
            {user && user.expenseList && user.expenseList.length ? (
              <MemoizedBar data={user.expenseList} />
            ) : (
              <MemoizedNoChart bg="#f6f6f6" title={"No data available!"} />
            )}
          </div>
        </section>
        <Sorting handleCancel={() => setOpenSort(false)} open={openSort} />
        <AddExpenseModal handleCancel={handleCancel} open={open} />
        <AddSubscriptionModal handleCancel={handleCancelSub} open={openSub} />
      </>
    );
  } else {
    return <NoUser />;
  }
}
