import Membership from "../../models/membership.model.js";

const getSpecificMembership = async (req, res) => {
  try {
    const membershipId = req.params.id;

    const membership = await Membership.findOne({
      _id: membershipId,
      isDeleted: false,
    })
      .populate("memberId", "-password")
      .populate("planId");

    if (!membership) {
      return res.status(404).json({
        success: false,
        message: "No membership with this id exists",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Membership found",
      data: membership,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Some error occurred",
      error: error.message,
    });
  }
};

export default getSpecificMembership;
