import plan from "../../models/plan.model.js";

const specificPlan = async (req, res) => {
  try {
    const planId = req.params.id;

    const foundPlan = await plan.findOne({
      _id: planId,
      isDeleted: false,
    });

    if (!foundPlan) {
      return res.status(404).json({
        success: false,
        message: "There is no plan with such id",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Plan found",
      data: foundPlan,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Some error occurred",
      error: error.message,
    });
  }
};

export default specificPlan;