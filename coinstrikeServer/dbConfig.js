const mongoose = require("mongoose");

const cluster = "clusterdb.ok95nts";
const dbname = "coin";

const url = `mongodb+srv://${process.env.db_USERNAME}:${process.env.db_PASSWORD}@${cluster}.mongodb.net/${dbname}?retryWrites=true&w=majority`;

async function connectDB() {
  try {
    await mongoose.connect(url, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("Connected to MongoDB");

    //verification
    const db = mongoose.connection;
    db.on("error", console.error.bind(console, "connection error: "));
    db.once("open", function () {
      console.log("Connected successfully");
    });
  } catch (error) {
    console.error(error);
  }
}

module.exports = connectDB;
