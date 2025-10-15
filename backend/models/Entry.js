const mongoose = require('mongoose');

const entrySchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  date: {
    type: Date,
    required: true,
    default: Date.now
  },
  timeDuration: {
    hours: {
      type: Number,
      default: 0
    },
    minutes: {
      type: Number,
      default: 0
    }
  },
  concepts: {
    type: String,
    default: ''
  },
  githubRepo: {
    type: String,
    default: ''
  },
  leetcodeLink: {
    type: String,
    default: ''
  },
  hackerrankLink: {
    type: String,
    default: ''
  },
  doubts: {
    type: String,
    default: ''
  },
  problemsPracticed: {
    type: String,
    default: ''
  },
  mood: {
    type: String,
    enum: ['Excellent', 'Good', 'Average', 'Poor'],
    default: 'Good'
  },
  learningType: {
    type: String,
    enum: ['Self-study', 'Peer-learning', 'Mentor-guided'],
    default: 'Self-study'
  },
  tag: {
    type: String,
    default: ''
  },
  screenshotUrl: {
    type: String,
    default: ''
  },
  adminRemarks: [{
    comment: String,
    addedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    date: {
      type: Date,
      default: Date.now
    }
  }]
}, {
  timestamps: true
});

// Index for faster queries
entrySchema.index({ userId: 1, date: -1 });

module.exports = mongoose.model('Entry', entrySchema);
