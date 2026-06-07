import bcrypt from "bcryptjs";
import user from "../models/user.model.js";

const ADMIN_EMAIL = process.env.ADMIN_EMAIL || "admin@fitsuite.com";
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "admin123";
const ADMIN_NAME = process.env.ADMIN_NAME || "Admin";
const ADMIN_PHONE = process.env.ADMIN_PHONE || "0000000000";

const seedAdmin = async () => {
  try {
    const existing = await user.findOne({ email: ADMIN_EMAIL });

    if (existing) {
      existing.name = ADMIN_NAME;
      existing.phone = ADMIN_PHONE;
      const match = await bcrypt.compare(ADMIN_PASSWORD, existing.password);
      if (!match) existing.password = ADMIN_PASSWORD;
      await existing.save();
      console.log("Admin synced");
      return;
    }

    await user.deleteMany({ role: "admin" });

    await user.create({
      name: ADMIN_NAME,
      phone: ADMIN_PHONE,
      email: ADMIN_EMAIL,
      password: ADMIN_PASSWORD,
      role: "admin",
    });

    console.log("Admin created successfully");
  } catch (error) {
    console.log("Error seeding admin:", error.message);
  }
};

export default seedAdmin;
