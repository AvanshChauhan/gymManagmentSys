import Payment from "../../models/payment.model.schema.js";
import Membership from "../../models/membership.model.js";
import { buildPaginationMeta, getPagination } from "../../utils/pagination.js";

const getPaymentsByMember = async (req, res) => {
  try {
    const memberId = req.params.memberId;
    const { page, limit, skip } = getPagination(req.query);

    const memberships = await Membership.find({
      memberId,
      isDeleted: false,
    });

    const membershipIds = memberships.map((membership) => membership._id);

    const filter = {
      membershipId: { $in: membershipIds },
      isDeleted: false,
    };

    const [payments, total] = await Promise.all([
      Payment.find(filter)
        .populate({
          path: "membershipId",
          populate: [
            { path: "memberId", select: "-password" },
            { path: "planId" },
          ],
        })
        .sort({ paymentDate: -1 })
        .skip(skip)
        .limit(limit),
      Payment.countDocuments(filter),
    ]);

    return res.status(200).json({
      success: true,
      count: payments.length,
      pagination: buildPaginationMeta(page, limit, total),
      data: payments,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Some error occurred",
      error: error.message,
    });
  }
};

export default getPaymentsByMember;
