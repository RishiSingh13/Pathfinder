const Roadmap = require('../models/Roadmap');
const Module = require('../models/Module');
const Topic = require('../models/Topic');
const ProblemReport = require('../models/ProblemReport');
const { sendSuccess, sendError } = require('../utils/responseEnvelope');

/**
 * List all roadmaps with statistics (module count, topic count, core count)
 * Filterable by status: draft, published, archived
 */
async function listRoadmaps(req, res, next) {
  try {
    const { status } = req.query;
    const filter = {};
    if (status && ['draft', 'published', 'archived'].includes(status)) {
      filter.status = status;
    }

    const roadmaps = await Roadmap.find(filter).sort({ updatedAt: -1 }).lean();

    const stats = await Promise.all(
      roadmaps.map(async (rm) => {
        const [moduleCount, topicCount, coreTopicCount] = await Promise.all([
          Module.countDocuments({ roadmapId: rm._id, status: { $ne: 'archived' } }),
          Topic.countDocuments({ roadmapId: rm._id, status: { $ne: 'archived' } }),
          Topic.countDocuments({ roadmapId: rm._id, type: 'core', status: { $ne: 'archived' } }),
        ]);

        return {
          id: rm._id.toString(),
          title: rm.title,
          slug: rm.slug,
          status: rm.status,
          level: rm.level,
          estimatedHours: rm.estimatedHours,
          weeklyPaceHours: rm.weeklyPaceHours,
          curator: rm.curator,
          lastReviewedDate: rm.lastReviewedDate,
          moduleCount,
          topicCount,
          coreTopicCount,
          updatedAt: rm.updatedAt,
        };
      })
    );

    return sendSuccess(res, 200, { roadmaps: stats });
  } catch (err) {
    next(err);
  }
}

/**
 * Get full roadmap details along with all modules and topics for editing
 * Supports search by MongoDB ObjectId or unique slug
 */
async function getRoadmap(req, res, next) {
  try {
    const { id } = req.params;

    let roadmap;
    if (id.match(/^[0-9a-fA-F]{24}$/)) {
      roadmap = await Roadmap.findById(id).lean();
    }
    if (!roadmap) {
      roadmap = await Roadmap.findOne({ slug: id.toLowerCase() }).lean();
    }

    if (!roadmap) {
      return sendError(res, 404, 'NOT_FOUND', 'Roadmap not found.', undefined, req);
    }

    // Fetch all non-archived modules sorted by order
    const modules = await Module.find({
      roadmapId: roadmap._id,
      status: { $ne: 'archived' },
    })
      .sort({ order: 1 })
      .lean();

    // Fetch all non-archived topics sorted by order
    const topics = await Topic.find({
      roadmapId: roadmap._id,
      status: { $ne: 'archived' },
    })
      .sort({ order: 1 })
      .lean();

    // Attach topics to their corresponding module
    const modulesWithTopics = modules.map((m) => {
      const moduleTopics = topics
        .filter((t) => t.moduleId.toString() === m._id.toString())
        .map((t) => ({
          id: t._id.toString(),
          moduleId: t.moduleId.toString(),
          roadmapId: t.roadmapId.toString(),
          key: t.key,
          title: t.title,
          type: t.type,
          order: t.order,
          status: t.status,
          estimatedMinutes: t.estimatedMinutes,
          buildsOnNote: t.buildsOnNote || '',
          objectives: t.objectives || [],
          resources: (t.resources || []).map((r) => ({
            id: r._id.toString(),
            title: r.title,
            url: r.url,
            type: r.type,
            source: r.source || '',
            duration: r.duration || '',
            role: r.role || 'primary',
            reason: r.reason || '',
          })),
          practiceItems: (t.practiceItems || []).map((p) => ({
            id: p._id.toString(),
            title: p.title,
            url: p.url,
            difficulty: p.difficulty || 'Easy',
            type: p.type || 'Coding Exercise',
            description: p.description || '',
          })),
        }));

      return {
        id: m._id.toString(),
        roadmapId: m.roadmapId.toString(),
        title: m.title,
        phaseLabel: m.phaseLabel,
        description: m.description || '',
        order: m.order,
        status: m.status,
        topics: moduleTopics,
      };
    });

    return sendSuccess(res, 200, {
      roadmap: {
        id: roadmap._id.toString(),
        title: roadmap.title,
        slug: roadmap.slug,
        outcome: roadmap.outcome,
        level: roadmap.level,
        estimatedHours: roadmap.estimatedHours,
        weeklyPaceHours: roadmap.weeklyPaceHours || 5,
        status: roadmap.status,
        curator: roadmap.curator || 'Curriculum Team',
        lastReviewedDate: roadmap.lastReviewedDate,
        prerequisites: roadmap.prerequisites || [],
        whatIsOutOfScope: roadmap.whatIsOutOfScope || [],
        intendedAudience: roadmap.intendedAudience || '',
        sampleTopicKey: roadmap.sampleTopicKey || '',
        orderedPhaseTitles: roadmap.orderedPhaseTitles || [],
        createdAt: roadmap.createdAt,
        updatedAt: roadmap.updatedAt,
      },
      modules: modulesWithTopics,
    });
  } catch (err) {
    next(err);
  }
}

