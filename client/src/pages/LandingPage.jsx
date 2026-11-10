import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Compass, CheckCircle2, BookOpen, ArrowRight, ShieldCheck, Clock, Layers } from 'lucide-react';
import { api } from '../services/api';
import PageContainer from '../components/layout/PageContainer';
import RoadmapCard from '../components/roadmap/RoadmapCard';
import { RoadmapCardSkeleton } from '../components/ui/Skeleton';
import Button from '../components/ui/Button';

export default function LandingPage() {
  const [featuredRoadmaps, setFeaturedRoadmaps] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadFeatured() {
      try {
        setLoading(true);
        const res = await api.roadmaps.getCatalogue({ limit: 3 });
        if (res.data?.items) {
          setFeaturedRoadmaps(res.data.items);
        }
      } catch (err) {
        console.warn('Failed to load featured roadmaps:', err.message);
      } finally {
        setLoading(false);
      }
    }
    loadFeatured();
  }, []);

  return (
    <div>
      {/* Hero Section */}
      <section className="border-b border-border bg-gradient-to-b from-canvas to-surface py-16 sm:py-24">
        <PageContainer className="text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-light text-brand text-xs font-semibold mb-6 border border-brand-border">
            <ShieldCheck className="w-4 h-4" />
            <span>Curated & Reviewed Curriculum</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold text-ink tracking-tight max-w-3xl mx-auto leading-tight">
            Sequenced technical roadmaps for disciplined, self-directed learners.
          </h1>

          <p className="mt-5 text-base sm:text-lg text-ink-muted max-w-2xl mx-auto leading-relaxed">
            Stop drowning in generic AI summaries and fragmented tutorials. Follow structured, ordered modules with curator-vetted documentation, practice drills, and deterministic progress tracking.
          </p>

          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link to="/catalogue">
              <Button size="lg" className="w-full sm:w-auto">
                Explore Published Roadmaps
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
            <Link to="/register">
              <Button variant="secondary" size="lg" className="w-full sm:w-auto">
                Create Free Account
              </Button>
            </Link>
          </div>

          <div className="mt-12 flex flex-wrap items-center justify-center gap-8 text-xs text-ink-muted border-t border-border/60 pt-8 max-w-xl mx-auto">
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-brand" />
              Core-only progress denominator
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-brand" />
              Deterministic next action
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-brand" />
              Zero fake gamification streaks
            </span>
          </div>
        </PageContainer>
      </section>

      {/* Featured Roadmaps Section */}
      <section className="py-16">
        <PageContainer>
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
            <div>
              <h2 className="text-2xl font-bold text-ink">Featured Roadmaps</h2>
              <p className="text-sm text-ink-muted mt-1">
                Authoritative curricula maintained and reviewed by curators.
              </p>
            </div>
            <Link to="/catalogue" className="text-sm font-semibold text-brand hover:underline flex items-center gap-1">
              View all roadmaps
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <RoadmapCardSkeleton />
              <RoadmapCardSkeleton />
              <RoadmapCardSkeleton />
            </div>
          ) : featuredRoadmaps.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredRoadmaps.map((rm) => (
                <RoadmapCard key={rm.id || rm.slug} roadmap={rm} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-surface rounded-lg border border-border">
              <p className="text-sm text-ink-muted">No roadmaps currently published.</p>
            </div>
          )}
        </PageContainer>
      </section>

      {/* Product Pillars */}
      <section className="py-16 bg-surface-subtle border-t border-border">
        <PageContainer>
          <div className="text-center max-w-xl mx-auto mb-12">
            <h2 className="text-2xl font-bold text-ink">Built on Sound Pedagogical Invariants</h2>
            <p className="text-sm text-ink-muted mt-2">
              Designed to help you master concepts without feeling overwhelmed or manipulated.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-surface p-6 rounded-lg border border-border space-y-3 shadow-sm">
              <div className="w-10 h-10 rounded-lg bg-brand-light text-brand flex items-center justify-center border border-brand-border">
                <Layers className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-ink">Sequenced Curriculum</h3>
              <p className="text-xs text-ink-muted leading-relaxed">
                Every topic explicitly details what prerequisite concepts it builds upon. You study in chronological pedagogical order rather than jumping randomly between unrated links.
              </p>
            </div>

            <div className="bg-surface p-6 rounded-lg border border-border space-y-3 shadow-sm">
              <div className="w-10 h-10 rounded-lg bg-accent-light text-accent flex items-center justify-center border border-accent-border">
                <Clock className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-ink">Honest Pace & Progress</h3>
              <p className="text-xs text-ink-muted leading-relaxed">
                Progress tracks active core topics strictly. Optional deep-dives and stretch challenges never dilute your completion fraction. Pick your weekly hours and learn at your own pace.
              </p>
            </div>

            <div className="bg-surface p-6 rounded-lg border border-border space-y-3 shadow-sm">
              <div className="w-10 h-10 rounded-lg bg-success-light text-success flex items-center justify-center border border-success-border">
                <BookOpen className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-ink">Human-Vetted Resources</h3>
              <p className="text-xs text-ink-muted leading-relaxed">
                Curators review primary and alternate resources with explicit justifications and review dates. Report broken or outdated resources to our editorial queue anytime.
              </p>
            </div>
          </div>
        </PageContainer>
      </section>
    </div>
  );
}
