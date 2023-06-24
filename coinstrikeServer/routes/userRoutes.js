const express = require("express");
const asyncHandler = require("express-async-handler");
const nodemailer = require("nodemailer");
const Mailgen = require("mailgen");
const bcrypt = require("bcryptjs");

const { protect, admin } = require("../Middleware/AuthMiddleware.js");
const generateToken = require("../utils/generateToken.js");
const User = require("./../Models/userModel.js");

const userRouter = express.Router();

//==================CHART ROUTES==================
//Send User Income List and Expense List Chart
userRouter.get("/chart/line", protect, async (req, res) => {
  const user = await User.findById(req.user._id);
  res.json({
    incomeList: user.incomeList,
    expenseList: user.expenseList,
  });
});

//==================USER ROUTES==================
// Delete
userRouter.delete(
  "/:id",
  asyncHandler(async (req, res) => {
    console.log("object", req.params.id);
    User.deleteOne({ _id: req.params.id })
      .then(() => {
        res.status(200).json({ msg: "Deleted Success" });
      })
      .catch((err) => {
        res.status(401).json({ msg: err });
      });
  })
);
// LOGIN
userRouter.post(
  "/login",
  asyncHandler(async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (user && (await user.matchPassword(password))) {
      if (!user.isVerified) {
        res.status(300);
        throw new Error("Verify your email first");
      }
      res.json({
        _id: user._id,
        name: user.name,
        incomeList: user.incomeList,
        expenseList: user.expenseList,
        email: user.email,
        image: user.image,
        isVerified: user.isVerified,
        token: generateToken(user._id),
        createdAt: user.createdAt,
      });
    } else {
      res.status(401).send("Invalid Email or Password");
      throw new Error("Invalid Email or Password");
    }
  })
);

// REGISTER
userRouter.post(
  "/",
  asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    const userExists = await User.findOne({ email });

    if (userExists) {
      res.status(400).send("Email already exists");
      throw new Error("User already exists");
    }

    //MAILGEN Configuration -----------EMAIL
    var otpGen = Math.floor(1000 + Math.random() * 9000);
    console.log(otpGen);

    let config = {
      service: "gmail",
      auth: {
        user: process.env.EMAIL,
        pass: process.env.PASSWORD,
      },
    };

    let transporter = nodemailer.createTransport(config);

    let MailGenerator = new Mailgen({
      theme: "default",
      product: {
        name: "The CoinStriker Team",
        link: "https://papaya-daffodil-e225e7.netlify.app/", //--------------------EDIT LINK
      },
    });
    let response = {
      body: {
        name: `${email}`,
        intro: `Please enter the code on the sign up page to confirm your identity: ${otpGen}`,
        outro: "All the best,\n The CoinStriker Team",
      },
    };

    let mail = MailGenerator.generate(response);

    let message = {
      from: process.env.EMAIL,
      to: email,
      subject: "Otp CoinStriker",
      html: mail,
    };

    await transporter.sendMail(message).catch((error) => {
      res.status(500).send("Internal Server Error");
      throw new Error("Internal Server Error");
    });

    const salt = await bcrypt.genSalt(10);
    otpGen = await bcrypt.hash(otpGen.toString(), salt);

    // USER CREATING PHASE
    const user = await User.create({
      email,
      password,
      otp: otpGen,
    });
    if (user) {
      res.status(200).json({ msg: "Now verify to continue", id: user._id });
    } else {
      res.status(400).send("Invalid User Data");
      throw new Error("Invalid User Data");
    }
  })
);

// OTP verify
userRouter.post(
  "/verify",
  asyncHandler(async (req, res) => {
    const { email, otp } = req.body;
    const user = await User.findOne({ email });

    if (user && (await user.matchOtp(otp.toString()))) {
      user.isVerified = true;
      await user.save();
      res.json({
        _id: user._id,
        name: user.name,
        incomeList: user.incomeList,

        email: user.email,
        image: user.image,
        isVerified: true,
        token: generateToken(user._id),
        createdAt: user.createdAt,
      });
    } else {
      res.status(401).send("Invalid Otp Number");
      throw new Error("Invalid Otp Number");
    }
  })
);

