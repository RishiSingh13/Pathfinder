import React from 'react';
import { Link } from 'react-router-dom';
import { Clock, BookOpen, ArrowRight, Calendar, UserCheck } from 'lucide-react';
import Card from '../ui/Card';
import Badge from '../ui/Badge';

export default function RoadmapCard({ roadmap }) {
  const {
    title,
    slug,
    outcome,
    level = 'Beginner',
    estimatedHours,
    weeklyPaceHours = 5,
    estimatedWeeks,
    topicCount = 0,
    coreTopicCount = 0,
    curator,
    lastReviewedDate,
  } = roadmap;

  const levelVariantMap = {
    Beginner: 'brand',
    Intermediate: 'accent',
    Advanced: 'danger',
    'All Levels': 'info',
  };

  return (
    <Card hover className="p-6 flex flex-col justify-between h-full bg-surface">
      <div className="space-y-3">
        {/* Top Badges */}
        <div className="flex items-center justify-between gap-2">
          <Badge variant={levelVariantMap[level] || 'neutral'} size="xs">
            {level}
          </Badge>
          <div className="flex items-center gap-1 text-[11px] text-ink-muted">
            <Clock className="w-3.5 h-3.5" />
            <span>~{estimatedHours}h ({estimatedWeeks || Math.ceil(estimatedHours / weeklyPaceHours)}w at {weeklyPaceHours}h/w)</span>
          </div>
        </div>

        {/* Title and Outcome */}
        <div>
          <h3 className="text-lg font-bold text-ink hover:text-brand transition-colors line-clamp-1">
            <Link to={`/roadmaps/${slug}`}>{title}</Link>
          </h3>
          <p className="text-xs text-ink-muted mt-1 line-clamp-2 leading-relaxed">
            {outcome}
          </p>
        </div>

        {/* Curriculum Stats */}
        <div className="flex flex-wrap items-center gap-4 text-xs text-ink-muted pt-1">
          <div className="flex items-center gap-1.5">
            <BookOpen className="w-3.5 h-3.5 text-brand" />
            <span>
              <strong className="text-ink font-semibold">{coreTopicCount}</strong> core topics
              {topicCount > coreTopicCount && ` (${topicCount - coreTopicCount} optional)`}
            </span>
          </div>
        </div>
      </div>

      {/* Footer Info & Action */}
      <div className="pt-4 mt-5 border-t border-border flex items-center justify-between gap-3">
        <div className="flex flex-col text-[11px] text-ink-muted">
          {curator && (
            <span className="flex items-center gap-1">
              <UserCheck className="w-3 h-3 text-brand" />
              <span>{curator}</span>
            </span>
          )}
          {lastReviewedDate && (
            <span className="flex items-center gap-1 text-ink-faint">
              <Calendar className="w-3 h-3" />
              <span>Verified {lastReviewedDate}</span>
            </span>
          )}
        </div>

        <Link
          to={`/roadmaps/${slug}`}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-brand hover:text-brand-hover hover:underline"
        >
          <span>Explore</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </Card>
  );
}
