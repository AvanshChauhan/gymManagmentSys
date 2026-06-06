import Payment from "../../models/payment.model.schema.js";

const getSpecificPayment = async (req, res) => {
  try {
    const paymentId = req.params.id;

    const payment = await Payment.findOne({
      _id: paymentId,
      isDeleted: false,
    }).populate({
      path: "membershipId",
      populate: [{ path: "memberId", select: "-password" }, { path: "planId" }],
    });

    if (!payment) {
      return res.status(404).json({
        success: false,
        message: "No payment with this id exists",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Payment found",
      data: payment,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Some error occurred",
      error: error.message,
    });
  }
};

export default getSpecificPayment;
