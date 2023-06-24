import React from "react";
import dayjs from "dayjs";
import { Avatar } from "antd";
import {
  HolderOutlined,
  PlusCircleOutlined,
  MinusCircleOutlined,
} from "@ant-design/icons";

export default function EntrySmall({ entry }) {
  return (
    //Same as Entry.jsx, but with a width of 85% instead of 100%
    <div className="trans--entry" style={{ width: "85%" }}>
      <div className="trans--entry-title fl-2">
        <Avatar
          size="medium"
          style={{ backgroundColor: "#f6f6f6", marginRight: ".6rem" }}
          icon={
            entry.type === "income" ? (
              <PlusCircleOutlined style={{ color: "green" }} />
            ) : (
              <MinusCircleOutlined style={{ color: "rgb(212, 46, 46)" }} />
            )
          }
        />
        <div className="entry-small-title">
          <h5 className="trans--entry-title">{entry.name}</h5>
          <span>{dayjs(entry.date).format("MMM DD YYYY")}</span>
        </div>
      </div>

      <div className="trans--entry-amount fl-1">
        <h5 className="trans--entry-2" style={{ marginTop: "1px" }}>
          {(entry.type === "income" ? "+ " : "- ") + "$" + entry.amount}
        </h5>
      </div>
    </div>
  );
}
