const User = require('../models/User');
const Startup = require('../models/Startup');
const Opportunity = require('../models/Opportunity');
const Application = require('../models/Application');
const Payment = require('../models/Payment');


exports.getPublicStats = async (req, res, next) => {
  try {
    const [totalStartups, totalOpportunities, totalUsers, acceptedApplications] = await Promise.all([
      Startup.countDocuments({ status: 'approved' }),
      Opportunity.countDocuments(),
      User.countDocuments(),
      Application.countDocuments({ status: 'accepted' }),
    ]);

    res.status(200).json({
      success: true,
      stats: {
        totalStartups,
        totalOpportunities,
        totalUsers,
        acceptedApplications,
      }
    });
  } catch (error) {
    next(error);
  }
};



exports.getAdminStats = async (req, res, next) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalStartups = await Startup.countDocuments();
    const totalOpportunities = await Opportunity.countDocuments();
    
    const revenueResult = await Payment.aggregate([
      { $match: { payment_status: 'succeeded' } },
      { $group: { _id: null, total: { $sum: '$amount' } } }
    ]);
    const totalRevenue = revenueResult[0]?.total || 0;

    
    const monthlyUsers = await User.aggregate([
      {
        $group: {
          _id: { $month: '$createdAt' },
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    const monthlyStartups = await Startup.aggregate([
      {
        $group: {
          _id: { $month: '$createdAt' },
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    res.status(200).json({
      success: true,
      stats: {
        totalUsers,
        totalStartups,
        totalOpportunities,
        totalRevenue,
        monthlyUsers,
        monthlyStartups
      }
    });
  } catch (error) {
    next(error);
  }
};



exports.getFounderStats = async (req, res, next) => {
  try {
    const startup = await Startup.findOne({ founder_email: req.user.email });

    if (!startup) {
      return res.status(200).json({
        success: true,
        stats: {
          totalOpportunities: 0,
          totalApplications: 0,
          acceptedMembers: 0,
          pendingApplications: 0,
          rejectedApplications: 0,
          applicationsOverTime: []
        }
      });
    }

    const opportunities = await Opportunity.find({ startup_id: startup._id });
    const opportunityIds = opportunities.map(o => o._id);

    const totalApplications = await Application.countDocuments({
      opportunity_id: { $in: opportunityIds }
    });

    const acceptedMembers = await Application.countDocuments({
      opportunity_id: { $in: opportunityIds },
      status: 'accepted'
    });

    const pendingApplications = await Application.countDocuments({
      opportunity_id: { $in: opportunityIds },
      status: 'pending'
    });

    const rejectedApplications = await Application.countDocuments({
      opportunity_id: { $in: opportunityIds },
      status: 'rejected'
    });

    const applicationsOverTimeRaw = await Application.aggregate([
      {
        $match: {
          opportunity_id: { $in: opportunityIds }
        }
      },
      {
        $group: {
          _id: {
            $dateToString: { format: "%Y-%m-%d", date: "$createdAt" }
          },
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    const applicationsOverTime = applicationsOverTimeRaw.map(item => ({
      name: item._id,
      value: item.count
    }));

    res.status(200).json({
      success: true,
      stats: {
        totalOpportunities: opportunities.length,
        totalApplications,
        acceptedMembers,
        pendingApplications,
        rejectedApplications,
        applicationsOverTime
      }
    });
  } catch (error) {
    next(error);
  }
};



exports.getCollaboratorStats = async (req, res, next) => {
  try {
    const totalApplications = await Application.countDocuments({
      applicant_email: req.user.email
    });

    const pendingApplications = await Application.countDocuments({
      applicant_email: req.user.email,
      status: 'pending'
    });

    const acceptedApplications = await Application.countDocuments({
      applicant_email: req.user.email,
      status: 'accepted'
    });

    res.status(200).json({
      success: true,
      stats: {
        totalApplications,
        pendingApplications,
        acceptedApplications
      }
    });
  } catch (error) {
    next(error);
  }
};
