const mongoose = require("mongoose");

// Creating the schema for the transaction model fields of user id, name, description, amount, category, type, cycle, status, auto, and date
const transactionSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.ObjectId,
      required: true,
      ref: "User",
    },
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },
    amount: {
      type: Number,
      required: true,
    },
    category: {
      type: String,
    },
    type: {
      type: String,
      required: true,
      enum: ["income", "expense", "subscription"],
    },
    cycle: {
      type: String,
      enum: ["monthly", "quarterly", "annual"],
    },
    status: {
      type: Boolean,
    },
    auto: {
      type: Boolean,
    },
    date: {
      type: Date,
      required: true,
      set: function (value) {
        // Extracting the date portion
        const [year, month, day, hour, minute, second] = value.split(":");
        const newDate = new Date(year, month, day, hour, minute, second);

        return newDate;
      },
    },
  },
  {
    timestamps: true,
  }
);

const Transaction = mongoose.model("Entry", transactionSchema);

module.exports = Transaction;
