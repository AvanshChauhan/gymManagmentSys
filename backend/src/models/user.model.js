import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "name is required"],
      trim: true,
    },

    email: {
      type: String,
      // required: [true, "email is required"],
      trim: true,
      lowercase: true,
      match: [/^\S+@\S+\.\S+$/, "Please provide a valid email"],
    },

    phone: {
      type: String,
      required: [true, "phone number is required"],
      trim: true,
      unique: true,
      match: [/^\d{10}$/, "phone number must be exactly 10 digits"],
    },

    password: {
      type: String,
      required: [true, "password is required"],
      minlength: [6, "password must be at least 6 characters long"],
    },

    role: {
      type: String,
      enum: ["admin", "member"],
      default: "member",
    },

    gender: {
      type: String,
      enum: ["male", "female", "other"],
    },

    dateOfBirth: {
      type: Date,
    },

    height: {
      type: Number,
    },

    weight: {
      type: Number,
    },

    address: {
      type: String,
      trim: true,
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
    profileImage: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

userSchema.index(
  { email: 1 },
  {
    unique: true,
    partialFilterExpression: { email: { $type: "string" } },
  }
);

userSchema.pre("save", async function () {
  if (!this.isModified("password")) return;

  this.password = await bcrypt.hash(this.password, 10);
});

userSchema.methods.comparePassword = async function (password) {
  return bcrypt.compare(password, this.password);
};

const user = mongoose.model("user", userSchema);

export default user;
