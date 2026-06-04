import plan from "../../models/plan.model.js";

const createPlan = async (req, res) => {
  try {
    const { name, durationInDays, price, description } = req.body;

    if (!name || !durationInDays || !price) {
      return res.status(400).json({
        success: false,
        message: "Required fields are missing",
      });
    }

    const isPlanExist = await plan.findOne({ name });

    if (isPlanExist) {
      return res.status(409).json({
        success: false,
        message: "Plan already exists",
      });
    }

    const newPlan = await plan.create({
      name,
      durationInDays,
      price,
      description,
      createdBy: req.user.userId,
    });

    return res.status(201).json({
      success: true,
      message: "Plan created successfully",
      data: newPlan,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Some error occurred",
      error: error.message,
    });
  }
};

export default createPlan;
