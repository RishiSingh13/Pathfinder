const mongoose = require('mongoose');

const problemReportSchema = new mongoose.Schema(
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
    // Optional — when the report is about a specific resource within the topic
    resourceId: {
      type: String,
      default: null,
    },
    roadmapId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Roadmap',
      index: true,
    },
    reportType: {
      type: String,
      enum: ['broken_link', 'outdated_content', 'incorrect_info', 'missing_resource', 'other'],
      default: 'other',
      index: true,
    },
    // Reporter's optional description of the issue
    description: {
      type: String,
      default: '',
      trim: true,
      maxlength: [1000, 'Description cannot exceed 1000 characters'],
    },
    status: {
      type: String,
      enum: ['open', 'resolved', 'dismissed'],
      default: 'open',
      index: true,
    },
    resolvedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

problemReportSchema.index({ status: 1, createdAt: -1 });

module.exports = mongoose.model('ProblemReport', problemReportSchema);
