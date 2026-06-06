import Payment from "../../models/payment.model.schema.js";

const getRevenueDashboard = async (req, res) => {
  try {
    const { from, to } = req.query;
    const dateFilter = {};

    if (from) {
      dateFilter.$gte = new Date(from);
    }

    if (to) {
      const toDate = new Date(to);
      toDate.setHours(23, 59, 59, 999);
      dateFilter.$lte = toDate;
    }

    const match = {
      isDeleted: false,
      ...(Object.keys(dateFilter).length && { paymentDate: dateFilter }),
    };

    const [summary, byMethod, dailyRevenue, recentPayments] = await Promise.all(
      [
        Payment.aggregate([
          { $match: match },
          {
            $group: {
              _id: null,
              totalRevenue: { $sum: "$amount" },
              totalPayments: { $sum: 1 },
              averagePayment: { $avg: "$amount" },
            },
          },
        ]),
        Payment.aggregate([
          { $match: match },
          {
            $group: {
              _id: "$paymentMethod",
              totalRevenue: { $sum: "$amount" },
              totalPayments: { $sum: 1 },
            },
          },
          { $sort: { totalRevenue: -1 } },
        ]),
        Payment.aggregate([
          { $match: match },
          {
            $group: {
              _id: {
                $dateToString: {
                  format: "%Y-%m-%d",
                  date: "$paymentDate",
                },
              },
              totalRevenue: { $sum: "$amount" },
              totalPayments: { $sum: 1 },
            },
          },
          { $sort: { _id: 1 } },
        ]),
        Payment.find(match)
          .populate({
            path: "membershipId",
            populate: [
              { path: "memberId", select: "-password" },
              { path: "planId" },
            ],
          })
          .sort({ paymentDate: -1 })
          .limit(10),
      ]
    );

    const totals = summary[0] || {
      totalRevenue: 0,
      totalPayments: 0,
      averagePayment: 0,
    };

    return res.status(200).json({
      success: true,
      filters: {
        from: from || null,
        to: to || null,
      },
      data: {
        totalRevenue: totals.totalRevenue,
        totalPayments: totals.totalPayments,
        averagePayment: totals.averagePayment || 0,
        byMethod: byMethod.map((item) => ({
          paymentMethod: item._id,
          totalRevenue: item.totalRevenue,
          totalPayments: item.totalPayments,
        })),
        dailyRevenue: dailyRevenue.map((item) => ({
          date: item._id,
          totalRevenue: item.totalRevenue,
          totalPayments: item.totalPayments,
        })),
        recentPayments,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Some error occurred",
      error: error.message,
    });
  }
};

export default getRevenueDashboard;
