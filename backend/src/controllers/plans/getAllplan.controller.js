import plan from "../../models/plan.model.js";
import { buildPaginationMeta, getPagination } from "../../utils/pagination.js";

const getAllPlan = async (req, res) => {
  try {
    const { page, limit, skip } = getPagination(req.query);
    const filter = { isDeleted: false };

    const [plans, total] = await Promise.all([
      plan.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit),
      plan.countDocuments(filter),
    ]);

    return res.status(200).json({
      success: true,
      count: plans.length,
      pagination: buildPaginationMeta(page, limit, total),
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
