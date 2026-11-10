import React, { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { Compass, Menu, X, Shield, User, LogOut, ArrowRight } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import Button from '../ui/Button';
import Badge from '../ui/Badge';

export default function Navbar() {
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    setMobileMenuOpen(false);
    navigate('/');
  };

  const navLinkClasses = ({ isActive }) =>
    `text-sm font-medium transition-colors px-3 py-1.5 rounded-md ${
      isActive
        ? 'text-brand bg-brand-light font-semibold'
        : 'text-ink-muted hover:text-ink hover:bg-surface-subtle'
    }`;

  return (
    <header className="sticky top-0 z-40 bg-surface/90 backdrop-blur-md border-b border-border">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 rounded-lg bg-brand text-white flex items-center justify-center shadow-sm group-hover:bg-brand-hover transition-colors">
              <Compass className="w-5 h-5" />
            </div>
            <div className="flex flex-col">
              <span className="text-base font-bold text-ink tracking-tight">PathFinder</span>
              <span className="text-[10px] text-ink-muted -mt-1 font-medium">Curated Roadmaps</span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-1.5">
            <NavLink to="/catalogue" className={navLinkClasses}>
              Browse Roadmaps
            </NavLink>
            {isAuthenticated && (
              <NavLink to="/dashboard" className={navLinkClasses}>
                My Dashboard
              </NavLink>
            )}
            {isAdmin && (
              <NavLink to="/admin" className={navLinkClasses}>
                <span className="inline-flex items-center gap-1">
                  <Shield className="w-3.5 h-3.5 text-accent" />
                  Curator Studio
                </span>
              </NavLink>
            )}
          </nav>

          {/* Desktop Auth Controls */}
          <div className="hidden md:flex items-center gap-3">
            {isAuthenticated ? (
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 pl-3 border-l border-border text-sm">
                  <div className="w-7 h-7 rounded-full bg-brand-light text-brand flex items-center justify-center font-semibold text-xs border border-brand-border">
                    {user?.displayName ? user.displayName.charAt(0).toUpperCase() : 'U'}
                  </div>
                  <div className="flex flex-col">
                    <span className="text-xs font-medium text-ink leading-tight">{user?.displayName}</span>
                    {user?.role === 'admin' && (
                      <Badge variant="accent" size="xs" className="w-fit scale-90 -ml-1">
                        Admin
                      </Badge>
                    )}
                  </div>
                </div>
                <Button variant="ghost" size="sm" onClick={handleLogout} className="text-ink-muted hover:text-red-600">
                  <LogOut className="w-4 h-4 mr-1" />
                  Sign Out
                </Button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link to="/login">
                  <Button variant="ghost" size="sm">
                    Sign In
                  </Button>
                </Link>
                <Link to="/register">
                  <Button variant="primary" size="sm">
                    Get Started
                    <ArrowRight className="w-3.5 h-3.5 ml-1" />
                  </Button>
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden">
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="text-ink-muted hover:text-ink p-2 rounded-md hover:bg-surface-subtle focus:outline-none focus:ring-2 focus:ring-brand"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-border bg-surface px-4 pt-2 pb-6 space-y-3">
          <nav className="flex flex-col space-y-1">
            <NavLink
              to="/catalogue"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-md text-sm font-medium text-ink hover:bg-surface-subtle"
            >
              Browse Roadmaps
            </NavLink>
            {isAuthenticated && (
              <NavLink
                to="/dashboard"
                onClick={() => setMobileMenuOpen(false)}
                className="px-3 py-2 rounded-md text-sm font-medium text-ink hover:bg-surface-subtle"
              >
                My Dashboard
              </NavLink>
            )}
            {isAdmin && (
              <NavLink
                to="/admin"
                onClick={() => setMobileMenuOpen(false)}
                className="px-3 py-2 rounded-md text-sm font-medium text-ink hover:bg-surface-subtle flex items-center gap-1.5"
              >
                <Shield className="w-4 h-4 text-accent" />
                Curator Studio
              </NavLink>
            )}
          </nav>

          <div className="pt-3 border-t border-border">
            {isAuthenticated ? (
              <div className="space-y-3">
                <div className="px-3 py-1 text-xs text-ink-muted">
                  Signed in as <strong className="text-ink">{user?.displayName}</strong> ({user?.email})
                </div>
                <Button variant="danger-outline" size="sm" onClick={handleLogout} className="w-full">
                  <LogOut className="w-4 h-4 mr-2" />
                  Sign Out
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-2">
                <Link to="/login" onClick={() => setMobileMenuOpen(false)}>
                  <Button variant="secondary" size="sm" className="w-full">
                    Sign In
                  </Button>
                </Link>
                <Link to="/register" onClick={() => setMobileMenuOpen(false)}>
                  <Button variant="primary" size="sm" className="w-full">
                    Sign Up
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
