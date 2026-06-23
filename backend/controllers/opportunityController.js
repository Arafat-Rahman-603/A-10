const Opportunity = require('../models/Opportunity');
const Startup = require('../models/Startup');
const Application = require('../models/Application');
const Payment = require('../models/Payment');
const { AppError } = require('../middleware/errorHandler');



exports.createOpportunity = async (req, res, next) => {
  try {
    const { startup_id, role_title, required_skills, work_type, commitment_level, deadline } = req.body;

    
    const startup = await Startup.findById(startup_id);
    if (!startup) {
      throw new AppError('Startup not found', 404);
    }
    if (startup.founder_email !== req.user.email) {
      throw new AppError('Not authorized. This is not your startup.', 403);
    }

    
    const count = await Opportunity.countDocuments({ startup_id });
    if (count >= 3) {
      
      const payment = await Payment.findOne({
        user_email: req.user.email,
        payment_status: 'succeeded'
      });
      if (!payment) {
        return res.status(402).json({
          success: false,
          message: 'Free limit reached. Please upgrade to premium to post more opportunities.',
          requiresPayment: true,
          currentCount: count
        });
      }
    }

    const opportunity = await Opportunity.create({
      startup_id,
      role_title,
      required_skills,
      work_type,
      commitment_level,
      deadline
    });

    res.status(201).json({
      success: true,
      message: 'Opportunity created successfully',
      opportunity
    });
  } catch (error) {
    next(error);
  }
};



exports.getAllOpportunities = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 9;
    const skip = (page - 1) * limit;
    const { search, skills, work_type, industry } = req.query;

    let matchStage = {};

    
    if (search) {
      matchStage.role_title = { $regex: search, $options: 'i' };
    }

    
    if (skills) {
      const skillsArray = skills.split(',').map(s => s.trim());
      matchStage.required_skills = {
        $elemMatch: {
          $regex: skillsArray.join('|'),
          $options: 'i'
        }
      };
    }

    
    if (work_type) {
      const workTypes = work_type.split(',');
      matchStage.work_type = { $in: workTypes };
    }

    
    let pipeline = [
      {
        $lookup: {
          from: 'startups',
          localField: 'startup_id',
          foreignField: '_id',
          as: 'startup'
        }
      },
      { $unwind: '$startup' },
      { $match: { 'startup.status': 'approved' } }
    ];

    
    if (industry) {
      const industries = industry.split(',');
      pipeline.push({
        $match: { 'startup.industry': { $in: industries } }
      });
    }

    
    if (Object.keys(matchStage).length > 0) {
      pipeline.push({ $match: matchStage });
    }

    
    pipeline.push({ $sort: { createdAt: -1 } });

    
    const countPipeline = [...pipeline, { $count: 'total' }];
    const countResult = await Opportunity.aggregate(countPipeline);
    const total = countResult[0]?.total || 0;

    
    pipeline.push({ $skip: skip });
    pipeline.push({ $limit: limit });

    const opportunities = await Opportunity.aggregate(pipeline);

    res.status(200).json({
      success: true,
      count: opportunities.length,
      total,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      opportunities
    });
  } catch (error) {
    next(error);
  }
};



exports.getOpportunity = async (req, res, next) => {
  try {
    const opportunity = await Opportunity.findById(req.params.id)
      .populate('startup_id');

    if (!opportunity) {
      throw new AppError('Opportunity not found', 404);
    }

    res.status(200).json({
      success: true,
      opportunity
    });
  } catch (error) {
    next(error);
  }
};



exports.getOpportunitiesByStartup = async (req, res, next) => {
  try {
    const opportunities = await Opportunity.find({
      startup_id: req.params.startupId
    }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: opportunities.length,
      opportunities
    });
  } catch (error) {
    next(error);
  }
};



exports.getMyOpportunities = async (req, res, next) => {
  try {
    const startup = await Startup.findOne({ founder_email: req.user.email });
    
    if (!startup) {
      return res.status(200).json({
        success: true,
        count: 0,
        opportunities: []
      });
    }

    const opportunities = await Opportunity.find({ startup_id: startup._id })
      .populate('startup_id')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: opportunities.length,
      opportunities
    });
  } catch (error) {
    next(error);
  }
};



exports.updateOpportunity = async (req, res, next) => {
  try {
    let opportunity = await Opportunity.findById(req.params.id).populate('startup_id');

    if (!opportunity) {
      throw new AppError('Opportunity not found', 404);
    }

    if (opportunity.startup_id.founder_email !== req.user.email) {
      throw new AppError('Not authorized to update this opportunity', 403);
    }

    opportunity = await Opportunity.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    res.status(200).json({
      success: true,
      message: 'Opportunity updated successfully',
      opportunity
    });
  } catch (error) {
    next(error);
  }
};



exports.deleteOpportunity = async (req, res, next) => {
  try {
    const opportunity = await Opportunity.findById(req.params.id).populate('startup_id');

    if (!opportunity) {
      throw new AppError('Opportunity not found', 404);
    }

    if (opportunity.startup_id.founder_email !== req.user.email && req.user.role !== 'admin') {
      throw new AppError('Not authorized to delete this opportunity', 403);
    }

    
    await Application.deleteMany({ opportunity_id: opportunity._id });
    await Opportunity.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Opportunity deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};



exports.getFeaturedOpportunities = async (req, res, next) => {
  try {
    const opportunities = await Opportunity.aggregate([
      {
        $lookup: {
          from: 'startups',
          localField: 'startup_id',
          foreignField: '_id',
          as: 'startup'
        }
      },
      { $unwind: '$startup' },
      { $match: { 'startup.status': 'approved' } },
      { $sort: { createdAt: -1 } },
      { $limit: 6 }
    ]);

    res.status(200).json({
      success: true,
      opportunities
    });
  } catch (error) {
    next(error);
  }
};
