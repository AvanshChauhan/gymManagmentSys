import user from "../../models/user.model.js";
import plan from "../../models/plan.model.js";
import membership from "../../models/membership.model.js";

const assignMembership = async (req, res) => {
  try {
    const { memberId, planId } = req.body;

    if (!memberId || !planId) {
      return res.status(400).json({
        success: false,
        message: "Member id and Plan id are required",
      });
    }

    const member = await user.findById(memberId);

    if (!member || member.isDeleted) {
      return res.status(404).json({
        success: false,
        message: "Member not found",
      });
    }

    const selectedPlan = await plan.findOne({
      _id: planId,
      isDeleted: false,
    });

    if (!selectedPlan) {
      return res.status(404).json({
        success: false,
        message: "Plan not found",
      });
    }

    const existingMembership = await membership.findOne({
      memberId,
      status: "active",
      isDeleted: false,
    });

    if (existingMembership) {
      return res.status(409).json({
        success: false,
        message: "Member already has an active membership",
      });
    }

    const startDate = new Date();

    const endDate = new Date(startDate);
    endDate.setDate(
      endDate.getDate() + selectedPlan.durationInDays
    );

    const newMembership = await membership.create({
      memberId,
      planId,
      startDate,
      endDate,
      status: "active",
      createdBy: req.user.userId,
    });

    return res.status(201).json({
      success: true,
      message: "Membership assigned successfully",
      data: newMembership,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Some error occurred",
      error: error.message,
    });
  }
};

export default assignMembership;