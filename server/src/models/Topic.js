const mongoose = require('mongoose');

const resourceSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      required: true,
      default: 'Article',
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    url: {
      type: String,
      required: true,
      trim: true,
      match: [/^https?:\/\//i, 'Resource URL must start with http:// or https://'],
    },
    source: {
      type: String,
      default: '',
    },
    duration: {
      type: String,
      default: '20 mins',
    },
    language: {
      type: String,
      default: 'English',
    },
    level: {
      type: String,
      default: 'Beginner',
    },
    role: {
      type: String,
      enum: ['primary', 'alternate', 'optional_reading'],
      default: 'primary',
    },
    reason: {
      type: String,
      default: '',
    },
    lastCheckedDate: {
      type: String,
      default: () => new Date().toISOString().split('T')[0],
    },
  },
  { _id: true }
);

const practiceItemSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      default: '',
    },
    type: {
      type: String,
      default: 'Coding Exercise',
    },
    difficulty: {
      type: String,
      enum: ['Easy', 'Medium', 'Hard'],
      default: 'Easy',
    },
    url: {
      type: String,
      required: true,
      trim: true,
    },
  },
  { _id: true }
);

const topicSchema = new mongoose.Schema(
  {
    moduleId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Module',
      required: true,
      index: true,
    },
    roadmapId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Roadmap',
      required: true,
      index: true,
    },
    title: {
      type: String,
      required: [true, 'Topic title is required'],
      trim: true,
    },
    key: {
      type: String,
      required: [true, 'Stable topic key is required'],
      trim: true,
    },
    objectives: {
      type: [String],
      default: [],
    },
    estimatedMinutes: {
      type: Number,
      required: true,
      default: 45,
      min: 1,
    },
    type: {
      type: String,
      enum: ['core', 'optional', 'stretch'],
      default: 'core',
      index: true,
    },
    buildsOnNote: {
      type: String,
      default: '',
    },
    order: {
      type: Number,
      required: true,
      default: 1,
    },
    status: {
      type: String,
      enum: ['draft', 'published', 'archived'],
      default: 'published',
      index: true,
    },
    lastVerifiedDate: {
      type: String,
      default: () => new Date().toISOString().split('T')[0],
    },
    resources: [resourceSchema],
    practiceItems: [practiceItemSchema],
  },
  {
    timestamps: true,
  }
);

// Compound indexes
topicSchema.index({ roadmapId: 1, order: 1 });
topicSchema.index({ moduleId: 1, order: 1 });
topicSchema.index({ roadmapId: 1, key: 1 }, { unique: true });

module.exports = mongoose.model('Topic', topicSchema);
