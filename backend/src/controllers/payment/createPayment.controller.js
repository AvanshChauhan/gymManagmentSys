import Payment from "../../models/payment.model.schema.js";
import Membership from "../../models/membership.model.js";
import plan from "../../models/plan.model.js";

const createPayment = async (req, res) => {
  try {
    const membershipId = req.params.id;

    const { amount, paymentMethod, note } = req.body;
    const numericAmount = Number(amount);

    if (!Number.isFinite(numericAmount) || numericAmount <= 0) {
      return res.status(400).json({
        success: false,
        message: "Valid amount is required",
      });
    }

    const membership = await Membership.findOne({
      _id: membershipId,
      isDeleted: false,
    });

    if (!membership) {
      return res.status(404).json({
        success: false,
        message: "Membership not found",
      });
    }

    const selectedPlan = await plan.findOne({
      _id: membership.planId,
      isDeleted: false,
    });

    if (!selectedPlan) {
      return res.status(404).json({
        success: false,
        message: "Plan not found",
      });
    }

    const previousPayments = await Payment.find({
      membershipId,
      isDeleted: false,
    });

    const totalPaid = previousPayments.reduce(
      (sum, payment) => sum + payment.amount,
      0
    );

    if (totalPaid + numericAmount > selectedPlan.price) {
      return res.status(400).json({
        success: false,
        message: "Payment exceeds plan amount",
      });
    }

    const newPayment = await Payment.create({
      membershipId,
      amount: numericAmount,
      paymentMethod,
      note,
      receivedBy: req.user.userId,
    });

    return res.status(201).json({
      success: true,
      message: "Payment created successfully",
      data: newPayment,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Some error occurred",
      error: error.message,
    });
  }
};

export default createPayment;
