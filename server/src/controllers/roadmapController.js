const Roadmap = require('../models/Roadmap');
const Module = require('../models/Module');
const Topic = require('../models/Topic');
const Enrolment = require('../models/Enrolment');
const TopicProgress = require('../models/TopicProgress');
const { calculateRoadmapProgress } = require('../services/progressCalculator');
const { sendSuccess, sendError } = require('../utils/responseEnvelope');

// Helper to escape user search input for safe regular expressions
function escapeRegex(str) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/**
 * Public roadmap catalogue with server-side search, filtering, and pagination
 */
async function getCatalogue(req, res, next) {
  try {
    const { search, level, page = 1, limit = 20 } = req.query;

    const query = { status: 'published' };

    // Apply level filter
    if (level && level !== 'All' && ['Beginner', 'Intermediate', 'Advanced', 'All Levels'].includes(level)) {
      query.level = level;
    }

    // Apply safe search filter
    if (search && typeof search === 'string' && search.trim().length > 0) {
      const sanitizedSearch = escapeRegex(search.trim());
      query.$or = [
        { title: { $regex: sanitizedSearch, $options: 'i' } },
        { outcome: { $regex: sanitizedSearch, $options: 'i' } },
        { curator: { $regex: sanitizedSearch, $options: 'i' } },
      ];
    }

    const pageNum = Math.max(1, parseInt(page, 10) || 1);
    const limitNum = Math.min(50, Math.max(1, parseInt(limit, 10) || 20));
    const skip = (pageNum - 1) * limitNum;

    const [total, roadmaps] = await Promise.all([
      Roadmap.countDocuments(query),
      Roadmap.find(query).sort({ createdAt: -1 }).skip(skip).limit(limitNum),
    ]);

    const catalogueItems = await Promise.all(
      roadmaps.map(async (rm) => {
        const [topicCount, coreTopicCount] = await Promise.all([
          Topic.countDocuments({ roadmapId: rm._id, status: 'published' }),
          Topic.countDocuments({ roadmapId: rm._id, status: 'published', type: 'core' }),
        ]);

        const weeklyPace = rm.weeklyPaceHours || 5;
        const estimatedWeeks = Math.ceil(rm.estimatedHours / weeklyPace);

        return {
          id: rm._id.toString(),
          title: rm.title,
          slug: rm.slug,
          outcome: rm.outcome,
          level: rm.level,
          prerequisites: rm.prerequisites,
          estimatedHours: rm.estimatedHours,
          weeklyPaceHours: weeklyPace,
          estimatedWeeks,
          topicCount,
          coreTopicCount,
          lastReviewedDate: rm.lastReviewedDate,
          curator: rm.curator,
        };
      })
    );

    return sendSuccess(
      res,
      200,
      { items: catalogueItems },
      {
        total,
        page: pageNum,
        limit: limitNum,
        totalPages: Math.ceil(total / limitNum) || 1,
      }
    );
  } catch (err) {
    next(err);
  }
}

/**
 * Public roadmap preview by unique slug
 */
async function getRoadmapPreview(req, res, next) {
  try {
    const { slug } = req.params;

    const query = { slug: slug.toLowerCase() };
    const isAdmin = req.user && req.user.role === 'admin';
    if (!isAdmin) {
      query.status = 'published';
    }

    const roadmap = await Roadmap.findOne(query);
    if (!roadmap) {
      return sendError(
        res,
        404,
        'NOT_FOUND',
        'Roadmap not found or has not been published yet.',
        undefined,
        req
      );
    }

    // Load published modules in order
    const moduleQuery = { roadmapId: roadmap._id };
    if (!isAdmin) moduleQuery.status = 'published';
    const modules = await Module.find(moduleQuery).sort({ order: 1 });

    // Load published topics in order
    const topicQuery = { roadmapId: roadmap._id };
    if (!isAdmin) topicQuery.status = 'published';
    const topics = await Topic.find(topicQuery).sort({ order: 1 });

    // Find sample topic for public overview preview
    let sampleTopic = null;
    if (roadmap.sampleTopicKey) {
      sampleTopic = topics.find((t) => t.key === roadmap.sampleTopicKey);
    }
    if (!sampleTopic && topics.length > 0) {
      sampleTopic = topics[0];
    }

    // Assemble ordered module outline
    const moduleOutlines = modules.map((m) => {
      const moduleTopics = topics.filter((t) => t.moduleId.toString() === m._id.toString());
      const totalMinutes = moduleTopics.reduce((acc, t) => acc + (t.estimatedMinutes || 0), 0);
      return {
        id: m._id.toString(),
        title: m.title,
        phaseLabel: m.phaseLabel,
        description: m.description,
        order: m.order,
        estimatedHours: Number((totalMinutes / 60).toFixed(1)),
        topics: moduleTopics.map((t) => ({
          id: t._id.toString(),
          key: t.key,
          title: t.title,
          type: t.type,
          estimatedMinutes: t.estimatedMinutes,
          order: t.order,
        })),
      };
    });

    const weeklyPace = roadmap.weeklyPaceHours || 5;
    const estimatedWeeks = Math.ceil(roadmap.estimatedHours / weeklyPace);

    // If user is authenticated, retrieve their enrollment and calculated progress
    let userEnrolment = null;
    let progressMetrics = null;

    if (req.user) {
      const enrolment = await Enrolment.findOne({
        userId: req.user._id,
        roadmapId: roadmap._id,
      });

      if (enrolment && enrolment.status === 'active') {
        userEnrolment = {
          id: enrolment._id.toString(),
          status: enrolment.status,
          weeklyHours: enrolment.weeklyHours,
          targetDate: enrolment.targetDate,
          lastActivity: enrolment.lastActivity,
        };

        const progressRecords = await TopicProgress.find({
          userId: req.user._id,
          roadmapId: roadmap._id,
        });

        progressMetrics = calculateRoadmapProgress(topics, progressRecords);
      }
    }

    return sendSuccess(res, 200, {
      roadmap: {
        id: roadmap._id.toString(),
        title: roadmap.title,
        slug: roadmap.slug,
        outcome: roadmap.outcome,
        level: roadmap.level,
        prerequisites: roadmap.prerequisites,
        estimatedHours: roadmap.estimatedHours,
        weeklyPaceHours: weeklyPace,
        estimatedWeeks,
        status: roadmap.status,
        curator: roadmap.curator,
        lastReviewedDate: roadmap.lastReviewedDate,
        intendedAudience: roadmap.intendedAudience,
        whatIsOutOfScope: roadmap.whatIsOutOfScope,
        resourceMix: roadmap.resourceMix,
        languages: roadmap.languages,
      },
      modules: moduleOutlines,
      sampleTopic: sampleTopic
        ? {
            id: sampleTopic._id.toString(),
            key: sampleTopic.key,
            title: sampleTopic.title,
            objectives: sampleTopic.objectives,
            estimatedMinutes: sampleTopic.estimatedMinutes,
            type: sampleTopic.type,
            resourceCount: (sampleTopic.resources || []).length,
          }
        : null,
      userEnrolment,
      progressMetrics,
    });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  getCatalogue,
  getRoadmapPreview,
};
