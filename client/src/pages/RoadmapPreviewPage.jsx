import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  Clock,
  BookOpen,
  CheckCircle2,
  Calendar,
  UserCheck,
  ChevronDown,
  ChevronRight,
  ArrowRight,
  Layers,
  ArrowLeft,
  PlayCircle,
  AlertTriangle,
  HelpCircle,
  ExternalLink,
} from 'lucide-react';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import PageContainer from '../components/layout/PageContainer';
import Badge from '../components/ui/Badge';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import Modal from '../components/ui/Modal';
import ProgressFraction from '../components/roadmap/ProgressFraction';
import ErrorAlert from '../components/ui/ErrorAlert';
import { Skeleton } from '../components/ui/Skeleton';

export default function RoadmapPreviewPage() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();

  const [roadmap, setRoadmap] = useState(null);
  const [modules, setModules] = useState([]);
  const [sampleTopic, setSampleTopic] = useState(null);
  const [userEnrolment, setUserEnrolment] = useState(null);
  const [progressMetrics, setProgressMetrics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Enrollment modal state
  const [enrollModalOpen, setEnrollModalOpen] = useState(false);
  const [weeklyHours, setWeeklyHours] = useState(5);
  const [enrolling, setEnrolling] = useState(false);
  const [enrollError, setEnrollError] = useState(null);

  // Accordion state: map of moduleId -> boolean
  const [expandedModules, setExpandedModules] = useState({});

  useEffect(() => {
    async function loadRoadmap() {
      try {
        setLoading(true);
        setError(null);
        const res = await api.roadmaps.getPreview(slug);
        if (res.data?.roadmap) {
          setRoadmap(res.data.roadmap);
          setModules(res.data.modules || []);
          setSampleTopic(res.data.sampleTopic || null);
          setUserEnrolment(res.data.userEnrolment || null);
          setProgressMetrics(res.data.progressMetrics || null);
          setWeeklyHours(res.data.roadmap.weeklyPaceHours || 5);

          // Expand all modules by default for easy scanning
          const initialExpanded = {};
          (res.data.modules || []).forEach((m) => {
            initialExpanded[m.id] = true;
          });
          setExpandedModules(initialExpanded);
        }
      } catch (err) {
        setError(err.message || 'Failed to load roadmap.');
      } finally {
        setLoading(false);
      }
    }
    loadRoadmap();
  }, [slug]);

  const toggleModule = (modId) => {
    setExpandedModules((prev) => ({
      ...prev,
      [modId]: !prev[modId],
    }));
  };

  const handleEnroll = async (e) => {
    e.preventDefault();
    setEnrolling(true);
    setEnrollError(null);
    try {
      const res = await api.progress.enroll(slug, {
        weeklyHours: parseInt(weeklyHours, 10),
      });
      setUserEnrolment(res.data?.enrolment || { status: 'active', weeklyHours });
      setProgressMetrics(res.data?.metrics || null);
      setEnrollModalOpen(false);
    } catch (err) {
      setEnrollError(err.message || 'Failed to enroll in this roadmap.');
    } finally {
      setEnrolling(false);
    }
  };

  if (loading) {
    return (
      <PageContainer>
        <div className="space-y-6 animate-pulse">
          <Skeleton className="h-4 w-28" />
          <Skeleton className="h-10 w-2/3" />
          <Skeleton className="h-24 w-full" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Skeleton className="h-64 col-span-2" />
            <Skeleton className="h-64 col-span-1" />
          </div>
        </div>
      </PageContainer>
    );
  }

  if (error || !roadmap) {
    return (
      <PageContainer>
        <div className="max-w-xl mx-auto py-12">
          <ErrorAlert
            title="Roadmap unavailable"
            message={error || 'The requested roadmap could not be found.'}
            className="mb-4"
          />
          <Link to="/catalogue">
            <Button variant="secondary" size="sm">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Catalogue
            </Button>
          </Link>
        </div>
      </PageContainer>
    );
  }

  const levelVariantMap = {
    Beginner: 'brand',
    Intermediate: 'accent',
    Advanced: 'danger',
    'All Levels': 'info',
  };

  const isEnrolled = userEnrolment && userEnrolment.status === 'active';

  return (
    <PageContainer>
      {/* Breadcrumbs */}
      <nav className="flex items-center gap-2 text-xs text-ink-muted mb-6">
        <Link to="/catalogue" className="hover:text-ink">
          Catalogue
        </Link>
        <span>/</span>
        <span className="text-ink font-medium">{roadmap.title}</span>
      </nav>

      {/* Hero Header */}
      <div className="bg-surface rounded-2xl border border-border p-6 sm:p-8 shadow-sm mb-8 space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <Badge variant={levelVariantMap[roadmap.level] || 'neutral'} size="md">
              {roadmap.level}
            </Badge>
            <span className="text-xs text-ink-muted flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-brand" />
              ~{roadmap.estimatedHours} hours total ({roadmap.estimatedWeeks} weeks at {roadmap.weeklyPaceHours}h/week)
            </span>
          </div>

          <div className="flex items-center gap-4 text-xs text-ink-muted">
            {roadmap.curator && (
              <span className="flex items-center gap-1.5">
                <UserCheck className="w-3.5 h-3.5 text-brand" />
                <span>Curated by <strong>{roadmap.curator}</strong></span>
              </span>
            )}
            {roadmap.lastReviewedDate && (
              <span className="flex items-center gap-1.5 text-ink-faint">
                <Calendar className="w-3.5 h-3.5" />
                <span>Reviewed {roadmap.lastReviewedDate}</span>
              </span>
            )}
          </div>
        </div>

        <div>
          <h1 className="text-2xl sm:text-4xl font-extrabold text-ink tracking-tight">
            {roadmap.title}
          </h1>
          <p className="mt-3 text-base text-ink-muted leading-relaxed">
            {roadmap.outcome}
          </p>
        </div>

        {/* Action Panel based on enrollment & auth state */}
        <div className="pt-6 border-t border-border flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 bg-surface-subtle -mx-6 -mb-6 sm:-mx-8 sm:-mb-8 p-6 sm:p-8 rounded-b-2xl">
          {isEnrolled ? (
            <div className="w-full space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-sm font-bold text-ink">You are enrolled in this roadmap</span>
                  <span className="text-xs text-ink-muted">({userEnrolment.weeklyHours}h/week pace)</span>
                </div>

                {progressMetrics?.resumeTopic && (
                  <Link to={`/roadmaps/${slug}/topics/${progressMetrics.resumeTopic.key}`}>
                    <Button variant="primary" size="md">
                      <PlayCircle className="w-4 h-4 mr-2" />
                      Continue: {progressMetrics.resumeTopic.title}
                    </Button>
                  </Link>
                )}
              </div>

              {progressMetrics && (
                <div className="max-w-md bg-surface p-3.5 rounded-lg border border-border">
                  <ProgressFraction
                    completedCoreCount={progressMetrics.completedCoreCount}
                    totalCoreCount={progressMetrics.totalCoreCount}
                    percentage={progressMetrics.percentage}
                    studiedCoreCount={progressMetrics.studiedCoreCount}
                    knownCoreCount={progressMetrics.knownCoreCount}
                  />
                </div>
              )}
            </div>
          ) : isAuthenticated ? (
            <div className="w-full flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h4 className="text-sm font-semibold text-ink">Ready to start this pathway?</h4>
                <p className="text-xs text-ink-muted mt-0.5">
                  Enroll to track your topic completions, save your weekly pace, and resume seamlessly.
                </p>
              </div>
              <Button size="md" onClick={() => setEnrollModalOpen(true)}>
                Enroll in Roadmap
                <ArrowRight className="w-4 h-4 ml-1.5" />
              </Button>
            </div>
          ) : (
            <div className="w-full flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h4 className="text-sm font-semibold text-ink">Sign in to save your personal progress</h4>
                <p className="text-xs text-ink-muted mt-0.5">
                  Browse the curriculum freely, or sign in to track completed core topics.
                </p>
              </div>
              <Link to={`/login?redirect=/roadmaps/${slug}`}>
                <Button size="md">
                  Sign In to Enroll
                  <ArrowRight className="w-4 h-4 ml-1.5" />
                </Button>
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Main Grid: Curriculum Outline & Metadata */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Sequenced Module & Topic Outline */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-ink flex items-center gap-2">
              <Layers className="w-5 h-5 text-brand" />
              Curriculum Outline
            </h2>
            <span className="text-xs text-ink-muted">
              {modules.length} modules ·{' '}
              {modules.reduce((sum, m) => sum + (m.topics || []).length, 0)} total topics
            </span>
          </div>

          <div className="space-y-4">
            {modules.map((m, idx) => {
              const isExpanded = !!expandedModules[m.id];
              const topicList = m.topics || [];
              const coreCount = topicList.filter((t) => t.type === 'core').length;

              return (
                <div
                  key={m.id}
                  className="bg-surface rounded-xl border border-border shadow-xs overflow-hidden transition-colors"
                >
                  {/* Module Header Bar */}
                  <button
                    type="button"
                    onClick={() => toggleModule(m.id)}
                    className="w-full text-left p-4 sm:p-5 flex items-start justify-between gap-4 hover:bg-surface-subtle transition-colors focus:outline-none focus:bg-surface-subtle"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-semibold uppercase tracking-wider text-brand">
                          {m.phaseLabel}
                        </span>
                        <span className="text-xs text-ink-muted">· ~{m.estimatedHours}h</span>
                      </div>
                      <h3 className="text-base font-bold text-ink">{m.title}</h3>
                      {m.description && (
                        <p className="text-xs text-ink-muted line-clamp-1">{m.description}</p>
                      )}
                    </div>

                    <div className="flex items-center gap-3 shrink-0 pt-1">
                      <span className="text-xs font-medium text-ink-muted">
                        {coreCount} core topics
                      </span>
                      <div className="text-ink-muted">
                        {isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                      </div>
                    </div>
                  </button>

                  {/* Topics List */}
                  {isExpanded && (
                    <div className="border-t border-border/60 divide-y divide-border/40 bg-surface">
                      {topicList.map((t, tIdx) => (
                        <div
                          key={t.id || t.key}
                          className="px-5 py-3.5 flex items-center justify-between gap-3 hover:bg-surface-subtle transition-colors group"
                        >
                          <div className="flex items-center gap-3">
                            <span className="text-xs font-mono text-ink-muted/70 w-5 text-right">
                              {tIdx + 1}.
                            </span>
                            <div>
                              <Link
                                to={`/roadmaps/${slug}/topics/${t.key}`}
                                className="text-sm font-medium text-ink group-hover:text-brand transition-colors flex items-center gap-1.5"
                              >
                                <span>{t.title}</span>
                              </Link>
                              <div className="flex items-center gap-2 mt-0.5">
                                <span className="text-[11px] text-ink-muted">{t.estimatedMinutes} mins</span>
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center gap-2">
                            <Badge
                              variant={
                                t.type === 'core'
                                  ? 'brand'
                                  : t.type === 'optional'
                                  ? 'neutral'
                                  : 'accent'
                              }
                              size="xs"
                            >
                              {t.type}
                            </Badge>
                            <Link
                              to={`/roadmaps/${slug}/topics/${t.key}`}
                              className="text-xs font-semibold text-brand hover:text-brand-hover p-1 rounded hover:bg-brand-light transition-colors"
                              aria-label={`View topic: ${t.title}`}
                            >
                              <ArrowRight className="w-3.5 h-3.5" />
                            </Link>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Pedagogical Details & Sample Topic */}
        <div className="space-y-6">
          {/* Prerequisites Card */}
          {roadmap.prerequisites && roadmap.prerequisites.length > 0 && (
            <Card className="p-5 bg-surface space-y-3">
              <h3 className="text-sm font-bold text-ink flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-brand" />
                Recommended Prerequisites
              </h3>
              <ul className="space-y-2 text-xs text-ink-muted">
                {roadmap.prerequisites.map((req, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-brand font-bold">·</span>
                    <span>{req}</span>
                  </li>
                ))}
              </ul>
            </Card>
          )}

          {/* Scope Boundaries */}
          {roadmap.whatIsOutOfScope && roadmap.whatIsOutOfScope.length > 0 && (
            <Card className="p-5 bg-surface space-y-3">
              <h3 className="text-sm font-bold text-ink flex items-center gap-1.5">
                <HelpCircle className="w-4 h-4 text-ink-muted" />
                What is Explicitly Out of Scope
              </h3>
              <ul className="space-y-2 text-xs text-ink-muted">
                {roadmap.whatIsOutOfScope.map((item, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-ink-faint">×</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </Card>
          )}

          {/* Sample Topic Highlight */}
          {sampleTopic && (
            <Card className="p-5 bg-surface-subtle border-brand-border space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold uppercase tracking-wider text-brand">
                  Sample Topic Preview
                </span>
                <Badge variant="brand" size="xs">
                  {sampleTopic.type}
                </Badge>
              </div>

              <div>
                <h4 className="text-sm font-bold text-ink">{sampleTopic.title}</h4>
                <p className="text-xs text-ink-muted mt-0.5">
                  Estimated study time: {sampleTopic.estimatedMinutes} minutes
                </p>
              </div>

              {sampleTopic.objectives && sampleTopic.objectives.length > 0 && (
                <div className="space-y-1 pt-1">
                  <span className="text-[11px] font-semibold text-ink">Learning objectives:</span>
                  <ul className="text-xs text-ink-muted space-y-1">
                    {sampleTopic.objectives.slice(0, 3).map((obj, i) => (
                      <li key={i} className="flex items-start gap-1.5">
                        <span className="text-brand font-bold">✓</span>
                        <span className="line-clamp-1">{obj}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="pt-2">
                <Link to={`/roadmaps/${slug}/topics/${sampleTopic.key}`}>
                  <Button variant="outline" size="sm" className="w-full text-xs">
                    Inspect Full Topic Guide
                    <ArrowRight className="w-3.5 h-3.5 ml-1" />
                  </Button>
                </Link>
              </div>
            </Card>
          )}
        </div>
      </div>

      {/* Enrollment Modal */}
      <Modal
        isOpen={enrollModalOpen}
        onClose={() => setEnrollModalOpen(false)}
        title={`Enroll in ${roadmap.title}`}
        description="Select your target weekly pace. You can update this target anytime from your private dashboard."
      >
        <form onSubmit={handleEnroll} className="space-y-4">
          {enrollError && (
            <ErrorAlert title="Enrollment failed" message={enrollError} />
          )}

          <div>
            <label htmlFor="weeklyHours" className="block text-sm font-medium text-ink mb-1.5">
              Weekly Study Commitment (hours per week)
            </label>
            <div className="flex items-center gap-3">
              <input
                id="weeklyHours"
                type="number"
                min="1"
                max="60"
                value={weeklyHours}
                onChange={(e) => setWeeklyHours(e.target.value)}
                className="w-24 px-3 py-2 bg-surface text-ink text-sm rounded-md border border-border focus:outline-none focus:ring-2 focus:ring-brand"
                required
              />
              <span className="text-xs text-ink-muted">
                At {weeklyHours} hours/week, completion takes approximately{' '}
                <strong>{Math.ceil(roadmap.estimatedHours / Math.max(1, weeklyHours))} weeks</strong>.
              </span>
            </div>
          </div>

          <div className="pt-4 border-t border-border flex justify-end gap-2">
            <Button variant="secondary" onClick={() => setEnrollModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" loading={enrolling}>
              Confirm Enrollment
            </Button>
          </div>
        </form>
      </Modal>
    </PageContainer>
  );
}
