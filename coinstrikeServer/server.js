const express = require("express");
const cors = require("cors");

require("dotenv").config();

const app = express();
app.use(
  cors({
    origin: "*",
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const connectDB = require("./dbConfig");
connectDB();

app.get("/", (req, res) => {
  return res.json("works");
});

const userRoutes = require("./routes/userRoutes");
const transactionRoutes = require("./routes/transactionRoutes");
app.use("/api/user", userRoutes);
app.use("/api/entry", transactionRoutes);

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`server runs on ${PORT}`);
});
