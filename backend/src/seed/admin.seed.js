import bcrypt from "bcryptjs";
import user from "../models/user.model.js";

const ADMIN_EMAIL = process.env.ADMIN_EMAIL || "admin@fitsuite.com";
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "admin123";
const ADMIN_NAME = process.env.ADMIN_NAME || "Admin";
const ADMIN_PHONE = process.env.ADMIN_PHONE || "0000000000";

const seedAdmin = async () => {
  try {
    let admin = await user.findOne({ role: "admin", isDeleted: false });

    if (admin) {
      admin.email = ADMIN_EMAIL;
      admin.name = ADMIN_NAME;
      admin.phone = ADMIN_PHONE;
      const isMatch = await bcrypt.compare(ADMIN_PASSWORD, admin.password);
      if (!isMatch) {
        admin.password = ADMIN_PASSWORD;
      }
      await admin.save();
      console.log("Admin synced");
      return;
    }

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