/**
 * Create a new roadmap in draft status
 */
async function createRoadmap(req, res, next) {
  try {
    const {
      title,
      slug,
      outcome,
      level,
      estimatedHours,
      weeklyPaceHours,
      curator,
      prerequisites,
      whatIsOutOfScope,
      intendedAudience,
      orderedPhaseTitles,
    } = req.body || {};

    if (!title || typeof title !== 'string' || !title.trim()) {
      return sendError(
        res,
        400,
        'VALIDATION_ERROR',
        'Title is required.',
        [{ path: 'title', message: 'Roadmap title is required.' }],
        req
      );
    }

    if (!slug || typeof slug !== 'string' || !slug.trim()) {
      return sendError(
        res,
        400,
        'VALIDATION_ERROR',
        'Slug is required.',
        [{ path: 'slug', message: 'Roadmap slug is required.' }],
        req
      );
    }

    if (!outcome || typeof outcome !== 'string' || !outcome.trim()) {
      return sendError(
        res,
        400,
        'VALIDATION_ERROR',
        'Outcome is required.',
        [{ path: 'outcome', message: 'Roadmap outcome is required.' }],
        req
      );
    }

    const cleanSlug = slug.trim().toLowerCase().replace(/[^a-z0-9-]/g, '-');
    const existing = await Roadmap.findOne({ slug: cleanSlug });
    if (existing) {
      return sendError(
        res,
        409,
        'CONFLICT',
        'A roadmap with this slug already exists. Please choose a unique slug.',
        [{ path: 'slug', message: 'Slug already taken.' }],
        req
      );
    }

    const parsedHours = Number(estimatedHours);
    if (isNaN(parsedHours) || parsedHours < 1) {
      return sendError(
        res,
        400,
        'VALIDATION_ERROR',
        'Estimated hours must be a positive number.',
        [{ path: 'estimatedHours', message: 'Must be at least 1 hour.' }],
        req
      );
    }

    const roadmap = await Roadmap.create({
      title: title.trim(),
      slug: cleanSlug,
      outcome: outcome.trim(),
      level: ['Beginner', 'Intermediate', 'Advanced', 'All Levels'].includes(level) ? level : 'Beginner',
      estimatedHours: parsedHours,
      weeklyPaceHours: Number(weeklyPaceHours) || 5,
      curator: curator && curator.trim() ? curator.trim() : 'Curriculum Team',
      status: 'draft', // Always created in draft status
      prerequisites: Array.isArray(prerequisites) ? prerequisites.filter(Boolean) : [],
      whatIsOutOfScope: Array.isArray(whatIsOutOfScope) ? whatIsOutOfScope.filter(Boolean) : [],
      intendedAudience: intendedAudience ? intendedAudience.trim() : '',
      orderedPhaseTitles: Array.isArray(orderedPhaseTitles) ? orderedPhaseTitles.filter(Boolean) : [],
      lastReviewedDate: new Date().toISOString().split('T')[0],
    });

    return sendSuccess(res, 201, {
      roadmap: {
        id: roadmap._id.toString(),
        title: roadmap.title,
        slug: roadmap.slug,
        outcome: roadmap.outcome,
        level: roadmap.level,
        status: roadmap.status,
        estimatedHours: roadmap.estimatedHours,
        curator: roadmap.curator,
      },
      message: 'Roadmap created successfully as draft.',
    });
  } catch (err) {
    next(err);
  }
}

