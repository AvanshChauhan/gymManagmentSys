import jwt from "jsonwebtoken";
import user from "../models/user.model.js";

const authMiddleWare = async (req, res, next) => {
  try {
    const token = req.cookies.token || req.headers.authorization?.split(" ")[1];
    if (!token) {
      return res.status(401).json({
        message: "unauthorized access",
      });
    }
    const verifyToken = jwt.verify(token, process.env.JWT_SECRET);

    // Verify user still exists and is not soft-deleted
    const dbUser = await user.findById(verifyToken.userId);
    if (!dbUser || dbUser.isDeleted) {
      return res.status(401).json({
        message: "unauthorized access",
      });
    }

    req.user = verifyToken;
    next();
  } catch (error) {
    return res.status(400).json({
      error: "unathorized access",
    });
  }
};
export default authMiddleWare;
