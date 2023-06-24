import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import { updateUserProfile } from "./../Redux/Actions/userActions";

import dayjs from "dayjs";
import {
  Button,
  DatePicker,
  Input,
  InputNumber,
  Space,
  Select,
  Upload,
  message,
} from "antd";
import { UserOutlined, LoadingOutlined, PlusOutlined } from "@ant-design/icons";
import * as filestack from "filestack-js";

const beforeUpload = async (file, client, setImageUrl) => {
  const isJpgOrPng = file.type === "image/jpeg" || file.type === "image/png";
  if (!isJpgOrPng) {
    message.error("You can only upload JPG/PNG file!");
  }
  const isLt2M = file.size / 1024 / 1024 < 2;
  if (!isLt2M) {
    message.error("Image must smaller than 2MB!");
  }

  const data = await client.upload(file);
  setImageUrl(data.url);
  return isJpgOrPng && isLt2M;
};

export default function UserUpdate() {
  const client = filestack.init("AFmaRKROkSWypbC3kty3Az");
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [FName, setFName] = useState("");
  const [LName, setLName] = useState("");
  const [Amount, setAmount] = useState("");
  const [Curreny, setCurreny] = useState("₹");
  const [Type, setType] = useState("income");
  const [Date, setDate] = useState(dayjs());

  //Selector
  const userEmail = useSelector((state) => state.userRegister.userEmail);
  const { loadingU, error, userUpdate } = useSelector(
    (state) => state.userUpdateProfile
  );
  useEffect(() => {
    console.log(userUpdate, loadingU);
    if (loadingU) return;
    setLoading(false);
    if (userUpdate && Object.keys(userUpdate).length > 0) {
      message.success("Successfully Completed!");
      setTimeout(() => navigate("/"), 1000);
    }
    if (error) message.error(error);
  }, [error, userUpdate]);

  const [loading, setLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState();

  const handleChange = (info) => {
    console.log("info", info, imageUrl);
    if (info.file.status === "uploading") {
      setLoading(true);
      return;
    }
    if (imageUrl) {
      // Get this url from response in real world.
      setLoading(false);
      message.success("Uploaded!");
    }
  };
  const uploadButton = (
    <div>
      {loading ? <LoadingOutlined /> : <PlusOutlined />}
      <div
        style={{
          marginTop: 8,
        }}
      >
        Upload
      </div>
    </div>
  );
  return (
    <section
      className="d-full"
      style={{
        padding: "1rem",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <h1 style={{ marginBottom: ".5rem" }}>User Detail </h1>
      <form className="addForm user-form">
        <Upload
          name="avatar"
          listType="picture-card"
          className="avatar-uploader"
          showUploadList={false}
          beforeUpload={(e) => beforeUpload(e, client, setImageUrl)}
          onChange={handleChange}
        >
          {imageUrl ? (
            <img src={imageUrl} alt="avatar" style={{ width: "100%" }} />
          ) : (
            uploadButton
          )}
        </Upload>
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

        <Space className="space-form">
          <div>
            <label className="fw-500" htmlFor="amount">
              Salary{" "}
              <span
                style={{ fontSize: ".6rem", fontWeight: "400", color: "grey" }}
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
        <label className="fw-500" htmlFor="date">
          Birthday*
        </label>
        <DatePicker
          id="date"
          style={{ alignSelf: "start" }}
          defaultValue={dayjs(Date)}
          format={"YYYY-MM-DD"}
          onChange={(e) => {
            if (e !== null && e !== undefined) setDate(e.$d);
          }}
        />
        <div
          className="btn btn-add"
          style={{
            color: "#fff",
            backgroundColor: "#0b1b34",
            alignSelf: "end",
            fontSize: ".8rem",
            padding: ".5rem",
          }}
          onClick={() => {
            if (FName === "" || Date === dayjs() || Curreny === "") {
              console.log("Error");
              message.error("Please fill all the fields");
              return;
            }
            dispatch(
              updateUserProfile({
                name: FName,
                lastname: LName,
                image: imageUrl ? imageUrl : null,
                salary: Amount,
                currency: Curreny,
                date: Date,
              })
            );
          }}
        >
          Complete
        </div>
      </form>
    </section>
  );
}