/**
 * Update roadmap metadata or publication status
 * Enforces publication gate: cannot publish if empty curriculum
 */
async function updateRoadmap(req, res, next) {
  try {
    const { id } = req.params;

    let roadmap;
    if (id.match(/^[0-9a-fA-F]{24}$/)) {
      roadmap = await Roadmap.findById(id);
    }
    if (!roadmap) {
      roadmap = await Roadmap.findOne({ slug: id.toLowerCase() });
    }

    if (!roadmap) {
      return sendError(res, 404, 'NOT_FOUND', 'Roadmap not found.', undefined, req);
    }

    const updates = req.body || {};

    // Publication guard check
    if (updates.status === 'published' && roadmap.status !== 'published') {
      const [moduleCount, coreTopicCount] = await Promise.all([
        Module.countDocuments({ roadmapId: roadmap._id, status: { $ne: 'archived' } }),
        Topic.countDocuments({ roadmapId: roadmap._id, type: 'core', status: { $ne: 'archived' } }),
      ]);

      if (moduleCount === 0 || coreTopicCount === 0) {
        return sendError(
          res,
          400,
          'PUBLISH_GATE_FAILED',
          'Cannot publish roadmap: a published roadmap must contain at least 1 active module and 1 active core topic.',
          [
            { path: 'modules', message: `Found ${moduleCount} active modules (requires >= 1).` },
            { path: 'topics', message: `Found ${coreTopicCount} active core topics (requires >= 1).` },
          ],
          req
        );
      }
    }

    // Handle slug change uniqueness
    if (updates.slug && updates.slug.trim().toLowerCase() !== roadmap.slug) {
      const cleanSlug = updates.slug.trim().toLowerCase().replace(/[^a-z0-9-]/g, '-');
      const existing = await Roadmap.findOne({ slug: cleanSlug, _id: { $ne: roadmap._id } });
      if (existing) {
        return sendError(
          res,
          409,
          'CONFLICT',
          'Another roadmap already uses this slug.',
          [{ path: 'slug', message: 'Slug already taken.' }],
          req
        );
      }
      roadmap.slug = cleanSlug;
    }

    const allowed = [
      'title',
      'outcome',
      'level',
      'estimatedHours',
      'weeklyPaceHours',
      'status',
      'curator',
      'prerequisites',
      'whatIsOutOfScope',
      'intendedAudience',
      'sampleTopicKey',
      'orderedPhaseTitles',
    ];

    allowed.forEach((field) => {
      if (updates[field] !== undefined) {
        roadmap[field] = updates[field];
      }
    });

    roadmap.lastReviewedDate = new Date().toISOString().split('T')[0];
    await roadmap.save();

    return sendSuccess(res, 200, {
      roadmap: {
        id: roadmap._id.toString(),
        title: roadmap.title,
        slug: roadmap.slug,
        outcome: roadmap.outcome,
        level: roadmap.level,
        status: roadmap.status,
        estimatedHours: roadmap.estimatedHours,
        curator: roadmap.curator,
        lastReviewedDate: roadmap.lastReviewedDate,
      },
      message: 'Roadmap updated successfully.',
    });
  } catch (err) {
    next(err);
  }
}

/**
 * Create a new module inside a roadmap
 */
