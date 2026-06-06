import Membership from "../../models/membership.model.js";
import plan from "../../models/plan.model.js";

const renewMembership = async (req, res) => {
  try {
    const membershipId = req.params.id;

    const membership = await Membership.findOne({
      _id: membershipId,
      isDeleted: false,
    });

    if (!membership) {
      return res.status(404).json({
        success: false,
        message: "No membership with this id exists",
      });
    }

    const selectedPlan = await plan.findOne({
      _id: membership.planId,
      isDeleted: false,
    });

    if (!selectedPlan) {
      return res.status(404).json({
        success: false,
        message: "Plan not found",
      });
    }

    const currentEndDate = new Date(membership.endDate);

    currentEndDate.setDate(
      currentEndDate.getDate() + selectedPlan.durationInDays
    );

    membership.endDate = currentEndDate;
    membership.status = "active";

    await membership.save();

    return res.status(200).json({
      success: true,
      message: "Membership renewed successfully",
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

export default renewMembership;