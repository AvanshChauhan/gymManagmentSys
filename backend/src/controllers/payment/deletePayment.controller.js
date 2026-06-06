import Payment from "../../models/payment.model.schema.js";

const deletePayment = async (req, res) => {
  try {
    const paymentId = req.params.id;

    const payment = await Payment.findOne({
      _id: paymentId,
      isDeleted: false,
    });

    if (!payment) {
      return res.status(404).json({
        success: false,
        message: "No payment with this id exists",
      });
    }

    payment.isDeleted = true;
    payment.deletedAt = new Date();
    payment.deletedBy = req.user.userId;

    await payment.save();

    return res.status(200).json({
      success: true,
      message: "Payment deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Some error occurred",
      error: error.message,
    });
  }
};

export default deletePayment;
