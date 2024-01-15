import jwt from "jsonwebtoken";
import asyncHandler from "express-async-handler";
import User from "../models/userModel.js";

const protect = asyncHandler(async (req, res, next) => {
  let token;

  const JWT_SECRET = "pledgeup" || process.env.JWT_SECRET;
  const authorization = req.headers.authorization || req.body.authorization;
  if (authorization && authorization.startsWith("Bearer ")) {
    try {
      token = authorization.split(" ")[1];

      const decoded = jwt.verify(token, JWT_SECRET);

      req.user = await User.findById(decoded.id).select("-password");

      next();
    } catch (error) {
      console.error(error);
      res.status(401);
      throw new Error("Not authorized, token failed");
    }
  }

  if (!token) {
    res.status(401);
    throw new Error("Not authorized, no token");
  }
});

export { protect };
