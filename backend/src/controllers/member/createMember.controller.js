import user from "../../models/user.model.js";
const createMember = async (req, res) => {
  try {
    const { name, phone, gender, dateOfBirth, address, profileImage } =
      req.body || {};
    if (!name || !phone) {
      return res.status(400).json({
        success: false,
        message: "important details are missing",
      });
    }

    if (!/^\d{10}$/.test(phone)) {
      return res.status(400).json({
        success: false,
        message: "phone number must be exactly 10 digits",
      });
    }

    const isUserExist = await user.findOne({ phone });
    if (isUserExist) {
      return res.status(400).json({
        success: false,
        message: "user already exist with same credentials",
      });
    }
    const newMember = await user.create({
      name,
      phone,
      gender,
      dateOfBirth,
      address,
      profileImage,
      password: phone,
      role: "member",
    });
    return res.status(201).json({
      success: true,
      message: "Member created successfully",
      data: {
        id: newMember._id,
        name: newMember.name,
        phone: newMember.phone,
        defaultPassword: phone,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Something went wrong",
      error: error.message,
    });
  }
};
export default createMember;
