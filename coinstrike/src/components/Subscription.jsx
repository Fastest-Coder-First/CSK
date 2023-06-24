import React, { useState } from "react";

import AddSubscriptionModal from "./AddSubscription";
import dayjs from "dayjs";
import { Avatar } from "antd";
import Icon from "@ant-design/icons";
import { HolderOutlined, MinusCircleOutlined } from "@ant-design/icons";

export default function Subscription({ sub }) {
  const [open, setOpen] = useState(false);

  const showModal = () => {
    setOpen(true);
  };
  const handleCancel = () => {
    setOpen(false);
  };

  return (
    <>
      <div key={sub._id} className="trans--entry">
        <div className="trans--entry-title cur-p fl-2" onClick={showModal}>
          <Avatar
            className="trans--entry-avatar"
            size="medium"
            style={{ backgroundColor: "#f6f6f6" }}
            icon={
              (
                <img
                  alt="logo"
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "contain",
                    objectPosition: "center",
                  }}
                  src={`https://logo.clearbit.com/${sub.name
                    .toLowerCase()
                    .replace(/\s/g, "")}.com`}
                />
              ) || <MinusCircleOutlined style={{ color: "red" }} />
            }
          />
          <div className="entry-small-title">
            <h5 className="trans--entry-title">{sub.name}</h5>
            <span>{dayjs(sub.date).format("MMM DD")}</span>
          </div>
          <Icon
            type="message"
            style={{ fontSize: "16px", color: "#08c" }}
            theme="outlined"
          />
        </div>
        <div id="d-n" className="trans--entry-time entry-text-box">
          <label className="trans--entry-1">Cycle</label>
          <h5 className="trans--entry-2">{sub.cycle}</h5>
        </div>
        <div className="trans--entry-amount fl-1">
          <label className="trans--entry-1">Amount</label>
          <h5 className="trans--entry-2">{"- " + "$" + sub.amount}</h5>
        </div>
        <a
          className="trans--entry-btn cur-p"
          onClick={showModal}
          style={{ marginLeft: "1.5rem" }}
        >
          <HolderOutlined className="trans--entry-icon" />
        </a>
      </div>
      <AddSubscriptionModal
        handleCancel={handleCancel}
        showModal={showModal}
        open={open}
        edit={{ ...sub }}
      />
    </>
  );
}
