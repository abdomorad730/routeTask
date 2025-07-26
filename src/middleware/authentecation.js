import jwt from "jsonwebtoken"
import userModel from "../DB/models/user.model.js"

export const auth = async (req, res, next) => {
  try {
    const { authorization } = req.headers;

    if (!authorization) {
      return res.status(401).json({ msg: "Unauthorized: No token provided" });
    }

    const token = authorization.split(' ')[1];

    const decoded = jwt.verify(token, process.env.TOKEN_KEY);
    if (!decoded?.email) {
      return res.status(401).json({ msg: "Invalid token payload" });
    }

    const user = await userModel.findOne({ email: decoded.email });
    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }

    req.user = user;
    next();

  } catch (error) {
    console.error("Auth error:", error.message);
    return res.status(500).json({ msg: 'Server error', error: error.message });
  }
};
export const authorization = (roles = []) => {
  return (req, res, next) => {
    if (roles.includes(req?.user?.role)) {
      return next();
    }
    return res.status(401).json({ msg: 'Unauthorized access' });
  };
};