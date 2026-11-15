import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Compass, CheckCircle2, BookOpen, ArrowRight, ShieldCheck, Clock, Layers } from 'lucide-react';
import { api } from '../services/api';
import PageContainer from '../components/layout/PageContainer';
import RoadmapCard from '../components/roadmap/RoadmapCard';
import { RoadmapCardSkeleton } from '../components/ui/Skeleton';
import Button from '../components/ui/Button';
import Pop from '../components/motion/Pop';
import { Reveal, RevealGroup } from '../components/motion/Reveal';

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
    <div className="relative overflow-hidden">
      {/* Decorative brass lines for subtle editorial structure */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-6xl h-px bg-gradient-to-r from-transparent via-brass/30 to-transparent pointer-events-none" />

      {/* Hero Section */}
      <section className="border-b border-border bg-gradient-to-b from-canvas via-surface to-canvas py-16 sm:py-24 relative">
        <PageContainer className="text-center relative z-10">
          <Pop delay={50} className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-light text-brand text-xs font-semibold mb-6 border border-brand-border shadow-soft badge-pulse">
            <ShieldCheck className="w-4 h-4 text-brass" />
            <span>Curated & Reviewed Curriculum</span>
          </Pop>

          <Pop delay={120}>
            <h1 className="text-3xl sm:text-5xl font-extrabold text-ink tracking-tight max-w-3xl mx-auto leading-[1.15] font-serif sm:font-sans">
              Sequenced technical roadmaps for disciplined, self-directed learners.
            </h1>
          </Pop>

          <Pop delay={200}>
            <p className="mt-5 text-base sm:text-lg text-ink-muted max-w-2xl mx-auto leading-relaxed">
              Step away from generic AI noise and fragmented tutorials. Follow deliberate, ordered curricula with curator-vetted documentation, practice drills, and deterministic progress tracking.
            </p>
          </Pop>

          <Pop delay={280} className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link to="/catalogue" className="w-full sm:w-auto">
              <Button size="lg" className="w-full sm:w-auto">
                Explore Published Roadmaps
                <ArrowRight className="w-4 h-4 ml-2 text-brass" />
              </Button>
            </Link>
            <Link to="/register" className="w-full sm:w-auto">
              <Button variant="secondary" size="lg" className="w-full sm:w-auto">
                Create Free Account
              </Button>
            </Link>
          </Pop>

          <Pop delay={350}>
            <div className="mt-12 flex flex-wrap items-center justify-center gap-8 text-xs text-ink-subtle border-t border-border/70 pt-8 max-w-xl mx-auto">
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-brass" />
                Core-only progress denominator
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-brass" />
                Deterministic next action
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-brass" />
                Zero arbitrary streak gimmicks
              </span>
            </div>
          </Pop>
        </PageContainer>
      </section>

      {/* Featured Roadmaps Section */}
      <section className="py-16">
        <PageContainer>
          <Reveal delay={150} className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
            <div>
              <div className="text-[11px] font-bold uppercase tracking-widest text-brass mb-1">
                Editorial Selection
              </div>
              <h2 className="text-2xl font-bold text-ink">Featured Roadmaps</h2>
              <p className="text-sm text-ink-muted mt-1">
                Authoritative curricula maintained and verified by field curators.
              </p>
            </div>
            <Link to="/catalogue" className="text-sm font-semibold text-brand hover:text-brand-hover flex items-center gap-1 transition-colors group">
              View all roadmaps
              <ArrowRight className="w-4 h-4 text-brass transition-transform duration-200 group-hover:translate-x-1" />
            </Link>
          </Reveal>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <RoadmapCardSkeleton />
              <RoadmapCardSkeleton />
              <RoadmapCardSkeleton />
            </div>
          ) : featuredRoadmaps.length > 0 ? (
            <RevealGroup className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredRoadmaps.map((rm) => (
                <div key={rm.id || rm.slug} className="reveal-item">
                  <RoadmapCard roadmap={rm} />
                </div>
              ))}
            </RevealGroup>
          ) : (
            <div className="text-center py-12 bg-surface rounded-lg border border-border shadow-soft">
              <p className="text-sm text-ink-muted">No roadmaps currently published.</p>
            </div>
          )}
        </PageContainer>
      </section>

      {/* Product Pillars */}
      <section className="py-20 bg-surface-subtle/70 border-t border-border">
        <PageContainer>
          <Reveal delay={150} className="text-center max-w-xl mx-auto mb-14">
            <div className="text-[11px] font-bold uppercase tracking-widest text-brass mb-1">
              Pedagogical Standards
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-ink">Built on Sound Pedagogical Invariants</h2>
            <p className="text-sm text-ink-muted mt-2 leading-relaxed">
              Engineered to foster genuine conceptual mastery without friction or digital fatigue.
            </p>
          </Reveal>

          <RevealGroup className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="reveal-item bg-surface p-7 rounded-xl border border-border space-y-3.5 shadow-card shadow-inset-glow hover:border-brass/50 hover:shadow-lift hover:-translate-y-1.5 transition-all duration-300 group">
              <div className="w-10 h-10 rounded-lg bg-brand-light text-brand flex items-center justify-center border border-brand-border shadow-soft group-hover:scale-110 group-hover:border-brass transition-all duration-300">
                <Layers className="w-5 h-5 text-brass" />
              </div>
              <h3 className="text-base font-bold text-ink group-hover:text-brand transition-colors">Sequenced Curriculum</h3>
              <p className="text-xs text-ink-muted leading-relaxed">
                Every topic explicitly details the foundational prerequisites it builds upon. You study in chronological sequence rather than hopping between disjointed tutorials.
              </p>
            </div>

            <div className="reveal-item bg-surface p-7 rounded-xl border border-border space-y-3.5 shadow-card shadow-inset-glow hover:border-brass/50 hover:shadow-lift hover:-translate-y-1.5 transition-all duration-300 group">
              <div className="w-10 h-10 rounded-lg bg-accent-light text-accent flex items-center justify-center border border-accent-border shadow-soft group-hover:scale-110 group-hover:border-accent transition-all duration-300">
                <Clock className="w-5 h-5 text-accent" />
              </div>
              <h3 className="text-base font-bold text-ink group-hover:text-accent transition-colors">Honest Pace & Progress</h3>
              <p className="text-xs text-ink-muted leading-relaxed">
                Progress tracks active core topics exclusively. Optional deep-dives and stretch challenges never skew your completion fraction. Select your weekly hours and build a sustainable habit.
              </p>
            </div>

            <div className="reveal-item bg-surface p-7 rounded-xl border border-border space-y-3.5 shadow-card shadow-inset-glow hover:border-brass/50 hover:shadow-lift hover:-translate-y-1.5 transition-all duration-300 group">
              <div className="w-10 h-10 rounded-lg bg-success-light text-success flex items-center justify-center border border-success-border shadow-soft group-hover:scale-110 group-hover:border-success transition-all duration-300">
                <BookOpen className="w-5 h-5 text-success" />
              </div>
              <h3 className="text-base font-bold text-ink group-hover:text-success transition-colors">Human-Vetted Resources</h3>
              <p className="text-xs text-ink-muted leading-relaxed">
                Experienced curators review primary and alternate resources with explicit justifications and review dates. Report broken or dated material to our editorial triage anytime.
              </p>
            </div>
          </RevealGroup>
        </PageContainer>
      </section>

      {/* Editorial Invitation Banner */}
      <section className="bg-espresso text-ink py-16 border-t border-border relative">
        <PageContainer className="text-center max-w-3xl">
          <Reveal delay={150}>
            <div className="w-10 h-10 rounded-xl bg-surface border border-brass/40 text-brass flex items-center justify-center mx-auto mb-4 hover:scale-110 hover:rotate-12 hover:border-brass transition-all duration-300 shadow-soft">
              <Compass className="w-6 h-6 text-brass" />
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-ink">
              Begin your disciplined curriculum today.
            </h2>
            <p className="mt-3 text-sm text-ink-muted max-w-xl mx-auto leading-relaxed">
              Join students and engineering professionals who prefer quiet depth and rigorous sequencing over endless feeds.
            </p>
            <div className="mt-8 flex justify-center gap-3">
              <Link to="/register">
                <Button size="lg" className="bg-gradient-to-b from-brass to-[#A67538] border-brass/50 text-[#141210] font-bold hover:brightness-110 shadow-glow-brass">
                  Enroll in a Roadmap
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            </div>
          </Reveal>
        </PageContainer>
      </section>
    </div>
  );
}
