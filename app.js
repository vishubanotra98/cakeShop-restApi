import express, { urlencoded } from "express";
import dotenv from "dotenv";
import { errorMiddleware } from "./middlewares/errorMiddleware.js";
import cors from "cors";
import cookieParser from "cookie-parser";
import { User } from "./models/User.js";
import jwt from "jsonwebtoken";

const app = express();
export default app;

dotenv.config({
  path: "./config/config.env",
});

app.use(cors({ credentials: true, origin: "http://localhost:3000" }));
app.use(cookieParser());

app.use(express.json());
app.use(
  urlencoded({
    extended: true,
  })
);

app.post("/api/v1/login", async (req, res, next) => {
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
        secure: false,
        sameSite: "none",
      });
      res.json({ message: "User Logged In" });
    }
  } catch (error) {
    next(error);
  }
});

// Importing Routes
import userRoute from "./routes/userRoute.js";
import orderRoute from "./routes/ordersRoute.js";
import getMyOrdersRoute from "./routes/ordersRoute.js";
import getOrderDetailsRoute from "./routes/ordersRoute.js";

app.use("/api/v1", userRoute);
app.use("/api/v1", orderRoute);
app.use("/api/v1", getMyOrdersRoute);
app.use("/api/v1", getOrderDetailsRoute);

// Using Error Middleware
app.use(errorMiddleware);
