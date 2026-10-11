import React, { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Layout from './components/layout/Layout';
import AIChatbot from './components/chat/AIChatbot';
import { AuthProvider } from './context/AuthContext';

const HomePage = lazy(() => import('./pages/HomePage'));
const CheckPage = lazy(() => import('./pages/CheckPage'));
const ReportPage = lazy(() => import('./pages/ReportPage'));
const ReportsListPage = lazy(() => import('./pages/ReportsListPage'));
const ReportDetailPage = lazy(() => import('./pages/ReportDetailPage'));
const DashboardPage = lazy(() => import('./pages/DashboardPage'));
const MapPage = lazy(() => import('./pages/MapPage'));
const SafetyPage = lazy(() => import('./pages/SafetyPage'));
const ExplorerPage = lazy(() => import('./pages/ExplorerPage'));
const EmergencyPage = lazy(() => import('./pages/EmergencyPage'));
const ScannerPage = lazy(() => import('./pages/ScannerPage'));
const UrlEmailIntelPage = lazy(() => import('./pages/UrlEmailIntelPage'));
const PatternGraphPage = lazy(() => import('./pages/PatternGraphPage'));
const AuthPage = lazy(() => import('./pages/AuthPage'));
const VaultPage = lazy(() => import('./pages/VaultPage'));
const AlertsPage = lazy(() => import('./pages/AlertsPage'));
const ModerationPage = lazy(() => import('./pages/ModerationPage'));
const NotFoundPage = lazy(() => import('./pages/NotFoundPage'));

const LoadingSpinner = () => (
  <div className="min-h-screen flex items-center justify-center bg-slate-900">
    <div className="relative">
      <div className="h-16 w-16 rounded-full border-t-4 border-b-4 border-blue-500 animate-spin"></div>
      <div className="absolute inset-0 flex items-center justify-center">
        <div
          className="h-8 w-8 rounded-full border-t-4 border-b-4 border-cyan-400 animate-spin"
          style={{ animationDirection: 'reverse' }}
        ></div>
      </div>
    </div>
  </div>
);

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              background: '#1E293B',
              color: '#F8FAFC',
              border: '1px solid rgba(255, 255, 255, 0.1)',
            },
            success: {
              iconTheme: {
                primary: '#10B981',
                secondary: '#1E293B',
              },
            },
            error: {
              iconTheme: {
                primary: '#EF4444',
                secondary: '#1E293B',
              },
            },
          }}
        />

        <Suspense fallback={<LoadingSpinner />}>
          <Routes>
            <Route path="/" element={<Layout />}>
              <Route index element={<HomePage />} />
              <Route path="check" element={<CheckPage />} />
              <Route path="report" element={<ReportPage />} />
              <Route path="reports" element={<ReportsListPage />} />
              <Route path="reports/:id" element={<ReportDetailPage />} />
              <Route path="dashboard" element={<DashboardPage />} />
              <Route path="map" element={<MapPage />} />
              <Route path="safety" element={<SafetyPage />} />
              <Route path="explorer" element={<ExplorerPage />} />
              <Route path="emergency" element={<EmergencyPage />} />
              <Route path="scanner" element={<ScannerPage />} />
              <Route path="intelligence/url-email" element={<UrlEmailIntelPage />} />
              <Route path="intelligence/patterns" element={<PatternGraphPage />} />
              <Route path="auth" element={<AuthPage />} />
              <Route path="vault" element={<VaultPage />} />
              <Route path="alerts" element={<AlertsPage />} />
              <Route path="moderation" element={<ModerationPage />} />
              <Route path="*" element={<NotFoundPage />} />
            </Route>
          </Routes>
        </Suspense>

        <AIChatbot />
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
