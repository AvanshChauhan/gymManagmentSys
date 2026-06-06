import Payment from "../../models/payment.model.schema.js";

const getPayment = async (req, res) => {
  try {
    const payments = await Payment.find({
      isDeleted: false,
    }).populate({
      path: "membershipId",
      populate: [
        { path: "memberId", select: "-password" },
        { path: "planId" },
      ],
    });

    if (payments.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No payments exist",
      });
    }

    return res.status(200).json({
      success: true,
      count: payments.length,
      data: payments,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

export default getPayment;