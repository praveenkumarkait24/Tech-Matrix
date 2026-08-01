import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Sidebar } from './components/Navigation/Sidebar';
import { TopHeader } from './components/Navigation/TopHeader';
import { LandingPage } from './components/Landing/LandingPage';
import { StudentDashboard } from './components/Student/StudentDashboard';
import { ApplicationDetailView } from './components/Application/ApplicationDetailView';
import { NewApplicationStepper } from './components/Application/NewApplicationStepper';
import { MentorDashboard } from './components/Mentor/MentorDashboard';
import { HODDashboard } from './components/HOD/HODDashboard';
import { PlacementDashboard } from './components/Placement/PlacementDashboard';
import { ApplicationsListView } from './components/Applications/ApplicationsListView';
import { PartnerCompaniesView } from './components/Companies/PartnerCompaniesView';
import { WeeklyReportsView } from './components/Reports/WeeklyReportsView';
import { SettingsView } from './components/Settings/SettingsView';
import { TrackerView } from './components/Student/TrackerView';
import { ReportSubmissionView } from './components/Student/ReportSubmissionView';
import { AdminDashboard } from './components/Admin/AdminDashboard';

import { DocumentViewerModal } from './components/Documents/DocumentViewerModal';
import { NocGeneratorModal } from './components/Documents/NocGeneratorModal';
import { NewPartnerModal } from './components/Companies/NewPartnerModal';
import { ToastContainer } from './components/UI/ToastContainer';

const MainLayout: React.FC = () => {
  const { currentRole, currentView } = useApp();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // If public or landing view, show full screen landing page
  if (currentRole === 'public' || currentView === 'landing') {
    return (
      <div className="min-h-screen bg-[#eef2f6] text-slate-800">
        <LandingPage />
        <DocumentViewerModal />
        <NocGeneratorModal />
        <ToastContainer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100/70 text-slate-800 flex font-sans antialiased selection:bg-indigo-500 selection:text-white">
      {/* Left Sidebar */}
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

      {/* Right Main Body */}
      <div className="flex-1 min-w-0 flex flex-col">
        {/* Top Header */}
        <TopHeader onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />

        {/* View Content */}
        <main className="flex-1 pb-16">
          {currentView === 'student-dashboard' && <StudentDashboard />}
          {currentView === 'application-detail' && <ApplicationDetailView />}
          {currentView === 'new-application' && <NewApplicationStepper />}
          {currentView === 'mentor-dashboard' && <MentorDashboard />}
          {currentView === 'hod-dashboard' && <HODDashboard />}
          {currentView === 'placement-dashboard' && <PlacementDashboard />}
          {currentView === 'applications-list' && <ApplicationsListView />}
          {currentView === 'companies' && <PartnerCompaniesView />}
          {currentView === 'reports' && <WeeklyReportsView />}
          {currentView === 'settings' && <SettingsView />}
          {currentView === 'tracker' && <TrackerView />}
          {currentView === 'report-submission' && <ReportSubmissionView />}
          {currentView === 'admin-dashboard' && <AdminDashboard view="dashboard" />}
          {currentView === 'admin-users' && <AdminDashboard view="users" />}
          {currentView === 'admin-departments' && <AdminDashboard view="departments" />}
          {currentView === 'admin-audit-logs' && <AdminDashboard view="logs" />}
        </main>
      </div>

      {/* Global Modals & Notifications */}
      <DocumentViewerModal />
      <NocGeneratorModal />
      <NewPartnerModal />
      <ToastContainer />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainLayout />
    </AppProvider>
  );
}
