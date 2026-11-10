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
    resourceId: {
      type: String,
      required: true,
    },
    reportType: {
      type: String,
      enum: ['broken_link', 'outdated_content', 'typo_or_error', 'other'],
      default: 'broken_link',
      index: true,
    },
    message: {
      type: String,
      required: [true, 'Report message is required'],
      trim: true,
      maxlength: [1000, 'Message cannot exceed 1000 characters'],
    },
    status: {
      type: String,
      enum: ['open', 'resolved'],
      default: 'open',
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

problemReportSchema.index({ status: 1, createdAt: -1 });

module.exports = mongoose.model('ProblemReport', problemReportSchema);
