import mongoose from "mongoose";
const paymentSchema = new mongoose.Schema(
  {
    membershipId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "membership",
      required: [true, "membership id is required"],
    },
    amount: {
      type: Number,
      min: [0, "amount can not be in negative"],
      required: [true, "amount is required"],
    },
    paymentMethod: {
      type: String,
      enum: ["cash", "upi"],
      default: "cash",
    },
    note: {
      type: String,
      trim: true,
      default: "",
    },

    paymentDate: {
      type: Date,
      default: Date.now,
    },
    receivedBy: {
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
  { timestamps: true }
);
const payment = mongoose.model("payment", paymentSchema);
export default payment;
