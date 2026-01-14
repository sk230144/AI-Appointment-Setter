// Dashboard controller - provides statistics and overview data
const appointmentService = require('../services/appointmentService');
const Appointment = require('../models/Appointment');

/**
 * Get dashboard statistics
 * GET /api/dashboard/stats
 */
async function getDashboardStats(req, res) {
  try {
    console.log('📊 GET /api/dashboard/stats');

    const stats = await appointmentService.getAppointmentStats();

    // Get recent appointments
    const recentAppointments = await Appointment.find({ status: 'scheduled' })
      .sort({ createdAt: -1 })
      .limit(5)
      .lean();

    // Get today's appointments
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const todayAppointmentsList = await Appointment.find({
      appointmentDate: { $gte: today, $lt: tomorrow },
      status: 'scheduled',
    })
      .sort({ appointmentTime: 1 })
      .lean();

    console.log('✅ Dashboard statistics compiled');

    res.status(200).json({
      success: true,
      data: {
        statistics: stats,
        recentAppointments,
        todayAppointments: todayAppointmentsList,
      },
    });
  } catch (error) {
    console.error('❌ Error in getDashboardStats:', error.message);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch dashboard statistics',
      message: error.message,
    });
  }
}

/**
 * Get appointment trends (for charts/graphs)
 * GET /api/dashboard/trends?days=7
 */
async function getAppointmentTrends(req, res) {
  try {
    const { days = 7 } = req.query;
    console.log(`📈 GET /api/dashboard/trends?days=${days}`);

    const daysCount = parseInt(days);
    if (isNaN(daysCount) || daysCount < 1 || daysCount > 90) {
      console.error('❌ Invalid days parameter');
      return res.status(400).json({
        success: false,
        error: 'Days parameter must be between 1 and 90',
      });
    }

    const startDate = new Date();
    startDate.setDate(startDate.getDate() - daysCount);
    startDate.setHours(0, 0, 0, 0);

    // Get appointments grouped by date
    const appointments = await Appointment.aggregate([
      {
        $match: {
          appointmentDate: { $gte: startDate },
        },
      },
      {
        $group: {
          _id: {
            date: { $dateToString: { format: '%Y-%m-%d', date: '$appointmentDate' } },
            status: '$status',
          },
          count: { $sum: 1 },
        },
      },
      {
        $sort: { '_id.date': 1 },
      },
    ]);

    // Format the data
    const trendData = {};
    appointments.forEach(item => {
      const date = item._id.date;
      if (!trendData[date]) {
        trendData[date] = {
          date,
          scheduled: 0,
          completed: 0,
          cancelled: 0,
          no_show: 0,
        };
      }
      trendData[date][item._id.status] = item.count;
    });

    const trends = Object.values(trendData);

    console.log(`✅ Returning trends for ${daysCount} days`);

    res.status(200).json({
      success: true,
      data: trends,
    });
  } catch (error) {
    console.error('❌ Error in getAppointmentTrends:', error.message);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch appointment trends',
      message: error.message,
    });
  }
}

module.exports = {
  getDashboardStats,
  getAppointmentTrends,
};
