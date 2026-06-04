import plan from "../../models/plan.model.js";

const getAllPlan = async (req, res) => {
  try {
    const plans = await plan.find({
      isDeleted: false,
    });

    return res.status(200).json({
      success: true,
      count: plans.length,
      data: plans,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Some error occurred",
      error: error.message,
    });
  }
};

export default getAllPlan;