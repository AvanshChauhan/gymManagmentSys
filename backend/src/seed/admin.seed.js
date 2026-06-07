import bcrypt from "bcryptjs";
import user from "../models/user.model.js";

const ADMIN_EMAIL = process.env.ADMIN_EMAIL || "admin@fitsuite.com";
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "admin123";

const seedAdmin = async () => {
  try {
    const existing = await user.findOne({ email: ADMIN_EMAIL });

    if (existing) {
      const isMatch = await bcrypt.compare(ADMIN_PASSWORD, existing.password);
      if (!isMatch) {
        existing.password = ADMIN_PASSWORD;
        await existing.save();
        console.log("Admin password updated");
      } else {
        console.log("Admin already exists");
      }
      return;
    }

    await user.create({
      name: process.env.ADMIN_NAME || "Admin",
      phone: process.env.ADMIN_PHONE || "0000000000",
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
