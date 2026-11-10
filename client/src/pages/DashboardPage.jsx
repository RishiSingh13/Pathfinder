import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import {
  Compass,
  PlayCircle,
  BookOpen,
  CheckCircle2,
  Clock,
  Settings,
  Archive,
  ArrowRight,
  TrendingUp,
  Award,
  Layers,
  Calendar,
} from 'lucide-react';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import PageContainer from '../components/layout/PageContainer';
import ProgressFraction from '../components/roadmap/ProgressFraction';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import Modal from '../components/ui/Modal';
import EmptyState from '../components/ui/EmptyState';
import ErrorAlert from '../components/ui/ErrorAlert';
import { Skeleton } from '../components/ui/Skeleton';
import WeeklyPaceModal from '../components/dashboard/WeeklyPaceModal';

export default function DashboardPage() {
  const { user } = useAuth();
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Modal states
  const [editingEnrolment, setEditingEnrolment] = useState(null);
  const [archivingEnrolment, setArchivingEnrolment] = useState(null);
  const [archiving, setArchiving] = useState(false);

  const fetchDashboard = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await api.progress.getDashboard();
      if (res.data) {
        setDashboardData(res.data);
      }
    } catch (err) {
      setError(err.message || 'Failed to load dashboard.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDashboard();
  }, [fetchDashboard]);

  const handleUpdatePace = async (slug, weeklyHours) => {
    await api.progress.updateEnrolment(slug, { weeklyHours });
    await fetchDashboard();
  };

  const handleArchive = async () => {
    if (!archivingEnrolment) return;
    setArchiving(true);
    try {
      await api.progress.unenroll(archivingEnrolment.roadmap.slug);
      setArchivingEnrolment(null);
      await fetchDashboard();
    } catch (err) {
      setError(err.message || 'Failed to archive enrollment.');
    } finally {
      setArchiving(false);
    }
  };

  if (loading) {
    return (
      <PageContainer>
        <div className="space-y-6 animate-pulse">
          <Skeleton className="h-8 w-48" />
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <Skeleton className="h-20" />
            <Skeleton className="h-20" />
            <Skeleton className="h-20" />
            <Skeleton className="h-20" />
          </div>
          <Skeleton className="h-48" />
          <Skeleton className="h-48" />
        </div>
      </PageContainer>
    );
  }

  if (error && !dashboardData) {
    return (
      <PageContainer>
        <ErrorAlert
          title="Could not load dashboard"
          message={error}
          onRetry={fetchDashboard}
          className="max-w-xl mx-auto my-12"
        />
      </PageContainer>
    );
  }

  const enrolments = dashboardData?.enrolments || [];
  const recentlyTouched = dashboardData?.recentlyTouched || [];
  const summary = dashboardData?.summary || {
    totalEnrolled: 0,
    completedRoadmaps: 0,
    totalCoreTopicsCompleted: 0,
    totalRemainingHours: 0,
  };

  const levelVariantMap = {
    Beginner: 'brand',
    Intermediate: 'accent',
    Advanced: 'danger',
    'All Levels': 'info',
  };

  return (
    <PageContainer>
      {/* Header */}
      <div className="mb-8 space-y-1">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-ink tracking-tight">
          Welcome back, {user?.displayName}
        </h1>
        <p className="text-sm text-ink-muted">
          Your active learning commitments, core progress fractions, and deterministic next actions.
        </p>
      </div>

      {/* Summary KPI Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
        <Card className="p-4 bg-surface">
          <div className="flex items-center gap-2 text-ink-muted text-xs font-medium mb-1">
            <Layers className="w-4 h-4 text-brand" />
            <span>Active Roadmaps</span>
          </div>
          <div className="text-2xl font-extrabold text-ink tabular-nums">
            {summary.totalEnrolled}
          </div>
        </Card>

        <Card className="p-4 bg-surface">
          <div className="flex items-center gap-2 text-ink-muted text-xs font-medium mb-1">
            <CheckCircle2 className="w-4 h-4 text-brand" />
            <span>Core Completed</span>
          </div>
          <div className="text-2xl font-extrabold text-ink tabular-nums">
            {summary.totalCoreTopicsCompleted}
          </div>
        </Card>

        <Card className="p-4 bg-surface">
          <div className="flex items-center gap-2 text-ink-muted text-xs font-medium mb-1">
            <Clock className="w-4 h-4 text-accent" />
            <span>Est. Remaining</span>
          </div>
          <div className="text-2xl font-extrabold text-ink tabular-nums">
            ~{summary.totalRemainingHours}h
          </div>
        </Card>

        <Card className="p-4 bg-surface">
          <div className="flex items-center gap-2 text-ink-muted text-xs font-medium mb-1">
            <Award className="w-4 h-4 text-emerald-600" />
            <span>Pathways Mastered</span>
          </div>
          <div className="text-2xl font-extrabold text-ink tabular-nums">
            {summary.completedRoadmaps}
          </div>
        </Card>
      </div>

      {/* Main Content Layout */}
      {enrolments.length === 0 ? (
        <EmptyState
          icon={Compass}
          title="No active roadmap enrollments"
          description="Browse our curated catalogue to choose a sequenced engineering roadmap that fits your learning goals."
          actionLabel="Browse Published Roadmaps"
          onAction={() => (window.location.href = '/catalogue')}
          className="my-8"
        />
      ) : (
        <div className="space-y-8">
          {/* Active Enrollments Section */}
          <section className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-ink flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-brand" />
                Active Learning Roadmaps ({enrolments.length})
              </h2>
              <Link to="/catalogue" className="text-xs font-semibold text-brand hover:underline">
                Explore more roadmaps
              </Link>
            </div>

            <div className="space-y-5">
              {enrolments.map((enrol) => {
                const { roadmap, metrics, weeklyHours } = enrol;
                const resumeTopic = metrics.resumeTopic;

                return (
                  <Card key={enrol.id} className="p-6 bg-surface space-y-5">
                    {/* Roadmap Header & Metadata */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <Badge variant={levelVariantMap[roadmap.level] || 'neutral'} size="xs">
                            {roadmap.level}
                          </Badge>
                          <span className="text-xs text-ink-muted">
                            ~{roadmap.totalHours}h total · {weeklyHours}h/week pace
                          </span>
                        </div>
                        <h3 className="text-xl font-bold text-ink hover:text-brand transition-colors">
                          <Link to={`/roadmaps/${roadmap.slug}`}>{roadmap.title}</Link>
                        </h3>
                      </div>

                      {/* Controls */}
                      <div className="flex items-center gap-2 self-start sm:self-auto">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setEditingEnrolment(enrol)}
                          className="text-xs text-ink-muted hover:text-ink"
                        >
                          <Settings className="w-3.5 h-3.5 mr-1" />
                          Set Pace
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setArchivingEnrolment(enrol)}
                          className="text-xs text-ink-muted hover:text-red-600"
                        >
                          <Archive className="w-3.5 h-3.5 mr-1" />
                          Archive
                        </Button>
                      </div>
                    </div>

                    {/* Progress Fraction Bar */}
                    <div className="bg-surface-subtle p-4 rounded-xl border border-border">
                      <ProgressFraction
                        completedCoreCount={metrics.completedCoreCount}
                        totalCoreCount={metrics.totalCoreCount}
                        percentage={metrics.percentage}
                        studiedCoreCount={metrics.studiedCoreCount}
                        knownCoreCount={metrics.knownCoreCount}
                        size="md"
                      />
                    </div>

                    {/* Deterministic Resume Action Banner */}
                    <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 border-t border-border/70">
                      <div className="space-y-0.5">
                        <span className="text-[11px] font-bold uppercase tracking-wider text-brand">
                          {metrics.resumeReason || 'Deterministic Next Step'}
                        </span>
                        {resumeTopic ? (
                          <p className="text-sm font-semibold text-ink">
                            {resumeTopic.title}{' '}
                            <span className="text-xs font-normal text-ink-muted">
                              ({resumeTopic.estimatedMinutes} mins · {resumeTopic.type})
                            </span>
                          </p>
                        ) : (
                          <p className="text-sm font-semibold text-emerald-700">
                            You have completed all core topics in this roadmap!
                          </p>
                        )}
                      </div>

                      {resumeTopic ? (
                        <Link to={`/roadmaps/${roadmap.slug}/topics/${resumeTopic.key}`}>
                          <Button size="md" className="w-full sm:w-auto font-semibold">
                            <PlayCircle className="w-4 h-4 mr-2" />
                            Continue Learning
                          </Button>
                        </Link>
                      ) : (
                        <Link to={`/roadmaps/${roadmap.slug}`}>
                          <Button variant="secondary" size="md" className="w-full sm:w-auto">
                            Review Curriculum
                          </Button>
                        </Link>
                      )}
                    </div>
                  </Card>
                );
              })}
            </div>
          </section>

          {/* Recently Studied Topics Ledger */}
          {recentlyTouched.length > 0 && (
            <section className="space-y-3 pt-4">
              <h2 className="text-base font-bold text-ink flex items-center gap-2">
                <Clock className="w-4 h-4 text-brand" />
                Recently Studied Topics
              </h2>
              <div className="bg-surface rounded-xl border border-border divide-y divide-border/60 overflow-hidden">
                {recentlyTouched.map((item, idx) => (
                  <div
                    key={idx}
                    className="p-3.5 sm:px-5 flex items-center justify-between gap-4 hover:bg-surface-subtle transition-colors"
                  >
                    <div>
                      <Link
                        to={`/roadmaps/${item.roadmapSlug}/topics/${item.key}`}
                        className="text-sm font-medium text-ink hover:text-brand transition-colors"
                      >
                        {item.title}
                      </Link>
                      <div className="flex items-center gap-2 text-xs text-ink-muted mt-0.5">
                        <span className="text-brand font-medium">{item.roadmapTitle}</span>
                        <span>·</span>
                        <span className="capitalize">{item.status.replace('_', ' ')}</span>
                      </div>
                    </div>

                    <Link to={`/roadmaps/${item.roadmapSlug}/topics/${item.key}`}>
                      <Button variant="ghost" size="sm" className="text-xs">
                        Open
                        <ArrowRight className="w-3.5 h-3.5 ml-1" />
                      </Button>
                    </Link>
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>
      )}

      {/* Edit Weekly Pace Modal */}
      <WeeklyPaceModal
        isOpen={!!editingEnrolment}
        onClose={() => setEditingEnrolment(null)}
        enrolment={editingEnrolment}
        onUpdatePace={handleUpdatePace}
      />

      {/* Archive Confirmation Modal */}
      <Modal
        isOpen={!!archivingEnrolment}
        onClose={() => setArchivingEnrolment(null)}
        title="Archive Enrollment?"
        description={`Are you sure you want to archive your enrollment in "${archivingEnrolment?.roadmap?.title}"?`}
      >
        <div className="space-y-4">
          <p className="text-xs text-ink-muted leading-relaxed">
            Your completed topic records and study history will be safely preserved. You can re-enroll anytime from the catalogue to pick up where you left off.
          </p>
          <div className="pt-4 border-t border-border flex justify-end gap-2">
            <Button variant="secondary" onClick={() => setArchivingEnrolment(null)}>
              Cancel
            </Button>
            <Button variant="danger" loading={archiving} onClick={handleArchive}>
              Archive Enrollment
            </Button>
          </div>
        </div>
      </Modal>
    </PageContainer>
  );
}
