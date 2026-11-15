const mongoose = require('mongoose');

const moduleSchema = new mongoose.Schema(
  {
    roadmapId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Roadmap',
      required: true,
      index: true,
    },
    title: {
      type: String,
      required: [true, 'Module title is required'],
      trim: true,
      maxlength: [140, 'Module title must be under 140 characters'],
    },
    description: {
      type: String,
      default: '',
      trim: true,
    },
    phaseLabel: {
      type: String,
      required: [true, 'Phase label is required'],
      trim: true,
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
  },
  {
    timestamps: true,
  }
);

// Compound index for ordered modules within roadmap
moduleSchema.index({ roadmapId: 1, order: 1 });

module.exports = mongoose.model('Module', moduleSchema);
