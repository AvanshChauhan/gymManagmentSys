import mongoose from "mongoose";
const membershipSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: [true, "userID is required"],
      ref: "user",
    },
    planId: {
      type: mongoose.Schema.Types.ObjectId,
      required: [true, "user id is required"],
      ref: "plan",
    },
    startDate: {
      type: Date,
      required: [true, "start date is rquired"],
    },
    endDate: {
      type: Date,
      required: [true, "end date is required"],
    },
    totalAmount: {
      type: Number,
      required: [true, "ammount is required"],
      min: [0, "ammount can not be in negative"],
    },
    paidAmount: {
      type: Number,
      default: 0,
      min: [0, "amount cannot be negative"],
    },
    status: {
      type: String,
      enum: ["active", "pending", "expired"],
      default: "pending",
    },
  },
  { timestamps: true }
);
const membership = mongoose.model("membership", membershipSchema);
export default membership;
