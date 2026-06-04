import user from "../../models/user.model.js";

const getMe = async (req, res) => {
  try {
    const userId = req.user.userId;

    const findUser = await user.findById(userId).select("-password");

    if (!findUser) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: findUser,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Some error occurred",
      error: error.message,
    });
  }
};

export default getMe;
