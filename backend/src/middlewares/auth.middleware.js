import jwt from "jsonwebtoken";
const authMiddleWare = async (req, res, next) => {
  try {
    const token = req.cookies.token;
    if (!token) {
      return res.status(401).json({
        message: "unauthorized access",
      });
    }
    const verifyToken=jwt.verify(token,process.env.JWT_SECRET)
    req.user=verifyToken
    next()
  } catch (error) {
    return res.status(400).json({
        error:"unathorized access"
    })
  }
};
export default authMiddleWare