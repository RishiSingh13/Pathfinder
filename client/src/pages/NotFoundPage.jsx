import React from 'react';
import { Link } from 'react-router-dom';
import { Compass, ArrowLeft, BookOpen } from 'lucide-react';
import PageContainer from '../components/layout/PageContainer';
import Button from '../components/ui/Button';
import Pop from '../components/motion/Pop';

export default function NotFoundPage() {
  return (
    <PageContainer className="py-24 text-center">
<<<<<<< HEAD
      <Pop delay={50} className="w-16 h-16 rounded-2xl bg-surface border border-brass/40 text-brass shadow-card flex items-center justify-center mx-auto mb-6 hover:rotate-12 hover:border-brass hover:shadow-glow-brass transition-all duration-300 group">
        <Compass className="w-8 h-8 text-brass group-hover:scale-110 transition-transform duration-300" />
=======
      <Pop delay={50} className="w-16 h-16 rounded-2xl bg-surface-subtle text-brass border border-border shadow-card shadow-inset-glow flex items-center justify-center mx-auto mb-6">
        <Compass className="w-8 h-8 text-brass" />
>>>>>>> ee7e2e0795074dda19dad019b6a85befd5f355d8
      </Pop>

      <Pop delay={120}>
        <span className="text-xs font-bold uppercase tracking-widest text-brass">404 Error</span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-ink mt-2 mb-3 font-serif sm:font-sans">Page not found</h1>
        <p className="text-sm text-ink-muted max-w-md mx-auto mb-8 leading-relaxed">
          The curriculum, topic, or volume you are seeking does not exist, has been archived, or requires authentication.
        </p>
      </Pop>

      <Pop delay={200} className="flex flex-wrap items-center justify-center gap-3">
        <Link to="/catalogue">
          <Button variant="primary" size="md">
            <BookOpen className="w-4 h-4 mr-2 text-brass" />
            Browse Published Roadmaps
          </Button>
        </Link>
        <Link to="/">
          <Button variant="secondary" size="md">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Return Home
          </Button>
        </Link>
      </Pop>
    </PageContainer>
  );
}
