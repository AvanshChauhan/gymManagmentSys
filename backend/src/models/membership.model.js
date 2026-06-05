import mongoose from "mongoose";

const membershipSchema = new mongoose.Schema(
  {
    memberId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: [true, "Member id is required"],
    },

    planId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "plan",
      required: [true, "Plan id is required"],
    },

    startDate: {
      type: Date,
      required: [true, "Start date is required"],
    },

    endDate: {
      type: Date,
      required: [true, "End date is required"],
    },

    status: {
      type: String,
      enum: ["active", "pending", "expired", "cancelled"],
      default: "active",
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },

    isDeleted: {
      type: Boolean,
      default: false,
    },

    deletedAt: {
      type: Date,
      default: null,
    },

    deletedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

const Membership = mongoose.model("membership", membershipSchema);

export default Membership;