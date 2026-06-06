import Membership from "../../models/membership.model.js";
import Payment from "../../models/payment.model.schema.js";
import { buildPaginationMeta, getPagination } from "../../utils/pagination.js";

const getPendingDues = async (req, res) => {
  try {
    const { page, limit, skip } = getPagination(req.query);

    const memberships = await Membership.find({
      isDeleted: false,
      status: { $in: ["active", "pending", "expired"] },
    })
      .populate("memberId", "-password")
      .populate("planId")
      .sort({ endDate: 1 });

    const membershipIds = memberships.map((membership) => membership._id);

    const paymentTotals = await Payment.aggregate([
      {
        $match: {
          membershipId: { $in: membershipIds },
          isDeleted: false,
        },
      },
      {
        $group: {
          _id: "$membershipId",
          totalPaid: { $sum: "$amount" },
        },
      },
    ]);

    const paidByMembership = new Map(
      paymentTotals.map((payment) => [
        payment._id.toString(),
        payment.totalPaid,
      ])
    );

    const pendingDues = memberships
      .map((membership) => {
        const planPrice = membership.planId?.price || 0;
        const totalPaid = paidByMembership.get(membership._id.toString()) || 0;
        const dueAmount = Math.max(planPrice - totalPaid, 0);

        return {
          membership,
          member: membership.memberId,
          plan: membership.planId,
          planPrice,
          totalPaid,
          dueAmount,
          endDate: membership.endDate,
          status: membership.status,
        };
      })
      .filter((due) => due.dueAmount > 0)
      .sort((a, b) => b.dueAmount - a.dueAmount);

    const paginatedDues = pendingDues.slice(skip, skip + limit);

    return res.status(200).json({
      success: true,
      count: paginatedDues.length,
      pagination: buildPaginationMeta(page, limit, pendingDues.length),
      data: paginatedDues,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Some error occurred",
      error: error.message,
    });
  }
};

export default getPendingDues;
