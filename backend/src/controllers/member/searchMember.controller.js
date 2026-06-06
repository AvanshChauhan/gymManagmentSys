import user from "../../models/user.model.js";
import { buildPaginationMeta, getPagination } from "../../utils/pagination.js";

const searchMembers = async (req, res) => {
  try {
    const { page, limit, skip } = getPagination(req.query);
    const search = (req.query.q || req.query.search || "").trim();

    const filter = {
      role: "member",
      isDeleted: false,
    };

    if (search) {
      const searchRegex = new RegExp(search, "i");
      filter.$or = [
        { name: searchRegex },
        { phone: searchRegex },
        { email: searchRegex },
        { address: searchRegex },
      ];
    }

    const [members, total] = await Promise.all([
      user
        .find(filter)
        .select("-password")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      user.countDocuments(filter),
    ]);

    return res.status(200).json({
      success: true,
      count: members.length,
      pagination: buildPaginationMeta(page, limit, total),
      data: members,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

export default searchMembers;
