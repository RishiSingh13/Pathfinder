const mongoose = require('mongoose');

const roadmapSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Roadmap title is required'],
      trim: true,
      maxlength: [120, 'Title cannot exceed 120 characters'],
    },
    slug: {
      type: String,
      required: [true, 'Slug is required'],
      unique: true,
      lowercase: true,
      trim: true,
    },
    outcome: {
      type: String,
      required: [true, 'Expected outcome is required'],
      trim: true,
    },
    level: {
      type: String,
      enum: ['Beginner', 'Intermediate', 'Advanced', 'All Levels'],
      default: 'Beginner',
      index: true,
    },
    prerequisites: {
      type: [String],
      default: [],
    },
    estimatedHours: {
      type: Number,
      required: true,
      min: 1,
    },
    weeklyPaceHours: {
      type: Number,
      default: 5,
      min: 1,
      max: 60,
    },
    orderedPhaseTitles: {
      type: [String],
      default: [],
    },
    status: {
      type: String,
      enum: ['draft', 'published', 'archived'],
      default: 'draft',
      index: true,
    },
    curator: {
      type: String,
      default: 'Curriculum Team',
    },
    lastReviewedDate: {
      type: String,
      default: () => new Date().toISOString().split('T')[0],
    },
    intendedAudience: {
      type: String,
      default: '',
    },
    whatIsOutOfScope: {
      type: [String],
      default: [],
    },
    resourceMix: {
      type: [String],
      default: ['Interactive Exercises', 'Documentation', 'Guided Practice'],
    },
    languages: {
      type: [String],
      default: ['English'],
    },
    sampleTopicKey: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Roadmap', roadmapSchema);
