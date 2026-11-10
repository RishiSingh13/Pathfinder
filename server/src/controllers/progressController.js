const Enrolment = require('../models/Enrolment');
const TopicProgress = require('../models/TopicProgress');
const Roadmap = require('../models/Roadmap');
const Topic = require('../models/Topic');
const { calculateRoadmapProgress } = require('../services/progressCalculator');
const { sendSuccess, sendError } = require('../utils/responseEnvelope');

/**
 * Enroll or reactivate an enrollment in a published roadmap
 */
async function enroll(req, res, next) {
  try {
    const { slug } = req.params;
    const { weeklyHours, targetDate } = req.body || {};

    const roadmap = await Roadmap.findOne({ slug: slug.toLowerCase(), status: 'published' });
    if (!roadmap) {
      return sendError(
        res,
        404,
        'NOT_FOUND',
        'Roadmap not found or unavailable for enrollment.',
        undefined,
        req
      );
    }

    let parsedHours = parseInt(weeklyHours, 10);
    if (!parsedHours || parsedHours < 1 || parsedHours > 60) {
      parsedHours = roadmap.weeklyPaceHours || 5;
    }

    let enrolment = await Enrolment.findOne({
      userId: req.user._id,
      roadmapId: roadmap._id,
    });

    if (enrolment) {
      // Reactivate archived enrollment without erasing progress
      enrolment.status = 'active';
      enrolment.weeklyHours = parsedHours;
      if (targetDate) enrolment.targetDate = new Date(targetDate);
      enrolment.lastActivity = new Date();
      await enrolment.save();
    } else {
      enrolment = await Enrolment.create({
        userId: req.user._id,
        roadmapId: roadmap._id,
        status: 'active',
        weeklyHours: parsedHours,
        targetDate: targetDate ? new Date(targetDate) : null,
        lastActivity: new Date(),
      });
    }

    // Calculate initial progress metrics
    const topics = await Topic.find({ roadmapId: roadmap._id, status: 'published' }).sort({ order: 1 });
    const progressRecords = await TopicProgress.find({ userId: req.user._id, roadmapId: roadmap._id });
    const metrics = calculateRoadmapProgress(topics, progressRecords);

    return sendSuccess(res, 200, {
      enrolment: {
        id: enrolment._id.toString(),
        roadmapId: roadmap._id.toString(),
        slug: roadmap.slug,
        title: roadmap.title,
        status: enrolment.status,
        weeklyHours: enrolment.weeklyHours,
        targetDate: enrolment.targetDate,
        lastActivity: enrolment.lastActivity,
      },
      metrics,
    });
  } catch (err) {
    next(err);
  }
}

/**
 * Update enrollment settings (weekly study hours, target date)
 */
async function updateEnrolment(req, res, next) {
  try {
    const { slug } = req.params;
    const { weeklyHours, targetDate } = req.body || {};

    const roadmap = await Roadmap.findOne({ slug: slug.toLowerCase() });
    if (!roadmap) {
      return sendError(res, 404, 'NOT_FOUND', 'Roadmap not found.', undefined, req);
    }

    const enrolment = await Enrolment.findOne({
      userId: req.user._id,
      roadmapId: roadmap._id,
      status: 'active',
    });

    if (!enrolment) {
      return sendError(
        res,
        404,
        'NOT_FOUND',
        'You do not have an active enrollment in this roadmap.',
        undefined,
        req
      );
    }

    if (weeklyHours !== undefined) {
      const parsedHours = parseInt(weeklyHours, 10);
      if (isNaN(parsedHours) || parsedHours < 1 || parsedHours > 60) {
        return sendError(
          res,
          400,
          'VALIDATION_ERROR',
          'Weekly study pace must be an integer between 1 and 60 hours.',
          [{ path: 'weeklyHours', message: 'Value must be between 1 and 60.' }],
          req
        );
      }
      enrolment.weeklyHours = parsedHours;
    }

    if (targetDate !== undefined) {
      enrolment.targetDate = targetDate ? new Date(targetDate) : null;
    }

    enrolment.lastActivity = new Date();
    await enrolment.save();

    return sendSuccess(res, 200, {
      enrolment: {
        id: enrolment._id.toString(),
        slug: roadmap.slug,
        title: roadmap.title,
        weeklyHours: enrolment.weeklyHours,
        targetDate: enrolment.targetDate,
        status: enrolment.status,
      },
    });
  } catch (err) {
    next(err);
  }
}

/**
 * Archive an enrollment (preserves completed topic progress)
 */
async function unenroll(req, res, next) {
  try {
    const { slug } = req.params;

    const roadmap = await Roadmap.findOne({ slug: slug.toLowerCase() });
    if (!roadmap) {
      return sendError(res, 404, 'NOT_FOUND', 'Roadmap not found.', undefined, req);
    }

    const enrolment = await Enrolment.findOne({
      userId: req.user._id,
      roadmapId: roadmap._id,
    });

    if (!enrolment || enrolment.status === 'archived') {
      return sendError(
        res,
        400,
        'BAD_REQUEST',
        'You are not currently enrolled in this roadmap.',
        undefined,
        req
      );
    }

    enrolment.status = 'archived';
    enrolment.lastActivity = new Date();
    await enrolment.save();

    return sendSuccess(res, 200, {
      status: 'archived',
      message: `Enrolment for "${roadmap.title}" has been archived. Your completed progress has been preserved.`,
    });
  } catch (err) {
    next(err);
  }
}

/**
 * Set topic progress status (in_progress, completed, already_know, not_started)
 */
