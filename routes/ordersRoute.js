import express from "express";
import {
  authorizeAdmin,
  isAuthenticated,
} from "../middlewares/authMiddleware.js";
import {
  getAdminOrders,
  getMyOrders,
  getOrderDetails,
  paymentVerifivcation,
  placeOrder,
  placeOrderOnline,
  processOrder,
} from "../controllers/orderController.js";

const router = express.Router();

router.post("/createorder", isAuthenticated, placeOrder);

router.post("/createorderonline", isAuthenticated, placeOrderOnline);

router.post("/paymentverification", isAuthenticated, paymentVerifivcation);

router.get("/myorders", isAuthenticated, getMyOrders);

router.get("/order/:id", isAuthenticated, getOrderDetails);



// Add Admin Middleware
router.get("/admin/orders", isAuthenticated, authorizeAdmin, getAdminOrders);

router.get("/admin/order/:id", isAuthenticated, authorizeAdmin, processOrder);

export default router;
