import user from "../models/user.model.js";

const seedAdmin = async () => {
  try {
    const adminEmail = process.env.ADMIN_EMAIL || "admin@fitsuite.com";
    const adminExists = await user.findOne({ email: adminEmail });

    if (adminExists) {
      console.log("Admin already exists");
      return;
    }

    await user.create({
      name: process.env.ADMIN_NAME || "Admin",
      phone: process.env.ADMIN_PHONE || "0000000000",
      email: adminEmail,
      password: process.env.ADMIN_PASSWORD || "admin123",
      role: "admin",
    });

    console.log("Admin created successfully");
  } catch (error) {
    console.log("Error seeding admin:", error.message);
  }
};

export default seedAdmin;
