const adminMiddleware = async (req, res, next) => {
  try {
    const role = req.user.role;

    if (role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Forbidden: Admin access required",
      });
    }

    next();
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Some error occurred",
      error: error.message,
    });
  }
};

export default adminMiddleware;
