import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import "./App.css";

import { getUserInfo } from "./Redux/Actions/userActions";

import NoUser from "./pages/NoUser";

import Transaction from "./pages/Transaction";
import Dashboard from "./pages/Dashboard";
import Settings from "./pages/Settings";
import Profile from "./pages/Profile";
import Navbar from "./components/Navbar";

import Signup from "./pages/Signup";
import Login from "./pages/Login";
import Verification from "./pages/Verification";
import UserUpdate from "./pages/UserUpdate";

import NoPage from "./pages/NoPage";

import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  UploadOutlined,
  UserOutlined,
  VideoCameraOutlined,
} from "@ant-design/icons";
import { Layout } from "antd";
const { Content } = Layout;

function App() {
  const dispatch = useDispatch();

  //get userToken from useSelector
  //and if userToken is not present then show NoUser page
  //User Info
  const { userToken } = useSelector((state) => state.userLogin);
  useEffect(() => {
    if (userToken) {
      dispatch(getUserInfo(userToken));
    }
  }, [userToken]);

  return (
    // Create antd layout with sider and content
    <Layout id="body">
      <BrowserRouter>
        {/* //Sider is exported to Navbar.jsx */}
        <Navbar />

        <Content
          className="content"
          style={{
            height: "93vh",
          }}
        >
          {/* Create Routes and add all [Dashboard, Transaction, Settings, Profile, Signup, Login] components to it with path */}
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/transactions" element={<Transaction />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/profile" element={<Profile />} />

            <Route path="/signup" element={<Signup />} />
            <Route path="/login" element={<Login />} />
            <Route path="/verify" element={<Verification />} />
            <Route path="/user" element={<UserUpdate />} />

            {/* Create a 404 page for all other routes */}
            <Route path="*" element={<NoPage />} />
          </Routes>
        </Content>
        {/* // BrowserRouter ends here */}
      </BrowserRouter>
    </Layout>
  );
}

export default App;
