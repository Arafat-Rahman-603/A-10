const User = require('../models/User');
const Startup = require('../models/Startup');
const Opportunity = require('../models/Opportunity');
const Application = require('../models/Application');
const Payment = require('../models/Payment');



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
          acceptedMembers: 0
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

    res.status(200).json({
      success: true,
      stats: {
        totalOpportunities: opportunities.length,
        totalApplications,
        acceptedMembers
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
