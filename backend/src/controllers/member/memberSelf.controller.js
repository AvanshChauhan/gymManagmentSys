import Membership from "../../models/membership.model.js";
import Payment from "../../models/payment.model.schema.js";
import user from "../../models/user.model.js";

const getActiveMembership = (memberId) =>
  Membership.findOne({
    memberId,
    isDeleted: false,
    status: { $in: ["active", "pending"] },
  })
    .sort({ endDate: -1 })
    .populate("planId")
    .populate("memberId", "-password");

const getMemberPayments = async (memberId) => {
  const memberships = await Membership.find({
    memberId,
    isDeleted: false,
  }).select("_id");

  return Payment.find({
    membershipId: { $in: memberships.map((membership) => membership._id) },
    isDeleted: false,
  })
    .sort({ paymentDate: -1 })
    .populate({
      path: "membershipId",
      populate: [{ path: "planId" }, { path: "memberId", select: "-password" }],
    });
};

export const getMyProfile = async (req, res) => {
  try {
    const member = await user.findById(req.user.userId).select("-password");

    if (!member) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    return res.status(200).json({ success: true, data: member });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Some error occurred",
      error: error.message,
    });
  }
};

export const updateMyProfile = async (req, res) => {
  try {
    const { name, phone, gender, dateOfBirth, profileImage, address, height, weight } =
      req.body;

    const member = await user
      .findByIdAndUpdate(
        req.user.userId,
        { name, phone, gender, dateOfBirth, profileImage, address, height, weight },
        { new: true, runValidators: true }
      )
      .select("-password");

    if (!member) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    return res.status(200).json({
      success: true,
      message: "Profile has been updated",
      data: member,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Some error occurred",
      error: error.message,
    });
  }
};

export const getMyMembership = async (req, res) => {
  try {
    const membership = await getActiveMembership(req.user.userId);

    return res.status(200).json({
      success: true,
      data: membership,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Some error occurred",
      error: error.message,
    });
  }
};

export const getMyPayments = async (req, res) => {
  try {
    const payments = await getMemberPayments(req.user.userId);

    return res.status(200).json({
      success: true,
      count: payments.length,
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

export const getMySummary = async (req, res) => {
  try {
    const [member, membership, payments] = await Promise.all([
      user.findById(req.user.userId).select("-password"),
      getActiveMembership(req.user.userId),
      getMemberPayments(req.user.userId),
    ]);

    const planPrice = membership?.planId?.price || 0;
    const totalPaid = payments
      .filter(
        (payment) =>
          payment.membershipId?._id?.toString() === membership?._id?.toString()
      )
      .reduce((sum, payment) => sum + (payment.amount || 0), 0);

    return res.status(200).json({
      success: true,
      data: {
        member,
        membership,
        plan: membership?.planId || null,
        pendingAmount: Math.max(planPrice - totalPaid, 0),
        totalPaid,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Some error occurred",
      error: error.message,
    });
  }
};
