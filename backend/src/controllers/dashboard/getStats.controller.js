import User from "../../models/user.model.js";
import Plan from "../../models/plan.model.js";
import Membership from "../../models/membership.model.js";
import payment from "../../models/payment.model.schema.js";

const getStats = async (req, res) => {
  try {
    const totalMembers = await User.countDocuments({
      role: "member",
      isDeleted: false,
    });

    const totalPlans = await Plan.countDocuments({
      isDeleted: false,
    });

    const activeMemberships = await Membership.countDocuments({
      status: "active",
      isDeleted: false,
    });

    const expiredMemberships = await Membership.countDocuments({
      status: "expired",
      isDeleted: false,
    });

    const totalPayments = await payment.countDocuments({
      isDeleted: false,
    });

    return res.status(200).json({
      success: true,
      data: {
        totalMembers,
        totalPlans,
        activeMemberships,
        expiredMemberships,
        totalPayments,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Some error occurred",
      error: error.message,
    });
  }
};

export default getStats;
