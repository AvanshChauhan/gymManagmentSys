import plan from "../../models/plan.model.js";

const updatePlan = async (req, res) => {
  try {
    const planId = req.params.id;
    const { name, durationInDays, price, description, isActive } = req.body;

    const updatedPlan = await plan.findOneAndUpdate(
      {
        _id: planId,
        isDeleted: false,
      },
      {
        name,
        durationInDays,
        price,
        description,
        isActive,
      },
      {
        new: true,
        runValidators: true,
      }
    );

    if (!updatedPlan) {
      return res.status(404).json({
        success: false,
        message: "There is no plan with such id",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Plan updated successfully",
      data: updatedPlan,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Some error occurred",
      error: error.message,
    });
  }
};

export default updatePlan;
