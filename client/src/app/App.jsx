import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { Sparkles } from 'lucide-react';
import { AuthProvider } from '../context/AuthContext';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import AiAssistantDrawer from '../components/ai/AiAssistantDrawer';
import SpiralIntro from '../components/motion/SpiralIntro';
import ScrollProgress from '../components/motion/ScrollProgress';

// Pages
import LandingPage from '../pages/LandingPage';
import CataloguePage from '../pages/CataloguePage';
import RoadmapPreviewPage from '../pages/RoadmapPreviewPage';
import TopicPage from '../pages/TopicPage';
import AuthPages from '../pages/AuthPages';
import DashboardPage from '../pages/DashboardPage';
import AdminDashboard from '../pages/AdminDashboard';
import AdminRoadmapEditor from '../pages/AdminRoadmapEditor';
import NotFoundPage from '../pages/NotFoundPage';
import ProtectedRoute from './ProtectedRoute';

function AnimatedRoutes() {
  const location = useLocation();

  return (
    <div key={location.pathname} className="page-transition flex-1 flex flex-col">
      <Routes location={location}>
        {/* Public Discovery Routes */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/catalogue" element={<CataloguePage />} />
        <Route path="/roadmaps/:slug" element={<RoadmapPreviewPage />} />
        <Route path="/roadmaps/:slug/topics/:topicKey" element={<TopicPage />} />

        {/* Authentication Routes */}
        <Route path="/login" element={<AuthPages initialMode="login" />} />
        <Route path="/register" element={<AuthPages initialMode="register" />} />

        {/* Private Learner Dashboard */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <DashboardPage />
            </ProtectedRoute>
          }
        />

        {/* Protected Curator Studio (Admin Only) */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute requireAdmin={true}>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/roadmaps/:slug"
          element={
            <ProtectedRoute requireAdmin={true}>
              <AdminRoadmapEditor />
            </ProtectedRoute>
          }
        />

        {/* Catch-all Not Found Route */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </div>
  );
}

function AppShell() {
  const [aiOpen, setAiOpen] = useState(false);
  const location = useLocation();
  const isLoginPage = location.pathname === '/login';

  return (
<<<<<<< HEAD
    <div className="flex flex-col min-h-screen bg-canvas text-ink">
=======
    <div className="flex flex-col min-h-screen bg-canvas text-ink selection:bg-brand selection:text-surface">
>>>>>>> ee7e2e0795074dda19dad019b6a85befd5f355d8
      {/* Full-screen Golden Spiral Intro on first site load (skip on /login to prevent dual overlay collision) */}
      {!isLoginPage && <SpiralIntro variant="site" />}

      {/* Top Scroll Progress Bar */}
      <ScrollProgress />

      <Navbar />
      <AnimatedRoutes />
      <Footer />

      {!aiOpen && (
        <button
          type="button"
          onClick={() => setAiOpen(true)}
<<<<<<< HEAD
          className="fixed bottom-6 right-6 z-40 inline-flex items-center gap-2 px-4 py-3 rounded-full bg-surface text-ink border border-brass/40 hover:border-brass shadow-lift hover:shadow-glow-brass hover:-translate-y-1 active:translate-y-0 active:scale-95 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-brand focus:ring-offset-2 focus:ring-offset-canvas group"
          title="Ask PathFinder AI"
          aria-label="Open PathFinder AI Assistant"
        >
          <Sparkles className="w-5 h-5 text-brass group-hover:rotate-12 transition-transform duration-300" />
          <span className="text-sm font-semibold hidden sm:inline group-hover:text-brass transition-colors">Ask AI</span>
=======
          className="fixed bottom-6 right-6 z-40 inline-flex items-center gap-2 px-4 py-3 rounded-full bg-espresso text-surface border border-brass/40 hover:bg-espresso/90 shadow-card hover:shadow-lift hover:scale-105 active:scale-95 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-brand focus:ring-offset-2 focus:ring-offset-canvas"
          title="Ask PathFinder AI"
          aria-label="Open PathFinder AI Assistant"
        >
          <Sparkles className="w-5 h-5 text-brass" />
          <span className="text-sm font-semibold hidden sm:inline">Ask AI</span>
>>>>>>> ee7e2e0795074dda19dad019b6a85befd5f355d8
        </button>
      )}

      <AiAssistantDrawer isOpen={aiOpen} onClose={() => setAiOpen(false)} />
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppShell />
      </AuthProvider>
    </BrowserRouter>
  );
}
