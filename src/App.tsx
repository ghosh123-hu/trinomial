/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import Header, { ActiveTab } from './components/Header';
import Footer from './components/Footer';
import HomeView from './views/HomeView';
import IssueDetailView from './views/IssueDetailView';
import VolunteerView from './views/VolunteerView';
import DashboardView from './views/DashboardView';
import AIInsightsView from './views/AIInsightsView';
import OrganizationsView from './views/OrganizationsView';

import ReportIssueModal from './components/modals/ReportIssueModal';
import SignPetitionModal from './components/modals/SignPetitionModal';
import VolunteerRegisterModal from './components/modals/VolunteerRegisterModal';
import WardAlertsModal from './components/modals/WardAlertsModal';
import FileGrievanceModal from './components/modals/FileGrievanceModal';
import FactsheetModal from './components/modals/FactsheetModal';

import {
  INITIAL_ISSUES,
  INITIAL_VOLUNTEER_DRIVES,
  CivicIssue,
  VolunteeringDrive,
} from './data/civicData';

export default function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('home');
  const [issues, setIssues] = useState<CivicIssue[]>(INITIAL_ISSUES);
  const [volunteerDrives, setVolunteerDrives] =
    useState<VolunteeringDrive[]>(INITIAL_VOLUNTEER_DRIVES);
  const [selectedIssueId, setSelectedIssueId] = useState<string>('KTV-2024-8841');

  // Modal visibility states
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [isSignPetitionModalOpen, setIsSignPetitionModalOpen] = useState(false);
  const [isVolunteerModalOpen, setIsVolunteerModalOpen] = useState(false);
  const [isWardAlertsModalOpen, setIsWardAlertsModalOpen] = useState(false);
  const [isFileGrievanceModalOpen, setIsFileGrievanceModalOpen] = useState(false);
  const [isFactsheetModalOpen, setIsFactsheetModalOpen] = useState(false);
  const [selectedDriveForModal, setSelectedDriveForModal] =
    useState<VolunteeringDrive | null>(null);

  // Scroll to top on navigation
  const handleNavigate = (tab: ActiveTab) => {
    setActiveTab(tab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectIssue = (issueId: string) => {
    setSelectedIssueId(issueId);
    setActiveTab('detail');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectDriveToJoin = (drive: VolunteeringDrive) => {
    setSelectedDriveForModal(drive);
    setIsVolunteerModalOpen(true);
  };

  const handleReportSubmit = (newIssueData: Partial<CivicIssue>) => {
    const fullIssue: CivicIssue = {
      id: newIssueData.id || `KTV-2024-${Math.floor(1000 + Math.random() * 9000)}`,
      title: newIssueData.title || 'Reported Issue',
      location: newIssueData.location || 'Ward 150',
      city: newIssueData.city || 'Bengaluru',
      ward: newIssueData.ward || 'Ward 150',
      category: newIssueData.category || 'Environmental Concerns',
      severity: newIssueData.severity || 'High Priority',
      status: 'Open Issues',
      description: newIssueData.description || '',
      image: newIssueData.image || issues[0].image,
      geoCoordinates: newIssueData.geoCoordinates || '12.9372, 77.6823',
      verifiedSource: newIssueData.verifiedSource || 'Citizen Geotag Report',
      assignedAuthority: newIssueData.assignedAuthority || 'BBMP Mahadevapura',
      citizensMobilized: 1,
      petitionSignatures: 1,
      petitionTarget: 500,
      updatedAt: 'Just now',
      firstRecorded: 'Today',
      escalationLevel: 1,
      isWatchlisted: true,
    };
    setIssues((prev) => [fullIssue, ...prev]);
  };

  const handlePetitionSuccess = (newCount: number) => {
    setIssues((prev) =>
      prev.map((iss) =>
        iss.id === selectedIssueId ? { ...iss, petitionSignatures: newCount } : iss
      )
    );
  };

  const handleVolunteerRegistered = (driveId: string) => {
    setVolunteerDrives((prev) =>
      prev.map((d) =>
        d.id === driveId
          ? {
              ...d,
              volunteersRegistered: d.volunteersRegistered + 1,
              isJoined: true,
              statusBadge: 'Attendance Confirmed',
            }
          : d
      )
    );
  };

  const currentIssue =
    issues.find((i) => i.id === selectedIssueId) || issues[0];

  return (
    <div className="min-h-screen bg-[#f9f9f9] text-[#047857] flex flex-col font-sans">
      {/* Top Navigation */}
      <Header
        activeTab={activeTab}
        onNavigate={handleNavigate}
        onOpenReportModal={() => setIsReportModalOpen(true)}
      />

      {/* Main View Container */}
      <div className="flex-1">
        {activeTab === 'home' && (
          <HomeView
            issues={issues}
            onSelectIssue={handleSelectIssue}
            onNavigate={handleNavigate}
          />
        )}

        {activeTab === 'explore' && (
          <div className="pt-4">
            <HomeView
              issues={issues}
              onSelectIssue={handleSelectIssue}
              onNavigate={handleNavigate}
            />
          </div>
        )}

        {activeTab === 'detail' && (
          <IssueDetailView
            issue={currentIssue}
            onNavigate={handleNavigate}
            onOpenSignPetition={() => setIsSignPetitionModalOpen(true)}
            onOpenRegisterVolunteer={() => {
              setSelectedDriveForModal(volunteerDrives[4] || volunteerDrives[0]);
              setIsVolunteerModalOpen(true);
            }}
            onOpenFileGrievance={() => setIsFileGrievanceModalOpen(true)}
            onOpenFactsheet={() => setIsFactsheetModalOpen(true)}
          />
        )}

        {activeTab === 'volunteer' && (
          <VolunteerView
            drives={volunteerDrives}
            onSelectDriveToJoin={handleSelectDriveToJoin}
            onOpenProposalModal={() => setIsReportModalOpen(true)}
          />
        )}

        {activeTab === 'dashboard' && (
          <DashboardView
            onNavigate={handleNavigate}
            onOpenReportModal={() => setIsReportModalOpen(true)}
            onOpenWardAlerts={() => setIsWardAlertsModalOpen(true)}
            onOpenFileGrievance={() => setIsFileGrievanceModalOpen(true)}
            onSelectIssue={handleSelectIssue}
          />
        )}

        {activeTab === 'insights' && <AIInsightsView />}

        {activeTab === 'organizations' && <OrganizationsView />}
      </div>

      {/* Footer */}
      <Footer onNavigate={handleNavigate} />

      {/* Modals */}
      <ReportIssueModal
        isOpen={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
        onSubmit={handleReportSubmit}
      />

      <SignPetitionModal
        isOpen={isSignPetitionModalOpen}
        onClose={() => setIsSignPetitionModalOpen(false)}
        onSuccess={handlePetitionSuccess}
        currentSignatures={currentIssue.petitionSignatures || 842}
        targetSignatures={currentIssue.petitionTarget || 1000}
      />

      <VolunteerRegisterModal
        isOpen={isVolunteerModalOpen}
        onClose={() => setIsVolunteerModalOpen(false)}
        drive={selectedDriveForModal}
        onRegistered={handleVolunteerRegistered}
      />

      <WardAlertsModal
        isOpen={isWardAlertsModalOpen}
        onClose={() => setIsWardAlertsModalOpen(false)}
      />

      <FileGrievanceModal
        isOpen={isFileGrievanceModalOpen}
        onClose={() => setIsFileGrievanceModalOpen(false)}
      />

      <FactsheetModal
        isOpen={isFactsheetModalOpen}
        onClose={() => setIsFactsheetModalOpen(false)}
        issue={currentIssue}
      />
    </div>
  );
}
