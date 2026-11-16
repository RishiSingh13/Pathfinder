import React from 'react';
import { Compass } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
<<<<<<< HEAD
    <footer className="bg-espresso text-ink-muted border-t border-border mt-auto shadow-lift">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded bg-surface border border-brass/30 text-brass flex items-center justify-center shadow-soft">
              <Compass className="w-4 h-4 text-brass" />
            </div>
            <span className="text-sm font-semibold text-ink tracking-wide">PathFinder</span>
            <span className="text-xs text-ink-subtle">· Curated Learning Pathways</span>
          </div>

          <div className="flex items-center gap-6 text-xs text-ink-muted">
=======
    <footer className="bg-espresso text-surface border-t border-border-strong/30 mt-auto shadow-lift">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded bg-brand/40 text-brass border border-brass/30 flex items-center justify-center">
              <Compass className="w-4 h-4 text-brass" />
            </div>
            <span className="text-sm font-semibold text-surface tracking-wide">PathFinder</span>
            <span className="text-xs text-ink-faint">· Curated Learning Pathways</span>
          </div>

          <div className="flex items-center gap-6 text-xs text-surface-subtle">
>>>>>>> ee7e2e0795074dda19dad019b6a85befd5f355d8
            <Link to="/catalogue" className="hover:text-brass transition-colors">
              Roadmap Catalogue
            </Link>
            <Link to="/login" className="hover:text-brass transition-colors">
              Learner Sign In
            </Link>
<<<<<<< HEAD
            <span className="text-ink-faint">Verified Curricula</span>
          </div>
        </div>

        <div className="mt-8 pt-5 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-ink-subtle">
          <p>© {new Date().getFullYear()} PathFinder. All educational materials are attributed to their respective authors.</p>
          <p className="text-brass/80">Curated for disciplined, self-directed learning with quiet focus.</p>
=======
            <span className="text-ink-faint/80">Verified Curricula</span>
          </div>
        </div>

        <div className="mt-8 pt-5 border-t border-surface/10 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-surface-subtle/70">
          <p>© {new Date().getFullYear()} PathFinder. All educational materials are attributed to their respective authors.</p>
          <p className="text-brass/70">Curated for disciplined, self-directed learning with quiet focus.</p>
>>>>>>> ee7e2e0795074dda19dad019b6a85befd5f355d8
        </div>
      </div>
    </footer>
  );
}
