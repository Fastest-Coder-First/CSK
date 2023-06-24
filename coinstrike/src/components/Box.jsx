import React from "react";

export default function Box(props) {
  return (
    <div className="box" style={{ width: props.w }}>
      <div
        className="boxBg"
        style={{ height: props.h, backgroundColor: props.color }}
      ></div>
      <h6 className="box--title">{props.title}</h6>
      <h2 className="box--amount">{"$ " + props.amount}</h2>
      <p className="box--stats">stats</p>
    </div>
  );
}
