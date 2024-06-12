import jwt from "jsonwebtoken";
import ErrorHandler from "./errorHandler.js";

const authenticateHandler = async (req, res, next) => {
  const { accessToken, refreshToken } = req.cookies;
  if(!accessToken|!refreshToken) return next (new ErrorHandler(404,"Login First!"))
  const access =  jwt.verify(accessToken, process.env.JWT_SECRET);
  const refresh = jwt.verify(refreshToken, process.env.JWT_SECRET);
  req.user={
    access,
    refresh
  }
  next();
};

export default authenticateHandler;
