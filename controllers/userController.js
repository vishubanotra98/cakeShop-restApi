import { User } from "../models/User.js";
import { Order } from "../models/Order.js";
import { Contact } from "../models/Contact.js";
import { asyncError } from "../middlewares/errorMiddleware.js";
import jwt from "jsonwebtoken";

export const myProfile = (req, res, next) => {
  return res.status(200).json({ status: 200, success: true, user: req.user });
};

// Register a new user
export const registerUser = asyncError(async (req, res, next) => {
  const { name, username, password, role } = req.body;

  console.log(req.body);

  let existingUser = await User.findOne({ username: username });

  if (existingUser) {
    return res.status(409).json({
      status: 409,
      errMsg: "User Already Exists.",
    });
  }

  const user = new User({ name, username, password, role });
  await user.save();

  res
    .status(201)
    .json({ status: 200, message: "User registered successfully" });
});

export const loginUser = asyncError(async (req, res, next) => {
  const { username, password } = req.body;

  const user = await User.findOne({ username, password });
  if (!user) {
    res
      .status(404)
      .json({ status: 400, errMsg: "Username or Password is incorrect." });
  } else {
    const token = jwt.sign(
      {
        name: user.name,
        username: user.username,
        id: user._id,
        role: user.role,
      },
      process.env.JWT_SECRET,
      { expiresIn: "1hr" }
    );

    res.status(200).json({ status: 200, message: "User Logged In", token });
  }
});

// Admin Routes
export const getAdminUsers = asyncError(async (req, res, next) => {
  const users = await User.find({});

  res.status(200).json({
    status: 200,
    success: true,
    users,
  });
});

export const getAdminStats = asyncError(async (req, res, next) => {
  const usersCount = await User.countDocuments();

  const orders = await Order.find({});

  const preparingOrder = orders.filter((i) => i.orderStatus === "Preparing");
  const shippedOrder = orders.filter((i) => i.orderStatus === "Shipped");
  const deliveredOrder = orders.filter((i) => i.orderStatus === "Delivered");

  let totalIncome = 0;

  orders.forEach((i) => {
    totalIncome += i.totalAmount;
  });

  res.status(200).json({
    success: true,
    usersCount,
    ordersCount: {
      total: orders.length,
      preparing: preparingOrder.length,
      shipped: shippedOrder.length,
      delivered: deliveredOrder.length,
    },
    totalIncome,
  });
});

export const contactForm = asyncError(async (req, res, next) => {
  const { name, email, message } = req.body;

  const formDetails = new Contact({ name, email, message });
  await formDetails.save();

  res.status(200).json({ success: true, message: "Message sent Successfully" });
});

export const adminForm = asyncError(async (req, res, next) => {
  const messages = await Contact.find({});
  res.status(200).json({
    success: true,
    messages,
  });
});
