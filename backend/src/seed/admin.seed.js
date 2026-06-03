import user from "../models/user.model.js";

const seedAdmin = async () => {
  try {
    const adminExists = await user.findOne({
      email: process.env.ADMIN_EMAIL,
    });

    if (adminExists) {
      console.log("Admin already exists");
      return;
    }

    await user.create({
      name: process.env.ADMIN_NAME,
      phone: process.env.ADMIN_PHONE,
      email: process.env.ADMIN_EMAIL,
      password: process.env.ADMIN_PASSWORD,
      role: "admin",
    });

    console.log("Admin created successfully");
  } catch (error) {
    console.log("Error seeding admin:", error.message);
  }
};

export default seedAdmin;
