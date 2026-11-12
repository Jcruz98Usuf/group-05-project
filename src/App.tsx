/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Opportunity, OpportunityStage, CompanyCapabilityProfile, ActivityEvent, EnterprisePageId, ProposalDocument, UserAccount } from './types';
import { mockOpportunities, initialActivityEvents } from './data/mockOpportunities';
import { initialCompanyProfile } from './data/companyProfile';
import { Header } from './components/Header';
import { Navigation } from './components/Navigation';
import { ExecutiveDashboard } from './components/ExecutiveDashboard';
import { OpportunitiesList } from './components/OpportunitiesList';
import { OpportunityWorkspace } from './components/OpportunityWorkspace';
import { ProposalStudio } from './components/ProposalStudio';
import { PipelineKanban } from './components/PipelineKanban';
import { CapabilityManager } from './components/CapabilityManager';
import { SettingsView } from './components/SettingsView';
import { NewOpportunityModal } from './components/NewOpportunityModal';
import { ProductBlueprintModal } from './components/ProductBlueprintModal';
import { OnboardingNexas } from './components/OnboardingNexas';
import { NexasChatbotBubble } from './components/NexasChatbotBubble';

export default function App() {
  // First Experience Onboarding State
  // Check if user has already onboarded; defaults to false for the initial visit as requested
  const [isOnboarded, setIsOnboarded] = useState<boolean>(() => {
    try {
      return localStorage.getItem('nexusiq_onboarded') === 'true';
    } catch {
      return false;
    }
  });

  const [userAccount, setUserAccount] = useState<UserAccount>({
    fullName: 'Sarah Jenkins',
    email: 'sarah.jenkins@apexsystems.com',
    companyName: 'Apex Intelligence & Systems Group',
    companyWebsite: 'https://apexsystems.example.com',
    companyDescription: 'We provide enterprise Power BI executive dashboards, distributed data lakehouse engineering, cloud software development, predictive AI services, and digital transformation consulting.',
    isOnboarded: false
  });

  const [opportunities, setOpportunities] = useState<Opportunity[]>(mockOpportunities);
  const [activeOpportunity, setActiveOpportunity] = useState<Opportunity>(mockOpportunities[0]);
  const [companyProfile, setCompanyProfile] = useState<CompanyCapabilityProfile>(initialCompanyProfile);
  const [activityEvents, setActivityEvents] = useState<ActivityEvent[]>(initialActivityEvents);

  const [currentPage, setCurrentPage] = useState<EnterprisePageId>('dashboard');
  const [isNavCollapsed, setIsNavCollapsed] = useState<boolean>(false);
  const [isNewOpportunityOpen, setIsNewOpportunityOpen] = useState<boolean>(false);
  const [isBlueprintOpen, setIsBlueprintOpen] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Handle completion of Nexas onboarding
  const handleCompleteOnboarding = (account: UserAccount, generatedProfile: CompanyCapabilityProfile) => {
    setUserAccount(account);
    setCompanyProfile(generatedProfile);
    setIsOnboarded(true);
    setCurrentPage('dashboard');

    try {
      localStorage.setItem('nexusiq_onboarded', 'true');
    } catch (e) {
      console.warn('LocalStorage error:', e);
    }

    const newEvent: ActivityEvent = {
      id: `act-${Date.now()}`,
      timestamp: 'Just now',
      opportunityId: activeOpportunity.id,
      opportunityTitle: 'Nexas Onboarding',
      type: 'qualification',
      message: `Nexas configured capability profile for "${generatedProfile.companyName}" with ${generatedProfile.services.length} core services.`,
      actor: 'Nexas Assistant',
      badgeType: 'emerald'
    };

    setActivityEvents((prev) => [newEvent, ...prev]);
  };

  // Re-run onboarding assistant
  const handleRerunOnboarding = () => {
    setIsOnboarded(false);
  };

  // Handle switching active opportunity
  const handleSelectOpportunity = (opp: Opportunity) => {
    setActiveOpportunity(opp);
  };

  // Handle new opportunity created from intake
  const handleOpportunityCreated = (newOpp: Opportunity) => {
    setOpportunities((prev) => [newOpp, ...prev]);
    setActiveOpportunity(newOpp);
    setCurrentPage('workspace');

    const newEvent: ActivityEvent = {
      id: `act-${Date.now()}`,
      timestamp: 'Just now',
      opportunityId: newOpp.id,
      opportunityTitle: newOpp.title,
      type: 'extraction',
      message: `Opportunity "${newOpp.title}" evaluated with fit score of ${newOpp.overallScore}/100.`,
      actor: userAccount.fullName || 'Marcus Vance',
      badgeType: newOpp.overallScore >= 80 ? 'emerald' : newOpp.overallScore >= 60 ? 'blue' : 'rose'
    };

    setActivityEvents((prev) => [newEvent, ...prev]);
  };

  // Handle stage change from Kanban or table
  const handleUpdateOpportunityStage = (oppId: string, newStage: OpportunityStage) => {
    setOpportunities((prev) =>
      prev.map((opp) => {
        if (opp.id === oppId) {
          const updated = { ...opp, stage: newStage };
          if (activeOpportunity.id === oppId) {
            setActiveOpportunity(updated);
          }
          return updated;
        }
        return opp;
      })
    );

    const target = opportunities.find((o) => o.id === oppId);
    if (target) {
      const newEvent: ActivityEvent = {
        id: `act-${Date.now()}`,
        timestamp: 'Just now',
        opportunityId: oppId,
        opportunityTitle: target.title,
        type: 'stage_changed',
        message: `Opportunity "${target.title}" moved to ${newStage.toUpperCase()} stage.`,
        actor: userAccount.fullName || 'Marcus Vance',
        badgeType: newStage === 'won' ? 'emerald' : 'blue'
      };
      setActivityEvents((prev) => [newEvent, ...prev]);
    }
  };

  // Handle proposal document update
  const handleUpdateProposal = (updatedProposal: ProposalDocument) => {
    const updatedOpp = {
      ...activeOpportunity,
      proposal: updatedProposal
    };

    setActiveOpportunity(updatedOpp);
    setOpportunities((prev) =>
      prev.map((o) => (o.id === updatedOpp.id ? updatedOpp : o))
    );
  };

  const qualifiedCount = opportunities.filter(
    (o) => o.stage === 'qualified' || o.stage === 'proposal' || o.stage === 'won'
  ).length;

  // IF USER IS NOT YET ONBOARDED -> RENDER "MEET NEXAS" ONBOARDING EXPERIENCE FIRST!
  if (!isOnboarded) {
    return (
      <OnboardingNexas
        onCompleteOnboarding={handleCompleteOnboarding}
        initialProfile={companyProfile}
      />
    );
  }

  const renderActivePage = () => {
    switch (currentPage) {
      case 'dashboard':
        return (
          <ExecutiveDashboard
            opportunities={opportunities}
            activeOpportunity={activeOpportunity}
            onSelectOpportunity={handleSelectOpportunity}
            onNavigate={(p) => setCurrentPage(p)}
            activityEvents={activityEvents}
            onOpenNewOpportunityModal={() => setIsNewOpportunityOpen(true)}
            companyName={companyProfile.companyName}
          />
        );

      case 'opportunities':
        return (
          <OpportunitiesList
            opportunities={opportunities}
            activeOpportunity={activeOpportunity}
            onSelectOpportunity={handleSelectOpportunity}
            onNavigate={(p) => setCurrentPage(p)}
            onOpenNewOpportunityModal={() => setIsNewOpportunityOpen(true)}
          />
        );

      case 'workspace':
        return (
          <OpportunityWorkspace
            opportunity={activeOpportunity}
            onNavigate={(p) => setCurrentPage(p)}
          />
        );

      case 'proposal-studio':
        return (
          <ProposalStudio
            opportunity={activeOpportunity}
            onUpdateProposal={handleUpdateProposal}
            onNavigate={(p) => setCurrentPage(p)}
            companyName={companyProfile.companyName}
          />
        );

      case 'pipeline':
        return (
          <PipelineKanban
            opportunities={opportunities}
            activeOpportunity={activeOpportunity}
            onSelectOpportunity={handleSelectOpportunity}
            onUpdateOpportunityStage={handleUpdateOpportunityStage}
            onNavigate={(p) => setCurrentPage(p)}
            onOpenNewOpportunityModal={() => setIsNewOpportunityOpen(true)}
          />
        );

      case 'capability-manager':
        return (
          <CapabilityManager
            companyProfile={companyProfile}
            onUpdateProfile={(updated) => setCompanyProfile(updated)}
            onNavigate={(p) => setCurrentPage(p)}
          />
        );

      case 'settings':
        return (
          <SettingsView
            companyProfile={companyProfile}
            onUpdateProfile={(updated) => setCompanyProfile(updated)}
          />
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-[#0F172A] antialiased flex flex-col">
      {/* Fixed Dark Navy Sidebar */}
      <Navigation
        currentPage={currentPage}
        onNavigate={(p) => setCurrentPage(p)}
        isCollapsed={isNavCollapsed}
        onToggleCollapse={() => setIsNavCollapsed(!isNavCollapsed)}
        totalOpportunitiesCount={opportunities.length}
        qualifiedCount={qualifiedCount}
        onOpenNewOpportunityModal={() => setIsNewOpportunityOpen(true)}
        companyName={companyProfile.companyName}
        onRerunOnboarding={handleRerunOnboarding}
      />

      {/* Main Layout Area Shifted by Sidebar Width */}
      <div 
        className={`flex-1 flex flex-col transition-all duration-200 ${
          isNavCollapsed ? 'pl-16' : 'pl-64'
        }`}
      >
        {/* Top Header */}
        <Header
          opportunities={opportunities}
          activeOpportunity={activeOpportunity}
          onSelectOpportunity={handleSelectOpportunity}
          onOpenNewOpportunityModal={() => setIsNewOpportunityOpen(true)}
          onOpenDocumentationModal={() => setIsBlueprintOpen(true)}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          userAccount={userAccount}
        />

        {/* Workspace Content Viewport */}
        <main className="flex-1 p-6 sm:p-8 max-w-[1600px] w-full mx-auto overflow-y-auto">
          {renderActivePage()}
        </main>
      </div>

      {/* New Opportunity Intake Modal */}
      <NewOpportunityModal
        isOpen={isNewOpportunityOpen}
        onClose={() => setIsNewOpportunityOpen(false)}
        companyProfile={companyProfile}
        onOpportunityCreated={handleOpportunityCreated}
      />

      {/* Product Blueprint & System Documentation Modal */}
      <ProductBlueprintModal
        isOpen={isBlueprintOpen}
        onClose={() => setIsBlueprintOpen(false)}
      />

      {/* Enterprise Floating Chatbot Bubble at Bottom Right */}
      <NexasChatbotBubble
        activeOpportunity={activeOpportunity}
        companyProfile={companyProfile}
        currentPage={currentPage}
        onNavigate={(p) => setCurrentPage(p)}
        onUpdateProposal={handleUpdateProposal}
      />
    </div>
  );
}
