import plan from "../../models/plan.model.js";

const deletePlan = async (req, res) => {
  try {
    const planId = req.params.id;

    const getPlan = await plan.findById(planId);

    if (!getPlan) {
      return res.status(404).json({
        success: false,
        message: "No plan with such id exists",
      });
    }

    getPlan.isDeleted = true;
    getPlan.deletedAt = new Date();
    getPlan.deletedBy = req.user.userId;

    await getPlan.save();

    return res.status(200).json({
      success: true,
      message: "Plan deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Some error occurred",
      error: error.message,
    });
  }
};

export default deletePlan;