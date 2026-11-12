/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Opportunity, OpportunityStage, CompanyCapabilityProfile, ActivityEvent, EnterprisePageId, ProposalDocument, UserAccount, SetupAnswers, CompanyFacts, NexasChatMessage, OpportunityDraft } from './types';
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
import { NexasChatbotBubble } from './components/NexasChatbotBubble';
import { AuthLoginView } from './components/AuthLoginView';
import { SetupIntelligence } from './components/SetupIntelligence';
import { WorkspaceEmptyState } from './components/WorkspaceEmptyState';
import {
  WorkspaceData,
  createDemoWorkspace,
  createEmptyWorkspace,
  emptyAccount,
  emptyProfile,
  getSessionUser,
  loadWorkspace,
  resolveUser,
  saveWorkspace,
  setSessionUser,
  DEMO_EMAIL
} from './services/workspaceStore';
import { mergeLearnedFacts } from './services/memoryService';

const VALID_PAGES: EnterprisePageId[] = [
  'dashboard',
  'opportunities',
  'workspace',
  'proposal-studio',
  'pipeline',
  'capability-manager',
  'settings'
];

// Safe destination when there is no in-app history to return to (never a blank screen).
const FALLBACK_PAGE: Record<EnterprisePageId, EnterprisePageId> = {
  dashboard: 'dashboard',
  opportunities: 'dashboard',
  workspace: 'opportunities',
  'proposal-studio': 'workspace',
  pipeline: 'dashboard',
  'capability-manager': 'dashboard',
  settings: 'dashboard'
};

