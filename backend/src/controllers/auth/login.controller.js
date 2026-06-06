import user from "../../models/user.model.js";
import generateToken from "../../utils/generateToken.js";

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: "Email or phone and password are required",
      });
    }

    const loginId = email.trim();
    const existingUser = await user.findOne({
      $or: [{ email: loginId.toLowerCase() }, { phone: loginId }],
      isDeleted: false,
    });

    if (!existingUser) {
      return res.status(401).json({
        message: "Invalid credentials",
      });
    }

    const isMatch = await existingUser.comparePassword(password);

    if (!isMatch) {
      return res.status(401).json({
        message: "Invalid credentials",
      });
    }

    const token = generateToken(existingUser._id, existingUser.role);

    res.cookie("token", token, {
      httpOnly: true,
      secure: false,
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    const { password: pwd, ...userData } = existingUser.toObject();

    return res.status(200).json({
      message: "user logged in successfully",
      user: userData,
    });
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
};

export default login;
