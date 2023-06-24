import React from "react";

import dayjs from "dayjs";
import { Avatar } from "antd";
import { MinusCircleOutlined } from "@ant-design/icons";

export default function SubscriptionSmall({ sub }) {
  return (
    //same as subscription.jsx, but with a width of 85% instead of 100%
    <div className="trans--entry">
      <div className="trans--entry-title fl-2">
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
      </div>

      <div className="trans--entry-amount fl-1">
        <h5
          className="trans--entry-2"
          style={{ fontSize: ".7rem", marginTop: "0" }}
        >
          {"$" + sub.amount}
        </h5>
      </div>
    </div>
  );
}