function resolvePageFromLocation(): EnterprisePageId {
  const statePage = window.history.state?.page as EnterprisePageId | undefined;
  if (statePage && VALID_PAGES.includes(statePage)) return statePage;
  const hash = window.location.hash.replace('#', '') as EnterprisePageId;
  if (hash && VALID_PAGES.includes(hash)) return hash;
  return 'dashboard';
}

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    try {
      return sessionStorage.getItem('nexusiq_authenticated') === 'true';
    } catch {
      return false;
    }
  });

  const [userId, setUserId] = useState<string | null>(() => getSessionUser());
  const [hydrated, setHydrated] = useState<boolean>(false);

  // Tenant-scoped workspace state (empty for brand-new accounts).
  const [userAccount, setUserAccount] = useState<UserAccount>(emptyAccount);
  const [companyProfile, setCompanyProfile] = useState<CompanyCapabilityProfile>(emptyProfile);
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [activeOpportunity, setActiveOpportunity] = useState<Opportunity | null>(null);
  const [activityEvents, setActivityEvents] = useState<ActivityEvent[]>([]);
  const [generalChatMessages, setGeneralChatMessages] = useState<NexasChatMessage[]>([]);
  const [isOnboarded, setIsOnboarded] = useState<boolean>(false);
  const [isFirstLogin, setIsFirstLogin] = useState<boolean>(false);
  const [setupSkipped, setSetupSkipped] = useState<boolean>(false);

  const [currentPage, setCurrentPage] = useState<EnterprisePageId>('dashboard');
  const [historyStack, setHistoryStack] = useState<EnterprisePageId[]>([]);
  const [isNavCollapsed, setIsNavCollapsed] = useState<boolean>(false);
  const [isMobileNavOpen, setIsMobileNavOpen] = useState<boolean>(false);
  const [isNewOpportunityOpen, setIsNewOpportunityOpen] = useState<boolean>(false);
  const [pendingOpportunityDraft, setPendingOpportunityDraft] = useState<OpportunityDraft | null>(null);
  const [isBlueprintOpen, setIsBlueprintOpen] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isNexasChatOpen, setIsNexasChatOpen] = useState(false);

  const hydratedRef = useRef(false);

  const hydrate = useCallback((ws: WorkspaceData) => {
    setUserAccount(ws.account);
    setCompanyProfile(ws.profile);
    setOpportunities(ws.opportunities);
    setActiveOpportunity(ws.opportunities[0] ?? null);
    setGeneralChatMessages(ws.generalChatMessages ?? []);
    setActivityEvents(ws.activities);
    setIsOnboarded(ws.onboarded);
    setIsFirstLogin(Boolean(ws.isFirstLogin));
    setSetupSkipped(Boolean(ws.setupSkipped));
  }, []);

  // Restore the isolated workspace for the active session user.
  useEffect(() => {
    if (!isAuthenticated) {
      hydratedRef.current = true;
      setHydrated(true);
      return;
    }
    const uid = getSessionUser();
    if (!uid) {
      setIsAuthenticated(false);
      hydratedRef.current = true;
      setHydrated(true);
      return;
    }
    setUserId(uid);
    const ws = loadWorkspace(uid);
    if (ws) {
      hydrate(ws);
    } else {
      // Stale session with no provisioned workspace — sign out cleanly.
      setSessionUser(null);
      setIsAuthenticated(false);
    }
    hydratedRef.current = true;
    setHydrated(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Persist the active tenant's workspace on every change (strict scoping by userId).
  useEffect(() => {
    if (!hydrated || !userId) return;
    saveWorkspace(userId, {
      account: userAccount,
      profile: companyProfile,
      opportunities,
      generalChatMessages,
      activities: activityEvents,
      onboarded: isOnboarded,
      setupSkipped,
      isFirstLogin,
      updatedAt: new Date().toISOString()
    });
  }, [hydrated, userId, userAccount, companyProfile, opportunities, generalChatMessages, activityEvents, isOnboarded, setupSkipped, isFirstLogin]);

  // Browser history integration: the Back button returns to the previous page
  // and never resolves to a blank screen.
  useEffect(() => {
    const initialPage = resolvePageFromLocation();
    if (!window.history.state || !window.history.state.page) {
      window.history.replaceState({ page: initialPage }, '', `#${initialPage}`);
    }

    const handlePopState = () => {
      const page = resolvePageFromLocation();
      setCurrentPage(page);
      setHistoryStack((prev) =>
        prev.length > 0 && prev[prev.length - 1] === page ? prev.slice(0, -1) : prev
      );
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Centralized navigation with browser history tracking.
  const handleNavigate = useCallback(
    (newPage: EnterprisePageId, pushHistory: boolean = true) => {
      if (newPage === currentPage) return;

      if (pushHistory) {
        setHistoryStack((prev) => [...prev, currentPage]);
      }
      try {
        if (pushHistory) {
          window.history.pushState({ page: newPage }, '', `#${newPage}`);
        } else {
          window.history.replaceState({ page: newPage }, '', `#${newPage}`);
        }
      } catch (e) {
        console.warn('History update failed:', e);
      }

      setCurrentPage(newPage);
      setIsMobileNavOpen(false);
      window.scrollTo({ top: 0 });
    },
    [currentPage]
  );

  // Back button: prefer real browser history (navigate back), fall back to a safe page.
  const handleGoBack = useCallback(() => {
    if (historyStack.length > 0) {
      window.history.back();
      return;
    }

    const fallback = FALLBACK_PAGE[currentPage] ?? 'dashboard';
    setCurrentPage(fallback);
    try {
      window.history.replaceState({ page: fallback }, '', `#${fallback}`);
    } catch (e) {
      console.warn(e);
    }
    window.scrollTo({ top: 0 });
  }, [historyStack, currentPage]);

  const addActivity = useCallback((event: ActivityEvent) => {
    setActivityEvents((prev) => [event, ...prev]);
  }, []);

  // Login / registration: provision an isolated workspace (empty for new users).
  const handleLoginSuccess = (user: UserAccount) => {
    const { userId: resolvedId, isNew } = resolveUser(user.email);

    let ws: WorkspaceData;
    if (isNew) {
      ws =
        user.email.trim().toLowerCase() === DEMO_EMAIL
          ? createDemoWorkspace(user)
          : createEmptyWorkspace(user);
    } else {
      ws = loadWorkspace(resolvedId) ?? createEmptyWorkspace(user);
    }

    hydrate(ws);
    setUserId(resolvedId);
    setSessionUser(resolvedId);
    setIsAuthenticated(true);
    setCurrentPage('dashboard');
    setHistoryStack([]);
    try {
      window.history.replaceState({ page: 'dashboard' }, '', '#dashboard');
      sessionStorage.setItem('nexusiq_authenticated', 'true');
    } catch (e) {
      console.warn(e);
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setUserId(null);
    setSessionUser(null);
    setOpportunities([]);
    setActiveOpportunity(null);
    setGeneralChatMessages([]);
    setActivityEvents([]);
    setCompanyProfile(emptyProfile());
    setUserAccount(emptyAccount());
    setIsOnboarded(false);
    setIsFirstLogin(false);
    try {
      sessionStorage.removeItem('nexusiq_authenticated');
    } catch (e) {
      console.warn(e);
    }
  };

  // Setup Assistant completion
  const handleCompleteSetup = (
    account: UserAccount,
    profile: CompanyCapabilityProfile,
    _answers: SetupAnswers
  ) => {
    setUserAccount({ ...account, isOnboarded: true });
    setCompanyProfile(profile);
    setIsOnboarded(true);
    setIsFirstLogin(false);
    setSetupSkipped(false);
    handleNavigate('dashboard');

    addActivity({
      id: `act-${Date.now()}`,
      timestamp: 'Just now',
      opportunityId: '',
      opportunityTitle: 'Setup',
      type: 'qualification',
      message: `Setup complete for "${profile.companyName}" with ${profile.services.length} service area(s).`,
      actor: 'Nexas Assistant',
      badgeType: 'emerald'
    });
  };

  // Skip setup (enter the app with a clean, empty workspace)
  const handleSkipSetup = () => {
    setUserAccount((prev) => ({ ...prev, isOnboarded: true }));
    setIsOnboarded(true);
    setIsFirstLogin(false);
    setSetupSkipped(true);
    handleNavigate('dashboard');
  };

  // Save My Company Info from Settings (editor + AI chat memory).
  const handleSaveCompany = (account: UserAccount, profile: CompanyCapabilityProfile) => {
    setUserAccount({ ...account, isOnboarded: true });
    setCompanyProfile({ ...profile, setupCompleted: true });
    setIsOnboarded(true);
    setIsFirstLogin(false);
  };

  // Passive AI memory: merge facts learned from chat into the profile (fills empty fields only).
  const handleLearnFacts = useCallback((facts: CompanyFacts) => {
    setCompanyProfile((prev) => mergeLearnedFacts(prev, facts));
  }, []);

  // Load isolated demo data into the current account (never shared across tenants).
  const handleLoadDemo = () => {
    const ws = createDemoWorkspace(userAccount);
    hydrate(ws);
    addActivity({
      id: `act-${Date.now()}`,
      timestamp: 'Just now',
      opportunityId: '',
      opportunityTitle: 'Demo Data',
      type: 'extraction',
      message: 'Demo workspace loaded into this account.',
      actor: userAccount.fullName || 'User',
      badgeType: 'blue'
    });
  };

  const handleSelectOpportunity = (opp: Opportunity) => setActiveOpportunity(opp);

  const handleOpportunityCreated = (newOpp: Opportunity) => {
    setPendingOpportunityDraft(null);
    setOpportunities((prev) => [newOpp, ...prev]);
    setActiveOpportunity(newOpp);
    handleNavigate('workspace');

    addActivity({
      id: `act-${Date.now()}`,
      timestamp: 'Just now',
      opportunityId: newOpp.id,
      opportunityTitle: newOpp.title,
      type: 'extraction',
      message: `Opportunity "${newOpp.title}" evaluated with fit score of ${newOpp.overallScore}/100.`,
      actor: userAccount.fullName || 'User',
      badgeType: newOpp.overallScore >= 80 ? 'emerald' : newOpp.overallScore >= 60 ? 'blue' : 'rose'
    });
  };

  const handleUpdateOpportunityChatMessages = useCallback((opportunityId: string, messages: NexasChatMessage[]) => {
    setOpportunities((prev) =>
      prev.map((opportunity) =>
        opportunity.id === opportunityId ? { ...opportunity, chatMessages: messages } : opportunity
      )
    );
    setActiveOpportunity((prev) =>
      prev?.id === opportunityId ? { ...prev, chatMessages: messages } : prev
    );
  }, []);

  const handleChatMessagesChange = useCallback((messages: NexasChatMessage[]) => {
    if (activeOpportunity) {
      handleUpdateOpportunityChatMessages(activeOpportunity.id, messages);
    } else {
      setGeneralChatMessages(messages);
    }
  }, [activeOpportunity, handleUpdateOpportunityChatMessages]);

  const handleReviewOpportunity = (draft: OpportunityDraft) => {
    setPendingOpportunityDraft(draft);
    setIsNewOpportunityOpen(true);
    setIsNexasChatOpen(false);
  };

  const handleUpdateOpportunityStage = (oppId: string, newStage: OpportunityStage) => {
    setOpportunities((prev) =>
      prev.map((opp) => {
        if (opp.id === oppId) {
          const updated = { ...opp, stage: newStage };
          if (activeOpportunity?.id === oppId) setActiveOpportunity(updated);
          return updated;
        }
        return opp;
      })
    );

    const target = opportunities.find((o) => o.id === oppId);
    if (target) {
      addActivity({
        id: `act-${Date.now()}`,
        timestamp: 'Just now',
        opportunityId: oppId,
        opportunityTitle: target.title,
        type: 'stage_changed',
        message: `Opportunity "${target.title}" moved to ${newStage.toUpperCase()} stage.`,
        actor: userAccount.fullName || 'User',
        badgeType: newStage === 'won' ? 'emerald' : 'blue'
      });
    }
  };

  const handleUpdateProposal = (updatedProposal: ProposalDocument) => {
    if (!activeOpportunity) return;
    const updatedOpp = { ...activeOpportunity, proposal: updatedProposal };
    setActiveOpportunity(updatedOpp);
    setOpportunities((prev) => prev.map((o) => (o.id === updatedOpp.id ? updatedOpp : o)));
  };

  // 1. Authentication gate
  if (!isAuthenticated) {
    return <AuthLoginView onLoginSuccess={handleLoginSuccess} />;
  }

  // 2. Setup Intelligence gate — shown only on first login (before onboarding completes)
  if (!isOnboarded) {
    return (
      <SetupIntelligence
        account={userAccount}
        mode="onboarding"
        onComplete={handleCompleteSetup}
        onSkip={handleSkipSetup}
      />
    );
  }

  const qualifiedCount = opportunities.filter(
    (o) => o.stage === 'qualified' || o.stage === 'proposal' || o.stage === 'won'
  ).length;

  const canGoBack = historyStack.length > 0 || currentPage !== 'dashboard';

  const EmptyPanel: React.FC<{ title: string; description: string }> = ({ title, description }) => (
    <div className="max-w-xl mx-auto text-center py-16">
      <h2 className="text-lg font-bold text-slate-900">{title}</h2>
      <p className="text-sm text-slate-500 mt-2">{description}</p>
      <button
        onClick={() => setIsNewOpportunityOpen(true)}
        className="mt-5 inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#0F172A] hover:bg-slate-800 text-white text-xs font-bold"
      >
        Add Opportunity
      </button>
    </div>
  );

  const renderActivePage = () => {
    switch (currentPage) {
      case 'dashboard':
        if (opportunities.length === 0) {
          return (
            <WorkspaceEmptyState
              account={userAccount}
              onEditCompany={() => handleNavigate('settings')}
              onAddOpportunity={() => setIsNewOpportunityOpen(true)}
              onLoadDemo={userAccount.email.toLowerCase() === DEMO_EMAIL ? undefined : handleLoadDemo}
            />
          );
        }
        return (
          <ExecutiveDashboard
            opportunities={opportunities}
            activeOpportunity={activeOpportunity}
            onSelectOpportunity={handleSelectOpportunity}
            onNavigate={handleNavigate}
            activityEvents={activityEvents}
            onOpenNewOpportunityModal={() => setIsNewOpportunityOpen(true)}
            companyName={companyProfile.companyName || userAccount.companyName}
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
        if (!activeOpportunity) {
          return <EmptyPanel title="No opportunity selected" description="Add an opportunity or select one from the list to open its workspace." />;
        }
        return (
          <OpportunityWorkspace
            opportunity={activeOpportunity}
            onNavigate={handleNavigate}
            onOpenOpportunityChat={() => setIsNexasChatOpen(true)}
          />
        );

      case 'proposal-studio':
        if (!activeOpportunity) {
          return <EmptyPanel title="No proposal yet" description="Select an opportunity to draft its proposal." />;
        }
        return (
          <ProposalStudio
            opportunity={activeOpportunity}
            onUpdateProposal={handleUpdateProposal}
            onNavigate={handleNavigate}
            companyName={companyProfile.companyName || userAccount.companyName}
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
            account={userAccount}
            onSaveCompany={handleSaveCompany}
          />
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-[#0F172A] antialiased flex flex-col font-sans">
      <Navigation
        currentPage={currentPage}
        onNavigate={handleNavigate}
        isCollapsed={isNavCollapsed}
        onToggleCollapse={() => setIsNavCollapsed(!isNavCollapsed)}
        totalOpportunitiesCount={opportunities.length}
        qualifiedCount={qualifiedCount}
        onOpenNewOpportunityModal={() => setIsNewOpportunityOpen(true)}
        companyName={companyProfile.companyName || userAccount.companyName}
        isOpenMobile={isMobileNavOpen}
        onCloseMobile={() => setIsMobileNavOpen(false)}
        onLogout={handleLogout}
      />

      <div
        className={`flex-1 flex flex-col transition-all duration-300 pl-0 ${
          isNavCollapsed ? 'lg:pl-16' : 'lg:pl-64'
        }`}
      >
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
          onNavigate={handleNavigate}
        />

        <main className="flex-1 p-3 sm:p-6 lg:p-8 max-w-[1600px] w-full mx-auto overflow-y-auto">
          {renderActivePage()}
        </main>
      </div>

      <NewOpportunityModal
        isOpen={isNewOpportunityOpen}
        onClose={() => {
          setIsNewOpportunityOpen(false);
          setPendingOpportunityDraft(null);
        }}
        companyProfile={companyProfile}
        onOpportunityCreated={handleOpportunityCreated}
        initialDraft={pendingOpportunityDraft}
      />

      <ProductBlueprintModal
        isOpen={isBlueprintOpen}
        onClose={() => setIsBlueprintOpen(false)}
      />

      <NexasChatbotBubble
        activeOpportunity={activeOpportunity}
        companyProfile={companyProfile}
        messages={activeOpportunity?.chatMessages ?? generalChatMessages}
        isOpen={isNexasChatOpen}
        onMessagesChange={handleChatMessagesChange}
        onOpenChange={setIsNexasChatOpen}
        onLearnFacts={handleLearnFacts}
        onNavigate={handleNavigate}
        onUpdateProposal={handleUpdateProposal}
        onReviewOpportunity={handleReviewOpportunity}
      />
    </div>
  );
}