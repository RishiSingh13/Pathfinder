import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from '../context/AuthContext';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';

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
        </div>
      </AuthProvider>
    </BrowserRouter>
  );
}
