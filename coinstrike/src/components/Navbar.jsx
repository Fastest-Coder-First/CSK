import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Link, NavLink } from "react-router-dom";

import { logout } from "./../Redux/Actions/userActions";
import { useDispatch, useSelector } from "react-redux";

import {
  PieChartOutlined,
  CompassOutlined,
  LogoutOutlined,
  UserOutlined,
  SettingOutlined,
} from "@ant-design/icons";

import { Layout, Avatar, Popconfirm } from "antd";
const { Sider } = Layout;

export default function Navbar() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // create state for [Name, ImageUrl, collapsed] and set default value of false
  const [Name, setName] = useState(false);
  const [ImageUrl, setImageUrl] = useState("");
  const [collapsed, setCollapsed] = useState(false);

  // get user info from useSelector
  const user = useSelector((state) => state.userInfo.user);
  useEffect(() => {
    // if user is present then set Name and ImageUrl
    if (user && Object.keys(user).length > 0) {
      const { name, email, currency } = user;
      setName(name ? name : email);
      setImageUrl(user.image || "");
    }
  }, [user]);

  return (
    <>
      {/* //Create Sider */}
      <Sider
        className="navbar"
        breakpoint="lg"
        collapsedWidth="0"
        // need to collapse navbar and set state of collapsed
        collapsed={collapsed}
        onCollapse={(collapsed) => {
          setCollapsed(collapsed);
        }}
        style={{
          height: "93vh",
          backgroundColor: "#fff",
          border: "1px solid rgba(208, 208, 208, 0.35)",
          //set padding and margin of sider if collapsed is true or false respectively
          padding: collapsed ? "0px" : "0 .8rem",
          margin: collapsed ? "0px" : "0 0 0 1rem",
        }}
      >
        {/* // user avatar and name in down of avatar */}
        <div className="avatar" style={{ cursor: "default" }}>
          <Avatar
            className="avatar"
            shape="square"
            size={90}
            style={{ borderRadius: "20px" }}
            icon={
              ImageUrl !== "" && ImageUrl !== null && ImageUrl ? (
                <img src={ImageUrl} />
              ) : (
                <UserOutlined />
              )
            }
          />
          <h5
            style={{
              textTransform: "capitalize",
              fontWeight: "700",
              fontStyle: "italic",
            }}
          >
            {Name || "No Name"}
          </h5>
        </div>
        <div className="menu">
          {/* //Create NavLink for [Dashboard, Transaction, Settings]
          and add path to it */}
          <NavLink
            to="/"
            className="btn menu--items"
            onClick={() => {
              if (window.innerWidth <= 990) setCollapsed(!collapsed);
            }}
          >
            <PieChartOutlined
              className="menu--items-icon"
              onClick={() => {
                if (window.innerWidth <= 990) setCollapsed(!collapsed);
              }}
            />
            Dashboard
          </NavLink>
          <NavLink
            to="/transactions"
            className="btn menu--items"
            onClick={() => {
              if (window.innerWidth <= 990) setCollapsed(!collapsed);
            }}
          >
            <CompassOutlined className="menu--items-icon" />
            Transactions
          </NavLink>
          <NavLink
            to="/settings"
            className="btn menu--items"
            onClick={() => {
              if (window.innerWidth <= 990) setCollapsed(!collapsed);
            }}
          >
            <SettingOutlined className="menu--items-icon" />
            Settings
          </NavLink>
        </div>
        <Popconfirm
          title="Logout"
          description="Are you sure to logout?"
          icon={<LogoutOutlined style={{ color: "red" }} />}
          onConfirm={() => {
            dispatch(logout());
            setTimeout(() => navigate("/login"), 1500);
          }}
          okButtonProps={{
            style: { backgroundColor: "rgb(11 27 52)", color: "#fff" },
          }}
          onCancel={() => {}}
          okText="Yes"
          cancelText="No"
        >
          {/* logout button with icon  */}
          <button
            className="btn btn-round"
            style={{ backgroundColor: "#d42e2e" }}
          >
            <LogoutOutlined />
            Logout
          </button>
        </Popconfirm>
      </Sider>
    </>
  );
}
