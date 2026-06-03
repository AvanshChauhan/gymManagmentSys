import user from "../../models/user.model.js";

const getSpecificMember = async (req, res) => {
  try {
    const memberId = req.params.id;

    const member = await user.findById(memberId).select("-password");

    if (!member) {
      return res.status(404).json({
        success: false,
        message: "User does not exist with this id",
      });
    }

    return res.status(200).json({
      success: true,
      message: "User found",
      data: member,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Some error occurred",
      error: error.message,
    });
  }
};

export default getSpecificMember;
