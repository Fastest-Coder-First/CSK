import React, { useEffect, useState } from "react";
import Chart from "react-apexcharts";

import dayjs from "dayjs";

import { Result, Button } from "antd";
import { LineChartOutlined } from "@ant-design/icons";

//Create all months array for xaxis labels as first 3 letters
const categories = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];
function Bar({ data }) {
  const [series, setSeries] = useState([]);
  const [state, setState] = useState({
    animations: {
      enabled: false,
    },
    toolbar: {
      show: false,
    },
    zoom: {
      enabled: false,
    },
    dataLabels: {
      enabled: false,
    },
    stroke: {
      width: 0,
    },
    title: {
      text: "Expenses spent",
      align: "top",
      style: {
        fontSize: "12px",
        fontFamily: "serif",
      },
    },
    fill: {
      colors: ["rgb(11, 27, 52)"],
      type: "gradient",
      gradient: {
        shade: "dark",
        type: "vertical",
        shadeIntensity: 0.1,
        inverseColors: false,
        opacityFrom: 0.8,
        opacityTo: 1,
      },
    },
    legend: {
      show: true,
    },
    xaxis: {},
  });

  useEffect(() => {
    //Check if data is available
    if (!data) return console.log("no data");

    // Slice the data to get the last 6 months
    const j = dayjs().month();
    var i = 0;
    if (j < 6) {
      i = 0;
    } else {
      i = j - 6;
    }

    // Set the series and xaxis
    setSeries([
      {
        name: "Expenses",
        data: data.slice(i, j + 1),
      },
    ]);
    setState({ ...state, xaxis: { categories: categories.slice(i, j + 1) } });
  }, [data]);
  return (
    <div className="app">
      <div className="row">
        <div className="mixed-chart">
          {console.log("first", series)}
          <Chart
            options={state}
            series={series}
            type="bar"
            height="150%"
            width="100%"
          />
        </div>
      </div>
    </div>
  );
}

function Donut({ data, expense }) {
  const [options, setOptions] = useState({
    plotOptions: {
      radialBar: {
        offsetY: 0,
        startAngle: 0,
        endAngle: 180,
        hollow: {
          margin: 5,
          size: "30%",
          background: "transparent",
        },
        dataLabels: {
          name: {
            show: true,
          },
          value: {
            show: true,
          },
        },
      },
    },
    stroke: {
      lineCap: "round",
    },
    legend: {
      show: true,
      floating: true,
      fontSize: "12px",
      position: "left",
      offsetY: 50,
      labels: {
        useSeriesColors: true,
      },
      markers: {
        size: 0,
      },
    },
    responsive: [
      {
        breakpoint: 1250,
        options: {
          chart: {
            width: 250,
            height: 300,
          },
          lagend: {
            floating: true,
            fontSize: "12px",
            position: "left",
            offsetY: 50,
          },
        },
      },
      {
        breakpoint: 1100,
        options: {
          chart: {
            width: 200,
            height: 280,
          },
          lagend: {
            floating: false,
            fontSize: "12px",
            position: "left",
            offsetY: 50,
          },
        },
      },
      {
        breakpoint: 950,
        options: {
          chart: {
            width: "100%",
            height: 250,
          },
        },
      },
      {
        breakpoint: 650,
        options: {
          chart: {
            height: 300,
            width: "100%",
          },
          legend: {
            floating: true,
            fontSize: "12px",
            position: "left",
            offsetY: 50,
            offsetX: 100,
          },
        },
      },
      {
        breakpoint: 450,
        options: {
          legend: {
            floating: true,
            fontSize: "12px",
            position: "left",
            offsetY: 50,
            offsetX: 20,
          },
        },
      },
    ],
  });
  const [series, setSeries] = useState([0, 0, 0, 0, 0, 0, 0]);
  useEffect(() => {
    var labels = [];
    var series = [];
    if (!data) return console.log("no data");
    data.map((item, i) => {
      labels = [...labels, item._id];
      series = [...series, Math.floor((item.total / expense) * 100)];
    });
    setSeries(series);
    setOptions((prevState) => {
      return {
        ...prevState,
        labels: labels,
      };
    });
    // setState((prevState) => { ...prevState, series: series });
  }, [data]);

  return (
    <div className="donut">
      <Chart
        options={options}
        series={series}
        type="radialBar"
        height="180%"
        width="100%"
      />
    </div>
  );
}

function Line({ incomeLists, expenseLists }) {
  const [series, setSeries] = useState([]);
  const options = {
    dataLabels: {
      enabled: false,
    },
    stroke: {
      curve: "smooth",
    },
    grid: {
      row: {
        colors: ["#f3f3f3", "#f3f3f3"], // takes an array which will be repeated on columns
        opacity: 0.5,
      },
    },
    xaxis: {
      categories: [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec",
      ],
    },
    responsive: [
      {
        breakpoint: 650,
        options: {
          chart: {
            width: "90%",
          },
        },
      },
    ],
  };

  useEffect(() => {
    if (!incomeLists || !expenseLists) return;
    const series = [
      {
        name: "Income",
        data: incomeLists,
      },
      {
        name: "Expense",
        data: expenseLists,
      },
      {
        name: "Balance",
        data: incomeLists.map((item, i) => {
          return item - expenseLists[i];
        }),
      },
    ];
    setSeries(series);
    console.log(series);
  }, [incomeLists, expenseLists]);
  return (
    <div id="chart">
      <Chart
        options={options}
        series={series}
        type="line"
        height="150%"
        width="100%"
      />
    </div>
  );
}

function NoChart({ title, bg }) {
  return (
    <div
      className="no-list"
      style={{
        backgroundColor: bg || null,
        borderRadius: "10px",
        margin: ".4rem",
      }}
    >
      <LineChartOutlined
        style={{
          fontSize: "2rem",
        }}
      />
      <h3 style={{ fontWeight: "500" }}>{title}</h3>
    </div>
  );
}

//export all functions as memoized components with React.memo
export const MemoizedDonut = React.memo(Donut);
export const MemoizedLine = React.memo(Line);
export const MemoizedBar = React.memo(Bar);

export const MemoizedNoChart = React.memo(NoChart);
