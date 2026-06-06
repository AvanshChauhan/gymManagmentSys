import user from "../../models/user.model.js";
import Membership from "../../models/membership.model.js";
import Payment from "../../models/payment.model.schema.js";

const deleteAnUser = async (req, res) => {
  try {
    const memberId = req.params.id;

    const member = await user.findById(memberId);

    if (!member) {
      return res.status(404).json({
        success: false,
        message: "No such user exists",
      });
    }

    const deletedAt = new Date();
    const deletedBy = req.user.userId;
    const memberships = await Membership.find({
      memberId,
      isDeleted: false,
    }).select("_id");
    const membershipIds = memberships.map((membership) => membership._id);

    member.isDeleted = true;
    member.deletedAt = deletedAt;
    member.deletedBy = deletedBy;

    await Promise.all([
      member.save(),
      Membership.updateMany(
        { _id: { $in: membershipIds } },
        {
          status: "cancelled",
          isDeleted: true,
          deletedAt,
          deletedBy,
        }
      ),
      Payment.updateMany(
        { membershipId: { $in: membershipIds }, isDeleted: false },
        {
          isDeleted: true,
          deletedAt,
          deletedBy,
        }
      ),
    ]);

    return res.status(200).json({
      success: true,
      message: "User, memberships, and payments deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Some error occurred",
      error: error.message,
    });
  }
};

export default deleteAnUser;
