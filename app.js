import express, { urlencoded } from "express";
import dotenv from "dotenv";
import { errorMiddleware } from "./middlewares/errorMiddleware.js";
import cors from "cors";

const app = express();
export default app;

dotenv.config({
  path: "./config/config.env",
});


app.use(
  cors({
    credentials: true,
    origin: process.env.FRONTEND_URL,
    methods: ["GET", "POST", "PUT", "DELETE"],
  })
);


app.use(express.json());
app.use(
  urlencoded({
    extended: true,
  })
);

app.enable("trust proxy");


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
