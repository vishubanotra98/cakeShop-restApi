import { User } from "../models/User.js";
import { Order } from "../models/Order.js";
import { asyncError } from "../middlewares/errorMiddleware.js";
import jwt from "jsonwebtoken";

export const myProfile = (req, res, next) => {
  res.status(200).json({ success: true, user: req.user });
};

// Register a new user
export const registerUser = asyncError(async (req, res, next) => {
  try {
    const { name, username, password } = req.body;
    const user = new User({ name, username, password });

    await user.save();

    const token = jwt.sign({ username, role: "user" }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    res.status(201).json({ message: "User registered successfully", token });
  } catch (error) {
    next(error);
  }
});

// Login user
// export const loginUser = asyncError(async (req, res, next) => {
//   const { username, password } = req.body;

//   try {
//     const user = await User.findOne({ username });

//     if (!user) {
//       return res.status(401).json({ message: "Authentication failed" });
//     }

//     if (user.password !== password) {
//       return res.status(401).json({ message: "Incorrect Password" });
//     }

//     const token = jwt.sign(
//       { username: user.username, id: user._id, role: user.role },
//       process.env.JWT_SECRET
//     );
//     // res.json({message: "User Logged In successfully", token });
//     res.cookie("token", token, {
//       sameSite: "none",
//       secure: false,
//     });
//     res.json({ message: "Login Successfully" });
//   } catch (error) {
//     next(error);
//   }
// });

export const loginUser = asyncError(async (req, res, next) => {
  const { username, password } = req.body;

  try {
    const user = await User.findOne({ username, password });
    if (!user) {
      res.json({ message: "User not found" });
    } else {
      const token = jwt.sign(
        {
          username: user.username,
          id: user._id,
          role: user.role,
        },
        process.env.JWT_SECRET,
        { expiresIn: "1hr" }
      );

      res.cookie("token", token, {
        secure: true,
        sameSite: "none",
      });
      res.json({ message: "User Logged In" });
    }
  } catch (error) {
    next(error);
  }
});

// Admin Routes
export const getAdminUsers = asyncError(async (req, res, next) => {
  const users = await User.find({});

  res.status(200).json({
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
