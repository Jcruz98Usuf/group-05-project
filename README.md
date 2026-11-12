# NexusIQ

**Know before you commit.**

NexusIQ is an Opportunity-to-Proposal intelligence platform for consulting firms, government contractors, and technology vendors. It ingests tenders, RFPs, procurement notices, and discovery notes; extracts structured requirements; matches them against a company's verified capabilities; flags risk with source evidence; and generates proposal-ready briefs.

This repository is the **frontend workspace application**: a React single-page app with strict per-user tenant isolation, an AI-assisted onboarding flow, and a full opportunity-to-proposal workflow.

---

## Table of Contents

1. [Project Overview](#project-overview)
2. [Architecture](#architecture)
3. [Tech Stack](#tech-stack)
4. [Folder Structure](#folder-structure)
5. [Local Setup & Environment Variables](#local-setup--environment-variables)
6. [Key Features](#key-features)
7. [Onboarding & Tenant Provisioning](#onboarding--tenant-provisioning)
8. [AI Business Analysis Workflow](#ai-business-analysis-workflow)
9. [Scripts](#scripts)
10. [Design Principles](#design-principles)

---

## Project Overview

NexusIQ helps organizations **qualify opportunities before committing capital, proposal effort, and delivery teams**. The product is organized around a simple pipeline:

```
Opportunities  →  Workspace  →  Proposal Studio  →  Pipeline
```

- **Dashboard** — pipeline KPIs (total, qualified, proposal-ready, high-risk, value), recent opportunities, recent activity, and top risks.
- **Opportunities** — a business table of evaluated leads with score, recommendation, and owner.
- **Workspace** — the core decision surface for a single opportunity, with four focused tabs: Overview, Capability Assessment, Risk Analysis, and Evidence.
- **Proposal Studio** — structured 8-section proposal drafting with DOCX, PDF, and Markdown export.
- **Pipeline** — Kanban board for stage progression.
- **Capability Manager** — the company capability profile (services, certifications, personnel, technologies) used for matching.
- **Settings** — organization profile, AI provider, thresholds, and setup assistant access.

---

## Architecture

### Multi-tenant data isolation model

Every account owns an **isolated workspace document**. Isolation is enforced in a single seam — `src/services/workspaceStore.ts` — so the UI never reads shared data.

```
Authentication (AuthLoginView)
        │
        ▼
resolveUser(email)  ──►  stable userId  (registry: nexusiq:registry:v1)
        │
        ├── new account  ──► createEmptyWorkspace()   (zero demo records)
        ├── demo account ──► createDemoWorkspace()    (isolated simulation data)
        └── returning    ──► loadWorkspace(userId)
        │
        ▼
WorkspaceData { account, profile, opportunities, activities, onboarded, setupSkipped }
        │
        ▼
Persisted under a userId-scoped key:
   nexusiq:workspace:v1:{userId}
```

Guarantees:

- **Fresh provisioning** — a newly registered user or enterprise starts with empty `opportunities`, `activities`, and an empty capability `profile`. No demo/simulation records are inherited.
- **Strict scoping** — all persistence is keyed by the resolved `userId`. Two accounts can never read each other's data.
- **Demo isolation** — the demo persona (`sarah.jenkins@apexsystems.com`) is the only account that receives pre-populated simulation data, stored in its own isolated document.
- **Account-type aware empty states** — new users see a clean empty-state dashboard tailored to **Individual** vs **Enterprise** (`WorkspaceEmptyState`), not hardcoded demo panels.

> **Production note:** `workspaceStore.ts` is the single repository seam. In production it is backed by Firestore (`users/{userId}` or `tenants/{tenantId}`) behind the same interface; the browser adapter in this repo mirrors that contract using namespaced local storage so the isolation guarantees are identical.

### State flow

- Workspace state lives in `App.tsx` and is hydrated once per session from the active tenant's document.
- Every mutation is persisted back to the tenant-scoped store via an effect keyed on `userId`.
- Navigation uses real browser history (`pushState`/`popstate`) with a safe fallback map so the Back button never resolves to a blank screen.

---

## Tech Stack

| Layer | Technology |
| --- | --- |
| UI framework | **React 19** + **TypeScript** (strict) |
| Build tool | **Vite 8** |
| Styling | **Tailwind CSS v4** (`@tailwindcss/vite`) |
| State / data | Typed store abstraction (`src/services/workspaceStore.ts`), Zustand-style scoping by `userId` |
| Database (target) | **Firebase / Firestore** — `users/{userId}` / `tenants/{tenantId}` (browser adapter today) |
| AI provider | Google Gemini (`@google/genai`) via `src/services/aiRouter.ts`, with a deterministic analysis fallback |
| Documents | `jspdf`, `html2canvas`, `docx`, `dompurify` (proposal export) |
| Animation | CSS spring/keyframes transitions (`src/index.css`); Framer Motion-ready |
| Icons | `lucide-react` |

---

## Folder Structure

```
group-05-project/
├── index.html                  # App entry HTML
├── package.json                # Scripts & dependencies
├── tsconfig.json               # Strict TypeScript config
├── vite.config.ts              # Vite + React + Tailwind plugins, @ alias
├── .env.example                # API key template
├── README.md
└── src/
    ├── main.tsx                # React root
    ├── App.tsx                 # Auth gate, tenant hydration, routing, persistence
    ├── index.css               # Tailwind + Nexas animations
    ├── assets/                 # Images
    ├── components/             # UI components
    │   ├── AuthLoginView.tsx       # Sign in / register / demo
    │   ├── SetupAssistant.tsx      # Multi-step onboarding wizard + skip modal
    │   ├── WorkspaceEmptyState.tsx # Clean empty state for new tenants
    │   ├── Header.tsx              # Top bar, search, back button
    │   ├── Navigation.tsx          # Sidebar nav
    │   ├── ExecutiveDashboard.tsx  # KPI dashboard
    │   ├── OpportunitiesList.tsx   # Business table
    │   ├── OpportunityWorkspace.tsx# 4-tab opportunity workspace
    │   ├── ProposalStudio.tsx      # Proposal drafting + export
    │   ├── PipelineKanban.tsx      # Stage pipeline
    │   ├── CapabilityManager.tsx   # Capability profile
    │   ├── SettingsView.tsx        # Org + AI settings + setup entry
    │   ├── NewOpportunityModal.tsx # Opportunity intake
    │   ├── ProductBlueprintModal.tsx
    │   ├── NexasChatbotBubble.tsx  # Contextual assistant
    │   ├── OnboardingNexas.tsx     # Legacy pre-auth onboarding
    │   └── Logo.tsx
    ├── data/                   # Seed/demo data
    │   ├── mockOpportunities.ts
    │   └── companyProfile.ts
    ├── services/               # Business logic & persistence
    │   ├── workspaceStore.ts       # Tenant-scoped store (isolation seam)
    │   ├── nexasEngine.ts          # Scoring, risk, capability, analysis
    │   └── aiRouter.ts             # AI provider + analysis orchestration
    └── types/
        └── index.ts            # Shared domain types
```

---

## Local Setup & Environment Variables

### Prerequisites

- Node.js 20+ (developed on Node 24)
- npm (or bun — a `bun.lock` is present)

### Install

```bash
npm install
```

### Environment variables

Copy `.env.example` to `.env.local` and fill in the keys you need:

```bash
# Backend gateway (if used)
API_KEY=

# Frontend (must be prefixed with VITE_)
VITE_API_KEY=
GEMINI_API_KEY=
VITE_GEMINI_API_KEY=
```

| Variable | Purpose |
| --- | --- |
| `API_KEY` | Server-side gateway key (optional) |
| `VITE_API_KEY` | Client-exposed API key (optional) |
| `GEMINI_API_KEY` / `VITE_GEMINI_API_KEY` | Google Gemini access for AI analysis |

> The app runs fully without keys — `aiRouter.ts` falls back to deterministic analysis when no provider is configured.

### Run

```bash
npm run dev      # Vite dev server (default http://localhost:3000)
npm run build    # Production build to dist/
npm run preview  # Preview the production build
npm run lint     # TypeScript type check (tsc --noEmit)
npm run clean    # Remove dist/ and server.js
```

---

## Key Features

- **Strict tenant isolation** — per-user workspace documents; new accounts start empty.
- **Guided onboarding** — a multi-step Setup Assistant captures business profile, industry, team size, and goals.
- **Opportunity analysis** — structured extraction of requirements, risks, contacts, and open questions.
- **Capability assessment** — matched / partial / gap breakdown against company capabilities.
- **Risk analysis** — technical, commercial, compliance, timeline, and resource risk with mitigations.
- **Opportunity scoring** — weighted 25/35/20/20 model (Business Fit / Capability Match / Delivery Readiness / Risk Impact).
- **Recommendations** — PURSUE / INVESTIGATE FURTHER / DO NOT PURSUE, with reasoning.
- **Proposal generation** — 8 structured sections; unknowns marked `Requires Human Review`.
- **Exports** — styled DOCX, PDF, and Markdown.

---

## Onboarding & Tenant Provisioning

### First sign-in

1. A new user registers (or signs in) via `AuthLoginView`.
2. `resolveUser(email)` provisions a stable `userId` and, for new accounts, an **empty workspace** (`createEmptyWorkspace`).
3. Because `onboarded` is `false`, `App.tsx` renders the **Setup Assistant** (`SetupAssistant.tsx`) automatically.

### Setup Assistant

A 4-step, glassmorphic wizard:

1. **Business Profile** — account type (Individual / Enterprise), company name, website, description.
2. **Industry** — sector selection.
3. **Team Size** — team/fleet size and role.
4. **Goals** — primary operational goals.

- **Skip for now** opens an animated confirmation modal explaining that completing setup lets the Nexas AI engine map the business structure, unlock tailored analytics, and automate workspace configuration — and that setup can be resumed anytime from the dashboard.
- Actions: **Continue Setup** (primary) and **Yes, Skip for Now** (ghost).
- Completion builds an evidence-based capability profile via `nexasEngine.buildCapabilityProfile()` (never fabricates certifications or personnel).
- The wizard is re-openable anytime from **Settings → Setup Assistant** or the dashboard empty state.

### Demo tenant

The **Launch Demo** button signs into the isolated demo account (`sarah.jenkins@apexsystems.com`) with pre-populated simulation data — kept entirely separate from real accounts.

---

## AI Business Analysis Workflow

```
Document intake
   │  (NewOpportunityModal / aiRouter)
   ▼
Extract  → organization, industry, budget, deadline, requirements, deliverables,
            eligibility, risks, contacts, open questions
   ▼
Capability Match → matched / partial / gaps + match %
   ▼
Risk Analysis → severity (Low/Medium/High/Critical) + mitigations
   ▼
Scoring → 0.25·BusinessFit + 0.35·CapabilityMatch + 0.20·DeliveryReadiness + 0.20·RiskImpact
   ▼
Recommendation → PURSUE / INVESTIGATE FURTHER / DO NOT PURSUE (explained)
   ▼
Proposal → 8 sections (unknowns → "Requires Human Review")
```

The scoring, risk aggregation, capability matching, and structured analysis builders live in `src/services/nexasEngine.ts` and are covered by the domain types in `src/types/index.ts`.

---

## Scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Start Vite dev server |
| `npm run build` | Production build (`dist/`) |
| `npm run preview` | Preview production build |
| `npm run lint` | TypeScript type check |
| `npm run clean` | Remove build artifacts |

---

## Design Principles

- **Business value over technical detail.**
- **Never invent** capabilities, certifications, staff, technologies, pricing, or references — missing data is marked explicitly.
- **Evidence-based** — recommendations tie back to extracted source text.
- **Clarity and trust** — concise labels, tables over decoration, no hype or marketing language.
- **Daily-use tooling** — every page should feel like software an organization operates, not a demo.

---

© 2026 NexusIQ Inc. · Know before you commit.