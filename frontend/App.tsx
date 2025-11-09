import React, { useState, Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider } from './contexts/ThemeContext';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { LanguageProvider } from './contexts/LanguageContext';
import { PublicNavbar } from './components/PublicNavbar';
import { Sidebar } from './components/Sidebar';
import { CommandPalette } from './components/CommandPalette';
import { ChatBotTrigger } from './components/ChatBot';
import { LoadingSpinner } from './components/ui/LoadingSpinner';
import { ErrorBoundary } from './components/ErrorBoundary';
import { Toaster } from './components/ui/toaster';

// Lazy load pages for better performance
const PublicHomePage = lazy(() => import('./pages/PublicHomePage').then(m => ({ default: m.PublicHomePage })));
const FeaturesPage = lazy(() => import('./pages/FeaturesPage').then(m => ({ default: m.FeaturesPage })));
const AboutPage = lazy(() => import('./pages/AboutPage').then(m => ({ default: m.AboutPage })));
const ContactPage = lazy(() => import('./pages/ContactPage').then(m => ({ default: m.ContactPage })));
const PricingPage = lazy(() => import('./pages/PricingPage').then(m => ({ default: m.PricingPage })));
const LoginPage = lazy(() => import('./pages/LoginPage').then(m => ({ default: m.LoginPage })));
const SignupPage = lazy(() => import('./pages/SignupPage').then(m => ({ default: m.SignupPage })));
const VerifyEmailPage = lazy(() => import('./pages/VerifyEmailPage').then(m => ({ default: m.VerifyEmailPage })));
const AdminDashboard = lazy(() => import('./pages/dashboards/AdminDashboard').then(m => ({ default: m.AdminDashboard })));
const DoctorDashboard = lazy(() => import('./pages/dashboards/DoctorDashboard').then(m => ({ default: m.DoctorDashboard })));
const PatientDashboard = lazy(() => import('./pages/dashboards/PatientDashboard').then(m => ({ default: m.PatientDashboard })));
const PatientsPage = lazy(() => import('./pages/PatientsPage').then(m => ({ default: m.PatientsPage })));
const DoctorsPage = lazy(() => import('./pages/DoctorsPage').then(m => ({ default: m.DoctorsPage })));
const AppointmentsPage = lazy(() => import('./pages/AppointmentsPage').then(m => ({ default: m.AppointmentsPage })));
const PatientAppointmentsPage = lazy(() => import('./pages/patient/AppointmentsPage').then(m => ({ default: m.AppointmentsPage })));
const TelemedicinePage = lazy(() => import('./pages/TelemedicinePage').then(m => ({ default: m.TelemedicinePage })));
const BillingPage = lazy(() => import('./pages/BillingPage').then(m => ({ default: m.BillingPage })));
const AnalyticsPage = lazy(() => import('./pages/AnalyticsPage').then(m => ({ default: m.AnalyticsPage })));
const MedicalRecordsPage = lazy(() => import('./pages/patient/MedicalRecordsPage').then(m => ({ default: m.MedicalRecordsPage })));
const ProfileSettingsPage = lazy(() => import('./pages/ProfileSettingsPage').then(m => ({ default: m.ProfileSettingsPage })));
const LabReportsPage = lazy(() => import('./pages/LabReportsPage').then(m => ({ default: m.LabReportsPage })));
const MessagesPage = lazy(() => import('./pages/doctor/MessagesPage').then(m => ({ default: m.MessagesPage })));
const DoctorSettingsPage = lazy(() => import('./pages/doctor/SettingsPage').then(m => ({ default: m.SettingsPage })));
const DoctorHelpPage = lazy(() => import('./pages/doctor/HelpPage').then(m => ({ default: m.DoctorHelpPage })));
const DoctorPatientsPage = lazy(() => import('./pages/doctor/PatientsPage').then(m => ({ default: m.PatientsPage })));
const DoctorAppointmentsPage = lazy(() => import('./pages/doctor/AppointmentsPage').then(m => ({ default: m.AppointmentsPage })));
const DoctorTelemedicinePage = lazy(() => import('./pages/doctor/TelemedicinePage').then(m => ({ default: m.TelemedicinePage })));
const DoctorLabReportsPage = lazy(() => import('./pages/doctor/LabReportsPage').then(m => ({ default: m.LabReportsPage })));

// Patient portal pages
const PatientBillingPage = lazy(() => import('./pages/patient/BillingPage').then(m => ({ default: m.BillingPage })));
const PatientTelemedicinePage = lazy(() => import('./pages/patient/TelemedicinePage').then(m => ({ default: m.TelemedicinePage })));
const NotificationsPage = lazy(() => import('./pages/patient/NotificationsPage').then(m => ({ default: m.NotificationsPage })));
const SettingsPage = lazy(() => import('./pages/patient/SettingsPage').then(m => ({ default: m.SettingsPage })));
const HelpPage = lazy(() => import('./pages/patient/HelpPage').then(m => ({ default: m.HelpPage })));

// Help article pages
const GettingStartedGuide = lazy(() => import('./pages/patient/help/GettingStartedGuide').then(m => ({ default: m.GettingStartedGuide })));
const MedicalRecordsGuide = lazy(() => import('./pages/patient/help/MedicalRecordsGuide').then(m => ({ default: m.MedicalRecordsGuide })));
const AppointmentsGuide = lazy(() => import('./pages/patient/help/AppointmentsGuide').then(m => ({ default: m.AppointmentsGuide })));
const BillingGuide = lazy(() => import('./pages/patient/help/BillingGuide').then(m => ({ default: m.BillingGuide })));

