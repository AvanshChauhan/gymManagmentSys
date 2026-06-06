import Membership from "../../models/membership.model.js";
import { buildPaginationMeta, getPagination } from "../../utils/pagination.js";

const getExpiringMemberships = async (req, res) => {
  try {
    const { page, limit, skip } = getPagination(req.query);
    const days = Math.max(parseInt(req.query.days, 10) || 7, 1);

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const expiryDate = new Date(today);
    expiryDate.setDate(expiryDate.getDate() + days);
    expiryDate.setHours(23, 59, 59, 999);

    const filter = {
      isDeleted: false,
      status: "active",
      endDate: {
        $gte: today,
        $lte: expiryDate,
      },
    };

    const [memberships, total] = await Promise.all([
      Membership.find(filter)
        .populate("memberId", "-password")
        .populate("planId")
        .sort({ endDate: 1 })
        .skip(skip)
        .limit(limit),
      Membership.countDocuments(filter),
    ]);

    return res.status(200).json({
      success: true,
      count: memberships.length,
      days,
      pagination: buildPaginationMeta(page, limit, total),
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

export default getExpiringMemberships;