async function createModule(req, res, next) {
  try {
    const roadmapId = req.params.id || req.body.roadmapId;
    const { title, description, phaseLabel, order, status } = req.body || {};

    if (!roadmapId) {
      return sendError(res, 400, 'VALIDATION_ERROR', 'Roadmap ID is required.', undefined, req);
    }

    const roadmap = await Roadmap.findById(roadmapId);
    if (!roadmap) {
      return sendError(res, 404, 'NOT_FOUND', 'Roadmap not found.', undefined, req);
    }

    if (!title || !title.trim()) {
      return sendError(res, 400, 'VALIDATION_ERROR', 'Module title is required.', [{ path: 'title' }], req);
    }

    if (!phaseLabel || !phaseLabel.trim()) {
      return sendError(res, 400, 'VALIDATION_ERROR', 'Phase label is required (e.g. Phase 1: Core Fundamentals).', [{ path: 'phaseLabel' }], req);
    }

    let orderNum = Number(order);
    if (isNaN(orderNum)) {
      const highest = await Module.findOne({ roadmapId: roadmap._id }).sort({ order: -1 });
      orderNum = highest ? highest.order + 1 : 1;
    }

    const newModule = await Module.create({
      roadmapId: roadmap._id,
      title: title.trim(),
      description: description ? description.trim() : '',
      phaseLabel: phaseLabel.trim(),
      order: orderNum,
      status: ['draft', 'published', 'archived'].includes(status) ? status : 'published',
    });

    return sendSuccess(res, 201, {
      module: {
        id: newModule._id.toString(),
        roadmapId: newModule.roadmapId.toString(),
        title: newModule.title,
        phaseLabel: newModule.phaseLabel,
        description: newModule.description,
        order: newModule.order,
        status: newModule.status,
        topics: [],
      },
      message: 'Module created successfully.',
    });
  } catch (err) {
    next(err);
  }
}

/**
 * Update module details
 */
async function updateModule(req, res, next) {
  try {
    const { id } = req.params;
    const moduleDoc = await Module.findById(id);
    if (!moduleDoc) {
      return sendError(res, 404, 'NOT_FOUND', 'Module not found.', undefined, req);
    }

    const allowed = ['title', 'description', 'phaseLabel', 'order', 'status'];
    allowed.forEach((field) => {
      if (req.body[field] !== undefined) {
        moduleDoc[field] = req.body[field];
      }
    });

    await moduleDoc.save();

    return sendSuccess(res, 200, {
      module: {
        id: moduleDoc._id.toString(),
        roadmapId: moduleDoc.roadmapId.toString(),
        title: moduleDoc.title,
        phaseLabel: moduleDoc.phaseLabel,
        description: moduleDoc.description,
        order: moduleDoc.order,
        status: moduleDoc.status,
      },
      message: 'Module updated successfully.',
    });
  } catch (err) {
    next(err);
  }
}

/**
 * Reorder modules in roadmap with atomic sequence update and ownership verification
 */
async function reorderModules(req, res, next) {
  try {
    const roadmapId = req.params.id || req.body.roadmapId;
    const { orderedIds } = req.body || {};

    if (!Array.isArray(orderedIds) || orderedIds.length === 0) {
      return sendError(res, 400, 'VALIDATION_ERROR', 'orderedIds array is required.', undefined, req);
    }

    // Verify all modules exist and belong to the roadmap
    const modules = await Module.find({
      _id: { $in: orderedIds },
      roadmapId,
      status: { $ne: 'archived' },
    });

    if (modules.length !== orderedIds.length) {
      return sendError(
        res,
        400,
        'VALIDATION_ERROR',
        'Mismatch in module IDs. All IDs must belong to this roadmap.',
        undefined,
        req
      );
    }

    // Update order of each module
    await Promise.all(
      orderedIds.map((id, index) =>
        Module.findByIdAndUpdate(id, { $set: { order: index + 1 } })
      )
    );

    return sendSuccess(res, 200, {
      message: 'Modules successfully reordered.',
      orderedIds,
    });
  } catch (err) {
    next(err);
  }
}

