const Application = require('../models/Application');
const Opportunity = require('../models/Opportunity');
const Startup = require('../models/Startup');
const { AppError } = require('../middleware/errorHandler');



exports.apply = async (req, res, next) => {
  try {
    const { opportunity_id, portfolio_link, motivation } = req.body;

    
    const opportunity = await Opportunity.findById(opportunity_id);
    if (!opportunity) {
      throw new AppError('Opportunity not found', 404);
    }

    
    if (new Date(opportunity.deadline) < new Date()) {
      throw new AppError('Application deadline has passed', 400);
    }

    
    const existingApp = await Application.findOne({
      opportunity_id,
      applicant_email: req.user.email
    });
    if (existingApp) {
      throw new AppError('You have already applied to this opportunity', 400);
    }

    const application = await Application.create({
      opportunity_id,
      applicant_email: req.user.email,
      portfolio_link,
      motivation
    });

    res.status(201).json({
      success: true,
      message: 'Application submitted successfully',
      application
    });
  } catch (error) {
    next(error);
  }
};



exports.getMyApplications = async (req, res, next) => {
  try {
    const applications = await Application.find({
      applicant_email: req.user.email
    })
      .populate({
        path: 'opportunity_id',
        populate: {
          path: 'startup_id',
          model: 'Startup'
        }
      })
      .sort({ applied_at: -1 });

    res.status(200).json({
      success: true,
      count: applications.length,
      applications
    });
  } catch (error) {
    next(error);
  }
};



exports.getFounderApplications = async (req, res, next) => {
  try {
    
    const startup = await Startup.findOne({ founder_email: req.user.email });
    if (!startup) {
      return res.status(200).json({
        success: true,
        count: 0,
        applications: []
      });
    }

    
    const opportunities = await Opportunity.find({ startup_id: startup._id });
    const opportunityIds = opportunities.map(o => o._id);

    
    const applications = await Application.find({
      opportunity_id: { $in: opportunityIds }
    })
      .populate('opportunity_id')
      .sort({ applied_at: -1 });

    res.status(200).json({
      success: true,
      count: applications.length,
      applications
    });
  } catch (error) {
    next(error);
  }
};



exports.acceptApplication = async (req, res, next) => {
  try {
    const application = await Application.findById(req.params.id)
      .populate({
        path: 'opportunity_id',
        populate: { path: 'startup_id' }
      });

    if (!application) {
      throw new AppError('Application not found', 404);
    }

    
    if (application.opportunity_id.startup_id.founder_email !== req.user.email) {
      throw new AppError('Not authorized', 403);
    }

    application.status = 'accepted';
    await application.save();

    res.status(200).json({
      success: true,
      message: 'Application accepted',
      application
    });
  } catch (error) {
    next(error);
  }
};



exports.rejectApplication = async (req, res, next) => {
  try {
    const application = await Application.findById(req.params.id)
      .populate({
        path: 'opportunity_id',
        populate: { path: 'startup_id' }
      });

    if (!application) {
      throw new AppError('Application not found', 404);
    }

    
    if (application.opportunity_id.startup_id.founder_email !== req.user.email) {
      throw new AppError('Not authorized', 403);
    }

    application.status = 'rejected';
    await application.save();

    res.status(200).json({
      success: true,
      message: 'Application rejected',
      application
    });
  } catch (error) {
    next(error);
  }
};
