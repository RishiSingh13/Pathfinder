const mongoose = require('mongoose');

const enrolmentSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    roadmapId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Roadmap',
      required: true,
      index: true,
    },
    status: {
      type: String,
      enum: ['active', 'archived'],
      default: 'active',
      index: true,
    },
    weeklyHours: {
      type: Number,
      default: 5,
      min: 1,
      max: 60,
    },
    targetDate: {
      type: Date,
      default: null,
    },
    lastActivity: {
      type: Date,
      default: Date.now,
    },
    lastTopicId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Topic',
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

// One enrolment per user and roadmap
enrolmentSchema.index({ userId: 1, roadmapId: 1 }, { unique: true });

module.exports = mongoose.model('Enrolment', enrolmentSchema);
