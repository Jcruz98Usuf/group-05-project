/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useCallback } from 'react';
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
import { AuthLoginView } from './components/AuthLoginView';

export default function App() {
  // Authentication State: First thing a visitor sees is login/sign-in
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    try {
      return sessionStorage.getItem('nexusiq_authenticated') === 'true';
    } catch {
      return false;
    }
  });

  // Onboarding state
  const [isOnboarded, setIsOnboarded] = useState<boolean>(() => {
    try {
      return localStorage.getItem('nexusiq_onboarded') === 'true';
    } catch {
      return true; // Default true so after login users can jump straight to workspace or rerun Nexas as needed
    }
  });

  const [userAccount, setUserAccount] = useState<UserAccount>({
    fullName: 'Sarah Jenkins',
    email: 'sarah.jenkins@apexsystems.com',
    companyName: 'Apex Intelligence & Systems Group',
    companyWebsite: 'https://apexsystems.example.com',
    companyDescription: 'We provide enterprise Power BI executive dashboards, distributed data lakehouse engineering, cloud software development, predictive AI services, and digital transformation consulting.',
    isOnboarded: true
  });

  const [opportunities, setOpportunities] = useState<Opportunity[]>(mockOpportunities);
  const [activeOpportunity, setActiveOpportunity] = useState<Opportunity>(mockOpportunities[0]);
  const [companyProfile, setCompanyProfile] = useState<CompanyCapabilityProfile>(initialCompanyProfile);
  const [activityEvents, setActivityEvents] = useState<ActivityEvent[]>(initialActivityEvents);

  const [currentPage, setCurrentPage] = useState<EnterprisePageId>('dashboard');
  const [historyStack, setHistoryStack] = useState<EnterprisePageId[]>([]);
  const [isNavCollapsed, setIsNavCollapsed] = useState<boolean>(false);
  const [isMobileNavOpen, setIsMobileNavOpen] = useState<boolean>(false);
  const [isNewOpportunityOpen, setIsNewOpportunityOpen] = useState<boolean>(false);
  const [isBlueprintOpen, setIsBlueprintOpen] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Handle browser Back / Forward buttons (popstate integration)
  useEffect(() => {
    // Set initial history state
    if (!window.history.state) {
      window.history.replaceState({ page: 'dashboard' }, '', '#dashboard');
    }

    const handlePopState = (event: PopStateEvent) => {
      if (event.state && event.state.page) {
        setCurrentPage(event.state.page);
      } else {
        const hash = window.location.hash.replace('#', '') as EnterprisePageId;
        const validPages: EnterprisePageId[] = [
          'dashboard', 'opportunities', 'workspace', 
          'proposal-studio', 'pipeline', 'capability-manager', 'settings'
        ];
        if (hash && validPages.includes(hash)) {
          setCurrentPage(hash);
        } else {
          setCurrentPage('dashboard');
        }
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Centralized Navigation with History Tracking
  const handleNavigate = useCallback((newPage: EnterprisePageId, pushHistory: boolean = true) => {
    if (newPage === currentPage) return;

    if (pushHistory) {
      setHistoryStack((prev) => [...prev, currentPage]);
      try {
        window.history.pushState({ page: newPage }, '', '#' + newPage);
      } catch (e) {
        console.warn('History pushState error:', e);
      }
    }

    setCurrentPage(newPage);
    setIsMobileNavOpen(false); // Close mobile drawer when navigating
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentPage]);

  // Back Button Handler (supports both UI button and hardware/browser back)
  const handleGoBack = useCallback(() => {
    if (historyStack.length > 0) {
      const prevPage = historyStack[historyStack.length - 1];
      setHistoryStack((prev) => prev.slice(0, prev.length - 1));
      try {
        window.history.pushState({ page: prevPage }, '', '#' + prevPage);
      } catch (e) {
        console.warn('History pushState error:', e);
      }
      setCurrentPage(prevPage);
    } else if (currentPage !== 'dashboard') {
      setCurrentPage('dashboard');
      try {
        window.history.pushState({ page: 'dashboard' }, '', '#dashboard');
      } catch (e) {
        console.warn(e);
      }
    } else {
      window.history.back();
    }
  }, [historyStack, currentPage]);

  // Successful Login Handler
  const handleLoginSuccess = (user: UserAccount) => {
    setUserAccount(user);
    if (user.companyName) {
      setCompanyProfile((prev) => ({
        ...prev,
        companyName: user.companyName
      }));
    }
    setIsAuthenticated(true);
    try {
      sessionStorage.setItem('nexusiq_authenticated', 'true');
    } catch (e) {
      console.warn(e);
    }
  };

  // Sign Out Handler
  const handleLogout = () => {
    setIsAuthenticated(false);
    try {
      sessionStorage.removeItem('nexusiq_authenticated');
    } catch (e) {
      console.warn(e);
    }
  };

  // Handle completion of Nexas onboarding
  const handleCompleteOnboarding = (account: UserAccount, generatedProfile: CompanyCapabilityProfile) => {
    setUserAccount(account);
    setCompanyProfile(generatedProfile);
    setIsOnboarded(true);
    handleNavigate('dashboard');

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
    handleNavigate('workspace');

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

  // 1. FIRST THING USERS SEE: LOGIN OR SIGN IN PAGE WITH HERO IMAGE & BRIEF DESCRIPTION
  if (!isAuthenticated) {
    return <AuthLoginView onLoginSuccess={handleLoginSuccess} />;
  }

  // 2. IF USER MANUALLY REQUESTS ONBOARDING FLOW
  if (!isOnboarded) {
    return (
      <OnboardingNexas
        onCompleteOnboarding={handleCompleteOnboarding}
        initialProfile={companyProfile}
      />
    );
  }

  const qualifiedCount = opportunities.filter(
    (o) => o.stage === 'qualified' || o.stage === 'proposal' || o.stage === 'won'
  ).length;

  const canGoBack = historyStack.length > 0 || currentPage !== 'dashboard';

  const renderActivePage = () => {
    switch (currentPage) {
      case 'dashboard':
        return (
          <ExecutiveDashboard
            opportunities={opportunities}
            activeOpportunity={activeOpportunity}
            onSelectOpportunity={handleSelectOpportunity}
            onNavigate={handleNavigate}
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
            onNavigate={handleNavigate}
            onOpenNewOpportunityModal={() => setIsNewOpportunityOpen(true)}
          />
        );

      case 'workspace':
        return (
          <OpportunityWorkspace
            opportunity={activeOpportunity}
            onNavigate={handleNavigate}
          />
        );

      case 'proposal-studio':
        return (
          <ProposalStudio
            opportunity={activeOpportunity}
            onUpdateProposal={handleUpdateProposal}
            onNavigate={handleNavigate}
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
            onNavigate={handleNavigate}
            onOpenNewOpportunityModal={() => setIsNewOpportunityOpen(true)}
          />
        );

      case 'capability-manager':
        return (
          <CapabilityManager
            companyProfile={companyProfile}
            onUpdateProfile={(updated) => setCompanyProfile(updated)}
            onNavigate={handleNavigate}
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
    <div className="min-h-screen bg-[#F8FAFC] text-[#0F172A] antialiased flex flex-col font-sans">
      
      {/* Responsive Navigation Sidebar / Mobile Drawer */}
      <Navigation
        currentPage={currentPage}
        onNavigate={handleNavigate}
        isCollapsed={isNavCollapsed}
        onToggleCollapse={() => setIsNavCollapsed(!isNavCollapsed)}
        totalOpportunitiesCount={opportunities.length}
        qualifiedCount={qualifiedCount}
        onOpenNewOpportunityModal={() => setIsNewOpportunityOpen(true)}
        companyName={companyProfile.companyName}
        onRerunOnboarding={handleRerunOnboarding}
        isOpenMobile={isMobileNavOpen}
        onCloseMobile={() => setIsMobileNavOpen(false)}
        onLogout={handleLogout}
      />

      {/* Main Layout Area: pl-0 on mobile & tablet, lg:pl-64 or lg:pl-16 on desktop */}
      <div 
        className={`flex-1 flex flex-col transition-all duration-300 pl-0 ${
          isNavCollapsed ? 'lg:pl-16' : 'lg:pl-64'
        }`}
      >
        {/* Top Header with Hamburger for mobile, Back button, and User menu */}
        <Header
          opportunities={opportunities}
          activeOpportunity={activeOpportunity}
          onSelectOpportunity={handleSelectOpportunity}
          onOpenNewOpportunityModal={() => setIsNewOpportunityOpen(true)}
          onOpenDocumentationModal={() => setIsBlueprintOpen(true)}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          userAccount={userAccount}
          currentPage={currentPage}
          canGoBack={canGoBack}
          onGoBack={handleGoBack}
          onOpenMobileNav={() => setIsMobileNavOpen(true)}
          onLogout={handleLogout}
          onRerunOnboarding={handleRerunOnboarding}
          onNavigate={handleNavigate}
        />

        {/* Workspace Content Viewport with responsive gutters */}
        <main className="flex-1 p-3 sm:p-6 lg:p-8 max-w-[1600px] w-full mx-auto overflow-y-auto">
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
        onNavigate={handleNavigate}
        onUpdateProposal={handleUpdateProposal}
      />
    </div>
  );
}
