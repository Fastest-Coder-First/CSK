const express = require("express");
const asyncHandler = require("express-async-handler");
const moment = require("moment");
const dayjs = require("dayjs");

const { protect, admin } = require("../Middleware/AuthMiddleware.js");
const Transaction = require("./../Models/transactionModel.js");
const User = require("./../Models/userModel.js");

const tranRouter = express.Router();

//Update user's income by amount
const userIncomeUpdate = async (req, amount) => {
  try {
    await User.findOneAndUpdate(
      { _id: req.user._id },
      {
        $inc: { income: amount },
        //Chatgpt suggestion of updating incomeList by month
        $set: { [`incomeList.${dayjs().month()}`]: req.user.income + amount },
      },
      { new: true }
    );
    return true; // Return true if the update is successful
  } catch (err) {
    console.log(err);
    return false; // Return false
  }
};

//Update user's expense by amount
const userExpenseUpdate = async (req, amount) => {
  try {
    await User.findOneAndUpdate(
      { _id: req.user._id },
      {
        $inc: { expense: amount },
        $set: { [`expenseList.${dayjs().month()}`]: req.user.expense + amount },
      },
      { new: true }
    );
  } catch (err) {
    console.log(err);
  }
};

//==================ENTRY ROUTES==================

// POST Entry on transaction model
tranRouter.post(
  "/",
  protect,
  asyncHandler(async (req, res) => {
    try {
      // get all data of name, amount, date, category, type, description from req.body
      const { name, amount, date, category, type, description } = req.body;
      // create a new entry in transaction model
      const data = await Transaction.create({
        name,
        amount,
        date,
        category,
        type,
        user: req.user._id,
        description,
      });

      //update overall income and expense of user
      //if type is income then update income else update expense
      if (type === "income") {
        //params are req, amount, isIncome
        await userIncomeUpdate(req, amount, true);
      } else {
        await userExpenseUpdate(req, amount, true);
      }
      //send response
      res.status(200).json({
        msg: "inserted Success",
        data,
      });
    } catch (err) {
      res.status(404).json({ msg: err });
    }
  })
);

//Send all entries from transaction model by user id and type of income or expense
//and add pagination with limit of 10 entries per page
tranRouter.get(
  "/",
  protect,
  asyncHandler(async (req, res) => {
    try {
      //get page number and limit from query
      const { page = 1, limit } = req.query;
      //calculate total number of transactions
      const totalTransactions = await Transaction.countDocuments({
        $and: [
          { user: req.user._id },
          {
            $or: [{ type: "expense" }, { type: "income" }],
          },
        ],
      });
      var totalPages = 1;
      if (totalTransactions > 10) {
        // Calculate total number of pages
        totalPages = Math.ceil(totalTransactions / limit);
      }
      //find all entries by user id and type of income or expense
      const obj = await Transaction.find({
        $and: [
          { user: req.user._id },
          {
            $or: [{ type: "expense" }, { type: "income" }],
          },
        ],
      }) //sort by date in descending order
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit);

      //send response
      res.status(200).json({
        msg: "inserted Success",
        data: {
          entries: obj,
          page: 1,
          pages: totalPages,
          total: totalTransactions, //for the antd pagination
        },
      });
    } catch (err) {
      res.status(404).json({ msg: err });
    }
  })
);

//Send all entries from transaction model by user id and type of income or expense
//same pagination as above
//get query of sortBy and sortOrder to sort entries by name, amount, date, category
tranRouter.get(
  "/sorted?",
  protect, //added by me
  asyncHandler(async (req, res) => {
    try {
      //get page number and limit from query
      const { page = 1, limit } = req.query;
      //calculate total number of transactions
      const totalTransactions = await Transaction.countDocuments({
        $and: [
          { user: req.user._id },
          {
            $or: [{ type: "expense" }, { type: "income" }],
          },
        ],
      });
      const totalPages = 1;
      if (totalTransactions > 10) {
        // Calculate total number of pages
        totalPages = Math.ceil(totalTransactions / limit);
      }
      const { sortBy, sortOrder } = req.query;
      const obj = await Transaction.find({
        $and: [
          { user: req.user._id },
          {
            $or: [{ type: "expense" }, { type: "income" }],
          },
        ],
      })
        .sort({ [sortBy]: sortOrder === "low" ? 1 : -1 })
        .skip((page - 1) * limit)
        .limit(limit);
      res.status(200).json({
        msg: "inserted Success",
        data: {
          entries: obj,
          page: page || 1,
          pages: totalPages,
          total: totalTransactions,
        },
      });
    } catch (err) {
      res.status(404).json({ msg: err });
    }
  })
);

