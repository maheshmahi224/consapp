const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: true
  },
  phone: {
    type: String,
    required: true
  },
  year: {
    type: String,
    required: true
  },
  department: {
    type: String,
    default: ''
  },
  college: {
    type: String,
    required: true
  },
  dateOfJoining: {
    type: Date,
    default: Date.now
  },
  github: {
    type: String,
    default: ''
  },
  leetcode: {
    type: String,
    default: ''
  },
  hackerrank: {
    type: String,
    default: ''
  },
  linkedin: {
    type: String,
    default: ''
  },
  resume: {
    type: String,
    default: ''
  },
  passionateAbout: {
    type: String,
    default: ''
  },
  amountPaidDates: [{
    amount: Number,
    date: Date,
    paymentMode: String
  }],
  role: {
    type: String,
    enum: ['student', 'admin'],
    default: 'student'
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('User', userSchema);
