const mongoose = require('mongoose');

const startupSchema = new mongoose.Schema({
  startup_name: {
    type: String,
    required: [true, 'Startup name is required'],
    trim: true,
    maxlength: [100, 'Startup name cannot exceed 100 characters']
  },
  logo: {
    type: String,
    required: [true, 'Logo is required']
  },
  industry: {
    type: String,
    required: [true, 'Industry is required'],
    enum: [
      'Technology', 'Healthcare', 'Finance', 'Education',
      'E-commerce', 'AI/ML', 'SaaS', 'Social Media',
      'Gaming', 'CleanTech', 'FoodTech', 'Other'
    ]
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
    maxlength: [2000, 'Description cannot exceed 2000 characters']
  },
  funding_stage: {
    type: String,
    required: [true, 'Funding stage is required'],
    enum: ['Pre-seed', 'Seed', 'Series A', 'Series B', 'Series C', 'Bootstrapped']
  },
  founder_email: {
    type: String,
    required: [true, 'Founder email is required'],
    lowercase: true
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending'
  }
}, {
  timestamps: true
});


startupSchema.index({ startup_name: 'text', description: 'text' });

module.exports = mongoose.model('Startup', startupSchema);
