const Startup = require('../models/Startup');
const Opportunity = require('../models/Opportunity');
const Application = require('../models/Application');
const { AppError } = require('../middleware/errorHandler');



exports.createStartup = async (req, res, next) => {
  try {
    const { startup_name, logo, industry, description, funding_stage } = req.body;

    
    const existing = await Startup.findOne({ founder_email: req.user.email });
    if (existing) {
      throw new AppError('You already have a startup. Update or delete it first.', 400);
    }

    const startup = await Startup.create({
      startup_name,
      logo,
      industry,
      description,
      funding_stage,
      founder_email: req.user.email
    });

    res.status(201).json({
      success: true,
      message: 'Startup created successfully. Pending admin approval.',
      startup
    });
  } catch (error) {
    next(error);
  }
};



exports.getAllStartups = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 9;
    const skip = (page - 1) * limit;
    const search = req.query.search || '';

    let query = { status: 'approved' };

    if (search) {
      query.$or = [
        { startup_name: { $regex: search, $options: 'i' } },
        { industry: { $regex: search, $options: 'i' } }
      ];
    }

    const total = await Startup.countDocuments(query);
    const startups = await Startup.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    res.status(200).json({
      success: true,
      count: startups.length,
      total,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      startups
    });
  } catch (error) {
    next(error);
  }
};



exports.getAllStartupsAdmin = async (req, res, next) => {
  try {
    const startups = await Startup.find().sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: startups.length,
      startups
    });
  } catch (error) {
    next(error);
  }
};



exports.getStartup = async (req, res, next) => {
  try {
    const startup = await Startup.findById(req.params.id);

    if (!startup) {
      throw new AppError('Startup not found', 404);
    }

    res.status(200).json({
      success: true,
      startup
    });
  } catch (error) {
    next(error);
  }
};



exports.getMyStartup = async (req, res, next) => {
  try {
    const startup = await Startup.findOne({ founder_email: req.user.email });

    res.status(200).json({
      success: true,
      startup: startup || null
    });
  } catch (error) {
    next(error);
  }
};



exports.updateStartup = async (req, res, next) => {
  try {
    let startup = await Startup.findById(req.params.id);

    if (!startup) {
      throw new AppError('Startup not found', 404);
    }

    
    if (startup.founder_email !== req.user.email && req.user.role !== 'admin') {
      throw new AppError('Not authorized to update this startup', 403);
    }

    startup = await Startup.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    res.status(200).json({
      success: true,
      message: 'Startup updated successfully',
      startup
    });
  } catch (error) {
    next(error);
  }
};



exports.deleteStartup = async (req, res, next) => {
  try {
    const startup = await Startup.findById(req.params.id);

    if (!startup) {
      throw new AppError('Startup not found', 404);
    }

    
    if (startup.founder_email !== req.user.email && req.user.role !== 'admin') {
      throw new AppError('Not authorized to delete this startup', 403);
    }

    
    const opportunities = await Opportunity.find({ startup_id: startup._id });
    const opportunityIds = opportunities.map(o => o._id);
    
    await Application.deleteMany({ opportunity_id: { $in: opportunityIds } });
    await Opportunity.deleteMany({ startup_id: startup._id });
    await Startup.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Startup and all related data deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};



exports.approveStartup = async (req, res, next) => {
  try {
    const startup = await Startup.findByIdAndUpdate(
      req.params.id,
      { status: 'approved' },
      { new: true }
    );

    if (!startup) {
      throw new AppError('Startup not found', 404);
    }

    res.status(200).json({
      success: true,
      message: 'Startup approved successfully',
      startup
    });
  } catch (error) {
    next(error);
  }
};



exports.getFeaturedStartups = async (req, res, next) => {
  try {
    const startups = await Startup.find({ status: 'approved' })
      .sort({ createdAt: -1 })
      .limit(6);

    res.status(200).json({
      success: true,
      startups
    });
  } catch (error) {
    next(error);
  }
};