/**
 * Create a new topic inside a module
 */
async function createTopic(req, res, next) {
  try {
    const moduleId = req.params.id || req.body.moduleId;
    const {
      title,
      key,
      objectives,
      estimatedMinutes,
      type,
      buildsOnNote,
      order,
      status,
      resources,
      practiceItems,
    } = req.body || {};

    if (!moduleId) {
      return sendError(res, 400, 'VALIDATION_ERROR', 'Module ID is required.', undefined, req);
    }

    const parentModule = await Module.findById(moduleId);
    if (!parentModule) {
      return sendError(res, 404, 'NOT_FOUND', 'Module not found.', undefined, req);
    }

    if (!title || !title.trim()) {
      return sendError(res, 400, 'VALIDATION_ERROR', 'Topic title is required.', [{ path: 'title' }], req);
    }

    if (!key || !key.trim()) {
      return sendError(res, 400, 'VALIDATION_ERROR', 'Topic key is required.', [{ path: 'key' }], req);
    }

    const cleanKey = key.trim().toLowerCase().replace(/[^a-z0-9-]/g, '-');
    const existing = await Topic.findOne({ roadmapId: parentModule.roadmapId, key: cleanKey });
    if (existing) {
      return sendError(
        res,
        409,
        'CONFLICT',
        'A topic with this key already exists in this roadmap.',
        [{ path: 'key', message: 'Topic key must be unique within the roadmap.' }],
        req
      );
    }

    let orderNum = Number(order);
    if (isNaN(orderNum)) {
      const highest = await Topic.findOne({ moduleId: parentModule._id }).sort({ order: -1 });
      orderNum = highest ? highest.order + 1 : 1;
    }

    // Validate resource URLs if provided
    const cleanResources = Array.isArray(resources) ? resources : [];
    for (const r of cleanResources) {
      if (!r.url || !r.url.match(/^https?:\/\//i)) {
        return sendError(
          res,
          400,
          'VALIDATION_ERROR',
          `Resource "${r.title || 'Untitled'}" must have a valid URL starting with http:// or https://`,
          [{ path: 'resources', message: 'Invalid URL scheme.' }],
          req
        );
      }
    }

    const topic = await Topic.create({
      roadmapId: parentModule.roadmapId,
      moduleId: parentModule._id,
      title: title.trim(),
      key: cleanKey,
      objectives: Array.isArray(objectives) ? objectives.filter(Boolean) : [],
      estimatedMinutes: Number(estimatedMinutes) || 45,
      type: ['core', 'optional', 'stretch'].includes(type) ? type : 'core',
      buildsOnNote: buildsOnNote ? buildsOnNote.trim() : '',
      order: orderNum,
      status: ['draft', 'published', 'archived'].includes(status) ? status : 'published',
      lastVerifiedDate: new Date().toISOString().split('T')[0],
      resources: cleanResources,
      practiceItems: Array.isArray(practiceItems) ? practiceItems : [],
    });

    return sendSuccess(res, 201, {
      topic: {
        id: topic._id.toString(),
        moduleId: topic.moduleId.toString(),
        roadmapId: topic.roadmapId.toString(),
        key: topic.key,
        title: topic.title,
        type: topic.type,
        order: topic.order,
        status: topic.status,
        estimatedMinutes: topic.estimatedMinutes,
        resources: topic.resources,
        practiceItems: topic.practiceItems,
      },
      message: 'Topic created successfully.',
    });
  } catch (err) {
    next(err);
  }
}

/**
 * Update topic details, resources, and practice items
 */
async function updateTopic(req, res, next) {
  try {
    const { id } = req.params;
    const topic = await Topic.findById(id);
    if (!topic) {
      return sendError(res, 404, 'NOT_FOUND', 'Topic not found.', undefined, req);
    }

    const updates = req.body || {};

    // Key uniqueness check
    if (updates.key && updates.key.trim().toLowerCase() !== topic.key) {
      const cleanKey = updates.key.trim().toLowerCase().replace(/[^a-z0-9-]/g, '-');
      const existing = await Topic.findOne({
        roadmapId: topic.roadmapId,
        key: cleanKey,
        _id: { $ne: topic._id },
      });
      if (existing) {
        return sendError(
          res,
          409,
          'CONFLICT',
          'Another topic in this roadmap already uses this key.',
          [{ path: 'key', message: 'Topic key must be unique within the roadmap.' }],
          req
        );
      }
      topic.key = cleanKey;
    }

    // Validate resource URLs if being updated
    if (Array.isArray(updates.resources)) {
      for (const r of updates.resources) {
        if (!r.url || !r.url.match(/^https?:\/\//i)) {
          return sendError(
            res,
            400,
            'VALIDATION_ERROR',
            `Resource "${r.title || 'Untitled'}" must have a valid URL starting with http:// or https://`,
            [{ path: 'resources', message: 'Invalid URL scheme.' }],
            req
          );
        }
      }
    }

    const allowed = [
      'moduleId',
      'title',
      'objectives',
      'estimatedMinutes',
      'type',
      'buildsOnNote',
      'order',
      'status',
      'resources',
      'practiceItems',
    ];

    allowed.forEach((field) => {
      if (updates[field] !== undefined) {
        topic[field] = updates[field];
      }
    });

    topic.lastVerifiedDate = new Date().toISOString().split('T')[0];
    await topic.save();

    return sendSuccess(res, 200, {
      topic: {
        id: topic._id.toString(),
        moduleId: topic.moduleId.toString(),
        roadmapId: topic.roadmapId.toString(),
        key: topic.key,
        title: topic.title,
        type: topic.type,
        order: topic.order,
        status: topic.status,
        estimatedMinutes: topic.estimatedMinutes,
        resources: topic.resources,
        practiceItems: topic.practiceItems,
      },
      message: 'Topic updated successfully.',
    });
  } catch (err) {
    next(err);
  }
}

/**
 * Reorder topics inside a module
 */
async function reorderTopics(req, res, next) {
  try {
    const moduleId = req.params.id || req.body.moduleId;
    const { orderedIds } = req.body || {};

    if (!Array.isArray(orderedIds) || orderedIds.length === 0) {
      return sendError(res, 400, 'VALIDATION_ERROR', 'orderedIds array is required.', undefined, req);
    }

    // Verify all topics belong to this module
    const topics = await Topic.find({
      _id: { $in: orderedIds },
      moduleId,
      status: { $ne: 'archived' },
    });

    if (topics.length !== orderedIds.length) {
      return sendError(
        res,
        400,
        'VALIDATION_ERROR',
        'Mismatch in topic IDs. All IDs must belong to this module.',
        undefined,
        req
      );
    }

    await Promise.all(
      orderedIds.map((id, index) =>
        Topic.findByIdAndUpdate(id, { $set: { order: index + 1 } })
      )
    );

    return sendSuccess(res, 200, {
      message: 'Topics successfully reordered.',
      orderedIds,
    });
  } catch (err) {
    next(err);
  }
}

/**
 * Safely archive a topic (preserves student completion history, removes from active roadmap view)
 */
async function archiveTopic(req, res, next) {
  try {
    const { id } = req.params;
    const topic = await Topic.findByIdAndUpdate(
      id,
      { $set: { status: 'archived' } },
      { new: true }
    );

    if (!topic) {
      return sendError(res, 404, 'NOT_FOUND', 'Topic not found.', undefined, req);
    }

    return sendSuccess(res, 200, {
      id: topic._id.toString(),
      status: topic.status,
      message: `Topic "${topic.title}" has been safely archived. Learner history is preserved.`,
    });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  listRoadmaps,
  getRoadmap,
  createRoadmap,
  updateRoadmap,
  createModule,
  updateModule,
  reorderModules,
  createTopic,
  updateTopic,
  reorderTopics,
  archiveTopic,
};
