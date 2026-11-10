import React, { useState, useEffect, useCallback } from 'react';
import { Search, Filter, X, RefreshCw } from 'lucide-react';
import { api } from '../services/api';
import PageContainer from '../components/layout/PageContainer';
import RoadmapCard from '../components/roadmap/RoadmapCard';
import { RoadmapCardSkeleton } from '../components/ui/Skeleton';
import EmptyState from '../components/ui/EmptyState';
import ErrorAlert from '../components/ui/ErrorAlert';
import Button from '../components/ui/Button';

export default function CataloguePage() {
  const [roadmaps, setRoadmaps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState('');
  const [level, setLevel] = useState('All');
  const [meta, setMeta] = useState({ total: 0 });

  const levels = ['All', 'Beginner', 'Intermediate', 'Advanced', 'All Levels'];

  const fetchRoadmaps = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await api.roadmaps.getCatalogue({
        search: search.trim() || undefined,
        level: level !== 'All' ? level : undefined,
      });
      if (res.data?.items) {
        setRoadmaps(res.data.items);
        setMeta(res.meta || { total: res.data.items.length });
      }
    } catch (err) {
      setError(err.message || 'Failed to load roadmaps.');
    } finally {
      setLoading(false);
    }
  }, [search, level]);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchRoadmaps();
    }, 250);
    return () => clearTimeout(timer);
  }, [fetchRoadmaps]);

  const handleClearFilters = () => {
    setSearch('');
    setLevel('All');
  };

  const hasActiveFilters = search.trim() !== '' || level !== 'All';

  return (
    <PageContainer>
      {/* Header */}
      <div className="mb-8 space-y-2">
        <h1 className="text-3xl font-extrabold text-ink tracking-tight">Roadmap Catalogue</h1>
        <p className="text-sm text-ink-muted max-w-2xl">
          Curated, outcome-oriented learning curricula. Select any roadmap to inspect its sequenced modules, time commitments, and study resources.
        </p>
      </div>

      {/* Filter and Search Controls */}
      <div className="bg-surface p-4 rounded-xl border border-border shadow-sm mb-8 space-y-4">
        <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center">
          {/* Search Box */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-muted pointer-events-none" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by roadmap title, topic, or expected outcome..."
              className="w-full pl-10 pr-9 py-2 text-sm bg-surface-subtle text-ink rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-brand focus:bg-surface transition-colors"
            />
            {search && (
              <button
                type="button"
                onClick={() => setSearch('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-muted hover:text-ink p-0.5 rounded"
                aria-label="Clear search input"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Clear Filters Button */}
          {hasActiveFilters && (
            <Button variant="ghost" size="sm" onClick={handleClearFilters} className="text-xs shrink-0">
              <RefreshCw className="w-3.5 h-3.5 mr-1.5" />
              Reset Filters
            </Button>
          )}
        </div>

        {/* Level Filter Pills */}
        <div className="flex flex-wrap items-center gap-2 pt-1 border-t border-border/50">
          <span className="text-xs font-semibold text-ink-muted flex items-center gap-1 mr-1">
            <Filter className="w-3 h-3" />
            Level:
          </span>
          {levels.map((lvl) => (
            <button
              key={lvl}
              type="button"
              onClick={() => setLevel(lvl)}
              className={`text-xs px-3 py-1 rounded-full font-medium transition-colors ${
                level === lvl
                  ? 'bg-brand text-white shadow-xs'
                  : 'bg-surface-subtle text-ink-muted hover:text-ink hover:bg-border'
              }`}
            >
              {lvl}
            </button>
          ))}
        </div>
      </div>

      {/* Results Count Summary */}
      <div className="flex items-center justify-between mb-6 text-xs text-ink-muted">
        <span>
          Showing <strong className="text-ink">{roadmaps.length}</strong> of{' '}
          <strong className="text-ink">{meta.total}</strong> published roadmaps
          {hasActiveFilters && ' (filtered)'}
        </span>
      </div>

      {/* Content Area */}
      {error ? (
        <ErrorAlert
          title="Could not load catalogue"
          message={error}
          onRetry={fetchRoadmaps}
          className="mb-8"
        />
      ) : loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <RoadmapCardSkeleton />
          <RoadmapCardSkeleton />
          <RoadmapCardSkeleton />
        </div>
      ) : roadmaps.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {roadmaps.map((rm) => (
            <RoadmapCard key={rm.id || rm.slug} roadmap={rm} />
          ))}
        </div>
      ) : (
        <EmptyState
          title="No published roadmaps match your criteria"
          description="Try clearing your search text or switching to another difficulty level."
          actionLabel="Clear All Filters"
          onAction={handleClearFilters}
        />
      )}
    </PageContainer>
  );
}
