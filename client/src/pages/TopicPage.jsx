import React, { useState, useEffect, useCallback } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  CheckCircle2,
  Lightbulb,
  Clock,
  ExternalLink,
  Code2,
  Flag,
  ChevronRight,
  Layers,
  Star,
  Zap,
  RotateCcw,
  PlayCircle,
} from 'lucide-react';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import PageContainer from '../components/layout/PageContainer';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import Card from '../components/ui/Card';
import { Skeleton } from '../components/ui/Skeleton';
import ErrorAlert from '../components/ui/ErrorAlert';
import ReportIssueModal from '../components/topic/ReportIssueModal';

// --- Type-to-colour / icon helpers ---
const topicTypeConfig = {
  core: { label: 'Core', variant: 'brand', icon: Layers },
  optional: { label: 'Optional', variant: 'info', icon: Star },
  stretch: { label: 'Stretch', variant: 'accent', icon: Zap },
};

const resourceRoleConfig = {
  primary: { label: 'Primary', className: 'text-brand font-semibold' },
  alternate: { label: 'Alternate', className: 'text-ink-muted' },
  optional_reading: { label: 'Extra', className: 'text-ink-muted italic' },
};

const difficultyConfig = {
  Easy: 'text-success bg-success-light border-success-border',
  Medium: 'text-accent bg-accent-light border-accent-border',
  Hard: 'text-danger bg-danger-light border-danger-border',
};

// --- Progress status action definitions ---
const statusActions = [
  {
    status: 'in_progress',
    label: 'Mark In Progress',
    icon: PlayCircle,
    className: 'border-info/40 bg-info-light text-info hover:bg-info-light/80',
    activeClassName: 'border-info bg-info-light text-info ring-2 ring-info/30',
  },
  {
    status: 'completed',
    label: 'Mark Completed',
    icon: CheckCircle2,
    className: 'border-success/40 bg-success-light text-success hover:bg-success-light/80',
    activeClassName: 'border-success bg-success-light text-success ring-2 ring-success/30',
  },
  {
    status: 'already_know',
    label: 'Already Know This',
    icon: Lightbulb,
    className: 'border-brand/40 bg-brand-light text-brand hover:bg-brand-light/80',
    activeClassName: 'border-brand bg-brand-light text-brand ring-2 ring-brand/30',
  },
  {
    status: 'not_started',
    label: 'Reset to Not Started',
    icon: RotateCcw,
    className: 'border-border bg-canvas text-ink-muted hover:bg-surface-subtle',
    activeClassName: 'border-border bg-canvas text-ink-muted',
  },
];

