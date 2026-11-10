import React from 'react';
import { Link } from 'react-router-dom';
import { Compass, ArrowLeft, BookOpen } from 'lucide-react';
import PageContainer from '../components/layout/PageContainer';
import Button from '../components/ui/Button';

export default function NotFoundPage() {
  return (
    <PageContainer className="py-20 text-center">
      <div className="w-16 h-16 rounded-2xl bg-surface-subtle text-ink-muted border border-border flex items-center justify-center mx-auto mb-6">
        <Compass className="w-8 h-8 text-brand" />
      </div>

      <span className="text-xs font-bold uppercase tracking-wider text-brand">404 Error</span>
      <h1 className="text-3xl font-extrabold text-ink mt-2 mb-3">Page not found</h1>
      <p className="text-sm text-ink-muted max-w-md mx-auto mb-8">
        The roadmap, topic, or page you are looking for does not exist, has been archived, or requires authentication.
      </p>

      <div className="flex flex-wrap items-center justify-center gap-3">
        <Link to="/catalogue">
          <Button variant="primary" size="md">
            <BookOpen className="w-4 h-4 mr-2" />
            Browse Published Roadmaps
          </Button>
        </Link>
        <Link to="/">
          <Button variant="secondary" size="md">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Go to Home
          </Button>
        </Link>
      </div>
    </PageContainer>
  );
}
