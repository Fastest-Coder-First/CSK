import React, { useState } from "react";

import AddExpenseModal from "./AddExpense";

import dayjs from "dayjs";
import { Avatar, Tooltip } from "antd";
import {
  HolderOutlined,
  PlusCircleOutlined,
  MinusCircleOutlined,
} from "@ant-design/icons";

export default function Entry({ entry }) {
  const [open, setOpen] = useState(false);

  const showModal = () => {
    setOpen(true);
  };
  const handleCancel = () => {
    setOpen(false);
  };
  return (
    <>
      <div className="trans--entry" key={entry._id}>
        <div className="trans--entry-title cur-p" onClick={showModal}>
          <Avatar
            className="trans--entry-avatar"
            size="small"
            style={{ backgroundColor: "#f6f6f6" }}
            // icon={<PlusCircleOutlined style={{ color: "green" }} />}
            icon={
              entry.type === "income" ? (
                <PlusCircleOutlined style={{ color: "green" }} />
              ) : (
                <MinusCircleOutlined style={{ color: "rgb(212, 46, 46)" }} />
              )
            }
          />
          <h5 className="trans--entry-title">{entry.name}</h5>
        </div>
        <div className="trans--entry-date entry-text-box">
          <label className="trans--entry-1">Date</label>
          <h5 className="trans--entry-2">{dayjs(entry.date).format("MMM DD")}</h5>
        </div>
        <div id="d-n-1" className="trans--entry-time entry-text-box">
          <label className="trans--entry-1">Category</label>
          <Tooltip title={entry.category} placement="topRight" >
            <h5 className="trans--entry-2">{entry.category}</h5>
          </Tooltip>
        </div>
        <div className="trans--entry-amount entry-text-box">
          <label className="trans--entry-1">Amount</label>
          <Tooltip title={"$" + entry.amount} placement="topRight" >
            <h5 className="trans--entry-2">
              {(entry.type === "income" ? "+ " : "- ") + "$" + entry.amount}
            </h5>
          </Tooltip>
        </div>
        <a className="trans--entry-btn">
          <HolderOutlined className="trans--entry-icon" onClick={showModal} />
        </a>
      </div>
      <AddExpenseModal
        handleCancel={handleCancel}
        showModal={showModal}
        open={open}
        edit={{
          amount: entry.amount,
          category: entry.category,
          date: entry.date,
          description: entry.description,
          name: entry.name,
          type: entry.type,
          user: entry.user,
          _id: entry._id,
        }}
      />
    </>
  );
}
