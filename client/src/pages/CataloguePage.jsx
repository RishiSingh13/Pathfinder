import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Search, Filter, X, RefreshCw } from 'lucide-react';
import { api } from '../services/api';
import PageContainer from '../components/layout/PageContainer';
import RoadmapCard from '../components/roadmap/RoadmapCard';
import { RoadmapCardSkeleton } from '../components/ui/Skeleton';
import EmptyState from '../components/ui/EmptyState';
import ErrorAlert from '../components/ui/ErrorAlert';
import Button from '../components/ui/Button';
import Pop from '../components/motion/Pop';
import { Reveal, RevealGroup } from '../components/motion/Reveal';

export default function CataloguePage() {
  const [roadmaps, setRoadmaps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState('');
  const [level, setLevel] = useState('All');
  const [meta, setMeta] = useState({ total: 0 });

  const levels = ['All', 'Beginner', 'Intermediate', 'Advanced', 'All Levels'];
  const reqIdRef = useRef(0);

  const fetchRoadmaps = useCallback(async () => {
    const currentReqId = ++reqIdRef.current;
    try {
      setLoading(true);
      setError(null);
      const res = await api.roadmaps.getCatalogue({
        search: search.trim() || undefined,
        level: level !== 'All' ? level : undefined,
      });
      if (currentReqId === reqIdRef.current && res.data?.items) {
        setRoadmaps(res.data.items);
        setMeta(res.meta || { total: res.data.items.length });
      }
    } catch (err) {
      if (currentReqId === reqIdRef.current) {
        setError(err.message || 'Failed to load roadmaps.');
      }
    } finally {
      if (currentReqId === reqIdRef.current) {
        setLoading(false);
      }
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
      <Pop delay={50} className="mb-8 space-y-2">
        <div className="text-[11px] font-bold uppercase tracking-widest text-brass">
          Curated Catalog
        </div>
        <h1 className="text-3xl font-extrabold text-ink tracking-tight font-serif sm:font-sans">
          Roadmap Catalogue
        </h1>
        <p className="text-sm text-ink-muted max-w-2xl leading-relaxed">
          Curated, outcome-oriented learning curricula. Select any roadmap to inspect its sequenced modules, time commitments, and study resources.
        </p>
      </Pop>

      {/* Filter and Search Controls */}
      <Pop delay={120}>
        <div className="bg-surface p-4 sm:p-5 rounded-xl border border-border shadow-card shadow-inset-glow mb-8 space-y-4">
          <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center">
            {/* Search Box */}
<<<<<<< HEAD
            <div className="relative flex-1 group">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-brass pointer-events-none group-focus-within:scale-110 transition-transform duration-200" />
=======
            <div className="relative flex-1">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-brass pointer-events-none" />
>>>>>>> ee7e2e0795074dda19dad019b6a85befd5f355d8
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by roadmap title, topic, or expected outcome..."
<<<<<<< HEAD
                className="w-full pl-10 pr-9 py-2 text-sm bg-surface-subtle text-ink placeholder:text-ink-faint rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-brand focus:border-brand focus:bg-surface focus:shadow-glow-brand transition-all shadow-soft"
=======
                className="w-full pl-10 pr-9 py-2 text-sm bg-surface-subtle text-ink placeholder:text-ink-faint rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-brand focus:border-brand focus:bg-surface transition-all shadow-soft"
>>>>>>> ee7e2e0795074dda19dad019b6a85befd5f355d8
              />
              {search && (
                <button
                  type="button"
                  onClick={() => setSearch('')}
<<<<<<< HEAD
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-muted hover:text-ink p-0.5 rounded transition-transform hover:scale-110"
=======
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-muted hover:text-ink p-0.5 rounded"
>>>>>>> ee7e2e0795074dda19dad019b6a85befd5f355d8
                  aria-label="Clear search input"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Clear Filters Button */}
            {hasActiveFilters && (
<<<<<<< HEAD
              <Button variant="ghost" size="sm" onClick={handleClearFilters} className="text-xs shrink-0 group">
                <RefreshCw className="w-3.5 h-3.5 mr-1.5 group-hover:rotate-180 transition-transform duration-500" />
=======
              <Button variant="ghost" size="sm" onClick={handleClearFilters} className="text-xs shrink-0">
                <RefreshCw className="w-3.5 h-3.5 mr-1.5" />
>>>>>>> ee7e2e0795074dda19dad019b6a85befd5f355d8
                Reset Filters
              </Button>
            )}
          </div>

          {/* Level Filter Pills */}
          <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-border/70">
            <span className="text-xs font-semibold text-ink-muted flex items-center gap-1.5 mr-1">
              <Filter className="w-3 h-3 text-brass" />
              Level:
            </span>
            {levels.map((lvl) => (
              <button
                key={lvl}
                type="button"
                onClick={() => setLevel(lvl)}
<<<<<<< HEAD
                className={`text-xs px-3.5 py-1.5 rounded-full font-medium transition-all duration-200 shadow-soft active:scale-95 ${
                  level === lvl
                    ? 'bg-brand text-[#141210] font-bold shadow-card scale-105 shadow-glow-brass'
                    : 'bg-surface-subtle text-ink-muted hover:text-ink hover:bg-border/60 hover:-translate-y-0.5'
=======
                className={`text-xs px-3 py-1 rounded-full font-medium transition-all shadow-soft ${
                  level === lvl
                    ? 'bg-brand text-[#FBF8F3] shadow-card scale-105'
                    : 'bg-surface-subtle text-ink-muted hover:text-ink hover:bg-border/60'
>>>>>>> ee7e2e0795074dda19dad019b6a85befd5f355d8
                }`}
              >
                {lvl}
              </button>
            ))}
          </div>
        </div>
      </Pop>

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
        <RevealGroup className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {roadmaps.map((rm) => (
            <div key={rm.id || rm.slug} className="reveal-item">
              <RoadmapCard roadmap={rm} />
            </div>
          ))}
        </RevealGroup>
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
