const mongoose = require('mongoose');

const sessionSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  task: {
    type: String,
    required: [true, 'Please provide a task description'],
    trim: true
  },
  duration: {
    type: Number,
    required: true,
    min: 0
  },
  mood: {
    type: String,
    enum: ['focused', 'calm', 'energized', 'distracted', 'tired', 'stressed'],
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  }
});

// Index for faster queries
sessionSchema.index({ user: 1, date: -1 });

module.exports = mongoose.model('Session', sessionSchema);
