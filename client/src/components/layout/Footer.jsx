import React from 'react';
import { Compass } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-surface border-t border-border mt-auto">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded bg-brand text-white flex items-center justify-center">
              <Compass className="w-3.5 h-3.5" />
            </div>
            <span className="text-sm font-semibold text-ink">PathFinder</span>
            <span className="text-xs text-ink-muted">· Curated Learning Pathways</span>
          </div>

          <div className="flex items-center gap-6 text-xs text-ink-muted">
            <Link to="/catalogue" className="hover:text-ink transition-colors">
              Roadmap Catalogue
            </Link>
            <Link to="/login" className="hover:text-ink transition-colors">
              Learner Sign In
            </Link>
            <span className="text-ink-faint">Verified Curricula</span>
          </div>
        </div>

        <div className="mt-6 pt-4 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-2 text-[11px] text-ink-muted">
          <p>© {new Date().getFullYear()} PathFinder. All educational materials are attributed to their respective authors.</p>
          <p>Curated for disciplined, self-directed learning without arbitrary gamification.</p>
        </div>
      </div>
    </footer>
  );
}
