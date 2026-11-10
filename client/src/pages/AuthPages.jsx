import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Compass, ArrowRight, ShieldCheck, Lock, Mail, User } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import ErrorAlert from '../components/ui/ErrorAlert';

export default function AuthPages({ initialMode = 'login' }) {
  const [mode, setMode] = useState(initialMode);
  const { login, register, error, clearError } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  // Parse redirect target if user was redirected from a protected action
  const searchParams = new URLSearchParams(location.search);
  const redirectTarget = searchParams.get('redirect') || '/dashboard';

  const [displayName, setDisplayName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fieldErrors, setFieldErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState(null);

  const switchMode = (newMode) => {
    setMode(newMode);
    clearError();
    setFormError(null);
    setFieldErrors({});
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError(null);
    setFieldErrors({});
    setSubmitting(true);

    try {
      if (mode === 'login') {
        const res = await login(email, password);
        if (res.success) {
          navigate(redirectTarget, { replace: true });
        } else {
          setFormError(res.message);
        }
      } else {
        const res = await register(displayName, email, password);
        if (res.success) {
          navigate(redirectTarget, { replace: true });
        } else {
          setFormError(res.message);
          if (res.fields) {
            const errMap = {};
            res.fields.forEach((f) => {
              errMap[f.path] = f.message;
            });
            setFieldErrors(errMap);
          }
        }
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-16rem)] flex items-center justify-center py-12 px-4 sm:px-6">
      <div className="w-full max-w-md space-y-6">
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <Link to="/" className="inline-flex items-center gap-2 text-brand">
            <div className="w-10 h-10 rounded-xl bg-brand text-white flex items-center justify-center shadow-sm">
              <Compass className="w-5 h-5" />
            </div>
          </Link>
          <h1 className="text-2xl font-bold text-ink tracking-tight">
            {mode === 'login' ? 'Sign in to PathFinder' : 'Create your learner account'}
          </h1>
          <p className="text-xs text-ink-muted">
            {mode === 'login'
              ? 'Resume your curated roadmaps and track deterministic progress.'
              : 'Join to enroll in published roadmaps and save your pace.'}
          </p>
        </div>

        {/* Form Container */}
        <div className="bg-surface p-6 sm:p-8 rounded-2xl border border-border shadow-sm space-y-5">
          {formError && (
            <ErrorAlert
              title={mode === 'login' ? 'Sign In Failed' : 'Registration Failed'}
              message={formError}
            />
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === 'register' && (
              <Input
                label="Full or Display Name"
                id="displayName"
                type="text"
                required
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                placeholder="Alex Chen"
                error={fieldErrors.displayName}
                autoComplete="name"
              />
            )}

            <Input
              label="Email Address"
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              error={fieldErrors.email}
              autoComplete="email"
            />

            <Input
              label="Password"
              id="password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              helperText={mode === 'register' ? 'Minimum 8 characters' : undefined}
              error={fieldErrors.password}
              autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
            />

            <Button
              type="submit"
              size="md"
              loading={submitting}
              className="w-full mt-2 font-semibold"
            >
              {mode === 'login' ? 'Sign In' : 'Create Account'}
              <ArrowRight className="w-4 h-4 ml-1.5" />
            </Button>
          </form>

          {/* Mode Switcher */}
          <div className="pt-4 border-t border-border text-center text-xs text-ink-muted">
            {mode === 'login' ? (
              <span>
                Don't have an account yet?{' '}
                <button
                  type="button"
                  onClick={() => switchMode('register')}
                  className="font-semibold text-brand hover:underline"
                >
                  Create one now
                </button>
              </span>
            ) : (
              <span>
                Already have an account?{' '}
                <button
                  type="button"
                  onClick={() => switchMode('login')}
                  className="font-semibold text-brand hover:underline"
                >
                  Sign in
                </button>
              </span>
            )}
          </div>
        </div>

        {/* Security Assurance */}
        <div className="text-center text-[11px] text-ink-faint flex items-center justify-center gap-1.5">
          <ShieldCheck className="w-3.5 h-3.5 text-brand" />
          <span>Sessions are secured with signed HTTP-only cookies and CSRF validation.</span>
        </div>
      </div>
    </div>
  );
}
