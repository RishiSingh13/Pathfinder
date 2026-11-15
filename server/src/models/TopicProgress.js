const mongoose = require('mongoose');

const topicProgressSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    topicId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Topic',
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
      enum: ['in_progress', 'completed', 'already_know'],
      default: 'in_progress',
      index: true,
    },
    completedAt: {
      type: Date,
      default: null,
    },
    lastViewedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

// One progress record per user and topic; efficient roadmap progress filtering
topicProgressSchema.index({ userId: 1, topicId: 1 }, { unique: true });
topicProgressSchema.index({ userId: 1, roadmapId: 1 });

module.exports = mongoose.model('TopicProgress', topicProgressSchema);