export default function TopicPage() {
  const { slug, topicKey } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Progress update state
  const [updatingStatus, setUpdatingStatus] = useState(false);
  const [localProgress, setLocalProgress] = useState(null); // optimistic UI

  // Enroll modal / action
  const [enrolling, setEnrolling] = useState(false);

  // Report modal
  const [reportModalOpen, setReportModalOpen] = useState(false);
  const [preselectedResource, setPreselectedResource] = useState(null);

  const fetchTopic = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.roadmaps.getTopic(slug, topicKey);
      setData(res.data);
      setLocalProgress(res.data?.userProgress || null);
    } catch (err) {
      setError(err.message || 'Failed to load topic.');
    } finally {
      setLoading(false);
    }
  }, [slug, topicKey]);

  useEffect(() => {
    fetchTopic();
  }, [fetchTopic]);

  const handleStatusUpdate = async (newStatus) => {
    if (!user) {
      navigate('/login');
      return;
    }
    if (!data?.isEnrolled) return; // Guard — should not be callable unless enrolled

    // Optimistic update
    const previousProgress = localProgress;
    setLocalProgress(newStatus === 'not_started' ? null : { status: newStatus });

    setUpdatingStatus(true);
    try {
      await api.progress.updateTopicStatus(slug, topicKey, newStatus);
    } catch (err) {
      // Revert on failure
      setLocalProgress(previousProgress);
    } finally {
      setUpdatingStatus(false);
    }
  };

  const handleEnroll = async () => {
    if (!user) {
      navigate('/login');
      return;
    }
    setEnrolling(true);
    try {
      await api.progress.enroll(slug, {});
      // Re-fetch to pick up new isEnrolled state
      await fetchTopic();
    } catch (err) {
      // Swallow — the user may already have an enrollment
      await fetchTopic();
    } finally {
      setEnrolling(false);
    }
  };

  const openReport = (resourceId = null) => {
    setPreselectedResource(resourceId);
    setReportModalOpen(true);
  };

  if (loading) {
    return (
      <PageContainer>
        <div className="space-y-6 animate-pulse">
          <Skeleton className="h-5 w-48" />
          <Skeleton className="h-10 w-3/4" />
          <Skeleton className="h-24" />
          <Skeleton className="h-48" />
          <Skeleton className="h-48" />
        </div>
      </PageContainer>
    );
  }

  if (error) {
    return (
      <PageContainer>
        <ErrorAlert
          title="Could not load topic"
          message={error}
          onRetry={fetchTopic}
          className="max-w-xl mx-auto my-12"
        />
      </PageContainer>
    );
  }

  const { roadmap, module: parentModule, topic, navigation, isEnrolled } = data;
  const currentStatus = localProgress?.status || null;
  const TypeIcon = topicTypeConfig[topic.type]?.icon || Layers;

  // Separate resources by role
  const primaryResources = topic.resources.filter((r) => r.role === 'primary');
  const alternateResources = topic.resources.filter((r) => r.role !== 'primary');

  return (
    <PageContainer maxWidth="max-w-4xl">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-1.5 text-xs text-ink-muted mb-6 flex-wrap">
        <Link to="/catalogue" className="hover:text-brand transition-colors">
          Catalogue
        </Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <Link to={`/roadmaps/${roadmap.slug}`} className="hover:text-brand transition-colors">
          {roadmap.title}
        </Link>
        {parentModule && (
          <>
            <ChevronRight className="w-3.5 h-3.5" />
            <span>{parentModule.phaseLabel || parentModule.title}</span>
          </>
        )}
        <ChevronRight className="w-3.5 h-3.5" />
        <span className="text-ink font-medium truncate max-w-[200px]">{topic.title}</span>
      </nav>

      {/* Topic header */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-3 flex-wrap">
          <Badge variant={topicTypeConfig[topic.type]?.variant || 'neutral'} size="sm">
            <TypeIcon className="w-3 h-3 mr-1" />
            {topicTypeConfig[topic.type]?.label || topic.type}
          </Badge>
          <span className="text-xs text-ink-muted flex items-center gap-1">
            <Clock className="w-3.5 h-3.5" />
            ~{topic.estimatedMinutes} minutes
          </span>
          <span className="text-xs text-ink-muted">
            Topic {navigation.position} of {navigation.total}
          </span>
        </div>

        <h1 className="text-2xl sm:text-3xl font-extrabold text-ink tracking-tight leading-tight mb-3">
          {topic.title}
        </h1>

        {topic.buildsOnNote && (
          <p className="text-sm text-ink-muted italic border-l-2 border-brand/40 pl-3">
            Builds on: {topic.buildsOnNote}
          </p>
        )}
      </div>

      {/* Enrollment / Progress CTA */}
      {user ? (
        isEnrolled ? (
          /* Progress Status Buttons */
          <Card className="p-4 mb-8 bg-surface border border-border">
            <p className="text-xs font-semibold text-ink-muted uppercase tracking-wider mb-3">
              Your Progress on This Topic
            </p>
            <div className="flex flex-wrap gap-2">
              {statusActions.map((action) => {
                const ActionIcon = action.icon;
                const isActive = currentStatus === action.status;
                const isNotStarted = action.status === 'not_started';
                // Don't show reset if topic isn't started
                if (isNotStarted && !currentStatus) return null;
                return (
                  <button
                    key={action.status}
                    onClick={() => !updatingStatus && handleStatusUpdate(action.status)}
                    disabled={updatingStatus || isActive}
<<<<<<< HEAD
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-sm font-medium transition-all duration-200 active:scale-95 hover:-translate-y-0.5 shadow-soft ${
                      isActive ? `${action.activeClassName} shadow-card scale-[1.02]` : action.className
=======
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-sm font-medium transition-all ${
                      isActive ? action.activeClassName : action.className
>>>>>>> ee7e2e0795074dda19dad019b6a85befd5f355d8
                    } disabled:opacity-60 disabled:cursor-default`}
                  >
                    <ActionIcon className="w-4 h-4" />
                    {isActive ? `✓ ${action.label}` : action.label}
                  </button>
                );
              })}
            </div>
            {!currentStatus && (
              <p className="text-xs text-ink-muted mt-2">
                Start this topic by clicking "Mark In Progress" or skip it with "Already Know This."
              </p>
            )}
          </Card>
        ) : (
          /* Enroll CTA */
          <Card className="p-4 mb-8 bg-brand/5 border border-brand/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <p className="text-sm font-semibold text-ink">
                Enroll in {roadmap.title} to track your progress
              </p>
              <p className="text-xs text-ink-muted mt-0.5">
                Track completed topics, pick up where you left off, and see your learning fraction.
              </p>
            </div>
            <Button size="sm" loading={enrolling} onClick={handleEnroll} className="shrink-0">
              Enroll Now
            </Button>
          </Card>
        )
      ) : (
        /* Sign-in CTA */
        <Card className="p-4 mb-8 bg-surface border border-border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <p className="text-sm text-ink-muted">
            <Link to="/login" className="text-brand font-semibold hover:underline">
              Sign in
            </Link>{' '}
            or{' '}
            <Link to="/register" className="text-brand font-semibold hover:underline">
              create a free account
            </Link>{' '}
            to track your progress on this roadmap.
          </p>
        </Card>
      )}

      {/* Learning Objectives */}
      {topic.objectives.length > 0 && (
        <section className="mb-8">
          <h2 className="text-base font-bold text-ink mb-3 flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-brand" />
            Learning Objectives
          </h2>
          <ul className="space-y-2">
            {topic.objectives.map((obj, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-ink">
                <CheckCircle2 className="w-4 h-4 text-brand mt-0.5 shrink-0" />
                <span>{obj}</span>
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* Resources */}
      {topic.resources.length > 0 && (
        <section className="mb-8">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-base font-bold text-ink flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-brand" />
              Curated Resources ({topic.resources.length})
            </h2>
            {user && isEnrolled && (
              <button
                onClick={() => openReport(null)}
                className="text-xs text-ink-muted hover:text-danger flex items-center gap-1 transition-colors"
              >
                <Flag className="w-3 h-3" />
                Report an issue
              </button>
            )}
          </div>

          <div className="space-y-3">
            {/* Primary resources first */}
            {primaryResources.map((resource) => (
              <ResourceCard
                key={resource.id}
                resource={resource}
                onReport={user && isEnrolled ? () => openReport(resource.id) : null}
              />
            ))}
            {/* Alternate & optional reading */}
            {alternateResources.length > 0 && (
              <>
                {primaryResources.length > 0 && (
                  <p className="text-xs text-ink-muted font-medium pt-1">
                    Alternate &amp; supplementary
                  </p>
                )}
                {alternateResources.map((resource) => (
                  <ResourceCard
                    key={resource.id}
                    resource={resource}
                    onReport={user && isEnrolled ? () => openReport(resource.id) : null}
                  />
                ))}
              </>
            )}
          </div>
        </section>
      )}

      {/* Practice Items */}
      {topic.practiceItems.length > 0 && (
        <section className="mb-8">
          <h2 className="text-base font-bold text-ink mb-3 flex items-center gap-2">
            <Code2 className="w-4 h-4 text-brand" />
            Practice Problems ({topic.practiceItems.length})
          </h2>
          <div className="space-y-2.5">
            {topic.practiceItems.map((item) => (
              <PracticeCard key={item.id} item={item} />
            ))}
          </div>
        </section>
      )}

      {/* Prev / Next Navigation */}
      <div className="pt-6 border-t border-border grid grid-cols-2 gap-4">
        <div>
          {navigation.prev ? (
            <Link to={`/roadmaps/${roadmap.slug}/topics/${navigation.prev.key}`}>
<<<<<<< HEAD
              <div className="group p-3 rounded-xl border border-border hover:border-brand/40 hover:bg-surface-subtle hover:-translate-y-0.5 hover:shadow-card transition-all duration-200">
                <div className="flex items-center gap-1 text-xs text-ink-muted mb-1">
                  <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-1 transition-transform duration-200" />
=======
              <div className="group p-3 rounded-xl border border-border hover:border-brand/40 hover:bg-surface-subtle transition-all">
                <div className="flex items-center gap-1 text-xs text-ink-muted mb-1">
                  <ArrowLeft className="w-3.5 h-3.5" />
>>>>>>> ee7e2e0795074dda19dad019b6a85befd5f355d8
                  <span>Previous</span>
                </div>
                <p className="text-sm font-semibold text-ink group-hover:text-brand transition-colors line-clamp-2">
                  {navigation.prev.title}
                </p>
                <span className="text-[11px] text-ink-muted capitalize">
                  {navigation.prev.type} · ~{navigation.prev.estimatedMinutes}m
                </span>
              </div>
            </Link>
          ) : (
            <Link to={`/roadmaps/${roadmap.slug}`}>
<<<<<<< HEAD
              <div className="group p-3 rounded-xl border border-border hover:border-brand/40 hover:bg-surface-subtle hover:-translate-y-0.5 hover:shadow-card transition-all duration-200">
                <div className="flex items-center gap-1 text-xs text-ink-muted mb-1">
                  <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-1 transition-transform duration-200" />
=======
              <div className="group p-3 rounded-xl border border-border hover:border-brand/40 hover:bg-surface-subtle transition-all">
                <div className="flex items-center gap-1 text-xs text-ink-muted mb-1">
                  <ArrowLeft className="w-3.5 h-3.5" />
>>>>>>> ee7e2e0795074dda19dad019b6a85befd5f355d8
                  <span>Back to Roadmap</span>
                </div>
                <p className="text-sm font-semibold text-ink group-hover:text-brand transition-colors">
                  {roadmap.title}
                </p>
              </div>
            </Link>
          )}
        </div>

        <div className="text-right">
          {navigation.next && (
            <Link to={`/roadmaps/${roadmap.slug}/topics/${navigation.next.key}`}>
<<<<<<< HEAD
              <div className="group p-3 rounded-xl border border-border hover:border-brand/40 hover:bg-surface-subtle hover:-translate-y-0.5 hover:shadow-card transition-all duration-200">
                <div className="flex items-center justify-end gap-1 text-xs text-ink-muted mb-1">
                  <span>Next</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform duration-200" />
=======
              <div className="group p-3 rounded-xl border border-border hover:border-brand/40 hover:bg-surface-subtle transition-all">
                <div className="flex items-center justify-end gap-1 text-xs text-ink-muted mb-1">
                  <span>Next</span>
                  <ArrowRight className="w-3.5 h-3.5" />
>>>>>>> ee7e2e0795074dda19dad019b6a85befd5f355d8
                </div>
                <p className="text-sm font-semibold text-ink group-hover:text-brand transition-colors line-clamp-2">
                  {navigation.next.title}
                </p>
                <span className="text-[11px] text-ink-muted capitalize">
                  {navigation.next.type} · ~{navigation.next.estimatedMinutes}m
                </span>
              </div>
            </Link>
          )}
        </div>
      </div>

      {/* Report Issue Modal */}
      <ReportIssueModal
        isOpen={reportModalOpen}
        onClose={() => {
          setReportModalOpen(false);
          setPreselectedResource(null);
        }}
        topicId={topic?.id}
        topicTitle={topic?.title}
        resources={topic?.resources || []}
        preselectedResourceId={preselectedResource}
      />
    </PageContainer>
  );
}

// --- Sub-components ---

function ResourceCard({ resource, onReport }) {
  const roleConfig = resourceRoleConfig[resource.role] || resourceRoleConfig.primary;

  return (
<<<<<<< HEAD
    <div className="p-4 rounded-xl border border-border bg-surface hover:border-brass/40 hover:-translate-y-0.5 hover:shadow-card transition-all duration-200 group">
=======
    <div className="p-4 rounded-xl border border-border bg-surface hover:border-brand/30 transition-colors group">
>>>>>>> ee7e2e0795074dda19dad019b6a85befd5f355d8
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          {/* Title and external link */}
          <div className="flex items-start gap-2">
            <a
              href={resource.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm font-semibold text-ink hover:text-brand transition-colors flex items-center gap-1.5 group-hover:text-brand"
            >
              {resource.title}
<<<<<<< HEAD
              <ExternalLink className="w-3.5 h-3.5 opacity-60 group-hover:opacity-100 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all shrink-0" />
=======
              <ExternalLink className="w-3.5 h-3.5 opacity-50 group-hover:opacity-100 shrink-0" />
>>>>>>> ee7e2e0795074dda19dad019b6a85befd5f355d8
            </a>
          </div>

          {/* Metadata row */}
          <div className="flex items-center gap-2 mt-1.5 flex-wrap">
            {resource.source && (
              <span className="text-xs text-ink-muted font-medium">{resource.source}</span>
            )}
            <span className="text-[11px] text-ink-subtle px-1.5 py-0.5 rounded-md bg-surface-subtle border border-border">
              {resource.type}
            </span>
            {resource.duration && (
              <span className="text-[11px] text-ink-muted flex items-center gap-0.5">
                <Clock className="w-3 h-3" />
                {resource.duration}
              </span>
            )}
            <span className={`text-[11px] ${roleConfig.className}`}>{roleConfig.label}</span>
          </div>

          {/* Curator reason */}
          {resource.reason && (
            <p className="text-xs text-ink-muted mt-1.5 italic leading-relaxed">
              {resource.reason}
            </p>
          )}
        </div>

        {/* Report button */}
        {onReport && (
          <button
            onClick={onReport}
            className="opacity-0 group-hover:opacity-100 transition-opacity text-ink-muted hover:text-danger p-1 rounded-md hover:bg-danger-light shrink-0"
            title="Report an issue with this resource"
          >
            <Flag className="w-3.5 h-3.5" />
          </button>
        )}
      </div>
    </div>
  );
}

function PracticeCard({ item }) {
  return (
    <a
      href={item.url}
      target="_blank"
      rel="noopener noreferrer"
<<<<<<< HEAD
      className="flex items-center justify-between p-3.5 rounded-xl border border-border bg-surface hover:border-brass/40 hover:bg-surface-subtle hover:-translate-y-0.5 hover:shadow-card transition-all duration-200 group"
=======
      className="flex items-center justify-between p-3.5 rounded-xl border border-border bg-surface hover:border-brand/30 hover:bg-surface-subtle transition-all group"
>>>>>>> ee7e2e0795074dda19dad019b6a85befd5f355d8
    >
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-ink group-hover:text-brand transition-colors">
          {item.title}
        </p>
        {item.description && (
          <p className="text-xs text-ink-muted mt-0.5 line-clamp-1">{item.description}</p>
        )}
        <div className="flex items-center gap-2 mt-1">
          {item.type && (
            <span className="text-[11px] text-ink-muted">{item.type}</span>
          )}
        </div>
      </div>
      <div className="flex items-center gap-2 shrink-0 ml-3">
        <span
          className={`text-[11px] px-2 py-0.5 rounded-md border font-medium ${
            difficultyConfig[item.difficulty] || 'text-ink-muted bg-surface border-border'
          }`}
        >
          {item.difficulty}
        </span>
        <ExternalLink className="w-3.5 h-3.5 text-ink-muted group-hover:text-brand transition-colors" />
      </div>
    </a>
  );
}
