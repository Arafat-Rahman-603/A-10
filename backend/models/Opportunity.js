const mongoose = require('mongoose');

const opportunitySchema = new mongoose.Schema({
  startup_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Startup',
    required: [true, 'Startup ID is required']
  },
  role_title: {
    type: String,
    required: [true, 'Role title is required'],
    trim: true,
    maxlength: [100, 'Role title cannot exceed 100 characters']
  },
  required_skills: {
    type: [String],
    required: [true, 'Required skills are needed'],
    validate: {
      validator: function (v) {
        return v.length > 0;
      },
      message: 'At least one skill is required'
    }
  },
  work_type: {
    type: String,
    required: [true, 'Work type is required'],
    enum: ['Remote', 'On-site', 'Hybrid']
  },
  commitment_level: {
    type: String,
    required: [true, 'Commitment level is required'],
    enum: ['Full-time', 'Part-time', 'Contract', 'Internship']
  },
  deadline: {
    type: Date,
    required: [true, 'Deadline is required']
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Opportunity', opportunitySchema);
