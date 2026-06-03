import mongoose from "mongoose";
const planSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "plan is required"],
      trim: true,
      unique: true,
    },
    durationInDays: {
      type: Number,
      required: [true, "duration is required"],
      min: [1, "duration must be one day"],
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    price: {
      type: Number,
      required: [true, "price is required"],
      min: [0, "price cannot be negative"],
    },
    description: {
      type: String,
      trim: true,
      default: "",
    },
  },
  { timestamps: true },
);
const plan = mongoose.model("plan", planSchema);
export default plan;