//Update entry's name, amount, date, category, type, description using id pass in params
tranRouter.put(
  "/:id",
  protect,
  asyncHandler(async (req, res) => {
    try {
      const transaction = await Transaction.findById(req.params.id);
      //Check if transaction exists to avoid error
      if (transaction) {
        //update all entries with new data from req.body
        //if data is not present then use old data
        // name, amount, date, category, type, description
        transaction.name = req.body.name || transaction.name;

        //Check if amount is changed and not equal to old amount then update income or expense
        //if change then calculate difference of old and new amount and update income or expense
        const flagAmount = transaction.amount !== req.body.amount;
        const diff = flagAmount
          ? req.body.amount - parseInt(transaction.amount)
          : 0;
        // console.log(flagAmount, diff);
        transaction.amount = req.body.amount || transaction.amount;
        transaction.description =
          req.body.description || transaction.description;
        transaction.category = req.body.category || transaction.category;

        //Check if type is changed and not equal to old type then update income or expense
        const flagType = transaction.type !== req.body.type;
        transaction.type = req.body.type || transaction.type;

        if (req.body.date) {
          transaction.date = req.body.date;
        }
        // console.log(req.body);
        //Now save the updated entry in transaction model
        const updatedEntry = await transaction.save(); //Save
        //update user income or expense with difference amount by flagType and flagAmount
        if (flagType) {
          if (transaction.type === "income") {
            await userIncomeUpdate(req, parseInt(transaction.amount));
            await userExpenseUpdate(req, parseInt(transaction.amount) * -1);
          } else {
            await userIncomeUpdate(req, parseInt(transaction.amount) * -1);
            await userExpenseUpdate(req, parseInt(transaction.amount));
          }
        } else if (flagAmount) {
          if (transaction.type === "income") {
            await userIncomeUpdate(req, diff);
          } else {
            await userExpenseUpdate(req, diff);
          }
        }
        //send user id, name, amount, description, category, type, date in response
        res.json({
          _id: updatedEntry._id,
          user: req.user._id,
          name: updatedEntry.name,
          amount: updatedEntry.amount,
          description: updatedEntry.description,
          category: updatedEntry.category,
          type: updatedEntry.type,
          date: updatedEntry.date,
        });
      } else {
        res.status(404);
        throw new Error("Transaction not found");
      }
    } catch (err) {
      console.log(err);
      res.status(404);
      throw new Error("Transaction not found");
    }
  })
);

// DELETE Entry
tranRouter.delete(
  "/:id",
  protect,
  asyncHandler(async (req, res) => {
    const totalTransactions = await Transaction.countDocuments({
      user: req.user._id,
    });
    const totalPages = 1;
    if (totalTransactions > 10) {
      // Calculate total number of pages
      totalPages = Math.ceil(totalTransactions / limit);
    }
    Transaction.deleteOne({ _id: req.params.id })
      .then((obj) => {
        //Checks Deleted by Count
        if (obj.deletedCount != 0) {
          //Delete amount from income or expense
          if (req.query.type === "income")
            userIncomeUpdate(req, parseInt(req.query.amount) * -1);
          else userExpenseUpdate(req, parseInt(req.query.amount) * -1);

          return res.status(200).json({
            msg: "Deleted Success",
            pages: totalPages,
            total: totalTransactions,
          }); //Deleted
        } else {
          res.status(401).json({ msg: "Sorry not deleted" }); //Not Deleted
        }
      })
      .catch((err) => {
        res.status(401).json({ msg: err }); //Not Found
      });
  })
);