async function setTopicProgress(req, res, next) {
  try {
    const { slug, topicKey } = req.params;
    const { status } = req.body || {};

    const validStatuses = ['in_progress', 'completed', 'already_know', 'not_started'];
    if (!validStatuses.includes(status)) {
      return sendError(
        res,
        400,
        'VALIDATION_ERROR',
        `Topic status must be one of: ${validStatuses.join(', ')}`,
        [{ path: 'status', message: `Invalid status "${status}".` }],
        req
      );
    }

    const roadmap = await Roadmap.findOne({ slug: slug.toLowerCase() });
    if (!roadmap) {
      return sendError(res, 404, 'NOT_FOUND', 'Roadmap not found.', undefined, req);
    }

    const topic = await Topic.findOne({ roadmapId: roadmap._id, key: topicKey });
    if (!topic) {
      return sendError(res, 404, 'NOT_FOUND', 'Topic not found in this roadmap.', undefined, req);
    }

    let progressRecord = await TopicProgress.findOne({
      userId: req.user._id,
      topicId: topic._id,
    });

    let currentRecord = null;

    if (status === 'not_started') {
      // Removing progress record resets topic to unstarted
      if (progressRecord) {
        await TopicProgress.findByIdAndDelete(progressRecord._id);
      }
    } else {
      if (!progressRecord) {
        progressRecord = new TopicProgress({
          userId: req.user._id,
          topicId: topic._id,
          roadmapId: roadmap._id,
          status,
          completedAt: (status === 'completed' || status === 'already_know') ? new Date() : null,
          lastViewedAt: new Date(),
        });
      } else {
        progressRecord.status = status;
        progressRecord.lastViewedAt = new Date();
        if (status === 'completed' || status === 'already_know') {
          if (!progressRecord.completedAt) progressRecord.completedAt = new Date();
        } else {
          progressRecord.completedAt = null;
        }
      }
      await progressRecord.save();
      currentRecord = {
        id: progressRecord._id.toString(),
        topicId: topic._id.toString(),
        status: progressRecord.status,
        completedAt: progressRecord.completedAt,
        lastViewedAt: progressRecord.lastViewedAt,
      };
    }

    // Touch enrollment activity
    await Enrolment.findOneAndUpdate(
      { userId: req.user._id, roadmapId: roadmap._id, status: 'active' },
      {
        $set: {
          lastActivity: new Date(),
          lastTopicId: topic._id,
        },
      }
    );

    // Recompute roadmap progress metrics
    const allPublishedTopics = await Topic.find({
      roadmapId: roadmap._id,
      status: 'published',
    }).sort({ order: 1 });

    const allUserProgress = await TopicProgress.find({
      userId: req.user._id,
      roadmapId: roadmap._id,
    });

    const metrics = calculateRoadmapProgress(allPublishedTopics, allUserProgress);

    return sendSuccess(res, 200, {
      topicKey: topic.key,
      status,
      topicProgress: currentRecord,
      metrics,
    });
  } catch (err) {
    next(err);
  }
}

/**
 * Learner Dashboard summary and active enrollments
 */
async function getDashboard(req, res, next) {
  try {
    const userId = req.user._id;

    const activeEnrolments = await Enrolment.find({
      userId,
      status: 'active',
    })
      .populate('roadmapId')
      .sort({ lastActivity: -1 });

    const enrolledRoadmaps = [];
    const allRecentlyTouched = [];

    let totalCoreTopicsCompleted = 0;
    let totalRemainingHours = 0;
    let completedRoadmapsCount = 0;

    for (const enrolment of activeEnrolments) {
      const roadmap = enrolment.roadmapId;
      if (!roadmap || roadmap.status === 'archived') continue;

      const topics = await Topic.find({
        roadmapId: roadmap._id,
        status: 'published',
      }).sort({ order: 1 });

      const progressRecords = await TopicProgress.find({
        userId,
        roadmapId: roadmap._id,
      });

      const metrics = calculateRoadmapProgress(topics, progressRecords);

      totalCoreTopicsCompleted += metrics.completedCoreCount;
      totalRemainingHours += metrics.remainingHours;
      if (metrics.isCompleted) completedRoadmapsCount++;

      enrolledRoadmaps.push({
        id: enrolment._id.toString(),
        weeklyHours: enrolment.weeklyHours,
        targetDate: enrolment.targetDate,
        lastActivity: enrolment.lastActivity,
        roadmap: {
          id: roadmap._id.toString(),
          title: roadmap.title,
          slug: roadmap.slug,
          level: roadmap.level,
          outcome: roadmap.outcome,
          curator: roadmap.curator,
          totalHours: roadmap.estimatedHours,
          weeklyPaceHours: roadmap.weeklyPaceHours || 5,
        },
        metrics,
      });

      metrics.recentlyTouched.forEach((item) => {
        allRecentlyTouched.push({
          ...item,
          roadmapTitle: roadmap.title,
          roadmapSlug: roadmap.slug,
        });
      });
    }

    allRecentlyTouched.sort((a, b) => new Date(b.lastViewedAt) - new Date(a.lastViewedAt));

    return sendSuccess(res, 200, {
      enrolments: enrolledRoadmaps,
      recentlyTouched: allRecentlyTouched.slice(0, 5),
      summary: {
        totalEnrolled: enrolledRoadmaps.length,
        completedRoadmaps: completedRoadmapsCount,
        totalCoreTopicsCompleted,
        totalRemainingHours: Number(totalRemainingHours.toFixed(1)),
      },
    });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  enroll,
  updateEnrolment,
  unenroll,
  setTopicProgress,
  getDashboard,
};
