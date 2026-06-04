import user from "../../models/user.model.js";

const deleteAnUser = async (req, res) => {
  try {
    const memberId = req.params.id;

    const member = await user.findById(memberId);

    if (!member) {
      return res.status(404).json({
        success: false,
        message: "No such user exists",
      });
    }

    member.isDeleted = true;
    member.deletedAt = new Date();
    member.deletedBy = req.user.userId;

    await member.save();

    return res.status(200).json({
      success: true,
      message: "User deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Some error occurred",
      error: error.message,
    });
  }
};

export default deleteAnUser;
