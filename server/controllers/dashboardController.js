const Lead = require('../models/Lead');
const asyncHandler = require('../utils/asyncHandler');

/**
 * GET /api/dashboard/stats
 */
const getStats = asyncHandler(async (req, res) => {
  const statusCounts = await Lead.aggregate([
    { $group: { _id: '$status', count: { $sum: 1 } } },
  ]);

  const counts = { New: 0, Contacted: 0, Converted: 0 };
  statusCounts.forEach(({ _id, count }) => {
    if (_id in counts) counts[_id] = count;
  });

  const total = counts.New + counts.Contacted + counts.Converted;
  const conversionRate = total === 0 ? 0 : Number(((counts.Converted / total) * 100).toFixed(1));

  res.status(200).json({
    success: true,
    data: {
      total,
      new: counts.New,
      contacted: counts.Contacted,
      converted: counts.Converted,
      conversionRate,
    },
  });
});

module.exports = { getStats };
