import user from "../../models/user.model.js";
import Membership from "../../models/membership.model.js";
import Payment from "../../models/payment.model.schema.js";
import plan from "../../models/plan.model.js";

const createMember = async (req, res) => {
  try {
    const {
      name,
      phone,
      gender,
      dateOfBirth,
      address,
      profileImage,
      planId,
      paymentAmount,
      paymentMethod,
      paymentNote,
    } =
      req.body || {};
    if (!name || !phone) {
      return res.status(400).json({
        success: false,
        message: "important details are missing",
      });
    }

    if (!/^\d{10}$/.test(phone)) {
      return res.status(400).json({
        success: false,
        message: "phone number must be exactly 10 digits",
      });
    }

    const isUserExist = await user.findOne({ phone });
    if (isUserExist) {
      return res.status(400).json({
        success: false,
        message: "user already exist with same credentials",
      });
    }

    let selectedPlan = null;
    const numericPaymentAmount = Number(paymentAmount || 0);

    if (planId) {
      selectedPlan = await plan.findOne({
        _id: planId,
        isDeleted: false,
      });

      if (!selectedPlan) {
        return res.status(404).json({
          success: false,
          message: "Plan not found",
        });
      }

      if (
        !Number.isFinite(numericPaymentAmount) ||
        numericPaymentAmount < 0 ||
        numericPaymentAmount > selectedPlan.price
      ) {
        return res.status(400).json({
          success: false,
          message: "Payment amount must be between 0 and plan price",
        });
      }
    }

    const newMember = await user.create({
      name,
      phone,
      gender,
      dateOfBirth,
      address,
      profileImage,
      password: phone,
      role: "member",
    });

    let newMembership = null;
    let newPayment = null;

    if (selectedPlan) {
      const startDate = new Date();
      const endDate = new Date(startDate);
      endDate.setDate(endDate.getDate() + selectedPlan.durationInDays);

      newMembership = await Membership.create({
        memberId: newMember._id,
        planId: selectedPlan._id,
        startDate,
        endDate,
        status: "active",
        createdBy: req.user.userId,
      });

      if (numericPaymentAmount > 0) {
        newPayment = await Payment.create({
          membershipId: newMembership._id,
          amount: numericPaymentAmount,
          paymentMethod,
          note: paymentNote,
          receivedBy: req.user.userId,
        });
      }
    }

    return res.status(201).json({
      success: true,
      message: "Member created successfully",
      data: {
        id: newMember._id,
        name: newMember.name,
        phone: newMember.phone,
        defaultPassword: phone,
        membership: newMembership,
        payment: newPayment,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Something went wrong",
      error: error.message,
    });
  }
};
export default createMember;
