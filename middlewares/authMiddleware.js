import ErrorHandler from "../utils/ErrorHandler.js";
import jwt from "jsonwebtoken";

export const authenticateToken = (req, res, next) => {
  const authToken = req.headers.authorization;
  if (authToken) {
    const token = authToken.split(" ")[1];
    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
      if (err) {
        return res.status(404).json({ status: 400, message: "Not found" });
      } else {
        req.user = user;
        next();
      }
    });
  } else {
    res.status(403).json({ status: 403, message: "User not logged in." });
  }
};

export const authorizeAdmin = (req, res, next) => {
  if (req.user.role !== "admin") {
    return next(new ErrorHandler("Only Admin Allowed", 405));
  }
  next();
};
