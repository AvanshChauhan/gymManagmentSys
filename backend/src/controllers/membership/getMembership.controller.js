import Membership from "../../models/membership.model.js";

const getAllMemberships = async (req, res) => {
  try {
    const memberships = await Membership.find({
      isDeleted: false,
    })
      .populate("memberId", "-password")
      .populate("planId");

    return res.status(200).json({
      success: true,
      count: memberships.length,
      data: memberships,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Some error occurred",
      error: error.message,
    });
  }
};

export default getAllMemberships;