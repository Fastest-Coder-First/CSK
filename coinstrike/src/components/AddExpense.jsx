import React, { useRef, useState, useEffect } from "react";

import { useDispatch, useSelector } from "react-redux";
import {
  addEntry,
  updateEntry,
  deleteEntry,
} from "../Redux/Actions/entryActions";

import dayjs from "dayjs";
import "dayjs/locale/en";
import {
  Button,
  Modal,
  DatePicker,
  Input,
  InputNumber,
  Space,
  Select,
  Segmented,
  Alert,
  message,
} from "antd";
import Draggable from "react-draggable";

function AddExpenseModal({ handleCancel, ...props }) {
  //Draggable Fuction porperties
  const [disabled, setDisabled] = useState(false);
  //get user income and expense from useSelector state to check if user has enough money to add expense
  const { income, expense } = useSelector((state) => state.userInfo.user);

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
  const [Category, setCategory] = useState("");
  const [Type, setType] = useState("income");
  const [Date, setDate] = useState(dayjs());
  const [Error, setError] = useState(false);

  const dispatch = useDispatch();
  const handleOk = async (e) => {
    // check name, amount, category, Date  and type  if not empty
    if (Name === "" || Amount === "" || Category === "" || Date === "") {
      setError(true);
      return;
    }

    setError(false);
    // check if user has enough balance to add expense
    const balance = income - expense;
    console.log("balance", balance, Amount);

    // if expense is greater than balance, show error message and return
    if (Type === "expense" && Amount > balance) {
      message.error("You don't have enough balance");
      return;
    }

    // if expense is greater than balance, show error message and return
    if (props.edit === undefined) {
      // dispatch action to add transaction
      await dispatch(
        addEntry({
          name: Name,
          description: Description,
          amount: Amount,
          category: Category,
          type: Type,
          date: dayjs(Date).format("YYYY:MM:DD:HH:mm:ss"),
        })
      );
    } else {
      // dispatch action to edit transaction
      await dispatch(
        updateEntry({
          id: props.edit._id,
          name: Name,
          description: Description,
          amount: Amount,
          category: Category,
          type: Type,
          date: dayjs(Date).format("YYYY:MM:DD:HH:mm:ss"),
        }) // pass the id of the transaction to be updated
      );
    }
    // reset all the fields
    setName("");
    setDescription("");
    setAmount("");
    setCategory("");
    setType("income");

    // close the modal
    handleCancel(1);
  };
  const handleClose = () => {
    setError(false);
  };

  useEffect(() => {
    // if edit is not undefined, set the values of the fields to the values of the transaction to be edited
    if (props.edit !== undefined) {
      setType(props.edit.type);
      setName(props.edit.name);
      setDescription(props.edit.description);
      setAmount(props.edit.amount);
      setCategory(props.edit.category);
      setDate(props.edit.date);
    }
  }, [props.edit]);

  const expenseLists = [
    "Select Category",
    "Rent",
    "Food",
    "Entertainment",
    "Groceries",
    "Travel",
    "Shopping",
    "Bills and Utilities",
    "Loans and Debt",
  ];
  const incomeLists = [
    "Select Category",
    "Salary",
    "Freelance Income",
    "Pension",
    "Royalties",
    "Gift Income",
    "Shopping",
    "Business Income",
  ];
  return (
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
            {props.edit === undefined ? "Add Transaction" : "Edit Transaction"}
          </div>
        }
        open={props.open}
        okText={props.edit === undefined ? "Add" : "Update"}
        onOk={handleOk}
        okButtonProps={{
          style: { background: Type !== "income" ? "red" : "green" },
        }}
        cancelText={props.edit === undefined ? "Cancel" : "Delete"}
        onCancel={handleCancel}
        cancelButtonProps={{
          danger: props.edit !== undefined,
          onClick: () => {
            if (props.edit !== undefined) {
              // dispatch action to delete transaction
              dispatch(
                deleteEntry({
                  id: props.edit._id,
                  amount: props.edit.amount,
                  type: props.edit.type,
                  date: props.edit.date,
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
        {Error && (
          <Alert
            message="Please Fill All Required Fields"
            type="error"
            closable
            style={{ marginBottom: "10px", padding: "5px" }}
            afterClose={handleClose}
          />
        )}
        <form className="addForm">
          <Segmented
            onChange={(e) => setType(e)}
            value={Type}
            block
            options={["income", "expense"]}
            style={{ textTransform: "capitalize" }}
          />
          <label htmlFor="name">Name</label>
          <Input
            id="name"
            placeholder={Type + " Name"}
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
                addonBefore={Type !== "income" ? "-" : "+"}
                placeholder="Total Amount"
                style={{ textTransform: "capitalize" }}
                value={Amount}
                onChange={(e) => (e > -1 ? setAmount(e) : null)}
              />
            </div>
            <div>
              <label htmlFor="category">Category</label>
              <br />
              <Select
                id="category"
                value={Category}
                onChange={(e) => setCategory(e)}
                defaultValue="select category"
                style={{
                  width: "100%",
                }}
                options={
                  Type === "income"
                    ? incomeLists.map((category, i) => {
                        return {
                          value: category.toLowerCase(),
                          label: category,
                          disabled: i === 0,
                        };
                      })
                    : expenseLists.map((category, i) => {
                        return {
                          value: category.toLowerCase(),
                          label: category,
                          disabled: i === 0,
                        };
                      })
                }
              />
            </div>
          </Space>
          <label htmlFor="name">Description</label>
          <Input.TextArea
            id="name"
            style={{ height: "max-content", resize: "none" }}
            placeholder="Description..."
            maxLength={50}
            showCount
            allowClear
            value={Description}
            onChange={(e) => setDescription(e.target.value)}
          />
          <label htmlFor="date">Date</label>
          <br />
          <DatePicker
            id="date"
            defaultValue={dayjs(Date)}
            format={"YYYY-MM-DD"}
            onChange={(e) => {
              if (e !== null && e !== undefined) setDate(e.$d);
            }}
          />
        </form>
      </Modal>
    </>
  );
}

export default React.memo(AddExpenseModal);
