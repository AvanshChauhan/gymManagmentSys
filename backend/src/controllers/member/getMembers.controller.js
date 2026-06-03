import user from "../../models/user.model.js";
const getAllMembers = async (req, res) => {
  try {
    const allMembers = await user.find({ role: "member" }).select("-password");
    if (!allMembers) {
      return res.status(404).json({
        success: false,
        message: "database is empty hence no user exist",
      });
    }
    return res.status(200).json({
      success: true,
      count: allMembers.length,
      data: allMembers,
    }); 
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};
export default getAllMembers
