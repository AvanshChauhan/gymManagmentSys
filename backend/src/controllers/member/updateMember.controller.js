import user from "../../models/user.model.js";

const updateAnUser = async (req, res) => {
  try {
    const memberId = req.params.id;
    const {
      name,
      phone,
      gender,
      dateOfBirth,
      weight,
      height,
      profileImage,
      address,
    } = req.body;

    const updatedUser = await user.findByIdAndUpdate(
      memberId,
      {
        name,
        phone,
        gender,
        dateOfBirth,
        weight,
        height,
        profileImage,
        address,
      },
      {
        new: true,
      }
    ).select("-password");

    if (!updatedUser) {
      return res.status(404).json({
        success: false,
        message: "No member exists with this id",
      });
    }

    return res.status(200).json({
      success: true,
      message: "User has been updated",
      data: updatedUser,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Some error occurred",
      error: error.message,
    });
  }
};

export default updateAnUser;