import React from "react";

import { UploadOutlined } from "@ant-design/icons";

export default function NoList({ title, text, btnText, btnFunc }) {
  return (
    <div className="no-list">
      <UploadOutlined
        style={{
          fontSize: "2rem",
        }}
      />
      <h3 style={{ fontWeight: "500" }}>{title}</h3>
      <p>{text || null}</p>
      <button
        style={{
          color: "rgb(255, 255, 255)",
          backgroundColor: "rgb(11, 27, 52)",
          border: "none",
        }}
        className="btn btn-add"
        onClick={btnFunc}
      >
        {btnText}
      </button>
    </div>
  );
}
