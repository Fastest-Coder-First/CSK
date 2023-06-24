import React, { useRef, useState, useEffect } from "react";

import { useDispatch } from "react-redux";
import { getSortedEntries } from "../Redux/Actions/entryActions";

import dayjs from "dayjs";
import "dayjs/locale/en";
import { Button, Modal, Space, Select, Alert } from "antd";
import Draggable from "react-draggable";

function Sorting({ handleCancel, ...props }) {
  //Draggable Fuction porperties
  const [disabled, setDisabled] = useState(false);
  const [bounds, setBounds] = useState({
    left: 0,
    top: 0,
    bottom: 0,
    right: 0,
  });
  const draggleRef = useRef(null);
  const onStart = (_event, uiData) => {
    const { clientWidth, clientHeight } = window.document.documentElement;
    const targetRect = draggleRef.current?.getBoundingClientRect();
    if (!targetRect) {
      return;
    }
    setBounds({
      left: -targetRect.left + uiData.x,
      right: clientWidth - (targetRect.right - uiData.x),
      top: -targetRect.top + uiData.y,
      bottom: clientHeight - (targetRect.bottom - uiData.y),
    });
  };

  //Fuctional Properties
  const [SortBy, setSortBy] = useState("select type");
  const [SortOrder, setSortOrder] = useState("low");
  const [Error, setError] = useState(false);

  const dispatch = useDispatch();
  const handleOk = async (e) => {
    // check name, amount, category, Date  and type  if not empty
    console.log(SortBy);
    if (SortBy === "select type" || SortOrder === "") {
      setError(true);
      return;
    }
    setError(false);

    // dispatch action to add transaction
    await dispatch(
      getSortedEntries({
        sortBy: SortBy,
        sortOrder: SortOrder,
        page: 1,
      })
    );

    // close the modal
    handleCancel(1);
  };
  const handleClose = () => {
    setError(false);
  };

  const categoryLists = ["Select Type", "Date", "Type", "Amount"];
  return (
    <>
      <Modal
        open={props.open}
        title="Sort Options"
        onOk={handleOk}
        onCancel={handleCancel}
        footer={[
          <Button key="back" onClick={handleCancel}>
            Cancel
          </Button>,
          <Button
            type="primary"
            onClick={handleOk}
            style={{
              color: "#fff",
              backgroundColor: "#0b1b34",
            }}
          >
            Sort
          </Button>,
        ]}
      >
        {Error && (
          <Alert
            message="Please Fill All Required Fields"
            type="error"
            closable
            style={{ marginBottom: "10px", padding: "5px" }}
            afterClose={handleClose}
          />
        )}
        <Space className="space-form">
          <div>
            <label htmlFor="by">SortBy</label>
            <br />
            <Select
              id="by"
              value={SortBy}
              onChange={(e) => setSortBy(e)}
              defaultValue="select type"
              style={{
                width: "100%",
              }}
              options={categoryLists.map((category, i) => {
                return {
                  value: category.toLowerCase(),
                  label: category,
                  disabled: i === 0,
                };
              })}
            />
          </div>
          <div>
            <label htmlFor="category">Order</label>
            <br />
            <Select
              id="category"
              value={SortOrder}
              onChange={(e) => setSortOrder(e)}
              defaultValue="low"
              style={{
                width: "100%",
              }}
              options={[
                { value: "low", label: "Low to High" },
                { value: "high", label: "High to Low" },
              ]}
            />
          </div>
        </Space>
      </Modal>
    </>
  );
}

export default React.memo(Sorting);
