import React from "react";
import { useNavigate } from "react-router-dom";

import { Space, Card, Button } from "antd";

export default function NoUser() {
  const navigate = useNavigate();
  return (
    <Space
      style={{
        height: "100%",
        width: "100%",
        justifyContent: "center",
        display: "flex",
        flexDirection: "coloumn",
      }}
    >
      <h2>Sorry! You have to login</h2>
      <Button type="primary" onClick={() => navigate("/login")}>
        Login
      </Button>
    </Space>
  );
}