const DemoPage = lazy(() => import('./app/demo/page').then(m => ({ default: m.default })));

// Admin pages
const AdminUserManagementPage = lazy(() => import('./pages/admin/UserManagementPage').then(m => ({ default: m.UserManagementPage })));
const AdminSystemSettingsPage = lazy(() => import('./pages/admin/SystemSettingsPage').then(m => ({ default: m.SystemSettingsPage })));
const AdminAnalyticsPage = lazy(() => import('./pages/admin/AnalyticsPage').then(m => ({ default: m.AnalyticsPage })));
const AdminBillingPage = lazy(() => import('./pages/admin/BillingPage').then(m => ({ default: m.BillingPage })));
const AdminDepartmentPage = lazy(() => import('./pages/admin/DepartmentPage').then(m => ({ default: m.DepartmentPage })));
const AdminNotificationsPage = lazy(() => import('./pages/admin/NotificationsPage').then(m => ({ default: m.NotificationsPage })));
const AdminHelpPage = lazy(() => import('./pages/admin/HelpPage').then(m => ({ default: m.HelpPage })));

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 10 * 60 * 1000, // 10 minutes
    },
    mutations: {
      retry: 1,
    },
  },
});

const AppRoutes = () => {
  const { user } = useAuth();

  if (!user) {
    return (
      <Routes>
        <Route path="/" element={<PublicHomePage />} />
        <Route path="/features" element={<FeaturesPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/pricing" element={<PricingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/verify-email" element={<VerifyEmailPage />} />
        <Route path="/demo" element={<DemoPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    );
  }

  // Authenticated routes
  switch (user?.role) {
    case 'admin':
      return (
        <Routes>
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/admin/users" element={<AdminUserManagementPage />} />
          <Route path="/admin/departments" element={<AdminDepartmentPage />} />
          <Route path="/admin/settings" element={<AdminSystemSettingsPage />} />
          <Route path="/admin/analytics" element={<AdminAnalyticsPage />} />
          <Route path="/admin/billing" element={<AdminBillingPage />} />
          <Route path="/admin/notifications" element={<AdminNotificationsPage />} />
          <Route path="/admin/help" element={<AdminHelpPage />} />
          <Route path="/demo" element={<DemoPage />} />
          <Route path="*" element={<Navigate to="/admin/dashboard" replace />} />
        </Routes>
      );
    case 'doctor':
      return (
        <Routes>
          <Route path="/doctor/dashboard" element={<DoctorDashboard />} />
          <Route path="/doctor/patients" element={<DoctorPatientsPage />} />
          <Route path="/doctor/appointments" element={<DoctorAppointmentsPage />} />
          <Route path="/doctor/telemedicine" element={<DoctorTelemedicinePage />} />
          <Route path="/doctor/lab-reports" element={<DoctorLabReportsPage />} />
          <Route path="/doctor/messages" element={<MessagesPage />} />
          <Route path="/doctor/settings" element={<DoctorSettingsPage />} />
          <Route path="/doctor/help" element={<DoctorHelpPage />} />
          <Route path="/demo" element={<DemoPage />} />
          <Route path="*" element={<Navigate to="/doctor/dashboard" replace />} />
        </Routes>
      );
    case 'patient':
      return (
        <Routes>
          <Route path="/patient/dashboard" element={<PatientDashboard />} />
          <Route path="/patient/appointments" element={<PatientAppointmentsPage />} />
          <Route path="/patient/telemedicine" element={<PatientTelemedicinePage />} />
          <Route path="/patient/billing" element={<PatientBillingPage />} />
          <Route path="/patient/medical-records" element={<MedicalRecordsPage />} />
          <Route path="/patient/notifications" element={<NotificationsPage />} />
          <Route path="/patient/settings" element={<SettingsPage />} />
          <Route path="/patient/help" element={<HelpPage />} />
          <Route path="/patient/help/getting-started" element={<GettingStartedGuide />} />
          <Route path="/patient/help/medical-records" element={<MedicalRecordsGuide />} />
          <Route path="/patient/help/appointments" element={<AppointmentsGuide />} />
          <Route path="/patient/help/billing" element={<BillingGuide />} />
          <Route path="/demo" element={<DemoPage />} />
          <Route path="*" element={<Navigate to="/patient/dashboard" replace />} />
        </Routes>
      );
    default:
      return <Navigate to="/" replace />;
  }
};

const AuthenticatedApp = () => {
  const { user, isLoading } = useAuth();
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="text-center">
          <LoadingSpinner size="lg" />
          <p className="mt-4 text-gray-600">Loading G1Cure...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 transition-colors">
      {user ? (
        <div className="flex h-screen bg-gray-100">
          <Sidebar />
          <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
            <ErrorBoundary>
              <Suspense fallback={<LoadingSpinner />}>
                <AppRoutes />
              </Suspense>
            </ErrorBoundary>
          </main>
        </div>
      ) : (
        <>
          <PublicNavbar />
          <main>
            <ErrorBoundary>
              <Suspense fallback={<LoadingSpinner />}>
                <AppRoutes />
              </Suspense>
            </ErrorBoundary>
          </main>
          <ChatBotTrigger />
        </>
      )}
      
      <CommandPalette 
        isOpen={isCommandPaletteOpen} 
        onClose={() => setIsCommandPaletteOpen(false)} 
      />
      
      <Toaster />
    </div>
  );
};

function App() {
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider>
          <LanguageProvider>
            <Router>
              <AuthProvider>
                <AuthenticatedApp />
              </AuthProvider>
            </Router>
          </LanguageProvider>
        </ThemeProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
}

export default App;