//==================CHART ROUTES==================
const mongoose = require("mongoose");
tranRouter.get(
  "/chart/pie",
  protect,
  asyncHandler(async (req, res) => {
    const result = await Transaction.aggregate([
      {
        $match: {
          user: new mongoose.Types.ObjectId(req.user._id),
          type: "expense",
        },
      },
      {
        $group: {
          _id: "$category",
          total: { $sum: { $toDouble: "$amount" } },
        },
      },
    ]).sort({ _id: 1 });
    res.status(200).json(result);
  })
);

//==============SUBSCRIPTION ROUTES==================

//POST create subscription entry with name, amount, cycle, date, type, auto, description
tranRouter.post("/subscription", protect, async (req, res) => {
  try {
    const { name, amount, description, cycle, date, type, auto } = req.body;
    const subscription = new Transaction({
      name,
      amount,
      cycle,
      type,
      auto,
      date,
      description,
      user: req.user._id,
    });
    const newSubscription = await subscription.save();
    userExpenseUpdate(req, parseInt(amount));
    res.status(201).json(newSubscription);
  } catch (err) {
    res.status(401).json({ msg: err });
  }
});

//GET all subscription entry using user id and type from req.user
tranRouter.get("/subscription", protect, async (req, res) => {
  try {
    //find all entries with user id and type of subscription and sort by date
    const obj = await Transaction.find({
      $and: [{ user: req.user._id }, { type: "subscription" }],
    }).sort({ createdAt: -1 });
    res.status(200).json({
      data: {
        subscriptions: obj,
      },
    });
  } catch (err) {
    console.log(err);
    res.status(404).json({ msg: err.message });
  }
});

//Update subscription entry by id with name, amount, cycle, date, type, auto, description from req.body
//same as update entry
tranRouter.put("/subscription/:id", protect, async (req, res) => {
  try {
    const subscription = await Transaction.findById(req.params.id);
    //Check if subscription exists to avoid error
    if (subscription) {
      subscription.name = req.body.name || subscription.name;
      //update all entries with new data from req.body
      //if data is not present then use old data
      // name, amount, date, category, type, description
      const flagAmount = subscription.amount !== req.body.amount;

      //Check if amount is changed and not equal to old amount then update income or expense
      //if change then calculate difference of old and new amount and update income or expense
      const diff = flagAmount
        ? req.body.amount - parseInt(subscription.amount)
        : 0;

      subscription.amount = req.body.amount || subscription.amount;
      subscription.description =
        req.body.description || subscription.description;
      subscription.cycle = req.body.cycle || subscription.cycle;
      subscription.type = req.body.type || subscription.type;
      subscription.auto = req.body.auto || subscription.auto || false;
      //DATE update
      if (req.body.date) {
        subscription.date = req.body.date;
      }

      //Now save the updated subscription in transaction model
      const updatedSubscription = await subscription.save(); //Save
      if (flagAmount) {
        await userExpenseUpdate(req, diff);
      }
      res.json({
        _id: updatedSubscription._id,
        user: req.user._id,
        name: updatedSubscription.name,
        amount: updatedSubscription.amount,
        description: updatedSubscription.description,
        cycle: updatedSubscription.cycle,
        type: updatedSubscription.type,
        date: updatedSubscription.date,
      });
    } else {
      res.status(404);
      throw new Error("Subscription not found");
    }
  } catch (err) {
    console.log(err);
    res.status(404);
    throw new Error("Subscription not found");
  }
});

//Delete subscription entry by id
tranRouter.delete("/subscription/:id", protect, async (req, res) => {
  try {
    const subscription = await Transaction.findById(req.params.id);
    Transaction.deleteOne({ _id: req.params.id })
      .then((obj) => {
        //Checks Deleted by Count
        if (obj.deletedCount != 0) {
          userExpenseUpdate(req, parseInt(req.query.amount) * -1);

          return res.status(200).json({
            msg: "Deleted Success",
            data: obj,
          }); //Deleted
        } else {
          res.status(401).json({ msg: "Sorry not deleted" }); //Not Deleted
        }
      })
      .catch((err) => {
        res.status(401).json({ msg: err }); //Not Found
      });
  } catch (err) {
    console.log(err);
    res.status(404);
    throw new Error("Subscription not found");
  }
});

const transactionRouter = tranRouter;
module.exports = transactionRouter;
