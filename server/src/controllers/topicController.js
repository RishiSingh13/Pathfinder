const Topic = require('../models/Topic');
const Module = require('../models/Module');
const Roadmap = require('../models/Roadmap');
const TopicProgress = require('../models/TopicProgress');
const Enrolment = require('../models/Enrolment');
const { sendSuccess, sendError } = require('../utils/responseEnvelope');

/**
 * GET /api/v1/roadmaps/:slug/topics/:topicKey
 * Returns full topic detail including resources, practice items,
 * sibling navigation (prev/next), and the caller's progress status.
 *
 * IMPORTANT: This endpoint is strictly read-only.
 * It NEVER creates or mutates any TopicProgress record.
 */
async function getTopic(req, res, next) {
  try {
    const { slug, topicKey } = req.params;

    // Resolve roadmap — only published roadmaps are accessible via this route
    const roadmap = await Roadmap.findOne({ slug: slug.toLowerCase(), status: 'published' });
    if (!roadmap) {
      return sendError(res, 404, 'NOT_FOUND', 'Roadmap not found or not published.', undefined, req);
    }

    // Resolve topic by its stable key within this roadmap
    const topic = await Topic.findOne({
      roadmapId: roadmap._id,
      key: topicKey,
      status: 'published',
    });

    if (!topic) {
      return sendError(res, 404, 'NOT_FOUND', 'Topic not found in this roadmap.', undefined, req);
    }

    // Resolve the parent module for context labels
    const parentModule = await Module.findById(topic.moduleId).lean();

    // Build prev/next navigation from sibling topics in the same roadmap
    // Ordered by global order field (cross-module sequence)
    const allTopics = await Topic.find({
      roadmapId: roadmap._id,
      status: 'published',
    })
      .sort({ order: 1 })
      .select('_id key title order type estimatedMinutes moduleId');

    const topicIndex = allTopics.findIndex((t) => t._id.toString() === topic._id.toString());

    const prevTopic = topicIndex > 0 ? allTopics[topicIndex - 1] : null;
    const nextTopic = topicIndex < allTopics.length - 1 ? allTopics[topicIndex + 1] : null;

    // Caller's current progress record for this topic (read-only, never create)
    let userProgress = null;
    let isEnrolled = false;

    if (req.user) {
      const progressRecord = await TopicProgress.findOne({
        userId: req.user._id,
        topicId: topic._id,
      }).lean();

      if (progressRecord) {
        userProgress = {
          status: progressRecord.status,
          completedAt: progressRecord.completedAt,
          lastViewedAt: progressRecord.lastViewedAt,
        };
      }

      // Check enrollment status so the client can show enroll CTA if needed
      const enrolment = await Enrolment.findOne({
        userId: req.user._id,
        roadmapId: roadmap._id,
        status: 'active',
      }).lean();

      isEnrolled = !!enrolment;
    }

    // Build the response payload
    const responseData = {
      roadmap: {
        id: roadmap._id.toString(),
        title: roadmap.title,
        slug: roadmap.slug,
        level: roadmap.level,
      },
      module: parentModule
        ? {
            id: parentModule._id.toString(),
            title: parentModule.title,
            phaseLabel: parentModule.phaseLabel,
          }
        : null,
      topic: {
        id: topic._id.toString(),
        key: topic.key,
        title: topic.title,
        type: topic.type,
        order: topic.order,
        estimatedMinutes: topic.estimatedMinutes,
        objectives: topic.objectives || [],
        buildsOnNote: topic.buildsOnNote || '',
        resources: topic.resources.map((r) => ({
          id: r._id.toString(),
          type: r.type,
          title: r.title,
          url: r.url,
          source: r.source,
          duration: r.duration,
          language: r.language,
          level: r.level,
          role: r.role,
          reason: r.reason,
        })),
        practiceItems: topic.practiceItems.map((p) => ({
          id: p._id.toString(),
          title: p.title,
          description: p.description,
          type: p.type,
          difficulty: p.difficulty,
          url: p.url,
        })),
      },
      navigation: {
        prev: prevTopic
          ? {
              key: prevTopic.key,
              title: prevTopic.title,
              type: prevTopic.type,
              estimatedMinutes: prevTopic.estimatedMinutes,
            }
          : null,
        next: nextTopic
          ? {
              key: nextTopic.key,
              title: nextTopic.title,
              type: nextTopic.type,
              estimatedMinutes: nextTopic.estimatedMinutes,
            }
          : null,
        position: topicIndex + 1,
        total: allTopics.length,
      },
      userProgress,
      isEnrolled,
    };

    return sendSuccess(res, 200, responseData);
  } catch (err) {
    next(err);
  }
}

module.exports = { getTopic };
