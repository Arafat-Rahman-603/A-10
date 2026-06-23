const mongoose = require('mongoose');

const applicationSchema = new mongoose.Schema({
  opportunity_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Opportunity',
    required: [true, 'Opportunity ID is required']
  },
  applicant_email: {
    type: String,
    required: [true, 'Applicant email is required'],
    lowercase: true
  },
  portfolio_link: {
    type: String,
    default: ''
  },

  motivation: {
    type: String,
    required: [true, 'Motivation message is required'],
    maxlength: [1000, 'Motivation cannot exceed 1000 characters']
  },
  status: {
    type: String,
    enum: ['pending', 'accepted', 'rejected'],
    default: 'pending'
  },
  applied_at: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});


applicationSchema.index({ opportunity_id: 1, applicant_email: 1 }, { unique: true });

module.exports = mongoose.model('Application', applicationSchema);
