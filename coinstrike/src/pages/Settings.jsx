import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import NoUser from "./NoUser";

import { updateUserProfile } from "./../Redux/Actions/userActions";

import dayjs from "dayjs";
import {
  Input,
  InputNumber,
  Space,
  Select,
  message,
  Divider,
} from "antd";
import { UserOutlined, LoadingOutlined, PlusOutlined } from "@ant-design/icons";

export default function Settings() {
  const dispatch = useDispatch();

  //create state of [FName, LName, Amount, Curreny, Type, Date]
  const [FName, setFName] = useState("");
  const [LName, setLName] = useState("");
  const [Amount, setAmount] = useState("");
  const [Curreny, setCurreny] = useState("₹");
  const [Type, setType] = useState("income");
  const [Date, setDate] = useState(dayjs());

  //User Info
  //get userToken, error, loading from useSelector from userLogin
  const { user, pieData } = useSelector((state) => state.userInfo);
  useEffect(() => {
    //if user is not logged in then navigate to login page
    if (user && Object.keys(user).length > 0) {
      setFName(user.name);
      setLName(user.lastName);
      setAmount(user.salary);
      //set currency to user currency
      setCurreny(user.currency);
    }
  }, [user]);

  //if user is not logged in then navigate to login page
  if (user && Object.keys(user).length > 0) {
    return (
      <div className="d-flex">
        <form className="addForm" style={{ width: "60%", height: "60%" }}>
          <h2 className="fw-500">User Details</h2>
          <br />
          <Space className="space-form">
            <div>
              <label className="fw-500" htmlFor="name">
                First Name*
              </label>
              <Input
                id="name"
                placeholder="First Name"
                style={{ textTransform: "capitalize" }}
                value={FName}
                onChange={(e) => setFName(e.target.value)}
              />
            </div>
            <div>
              <label className="fw-500" htmlFor="name">
                Last Name
              </label>
              <Input
                id="name"
                placeholder="Last Name"
                style={{ textTransform: "capitalize" }}
                value={LName}
                onChange={(e) => setLName(e.target.value)}
              />
            </div>
          </Space>
          <br />
          <br />
          <Space className="space-form">
            <div>
              <label className="fw-500" htmlFor="amount">
                Salary{" "}
                <span
                  style={{
                    fontSize: ".6rem",
                    fontWeight: "400",
                    color: "grey",
                  }}
                >
                  (Monthly)
                </span>{" "}
              </label>
              <br />
              <InputNumber
                id="amount"
                addonBefore={Type !== "income" ? "-" : "+"}
                placeholder="Total Amount"
                style={{ textTransform: "capitalize" }}
                value={Amount}
                onChange={(e) => (e > -1 ? setAmount(e) : null)}
              />
            </div>
            <div>
              <label className="fw-500" htmlFor="category">
                Currency*
              </label>
              <br />
              <Select
                id="category"
                value={Curreny}
                onChange={(e) => setCurreny(e)}
                defaultValue="₹"
                style={{
                  width: "100%",
                }}
                options={[
                  { label: "INR", value: "₹" },
                  { label: "USD", value: "$" },
                  { label: "EUR", value: "€" },
                  { label: "GBP", value: "£" },
                  { label: "JPY", value: "¥" },
                  { label: "AUD", value: "A$" },
                  { label: "CAD", value: "C$" },
                ]}
              />
            </div>
          </Space>
          <br />
          <br />
          <div
            className="btn btn-add"
            style={{
              color: "#fff",
              backgroundColor: "#0b1b34",
              alignSelf: "end",
              marginLeft: "auto",
              fontSize: ".8rem",
              padding: ".5rem",
            }}
            onClick={() => {
              if (FName === "" || Date === dayjs() || Curreny === "") {
                console.log("Error");
                message.error("Please fill all the fields");
                return;
              }
              if (
                FName === user.name ||
                Curreny === user.currency ||
                Amount === user.salary ||
                LName === user.lastName
              ) {
                console.log("Error");
                message.error("Change field to update");
                return;
              }
              dispatch(
                updateUserProfile({
                  name: FName,
                  lastname: LName,
                  salary: Amount,
                  currency: Curreny,
                  date: Date,
                })
              );
            }}
          >
            Update
          </div>
        </form>

        <Divider />
      </div>
    );
  } else {
    return <NoUser />;
  }
}
