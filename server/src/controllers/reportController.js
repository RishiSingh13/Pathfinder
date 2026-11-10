const ProblemReport = require('../models/ProblemReport');
const Topic = require('../models/Topic');
const { sendSuccess, sendError } = require('../utils/responseEnvelope');

/**
 * POST /api/v1/reports
 * Submit a resource issue or general topic problem report.
 * Validates that the topicId and optional resourceId actually exist and belong together.
 */
async function submitReport(req, res, next) {
  try {
    const { topicId, resourceId, reportType, description } = req.body || {};

    // Validate required fields
    if (!topicId || typeof topicId !== 'string' || topicId.trim() === '') {
      return sendError(
        res,
        400,
        'VALIDATION_ERROR',
        'A topicId is required to submit a report.',
        [{ path: 'topicId', message: 'topicId is required.' }],
        req
      );
    }

    const validReportTypes = ['broken_link', 'outdated_content', 'incorrect_info', 'missing_resource', 'other'];
    if (!reportType || !validReportTypes.includes(reportType)) {
      return sendError(
        res,
        400,
        'VALIDATION_ERROR',
        `Report type must be one of: ${validReportTypes.join(', ')}`,
        [{ path: 'reportType', message: 'Invalid or missing reportType.' }],
        req
      );
    }

    if (description && description.length > 1000) {
      return sendError(
        res,
        400,
        'VALIDATION_ERROR',
        'Description cannot exceed 1000 characters.',
        [{ path: 'description', message: 'Too long (max 1000 chars).' }],
        req
      );
    }

    // Verify the topic exists and is published
    const topic = await Topic.findById(topicId.trim()).lean();
    if (!topic || topic.status !== 'published') {
      return sendError(res, 404, 'NOT_FOUND', 'Topic not found or not accessible.', undefined, req);
    }

    // If resourceId is provided, verify it belongs to this topic
    if (resourceId) {
      const resourceExists = topic.resources.some(
        (r) => r._id.toString() === resourceId.trim()
      );
      if (!resourceExists) {
        return sendError(
          res,
          400,
          'VALIDATION_ERROR',
          'The specified resource does not belong to this topic.',
          [{ path: 'resourceId', message: 'Resource not found in this topic.' }],
          req
        );
      }
    }

    const report = await ProblemReport.create({
      userId: req.user._id,
      topicId: topic._id,
      resourceId: resourceId ? resourceId.trim() : null,
      roadmapId: topic.roadmapId,
      reportType,
      description: description ? description.trim() : '',
      status: 'open',
    });

    return sendSuccess(res, 201, {
      reportId: report._id.toString(),
      status: report.status,
      message: 'Your report has been submitted and will be reviewed by a curator. Thank you for helping improve the content.',
    });
  } catch (err) {
    next(err);
  }
}

/**
 * GET /api/v1/admin/reports
 * Paginated list of all reports for curator review.
 * Supports filtering by status (open, resolved, dismissed).
 */
async function listReports(req, res, next) {
  try {
    const { status = 'open', page = 1, limit = 20 } = req.query;
    const validStatuses = ['open', 'resolved', 'dismissed', 'all'];
    const resolvedStatus = validStatuses.includes(status) ? status : 'open';

    const filter = resolvedStatus === 'all' ? {} : { status: resolvedStatus };

    const pageNum = Math.max(1, parseInt(page, 10) || 1);
    const limitNum = Math.min(50, Math.max(1, parseInt(limit, 10) || 20));
    const skip = (pageNum - 1) * limitNum;

    const [reports, total] = await Promise.all([
      ProblemReport.find(filter)
        .populate('userId', 'displayName email')
        .populate('topicId', 'title key roadmapId')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limitNum)
        .lean(),
      ProblemReport.countDocuments(filter),
    ]);

    return sendSuccess(
      res,
      200,
      {
        reports: reports.map((r) => ({
          id: r._id.toString(),
          reportType: r.reportType,
          description: r.description,
          status: r.status,
          createdAt: r.createdAt,
          reporter: r.userId
            ? { displayName: r.userId.displayName, email: r.userId.email }
            : null,
          topic: r.topicId
            ? { title: r.topicId.title, key: r.topicId.key }
            : null,
          resourceId: r.resourceId,
          roadmapId: r.roadmapId?.toString(),
        })),
      },
      {
        page: pageNum,
        limit: limitNum,
        total,
        pages: Math.ceil(total / limitNum),
      }
    );
  } catch (err) {
    next(err);
  }
}

/**
 * PATCH /api/v1/admin/reports/:id
 * Update the status of a report (resolved, dismissed).
 */
async function updateReport(req, res, next) {
  try {
    const { id } = req.params;
    const { status } = req.body || {};

    const validStatuses = ['resolved', 'dismissed'];
    if (!validStatuses.includes(status)) {
      return sendError(
        res,
        400,
        'VALIDATION_ERROR',
        `Report status must be one of: ${validStatuses.join(', ')}`,
        [{ path: 'status', message: 'Invalid status.' }],
        req
      );
    }

    const report = await ProblemReport.findByIdAndUpdate(
      id,
      { status, resolvedAt: new Date() },
      { new: true }
    );

    if (!report) {
      return sendError(res, 404, 'NOT_FOUND', 'Report not found.', undefined, req);
    }

    return sendSuccess(res, 200, {
      id: report._id.toString(),
      status: report.status,
      resolvedAt: report.resolvedAt,
    });
  } catch (err) {
    next(err);
  }
}

module.exports = { submitReport, listReports, updateReport };