// PROFILE
userRouter.get(
  "/profile",
  protect,
  asyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id);

    if (user) {
      res.json({
        _id: user._id,
        name: user.name,
        incomeList: user.incomeList,
        expenseList: user.expenseList,
        email: user.email,
        image: user.image,
        isVerified: user.isVerified,
        createdAt: user.createdAt,
        currency: user.currency,
        expense: user.expense,
        income: user.income,
        balance: user.income - user.expense,
      });
    } else {
      res.status(404);
      throw new Error("User not found");
    }
  })
);

// UPDATE PROFILE
userRouter.put(
  "/profile",
  protect,
  asyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id);

    if (user) {
      user.name = req.body.name || user.name;
      user.lastname = req.body.lastname || user.lastname;
      user.image = req.body.image || user.image;
      user.currency = req.body.currency || user.currency;
      user.salary = req.body.salary || user.salary;
      user.date = req.body.date || user.date;
      if (req.body.password) {
        user.password = req.body.password;
      }
      const updatedUser = await user.save();
      res.json({
        _id: updatedUser._id,
        name: updatedUser.name,
        image: updatedUser.image,
        email: updatedUser.email,
        createdAt: updatedUser.createdAt,
        incomeList: updatedUser.incomeList,
        expenseList: updatedUser.expenseList,
        isVerified: updatedUser.isVerified,
        createdAt: updatedUser.createdAt,
        currency: updatedUser.currency,
        expense: updatedUser.expense,
        income: updatedUser.income,
        balance: updatedUser.income - updatedUser.expense,
      });
    } else {
      res.status(404);
      throw new Error("User not found");
    }
  })
);

userRouter.post(
  "/profile/photo",
  protect,
  asyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id);

    if (user) {
      user.image = req.body.image || user.image;
      const updatedUser = await user.save();
      res.json({
        _id: updatedUser._id,
        name: updatedUser.name,
        image: updatedUser.image,
        email: updatedUser.email,
      });
    } else {
      res.status(404);
      throw new Error("User not found");
    }
  })
);

// GET ALL USER ADMIN
userRouter.get(
  "/",
  protect,
  admin,
  asyncHandler(async (req, res) => {
    const users = await User.find({});
    res.json(users);
  })
);

/** send mail from real gmail account */
userRouter.post(
  "/sendemail",
  asyncHandler(async (req, res) => {
    const { userEmail } = req.body;
    var otpGen = Math.floor(1000 + Math.random() * 9000);

    let config = {
      service: "gmail",
      auth: {
        user: process.env.EMAIL,
        pass: process.env.PASSWORD,
      },
    };

    let transporter = nodemailer.createTransport(config);

    let MailGenerator = new Mailgen({
      theme: "default",
      product: {
        name: "The CoinStriker Team",
        link: "https://papaya-daffodil-e225e7.netlify.app/", //--------------------EDIT LINK
      },
    });
    let response = {
      body: {
        name: `${userEmail}`,
        intro: `Please enter the code on the sign up page to confirm your identity: ${otpGen}`,
        outro: "All the best,\n The CoinStriker Team",
      },
    };

    let mail = MailGenerator.generate(response);

    let message = {
      from: process.env.EMAIL,
      to: userEmail,
      subject: "Otp CoinStriker",
      html: mail,
    };

    transporter
      .sendMail(message)
      .then(() => {
        return res.status(201).json({
          msg: "you should receive an email",
        });
      })
      .catch((error) => {
        return res.status(500).json({ error });
      });
  })
);

userRouter.get(
  "/ie",
  protect,
  asyncHandler(async (req, res) => {
    try {
      const user = await User.findById(req.user._id);
      res.json({ income: user.income, expense: user.expense });
    } catch (error) {
      res.status(500).json({ error });
    }
  })
);

module.exports = userRouter;
