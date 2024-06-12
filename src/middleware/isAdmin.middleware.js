import asyncHandler from "../utils/asyncHandler.js";
import {User} from "../models/user.js";
import ErrorHandler from "../utils/errorHandler.js";
const isAdmin = asyncHandler(async (req, res, next) => {
  const { _id } = req.user.access;
  const user = await User.findById(_id);
  if (user.role !== "admin")
    next(new ErrorHandler(401, "You are not an Admin"));
  return next();
});

export default isAdmin