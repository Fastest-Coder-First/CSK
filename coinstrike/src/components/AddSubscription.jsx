import React, { useRef, useState, useEffect } from "react";

import { useDispatch } from "react-redux";
import {
  addSubscription,
  updateSubscription,
  deleteSubscription,
} from "../Redux/Actions/entryActions";

import dayjs from "dayjs";
import "dayjs/locale/en";
import {
  Modal,
  DatePicker,
  Input,
  InputNumber,
  Space,
  Switch,
  Select,
} from "antd";
import Draggable from "react-draggable";

function AddSubscriptionModal({ handleCancel, ...props }) {
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
  //create state of [Name, Description, Amount, Category] with useState of ""
  const [Name, setName] = useState("");
  const [Description, setDescription] = useState("");
  const [Amount, setAmount] = useState("");
  //cycle with useState of "select cycle" and Auto with useState of false
  const [Cycle, setCycle] = useState("select cycle");
  const [Auto, setAuto] = useState(false);
  const [Date, setDate] = useState(dayjs());

  const [Error, setError] = useState(false);
  const handleClose = () => {
    setError(false);
  };

  const dispatch = useDispatch();
  const handleOk = async (e) => {
    // check name, amount, category, Date  and type  if not empty
    console.log(Name, Description, Amount, Cycle, Date);
    if (Name === "" || Amount === "" || Cycle === "" || Date === "") {
      setError(true);
      return;
    }
    setError(false);

    // check if the user is adding or editing a transaction
    if (props.edit === undefined) {
      // dispatch action to add transaction
      await dispatch(
        addSubscription({
          name: Name,
          description: Description,
          amount: Amount,
          cycle: Cycle,
          auto: Auto,
          type: "subscription",
          date: dayjs(Date).format("YYYY:MM:DD:HH:mm:ss"),
        })
      );
    } else {
      // dispatch action to edit transaction
      await dispatch(
        updateSubscription({
          id: props.edit._id,
          name: Name,
          description: Description,
          amount: Amount,
          cycle: Cycle,
          auto: Auto,
          type: "subscription",
          date: dayjs(Date).format("YYYY:MM:DD:HH:mm:ss"),
        }) // pass the id of the transaction to be updated
      );
    }
    // reset all the fields
    setName("");
    setDescription("");
    setAmount("");
    setCycle("");

    // close the modal
    handleCancel(1);
  };

  useEffect(() => {
    // if the user is editing a transaction then set the fields
    if (props.edit !== undefined) {
      setAuto(props.edit.auto || false);
      setName(props.edit.name);
      setDescription(props.edit.description);
      setAmount(props.edit.amount);
      setCycle(props.edit.cycle);
      setDate(props.edit.date);
    }
  }, [props.edit]);

  const cycleLists = ["Select Cycle", "Monthly", "Quarterly", "Annual"];

  return (
    // Modal same as AddTransaction with different input
    <>
      <Modal
        width={400}
        title={
          <div
            style={{
              width: "100%",
              cursor: "move",
            }}
            onMouseOver={() => {
              if (disabled) {
                setDisabled(false);
              }
            }}
            onMouseOut={() => {
              setDisabled(true);
            }}
            // https://github.com/jsx-eslint/eslint-plugin-jsx-a11y/blob/master/docs/rules/mouse-events-have-key-events.md
            onFocus={() => {}}
            onBlur={() => {}}
            // end
          >
            Add Subscription
          </div>
        }
        open={props.open}
        onOk={handleOk}
        okButtonProps={{
          style: { background: "red" },
        }}
        okText={props.edit === undefined ? "Add" : "Update"}
        onCancel={handleCancel}
        cancelText={props.edit === undefined ? "Cancel" : "Delete"}
        onCancel={handleCancel}
        cancelButtonProps={{
          danger: props.edit !== undefined,
          onClick: () => {
            if (props.edit !== undefined) {
              // dispatch action to delete transaction
              dispatch(
                deleteSubscription({
                  id: props.edit._id,
                  amount: props.edit.amount,
                }) // pass the id of the transaction to be deleted
              );
            } else {
              handleCancel();
            }
          },
        }}
        modalRender={(modal) => (
          <Draggable
            disabled={disabled}
            bounds={bounds}
            onStart={(event, uiData) => onStart(event, uiData)}
          >
            <div ref={draggleRef}>{modal}</div>
          </Draggable>
        )}
      >
        <form className="addForm">
          <label htmlFor="name">Company</label>
          <Input
            id="name"
            placeholder="Name"
            style={{ textTransform: "capitalize" }}
            value={Name}
            onChange={(e) => setName(e.target.value)}
          />
          <Space className="space-form">
            <div>
              <label htmlFor="amount">Amount</label>
              <br />
              <InputNumber
                id="amount"
                addonBefore="-"
                placeholder="Total Amount"
                style={{ textTransform: "capitalize" }}
                value={Amount}
                onChange={(e) => (e > -1 ? setAmount(e) : null)}
              />
            </div>
            <div>
              <label htmlFor="category">Cycle</label>
              <br />
              <Select
                id="category"
                value={Cycle}
                onChange={(e) => setCycle(e)}
                defaultValue="select cycle"
                style={{
                  width: "100%",
                }}
                options={cycleLists.map((cycle, i) => {
                  return {
                    value: cycle.toLowerCase(),
                    label: cycle,
                    disabled: i === 0,
                  };
                })}
              />
            </div>
          </Space>
          <label htmlFor="name">Plan Description</label>
          <Input.TextArea
            id="name"
            style={{ height: "max-content", resize: "none" }}
            placeholder="About this Plan..."
            maxLength={50}
            showCount
            allowClear
            value={Description}
            onChange={(e) => setDescription(e.target.value)}
          />
          <Space className="space-form">
            <div>
              <label htmlFor="date">Start Date</label>
              <br />
              <DatePicker
                id="date"
                defaultValue={dayjs(Date)}
                format={"YYYY-MM-DD"}
                onChange={(e) => {
                  if (e !== null && e !== undefined) setDate(e.$d);
                }}
              />
            </div>
            <div>
              <label htmlFor="auto">Auto Debit</label>
              <br />
              <Switch
                id="auto"
                style={{ marginLeft: "5px" }}
                onChange={(e) => setAuto(e)}
              />
            </div>
          </Space>
        </form>
      </Modal>
    </>
  );
}

export default React.memo(AddSubscriptionModal);
