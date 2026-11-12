import React, { useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Sparkles } from 'lucide-react';
import { AuthProvider } from '../context/AuthContext';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import AiAssistantDrawer from '../components/ai/AiAssistantDrawer';

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

export default function App() {
  const [aiOpen, setAiOpen] = useState(false);

  return (
    <BrowserRouter>
      <AuthProvider>
        <div className="flex flex-col min-h-screen bg-canvas text-ink">
          <Navbar />
          <div className="flex-1">
            <Routes>
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
          <Footer />

          {!aiOpen && (
            <button
              type="button"
              onClick={() => setAiOpen(true)}
              className="fixed bottom-6 right-6 z-40 inline-flex items-center gap-2 px-4 py-3 rounded-full bg-brand text-white hover:bg-brand-hover shadow-lg hover:shadow-xl transition-all focus:outline-none focus:ring-2 focus:ring-brand focus:ring-offset-2"
              title="Ask PathFinder AI"
              aria-label="Open PathFinder AI Assistant"
            >
              <Sparkles className="w-5 h-5" />
              <span className="text-sm font-semibold hidden sm:inline">Ask AI</span>
            </button>
          )}

          <AiAssistantDrawer isOpen={aiOpen} onClose={() => setAiOpen(false)} />
        </div>
      </AuthProvider>
    </BrowserRouter>
  );
}
