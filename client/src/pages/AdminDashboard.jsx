import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import {
  Shield,
  Plus,
  BookOpen,
  Edit,
  Eye,
  Flag,
  CheckCircle2,
  AlertCircle,
  Clock,
  Layers,
  ArrowRight,
  Filter,
  Check,
  X,
  ExternalLink,
} from 'lucide-react';
import { api } from '../services/api';
import PageContainer from '../components/layout/PageContainer';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import Modal from '../components/ui/Modal';
import Input from '../components/ui/Input';
import EmptyState from '../components/ui/EmptyState';
import ErrorAlert from '../components/ui/ErrorAlert';
import { Skeleton } from '../components/ui/Skeleton';

export default function AdminDashboard() {
  const [roadmaps, setRoadmaps] = useState([]);
  const [reports, setReports] = useState([]);
  const [activeTab, setActiveTab] = useState('roadmaps'); // 'roadmaps' | 'reports'
  const [statusFilter, setStatusFilter] = useState('all');
  const [reportFilter, setReportFilter] = useState('open');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [actionSuccess, setActionSuccess] = useState(null);

  // Create Roadmap Modal State
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [submittingRoadmap, setSubmittingRoadmap] = useState(false);
  const [createError, setCreateError] = useState(null);
  const [newTitle, setNewTitle] = useState('');
  const [newSlug, setNewSlug] = useState('');
  const [newOutcome, setNewOutcome] = useState('');
  const [newLevel, setNewLevel] = useState('Beginner');
  const [newHours, setNewHours] = useState(30);
  const [newWeeklyPace, setNewWeeklyPace] = useState(5);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const [rmRes, repRes] = await Promise.all([
        api.admin.listRoadmaps(),
        api.admin.listReports('all'),
      ]);
      setRoadmaps(rmRes.data?.roadmaps || []);
      setReports(repRes.data?.reports || []);
    } catch (err) {
      setError(err.message || 'Failed to fetch admin data.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Handle auto-slugification
  const handleTitleChange = (val) => {
    setNewTitle(val);
    const slugified = val
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
    setNewSlug(slugified);
  };

  const handleCreateRoadmap = async (e) => {
    e.preventDefault();
    setSubmittingRoadmap(true);
    setCreateError(null);
    try {
      await api.admin.createRoadmap({
        title: newTitle.trim(),
        slug: newSlug.trim(),
        outcome: newOutcome.trim(),
        level: newLevel,
        estimatedHours: Number(newHours) || 30,
        weeklyPaceHours: Number(newWeeklyPace) || 5,
        status: 'draft',
      });
      setCreateModalOpen(false);
      setNewTitle('');
      setNewSlug('');
      setNewOutcome('');
      setNewHours(30);
      setNewWeeklyPace(5);
      setActionSuccess('Roadmap created successfully as draft.');
      setTimeout(() => setActionSuccess(null), 4000);
      await fetchData();
    } catch (err) {
      setCreateError(err.message || 'Failed to create roadmap.');
    } finally {
      setSubmittingRoadmap(false);
    }
  };

  const handleToggleStatus = async (roadmap) => {
    const nextStatus = roadmap.status === 'published' ? 'draft' : 'published';
    try {
      setError(null);
      await api.admin.updateRoadmap(roadmap.id, { status: nextStatus });
      setActionSuccess(`Roadmap status changed to "${nextStatus}".`);
      setTimeout(() => setActionSuccess(null), 4000);
      await fetchData();
    } catch (err) {
      setError(err.message || 'Failed to update status.');
    }
  };

  const handleResolveReport = async (reportId, statusToSet = 'resolved') => {
    try {
      await api.admin.resolveReport(reportId, statusToSet);
      setReports((prev) =>
        prev.map((r) => (r.id === reportId ? { ...r, status: statusToSet } : r))
      );
      setActionSuccess(`Report marked as ${statusToSet}.`);
      setTimeout(() => setActionSuccess(null), 3000);
    } catch (err) {
      setError(err.message || 'Failed to update report status.');
    }
  };

  const filteredRoadmaps = roadmaps.filter((rm) => {
    if (statusFilter === 'all') return true;
    return rm.status === statusFilter;
  });

  const filteredReports = reports.filter((rep) => {
    if (reportFilter === 'all') return true;
    return rep.status === reportFilter;
  });

  const openReportsCount = reports.filter((r) => r.status === 'open').length;

  return (
    <PageContainer>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="p-1.5 rounded-lg bg-brand-light text-brand">
              <Shield className="w-5 h-5" />
            </span>
            <span className="text-xs font-bold uppercase tracking-wider text-brand">
              Curator Studio
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-ink tracking-tight">
            Curriculum Administration
          </h1>
          <p className="text-sm text-ink-muted">
            Manage roadmap structures, draft-to-publish workflows, and community issue reports.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button onClick={() => setCreateModalOpen(true)}>
            <Plus className="w-4 h-4 mr-1.5" />
            New Roadmap
          </Button>
        </div>
      </div>

      {/* Global Alerts */}
      {actionSuccess && (
        <div className="mb-6 p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{actionSuccess}</span>
        </div>
      )}

      {error && (
        <ErrorAlert
          title="Curator Action Error"
          message={error}
          onRetry={fetchData}
          className="mb-6"
        />
      )}

      {/* Top Stat Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
        <Card className="p-4 bg-surface">
          <div className="flex items-center gap-2 text-ink-muted text-xs font-medium mb-1">
            <BookOpen className="w-4 h-4 text-brand" />
            <span>Total Roadmaps</span>
          </div>
          <div className="text-2xl font-extrabold text-ink tabular-nums">
            {roadmaps.length}
          </div>
        </Card>

        <Card className="p-4 bg-surface">
          <div className="flex items-center gap-2 text-ink-muted text-xs font-medium mb-1">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Published</span>
          </div>
          <div className="text-2xl font-extrabold text-ink tabular-nums">
            {roadmaps.filter((r) => r.status === 'published').length}
          </div>
        </Card>

        <Card className="p-4 bg-surface">
          <div className="flex items-center gap-2 text-ink-muted text-xs font-medium mb-1">
            <Layers className="w-4 h-4 text-amber-600" />
            <span>Drafts</span>
          </div>
          <div className="text-2xl font-extrabold text-ink tabular-nums">
            {roadmaps.filter((r) => r.status === 'draft').length}
          </div>
        </Card>

        <Card className="p-4 bg-surface">
          <div className="flex items-center gap-2 text-ink-muted text-xs font-medium mb-1">
            <Flag className="w-4 h-4 text-rose-600" />
            <span>Open Reports</span>
          </div>
          <div className="text-2xl font-extrabold text-ink tabular-nums">
            {openReportsCount}
          </div>
        </Card>
      </div>

      {/* Navigation Tabs */}
      <div className="flex border-b border-border mb-6">
        <button
          onClick={() => setActiveTab('roadmaps')}
          className={`pb-3 px-4 text-sm font-semibold border-b-2 transition-colors flex items-center gap-2 ${
            activeTab === 'roadmaps'
              ? 'border-brand text-brand'
              : 'border-transparent text-ink-muted hover:text-ink'
          }`}
        >
          <BookOpen className="w-4 h-4" />
          Roadmap Catalog ({roadmaps.length})
        </button>
        <button
          onClick={() => setActiveTab('reports')}
          className={`pb-3 px-4 text-sm font-semibold border-b-2 transition-colors flex items-center gap-2 ${
            activeTab === 'reports'
              ? 'border-brand text-brand'
              : 'border-transparent text-ink-muted hover:text-ink'
          }`}
        >
          <Flag className="w-4 h-4" />
          Content Issues
          {openReportsCount > 0 && (
            <span className="px-1.5 py-0.2 rounded-full text-[10px] font-bold bg-rose-100 text-rose-700">
              {openReportsCount}
            </span>
          )}
        </button>
      </div>

      {/* Tab 1: Roadmaps Management */}
      {activeTab === 'roadmaps' && (
        <div className="space-y-4">
          {/* Filters Bar */}
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-medium text-ink-muted flex items-center gap-1">
                <Filter className="w-3.5 h-3.5" />
                Filter:
              </span>
              {['all', 'published', 'draft', 'archived'].map((status) => (
                <button
                  key={status}
                  onClick={() => setStatusFilter(status)}
                  className={`text-xs px-2.5 py-1 rounded-lg capitalize transition-colors ${
                    statusFilter === status
                      ? 'bg-brand text-white font-medium'
                      : 'bg-surface border border-border text-ink-muted hover:text-ink'
                  }`}
                >
                  {status}
                </button>
              ))}
            </div>

            <span className="text-xs text-ink-muted">
              Showing {filteredRoadmaps.length} of {roadmaps.length} roadmaps
            </span>
          </div>

          {loading ? (
            <div className="space-y-3">
              <Skeleton className="h-24 w-full" />
              <Skeleton className="h-24 w-full" />
              <Skeleton className="h-24 w-full" />
            </div>
          ) : filteredRoadmaps.length === 0 ? (
            <EmptyState
              icon={BookOpen}
              title="No roadmaps match the selected filter"
              description="Adjust your filter or create a new curriculum roadmap to get started."
            />
          ) : (
            <div className="space-y-3">
              {filteredRoadmaps.map((rm) => {
                const isPublished = rm.status === 'published';
                const isDraft = rm.status === 'draft';

                return (
                  <Card key={rm.id} className="p-5 bg-surface hover:border-brand/30 transition-colors">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                      {/* Left: Info */}
                      <div className="space-y-1.5 flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <Badge
                            variant={
                              isPublished
                                ? 'brand'
                                : isDraft
                                ? 'accent'
                                : 'neutral'
                            }
                            size="xs"
                          >
                            {rm.status}
                          </Badge>
                          <span className="text-xs font-medium text-ink-muted">
                            {rm.level}
                          </span>
                          <span className="text-xs text-ink-subtle">·</span>
                          <span className="text-xs text-ink-muted flex items-center gap-1">
                            <Clock className="w-3.5 h-3.5" />
                            ~{rm.estimatedHours}h
                          </span>
                          <span className="text-xs text-ink-subtle">·</span>
                          <span className="text-xs text-ink-muted">
                            Curated by {rm.curator || 'Curriculum Team'}
                          </span>
                        </div>

                        <div className="flex items-center gap-2">
                          <h3 className="text-lg font-bold text-ink hover:text-brand transition-colors truncate">
                            <Link to={`/admin/roadmaps/${rm.slug}`}>{rm.title}</Link>
                          </h3>
                          <span className="text-xs text-ink-muted font-mono bg-surface-subtle px-1.5 py-0.5 rounded border border-border">
                            /{rm.slug}
                          </span>
                        </div>

                        <div className="flex items-center gap-4 text-xs text-ink-muted pt-1">
                          <span>
                            <strong>{rm.moduleCount || 0}</strong> modules
                          </span>
                          <span>
                            <strong>{rm.coreTopicCount || 0}</strong> core topics
                          </span>
                          <span>
                            <strong>{rm.topicCount || 0}</strong> total topics
                          </span>
                        </div>
                      </div>

                      {/* Right: Actions */}
                      <div className="flex items-center gap-2 self-start md:self-auto shrink-0">
                        {/* Toggle Published / Draft Button */}
                        <Button
                          variant={isPublished ? 'secondary' : 'primary'}
                          size="sm"
                          onClick={() => handleToggleStatus(rm)}
                          title={
                            isPublished
                              ? 'Change status to draft (hides from public catalogue)'
                              : 'Publish roadmap to catalogue'
                          }
                          className="text-xs"
                        >
                          {isPublished ? 'Unpublish to Draft' : 'Publish to Live'}
                        </Button>

                        {/* Edit Curriculum Button */}
                        <Link to={`/admin/roadmaps/${rm.slug}`}>
                          <Button variant="secondary" size="sm" className="text-xs">
                            <Edit className="w-3.5 h-3.5 mr-1" />
                            Edit Curriculum
                          </Button>
                        </Link>

                        {/* View Public Preview */}
                        {isPublished && (
                          <Link to={`/roadmaps/${rm.slug}`} target="_blank" rel="noopener noreferrer">
                            <Button variant="ghost" size="sm" className="text-xs text-ink-muted hover:text-ink">
                              <ExternalLink className="w-3.5 h-3.5" />
                            </Button>
                          </Link>
                        )}
                      </div>
                    </div>
                  </Card>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Tab 2: Issue Reports Queue */}
      {activeTab === 'reports' && (
        <div className="space-y-4">
          {/* Filters Bar */}
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-medium text-ink-muted flex items-center gap-1">
                <Filter className="w-3.5 h-3.5" />
                Filter:
              </span>
              {['open', 'resolved', 'dismissed', 'all'].map((status) => (
                <button
                  key={status}
                  onClick={() => setReportFilter(status)}
                  className={`text-xs px-2.5 py-1 rounded-lg capitalize transition-colors ${
                    reportFilter === status
                      ? 'bg-brand text-white font-medium'
                      : 'bg-surface border border-border text-ink-muted hover:text-ink'
                  }`}
                >
                  {status}
                </button>
              ))}
            </div>

            <span className="text-xs text-ink-muted">
              Showing {filteredReports.length} reports
            </span>
          </div>

          {filteredReports.length === 0 ? (
            <EmptyState
              icon={Flag}
              title="No issue reports found"
              description="No learner issue reports match this filter. Curated content is currently running cleanly."
            />
          ) : (
            <div className="space-y-3">
              {filteredReports.map((report) => {
                const isOpen = report.status === 'open';

                const reportTypeBadges = {
                  broken_link: { label: 'Broken Link', variant: 'danger' },
                  outdated_content: { label: 'Outdated Content', variant: 'accent' },
                  incorrect_info: { label: 'Incorrect Info', variant: 'accent' },
                  missing_resource: { label: 'Missing Resource', variant: 'info' },
                  other: { label: 'Other', variant: 'neutral' },
                };

                const typeInfo = reportTypeBadges[report.reportType] || reportTypeBadges.other;

                return (
                  <Card key={report.id} className="p-5 bg-surface space-y-3">
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <Badge variant={typeInfo.variant} size="xs">
                            {typeInfo.label}
                          </Badge>
                          <Badge
                            variant={
                              report.status === 'resolved'
                                ? 'brand'
                                : report.status === 'dismissed'
                                ? 'neutral'
                                : 'accent'
                            }
                            size="xs"
                          >
                            {report.status}
                          </Badge>
                          <span className="text-xs text-ink-muted">
                            {new Date(report.createdAt).toLocaleDateString()}
                          </span>
                        </div>

                        <h4 className="text-base font-bold text-ink">
                          Topic: {report.topic?.title || 'Unknown Topic'}{' '}
                          {report.topic?.key && (
                            <span className="text-xs text-ink-muted font-normal">
                              ({report.topic.key})
                            </span>
                          )}
                        </h4>

                        {report.reporter && (
                          <p className="text-xs text-ink-muted">
                            Reported by <strong>{report.reporter.displayName}</strong> ({report.reporter.email})
                          </p>
                        )}
                      </div>

                      {/* Action buttons */}
                      {isOpen && (
                        <div className="flex items-center gap-2 shrink-0">
                          <Button
                            size="sm"
                            variant="primary"
                            onClick={() => handleResolveReport(report.id, 'resolved')}
                            className="text-xs"
                          >
                            <Check className="w-3.5 h-3.5 mr-1" />
                            Resolve
                          </Button>
                          <Button
                            size="sm"
                            variant="secondary"
                            onClick={() => handleResolveReport(report.id, 'dismissed')}
                            className="text-xs"
                          >
                            <X className="w-3.5 h-3.5 mr-1" />
                            Dismiss
                          </Button>
                        </div>
                      )}
                    </div>

                    {report.description && (
                      <div className="p-3 rounded-lg bg-surface-subtle border border-border text-sm text-ink leading-relaxed">
                        {report.description}
                      </div>
                    )}
                  </Card>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Create Roadmap Modal */}
      <Modal
        isOpen={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
        title="Create New Learning Roadmap"
        description="Initialize a new curated roadmap in draft status. You can configure modules and topics in the editor afterwards."
      >
        <form onSubmit={handleCreateRoadmap} className="space-y-4">
          {createError && (
            <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{createError}</span>
            </div>
          )}

          <div className="space-y-1">
            <label className="block text-xs font-semibold text-ink-muted uppercase tracking-wider">
              Roadmap Title <span className="text-red-500">*</span>
            </label>
            <Input
              value={newTitle}
              onChange={(e) => handleTitleChange(e.target.value)}
              placeholder="e.g. Distributed Systems Engineering"
              required
            />
          </div>

          <div className="space-y-1">
            <label className="block text-xs font-semibold text-ink-muted uppercase tracking-wider">
              Unique URL Slug <span className="text-red-500">*</span>
            </label>
            <Input
              value={newSlug}
              onChange={(e) => setNewSlug(e.target.value)}
              placeholder="e.g. distributed-systems"
              required
            />
            <p className="text-[11px] text-ink-muted">
              Used in public URL: /roadmaps/<strong>{newSlug || 'slug'}</strong>
            </p>
          </div>

          <div className="space-y-1">
            <label className="block text-xs font-semibold text-ink-muted uppercase tracking-wider">
              Target Outcome <span className="text-red-500">*</span>
            </label>
            <textarea
              value={newOutcome}
              onChange={(e) => setNewOutcome(e.target.value)}
              placeholder="What practical capability will the learner acquire upon completion?"
              rows={2}
              required
              className="w-full px-3 py-2 rounded-lg border border-border bg-canvas text-sm text-ink focus:outline-none focus:ring-2 focus:ring-brand/40 focus:border-brand"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="space-y-1">
              <label className="block text-xs font-semibold text-ink-muted uppercase tracking-wider">
                Proficiency Level
              </label>
              <select
                value={newLevel}
                onChange={(e) => setNewLevel(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-border bg-canvas text-sm text-ink focus:outline-none focus:ring-2 focus:ring-brand/40 focus:border-brand"
              >
                <option value="Beginner">Beginner</option>
                <option value="Intermediate">Intermediate</option>
                <option value="Advanced">Advanced</option>
                <option value="All Levels">All Levels</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="block text-xs font-semibold text-ink-muted uppercase tracking-wider">
                Est. Total Hours
              </label>
              <Input
                type="number"
                min="1"
                max="500"
                value={newHours}
                onChange={(e) => setNewHours(e.target.value)}
                required
              />
            </div>

            <div className="space-y-1">
              <label className="block text-xs font-semibold text-ink-muted uppercase tracking-wider">
                Weekly Pace (Hrs)
              </label>
              <Input
                type="number"
                min="1"
                max="40"
                value={newWeeklyPace}
                onChange={(e) => setNewWeeklyPace(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="pt-3 border-t border-border flex justify-end gap-2">
            <Button
              variant="secondary"
              type="button"
              onClick={() => setCreateModalOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit" loading={submittingRoadmap}>
              Create Roadmap Draft
            </Button>
          </div>
        </form>
      </Modal>
    </PageContainer>
  );
}
