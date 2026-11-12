import {
  AccountType,
  ActivityEvent,
  CompanyCapabilityProfile,
  Opportunity,
  UserAccount
} from '../types';
import { mockOpportunities, initialActivityEvents } from '../data/mockOpportunities';
import { initialCompanyProfile } from '../data/companyProfile';

/**
 * Workspace store — strict per-user / per-tenant isolation.
 *
 * Every account owns an isolated workspace document. All persistence is keyed by
 * the resolved `userId`, so data never leaks across accounts. New accounts are
 * provisioned with empty collections (no demo/simulation records).
 *
 * In production this module is the single seam that would be backed by Firestore
 * (`users/{userId}` or `tenants/{tenantId}`). The browser adapter below mirrors
 * that contract so the UI and isolation guarantees stay identical.
 */

export type { AccountType };

export interface WorkspaceData {
  account: UserAccount;
  profile: CompanyCapabilityProfile;
  opportunities: Opportunity[];
  activities: ActivityEvent[];
  onboarded: boolean;
  setupSkipped?: boolean;
  updatedAt: string;
}

interface RegistryEntry {
  userId: string;
  email: string;
  createdAt: string;
}

type Registry = Record<string, RegistryEntry>;

const WORKSPACE_PREFIX = 'nexusiq:workspace:v1';
const REGISTRY_KEY = 'nexusiq:registry:v1';
const SESSION_USER_KEY = 'nexusiq:session_user';

/** Demo tenant email — the only account that receives simulation data. */
export const DEMO_EMAIL = 'sarah.jenkins@apexsystems.com';

const clone = <T>(value: T): T =>
  typeof structuredClone === 'function'
    ? structuredClone(value)
    : (JSON.parse(JSON.stringify(value)) as T);

function safeParse<T>(raw: string | null, fallback: T): T {
  if (!raw) return fallback;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

const workspaceKey = (userId: string) => `${WORKSPACE_PREFIX}:${userId}`;

export function emptyAccount(): UserAccount {
  return {
    fullName: '',
    email: '',
    companyName: '',
    companyWebsite: '',
    companyDescription: '',
    isOnboarded: false,
    accountType: 'enterprise'
  };
}

export function emptyProfile(): CompanyCapabilityProfile {
  return {
    companyName: '',
    tagline: '',
    annualRevenue: 'Not provided',
    teamSize: 0,
    primaryIndustries: [],
    services: [],
    certifications: [],
    techStack: [],
    keyPersonnel: [],
    needsConfirmation: ['Company profile']
  };
}

/** A brand-new tenant: empty collections, zero demo records. */
export function createEmptyWorkspace(account: UserAccount): WorkspaceData {
  return {
    account: { ...account, isOnboarded: false },
    profile: emptyProfile(),
    opportunities: [],
    activities: [],
    onboarded: false,
    setupSkipped: false,
    updatedAt: new Date().toISOString()
  };
}

/** Demo tenant only: pre-populated simulation data, fully isolated. */
export function createDemoWorkspace(account: UserAccount): WorkspaceData {
  return {
    account: { ...account, isOnboarded: true, accountType: account.accountType ?? 'enterprise' },
    profile: clone(initialCompanyProfile),
    opportunities: clone(mockOpportunities),
    activities: clone(initialActivityEvents),
    onboarded: true,
    setupSkipped: false,
    updatedAt: new Date().toISOString()
  };
}

export function loadWorkspace(userId: string): WorkspaceData | null {
  try {
    return safeParse<WorkspaceData | null>(localStorage.getItem(workspaceKey(userId)), null);
  } catch {
    return null;
  }
}

export function saveWorkspace(userId: string, data: WorkspaceData): void {
  try {
    localStorage.setItem(
      workspaceKey(userId),
      JSON.stringify({ ...data, updatedAt: new Date().toISOString() })
    );
  } catch (e) {
    console.warn('Workspace save failed:', e);
  }
}

export function loadRegistry(): Registry {
  try {
    return safeParse<Registry>(localStorage.getItem(REGISTRY_KEY), {});
  } catch {
    return {};
  }
}

function saveRegistry(registry: Registry): void {
  try {
    localStorage.setItem(REGISTRY_KEY, JSON.stringify(registry));
  } catch (e) {
    console.warn('Registry save failed:', e);
  }
}

/**
 * Resolve (or provision) the isolated user document for an email.
 * Returns the stable userId plus whether this is a first-time account.
 */
export function resolveUser(email: string): { userId: string; isNew: boolean } {
  const normalized = email.trim().toLowerCase();
  const registry = loadRegistry();
  const existing = registry[normalized];
  if (existing) {
    return { userId: existing.userId, isNew: false };
  }

  const userId = `usr_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;
  registry[normalized] = { userId, email: normalized, createdAt: new Date().toISOString() };
  saveRegistry(registry);
  return { userId, isNew: true };
}

export function setSessionUser(userId: string | null): void {
  try {
    if (userId) sessionStorage.setItem(SESSION_USER_KEY, userId);
    else sessionStorage.removeItem(SESSION_USER_KEY);
  } catch (e) {
    console.warn(e);
  }
}

export function getSessionUser(): string | null {
  try {
    return sessionStorage.getItem(SESSION_USER_KEY);
  } catch {
    return null;
  }
}

export { clone };