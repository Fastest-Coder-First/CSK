import React, { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";

import { useDispatch, useSelector } from "react-redux";
import { getEntries, getSubscriptions } from "./../Redux/Actions/entryActions";
import { getPieData, updateIE } from "./../Redux/Actions/userActions";

import NoUser from "./NoUser";
import NoList from "./../components/NoList";
import EntrySmall from "./../components/EntrySmall";
import SubscriptionSmall from "./../components/SubscriptionSmall";
import Box from "./../components/Box";

import "./../css/dashboard.css";

import {
  MemoizedDonut,
  MemoizedLine,
  MemoizedNoChart,
} from "./../components/Chart";

import { Skeleton } from "antd";

export default function Dashboard() {
  const navigate = useNavigate();

  const dispatch = useDispatch();
  //User Info
  // Get User from userInfo reducer using useSelector
  const { user, pieData } = useSelector((state) => state.userInfo);
  const { entries, loading, isEntryLoaded } = useSelector(
    (state) => state.entryLists
  );
  // Get subscriptions, loadingSub, isSubscriptionsLoaded from subscriptionLists reducer using useSelector
  const { subscriptions, loadingSub, isSubscriptionsLoaded } = useSelector(
    (state) => state.subscriptionLists
  );

  useEffect(() => {
    // If user is not present then navigate to NoUser page
    if (user && Object.keys(user).length > 0) {
      //calsulate percentage of expense and profit from total income and expense of user
      const ep = (user.expense / user.income) * 100;
      const ip = ((user.income - user.expense) / user.income) * 100;
      //set it to state of expensePercent and balancePercent
      setExpensePercent((ep / 100) * (maxValue - minValue) + minValue);
      setBalancePercent((ip / 100) * (maxValue - minValue) + minValue);

      getPieFunc();

      // If entries and subscriptions are not loaded then dispatch getEntries and getSubscriptions
      if (entries && entries.length === 0 && !isEntryLoaded) {
        //Getting Entries
        dispatch(getEntries(1));
        console.log("called entry");
      }
      // If subscriptions and subscriptions are not loaded then dispatch getSubscriptions
      if (
        subscriptions &&
        subscriptions.length === 0 &&
        !isSubscriptionsLoaded
      ) {
        //Getting Subscriptions
        dispatch(getSubscriptions());
        console.log("called subscription");
      }
    }
  }, [user]);

  useEffect(() => {
    dispatch(updateIE());
  }, []);

  const getPieFunc = useCallback(() => {
    if (pieData === undefined) {
      dispatch(getPieData());
    }
  }, [user]);

  const minValue = 20; // Minimum pixel value
  const maxValue = 200; // Maximum pixel value

  const [expensePercent, setExpensePercent] = useState(0);
  const [balancePercent, setBalancePercent] = useState(0);
  // const [balance, setBalance] = useState(0);

  // Check if user is present or not and if not then navigate to NoUser page
  if (user && Object.keys(user).length > 0) {
    return (
      <section className="dashboard">
        <section className="dashboard--1">
          <div className="dashboard--1-1">
            <Box
              // w="200px"
              h={balancePercent !== 0 ? String(balancePercent + "px") : "20px"} //(expenseAmount / totalIncome) * 100
              color="#5bb3ff4f"
              title="Total Balance"
              amount={user.balance}
            />
            <div
              style={{
                display: "flex",
                justifyContent: "space-around",
                width: "100%",
              }}
            >
              <Box
                // w="200px"
                h={user.income !== 0 ? "190px" : "20px"} //(expenseAmount / totalIncome) * 100
                color="#63ff636e"
                title="Total Profit"
                amount={user.income}
              />
              {
                // give me formula for percentage of expense and Profit
              }
              <Box
                // w="200px"
                h={
                  expensePercent !== 0 ? String(expensePercent + "px") : "20px"
                } //(expenseAmount / totalIncome) * 100
                color="rgb(212 46 46 / 52%)"
                title="Total Expenses"
                amount={user.expense}
              />
            </div>
          </div>
          <div className="dashboard--1-2">
            <h3 className="dash--title">Charts</h3>
            {/* {console.log(user, user.incomeList, user.expenseList)} */}

            {user && user.incomeList && user.expenseList ? (
              <MemoizedLine
                incomeLists={user.incomeList || []}
                expenseLists={user.expenseList || []}
              />
            ) : (
              <MemoizedNoChart bg="#f6f6f6" title={"No data available!"} />
            )}
          </div>
        </section>
        <section className="dashboard--2">
          <div className="dashboard--2-1">
            <h3 className="dash--title">Recent Expenses</h3>
            {loading ? (
              new Array(5)
                .fill(0)
                .map((_, i) => (
                  <Skeleton.Button
                    style={{ margin: ".5rem 0", marginRight: ".5rem" }}
                    active={loading}
                    size="small"
                    block={true}
                    key={i}
                  />
                ))
            ) : entries && entries.length > 0 ? (
              entries
                .slice(0, 5)
                .map((entry) => <EntrySmall key={entry._id} entry={entry} />)
            ) : (
              <NoList
                title={"Sorry! No Transaction to load."}
                btnText={"Add Transaction"}
                btnFunc={() => navigate("/transactions")}
              />
            )}
          </div>
          <div className="dashboard--2-2">
            <h3 className="dash--title">Subscription</h3>
            {loadingSub ? (
              new Array(5)
                .fill(0)
                .map((_, i) => (
                  <Skeleton.Button
                    style={{ margin: ".5rem 0", marginRight: ".5rem" }}
                    active={loadingSub}
                    size="small"
                    block={true}
                    key={i}
                  />
                ))
            ) : subscriptions && subscriptions.length > 0 ? (
              subscriptions
                .slice(0, 5)
                .map((sub) => <SubscriptionSmall key={sub._id} sub={sub} />)
            ) : (
              <NoList
                title={"Sorry! No Subscriptions to load."}
                btnText={"Add Subscriptions"}
                btnFunc={() => navigate("/transactions")}
              />
            )}
          </div>
          <div className="dashboard--2-3">
            <h3 className="dash--title" style={{ alignSelf: "self-start" }}>
              Pie
            </h3>
            {user && pieData && pieData.length !== 0 ? (
              <MemoizedDonut data={pieData} expense={user.expense} />
            ) : (
              <MemoizedNoChart title={"No data available!"} />
            )}
          </div>
        </section>
      </section>
    );
  } else {
    return <NoUser />;
  }
}
