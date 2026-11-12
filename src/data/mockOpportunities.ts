import { Opportunity, ActivityEvent } from '../types';

export const mockOpportunities: Opportunity[] = [
  {
    id: 'opp-transit-402',
    title: 'Metro Transit Real-Time Fleet Telemetry Platform',
    organization: 'Metropolitan Transportation Authority (MTA)',
    industry: 'Public Sector & Transportation',
    type: 'Tender',
    submittedDate: '2026-10-14',
    deadline: '2026-12-05',
    estimatedBudget: '$4,500,000',
    estimatedBudgetNumeric: 4500000,
    stage: 'qualified',
    overallScore: 88,
    riskLevel: 'Medium',
    recommendation: 'pursue',
    recommendationReason: 'Strong alignment with in-house Apache Kafka and distributed lakehouse streaming frameworks. Identified sponsor support from CTO Marcus Sterling. Main commercial contingency is the $15,000/day SLA milestone delay clause.',
    assignedOwner: 'Marcus Vance (VP Architecture)',
    sourceDocumentName: 'MTA-RFP-2026-Telematics-v2.pdf',
    summary: 'Centralized telemetry ingestion platform for 2,400 municipal hybrid and electric buses and 680 rail units. Real-time arrival calculation, EV battery health forecasting, and dispatch synchronization.',
    sourceDocumentText: `METROPOLITAN TRANSPORTATION AUTHORITY (MTA)
DEPARTMENT OF DIGITAL INFRASTRUCTURE & CAPITAL PROJECTS
REQUEST FOR PROPOSALS: RFP-2026-0881
PROJECT TITLE: Real-Time Fleet Telemetry & Predictive Analytics Lakehouse

1. EXECUTIVE OVERVIEW & OBJECTIVES
1.1 The Authority is soliciting competitive proposals from qualified enterprise software engineering vendors to modernize our real-time transit telemetry stack for 2,400 municipal hybrid and electric buses and 680 light-rail vehicles.
1.2 Budget: Board capital appropriation cap of $4,800,000 USD inclusive of software licenses, cloud architecture, and 12-month tier-3 operational support.
1.3 Liquidated Damages: $15,000 per business day penalty for unexcused schedule delays exceeding 30 calendar days past mutually agreed Phase milestones.
1.4 Performance: Ingestion engine must sustain 45,000 events/second at 99.99% availability with native GTFS-Realtime and SIRI support. Active SOC 2 Type II attestation mandatory. Evaluation Chair: Brenda Ramirez, Director of Transit Analytics.`,
    decisionMakers: [
      { name: 'Marcus V. Sterling', role: 'Chief Technology Officer (MTA)', influence: 'High' },
      { name: 'Brenda Ramirez', role: 'Director of Transit Analytics', influence: 'High' },
      { name: 'Arthur Pendelton', role: 'Chief Procurement Officer', influence: 'Medium' }
    ],
    keyDates: [
      { event: 'Clarification Questions Due', date: '2026-11-18' },
      { event: 'Formal Proposal Deadline', date: '2026-12-05' },
      { event: 'Shortlist Presentations', date: '2026-12-19' },
      { event: 'Contract Award Notice', date: '2027-01-14' }
    ],
    extractedEntities: [
      { label: 'Procuring Entity', value: 'Metropolitan Transportation Authority (MTA)', confidence: 99, evidenceId: 'ev-mta-1', category: 'Organization' },
      { label: 'Appropriated Budget', value: '$4,800,000 USD Capital Cap', confidence: 96, evidenceId: 'ev-mta-2', category: 'Budget' },
      { label: 'Throughput Threshold', value: '45,000 events/sec peak load', confidence: 98, evidenceId: 'ev-mta-3', category: 'Scope' },
      { label: 'Proposal Deadline', value: 'December 5, 2026 at 5:00 PM EST', confidence: 95, evidenceId: 'ev-mta-4', category: 'Timeline' },
      { label: 'Technical Chair', value: 'Brenda Ramirez, Transit Analytics Lead', confidence: 92, evidenceId: 'ev-mta-5', category: 'Stakeholder' }
    ],
    requirements: [
      {
        id: 'req-mta-1',
        title: 'High-Throughput Streaming Engine (45,000 events/sec)',
        category: 'Technical',
        mandatory: true,
        confidence: 98,
        evidenceId: 'ev-mta-3',
        description: 'Ingestion engine must sustain 45,000 telemetry events/sec with sub-second latency and 99.99% uptime availability.',
        companyProficiencyMatch: 95
      },
      {
        id: 'req-mta-2',
        title: 'GTFS-Realtime & SIRI Standard Compliance',
        category: 'Compliance',
        mandatory: true,
        confidence: 94,
        evidenceId: 'ev-mta-6',
        description: 'Native compatibility with General Transit Feed Specification (GTFS-Realtime) and SIRI protocols.',
        companyProficiencyMatch: 82
      },
      {
        id: 'req-mta-3',
        title: 'Active SOC 2 Type II Security Attestation',
        category: 'Compliance',
        mandatory: true,
        confidence: 99,
        evidenceId: 'ev-mta-7',
        description: 'Vendor systems and managed environments must possess active SOC 2 Type II attestation.',
        companyProficiencyMatch: 100
      },
      {
        id: 'req-mta-4',
        title: 'Past Performance in Transit Fleet Systems (> $2.5M)',
        category: 'Operational',
        mandatory: true,
        confidence: 95,
        evidenceId: 'ev-mta-8',
        description: 'Prime contractor must show 3 delivered transit projects over $2.5M in past 48 months.',
        companyProficiencyMatch: 90
      }
    ],
    capabilities: [
      {
        domain: 'Data Engineering & Streaming',
        requiredLevel: 5,
        currentLevel: 5,
        matchPercentage: 96,
        confidence: 95,
        gapSummary: 'Zero technical deficit. Team has delivered Kafka + Snowflake architectures exceeding 80k events/sec.',
        mitigationStrategy: 'Feature past City Transit Chicago & Port Authority reference architectures in Section 3.',
        verifiedAssets: ['Apache Kafka Cluster Blueprint', 'Lakehouse Realtime Benchmarks', '14 Certified Data Engineers']
      },
      {
        domain: 'Software Architecture & APIs',
        requiredLevel: 4,
        currentLevel: 5,
        matchPercentage: 94,
        confidence: 93,
        gapSummary: 'Fully capable of building the microservice ingestion nodes and dispatcher telemetry web portals.',
        mitigationStrategy: 'Package reusable React 19 UI component library for dispatcher command centers.',
        verifiedAssets: ['FastAPI Event Ingestors', 'React Webhook Dashboard Framework', 'Kubernetes Helm Deployments']
      },
      {
        domain: 'AI & Predictive Telematics',
        requiredLevel: 4,
        currentLevel: 4,
        matchPercentage: 86,
        confidence: 88,
        gapSummary: 'Predictive maintenance for EV battery thermals requires specialized telemetry feature-engineering.',
        mitigationStrategy: 'Leverage our pre-trained time-series anomaly detection pipeline.',
        verifiedAssets: ['Time-series Anomaly Engine', 'Automated Model Drift Monitor']
      },
      {
        domain: 'Business Intelligence & Reporting',
        requiredLevel: 4,
        currentLevel: 4,
        matchPercentage: 90,
        confidence: 91,
        gapSummary: 'MTA requires executive KPI dashboards with GTFS map overlays.',
        mitigationStrategy: 'Showcase interactive map-based telemetry canvas built on modern WebGL layers.',
        verifiedAssets: ['Looker Semantic Layer', 'Real-time Fleet Map Dashboard']
      },
      {
        domain: 'Delivery Management & PMO',
        requiredLevel: 5,
        currentLevel: 4,
        matchPercentage: 82,
        confidence: 85,
        gapSummary: 'Liquidated damages clause ($15,000/day delay) necessitates strict milestone buffer management.',
        mitigationStrategy: 'Add two-week contingency sprints before Phase 1 user acceptance testing.',
        verifiedAssets: ['PMP Certified Delivery Leads', 'Government Procurement Taskforce']
      }
    ],
    risks: [
      {
        id: 'risk-mta-1',
        title: 'Liquidated Damages Penalty ($15,000/day)',
        category: 'Commercial',
        severity: 'High',
        impact: 'Financial penalty risk if pilot testing exceeds 30-day buffer.',
        description: 'Contract imposes $15,000 per business day for unexcused schedule delays exceeding 30 calendar days past Phase milestones.',
        evidenceId: 'ev-mta-10',
        mitigation: 'Build 14-day schedule buffers prior to FAT/SAT milestones and negotiate force majeure edge hardware supply chain clauses.',
        costImpactEst: '$15,000 / day penalty ceiling capped at 10%'
      },
      {
        id: 'risk-mta-2',
        title: 'Legacy On-Vehicle Telematics Protocol Heterogeneity',
        category: 'Technical',
        severity: 'Medium',
        impact: 'Potential integration delay during initial firmware onboarding.',
        description: 'Fleet features 3 distinct generations of Sierra Wireless & Cradlepoint edge gateways with conflicting data schemas.',
        evidenceId: 'ev-mta-11',
        mitigation: 'Deploy containerized edge ingestion proxy with schema-registry normalization on Day 1.',
        costImpactEst: '$45,000 dedicated protocol adapter sprint'
      }
    ],
    evidenceMap: {
      'ev-mta-1': {
        id: 'ev-mta-1',
        section: 'Section 1.1 - Overview',
        page: 1,
        paragraphNumber: 1,
        exactQuote: 'The Metropolitan Transportation Authority (hereinafter "Authority") is soliciting competitive proposals from qualified enterprise software engineering vendors...',
        context: 'Procuring entity official legal name and contract authority.'
      },
      'ev-mta-2': {
        id: 'ev-mta-2',
        section: 'Section 2.1 - Financial Appropriation',
        page: 2,
        paragraphNumber: 1,
        exactQuote: 'The Board of Commissioners has earmarked a capital budget cap of $4,800,000 USD inclusive of software licenses, cloud architecture, and 12-month tier-3 operational support.',
        context: 'Budget ceiling verified directly from Board of Commissioners resolution.'
      },
      'ev-mta-3': {
        id: 'ev-mta-3',
        section: 'Section 3.1 - Stream Processing Throughput',
        page: 3,
        paragraphNumber: 1,
        exactQuote: 'The ingestion engine must effortlessly sustain peak loads of 45,000 telemetry events per second with 99.99% system availability, preserving guaranteed at-least-once message delivery semantics.',
        context: 'Non-negotiable architectural performance requirement.'
      },
      'ev-mta-4': {
        id: 'ev-mta-4',
        section: 'Section 5 - Procurement Schedule',
        page: 5,
        paragraphNumber: 2,
        exactQuote: 'Formal Proposal Due Date: December 5, 2026 at 5:00 PM EST. Late submissions will be rejected without review.',
        context: 'Proposal cutoff deadline.'
      },
      'ev-mta-5': {
        id: 'ev-mta-5',
        section: 'Section 5.2 - Governance',
        page: 5,
        paragraphNumber: 4,
        exactQuote: 'Director of Transit Analytics: Brenda Ramirez (Technical Evaluation Chair)',
        context: 'Primary technical decision maker and scoring chair.'
      },
      'ev-mta-6': {
        id: 'ev-mta-6',
        section: 'Section 3.4 - Standards',
        page: 3,
        paragraphNumber: 4,
        exactQuote: 'Full native compatibility with General Transit Feed Specification (GTFS-Realtime) and SIRI protocols.',
        context: 'Mandatory standard compliance requirement.'
      },
      'ev-mta-7': {
        id: 'ev-mta-7',
        section: 'Section 4.2 - Information Security',
        page: 4,
        paragraphNumber: 2,
        exactQuote: 'Vendor systems and managed environments must possess active SOC 2 Type II attestation and demonstrate compliance with CJIS / state municipal data retention mandates.',
        context: 'Mandatory cybersecurity compliance certification.'
      },
      'ev-mta-8': {
        id: 'ev-mta-8',
        section: 'Section 4.1 - Past Performance',
        page: 4,
        paragraphNumber: 1,
        exactQuote: 'The Prime Contractor must demonstrate at least three (3) successfully delivered public sector or commercial fleet projects valued above $2.5M within the preceding 48 months.',
        context: 'Mandatory RFP qualification threshold.'
      },
      'ev-mta-10': {
        id: 'ev-mta-10',
        section: 'Section 2.3 - Liquidated Damages',
        page: 2,
        paragraphNumber: 3,
        exactQuote: 'A contractual penalty of $15,000 per business day will be levied against the prime contractor for unexcused schedule delays exceeding thirty (30) calendar days from mutually agreed Phase milestones.',
        context: 'Commercial liability risk factor.'
      },
      'ev-mta-11': {
        id: 'ev-mta-11',
        section: 'Section 1.2 - Vehicle Fleet Composition',
        page: 1,
        paragraphNumber: 2,
        exactQuote: '...modernize our real-time transit telemetry stack for 2,400 municipal hybrid and electric buses and 680 light-rail vehicles.',
        context: 'Multiple legacy telemetry vendors across bus and rail fleets.'
      }
    },
    proposal: {
      executiveSummary: `Apex Intelligence & Systems Group respectfully submits this proposal to deliver the Metropolitan Transportation Authority's NextGen Real-Time Fleet Telemetry & Predictive Analytics Lakehouse.\n\nWith 2,400 municipal buses and 680 light-rail cars transporting 1.8 million daily commuters, the Authority requires an enterprise event-streaming foundation that guarantees sub-second telemetry delivery without vendor lock-in. Our team brings validated distributed streaming architectures that currently process over 80,000 events/second in live municipal transit environments.`,
      clientRequirements: `1. High-Throughput Stream Ingestion: Sustain peak loads of 45,000 events/second at 99.99% system availability.\n2. Open Transit Standards: Complete native integration with GTFS-Realtime and SIRI protocols for multi-modal dispatch.\n3. Predictive Fleet Telematics: Early forecasting of EV battery degradation, transmission thermal spikes, and brake wear 72 hours before road failure.\n4. Rigorous Cybersecurity: Active SOC 2 Type II attestation with end-to-end telemetry encryption.`,
      recommendedSolution: `Our solution employs a three-tier, cloud-native architecture deployed directly within MTA's sovereign cloud environment:\n\n- Ingestion Layer: High-resilience Apache Kafka cluster deployed on managed Kubernetes with schema registry validation.\n- Analytics & Lakehouse Tier: Snowflake and Databricks data lakehouse unifying raw telemetry streams into standardized transit schemas.\n- Operational Experience: Modern dispatch command center interface built on React and WebGL delivering instantaneous fleet location and vehicle diagnostics.`,
      deliverables: `Phase 1 (Months 1-3): Architecture Blueprint, Kafka Ingestion Core, and Edge Gateway Protocol Adapters.\nPhase 2 (Months 4-6): Pilot Ingestion across 200 Hybrid/EV Buses, GTFS-RT feed certification, and Dispatcher UI Beta.\nPhase 3 (Months 7-9): Full Fleet Cutover (2,400 buses + 680 rail units) and EV Battery Anomaly ML Model Training.\nPhase 4 (Months 10-12): Final Acceptance Testing (FAT/SAT), System Hardening, SOC 2 Audit Validation, and Staff Training.`,
      assumptions: `1. MTA IT will provide VPN and staging sandbox access to live test bus streams within 15 calendar days of project kickoff.\n2. In-vehicle edge gateway hardware (Sierra Wireless / Cradlepoint) maintains active cellular data contracts provided by MTA.`,
      dependencies: `1. Provisioning of target cloud infrastructure subscriptions by MTA Digital Infrastructure.\n2. Availability of municipal maintenance depot engineers during Phase 2 on-vehicle sensor validation.`,
      risks: `1. Liquidated Damages Exposure ($15,000/day): Mitigated by building two-week buffer sprints prior to Phase acceptance gates.\n2. Sensor Protocol Heterogeneity: Mitigated by deploying our pre-built edge proxy adapter on Day 1.`,
      openQuestions: `1. Regarding Section 2.3: Does the Authority consider delays caused by cellular carrier outages as unexcused delays?\n2. Regarding Section 3.3: Does MTA maintain direct CAN-bus diagnostic access to EV battery cell temperatures on the New Flyer fleet?`,
      lastUpdated: '2026-11-10 16:30'
    },
    tags: ['IoT', 'Kafka', 'Smart Transit', 'Public Sector', 'Lakehouse']
  },
  {
    id: 'opp-health-109',
    title: 'Hospital Clinical Data Exchange & Interoperability Gateway',
    organization: 'Horizon Health Alliance',
    industry: 'Healthcare & Life Sciences',
    type: 'RFP',
    submittedDate: '2026-10-22',
    deadline: '2026-12-18',
    estimatedBudget: '$3,000,000',
    estimatedBudgetNumeric: 3000000,
    stage: 'proposal',
    overallScore: 92,
    riskLevel: 'Low',
    recommendation: 'pursue',
    recommendationReason: 'Near-perfect capability match (94%). Complete compliance alignment with our active HIPAA, SOC 2 Type II, and ISO 27001 certifications. Strong executive relationship with Chief Medical Informatics Officer.',
    assignedOwner: 'Sarah Jenkins (Healthcare Lead)',
    sourceDocumentName: 'Horizon-Health-FHIR-RFP-2026.docx',
    summary: 'Enterprise-grade clinical data exchange connecting 14 acute care hospitals and 82 outpatient clinics across Epic, Cerner, and Meditech systems using HL7 FHIR Release 4.',
    sourceDocumentText: `HORIZON HEALTH ALLIANCE
CLINICAL INFORMATICS & DIGITAL HEALTH INITIATIVE
RFP REFERENCE: HHA-2026-FHIR-04

1. STATEMENT OF NEED
Horizon Health Alliance operates 14 acute care hospitals and 82 outpatient clinics. We require an enterprise-grade clinical data exchange platform to securely aggregate electronic health records (EHR) across disparate Cerner, Epic, and legacy Meditech platforms.
2. TARGET CAPABILITIES & COMPLIANCE
2.1 FHIR R4 Standards: System must implement HL7 FHIR Release 4 standard with automated patient matching achieving >99.4% deduplication accuracy.
2.2 HIPAA & HITECH Compliance: End-to-end encryption with BAA agreement, audit logging meeting 7-year federal compliance mandates.
2.3 Budget: Board-approved maximum capital outlay of $3,200,000. Project kickoff target is Q1 2027. Decision maker: Dr. Evelyn Reed, CMIO.`,
    decisionMakers: [
      { name: 'Dr. Evelyn Reed', role: 'Chief Medical Informatics Officer', influence: 'High' },
      { name: 'Nathaniel Hayes', role: 'Chief Information Security Officer', influence: 'High' }
    ],
    keyDates: [
      { event: 'Pre-Proposal Conference', date: '2026-11-20' },
      { event: 'Proposal Deadline', date: '2026-12-18' },
      { event: 'Vendor Sandbox Testing', date: '2027-01-08' }
    ],
    extractedEntities: [
      { label: 'Procuring Entity', value: 'Horizon Health Alliance', confidence: 99, evidenceId: 'ev-hha-1', category: 'Organization' },
      { label: 'Board Capital Outlay', value: '$3,200,000 Approved Budget', confidence: 97, evidenceId: 'ev-hha-2', category: 'Budget' },
      { label: 'Clinical Interop Standard', value: 'HL7 FHIR R4 & SMART on FHIR', confidence: 98, evidenceId: 'ev-hha-3', category: 'Scope' }
    ],
    requirements: [
      { id: 'req-hha-1', title: 'HL7 FHIR R4 Interoperability Gateway', category: 'Technical', mandatory: true, confidence: 98, evidenceId: 'ev-hha-3', description: 'Certified FHIR R4 gateway bridging Epic and Cerner EHR APIs.', companyProficiencyMatch: 95 },
      { id: 'req-hha-2', title: 'HIPAA & HITECH Compliance with BAA', category: 'Compliance', mandatory: true, confidence: 100, evidenceId: 'ev-hha-4', description: 'Rigorous PHI encryption, 7-year audit logs, and BAA execution.', companyProficiencyMatch: 100 }
    ],
    capabilities: [
      { domain: 'Software Architecture & APIs', requiredLevel: 5, currentLevel: 5, matchPercentage: 96, confidence: 95, gapSummary: 'Extensive experience building resilient microservices and health APIs.', mitigationStrategy: 'Highlight our SMART-on-FHIR open source contributions.', verifiedAssets: ['FHIR Gateway Starter', 'OAuth2 SMART Auth Proxy'] },
      { domain: 'Data Engineering & Streaming', requiredLevel: 4, currentLevel: 5, matchPercentage: 94, confidence: 93, gapSummary: 'Strong streaming and lakehouse health data pipelines.', mitigationStrategy: 'Provide reference architecture for HL7 batch-to-stream conversion.', verifiedAssets: ['HL7 MLLP Ingestors', 'Parquet Clinical Warehouse'] }
    ],
    risks: [
      { id: 'risk-hha-1', title: 'Hospital EHR API Access Delays', category: 'Technical', severity: 'Medium', impact: 'May delay pilot ingestion by 2 to 4 weeks.', description: 'Third-party EHR sandbox API credentials frequently encounter administrative committee delays.', evidenceId: 'ev-hha-5', mitigation: 'Request sandbox credentials immediately during contracting and employ synthetic FHIR test fixtures during sprint 1.', costImpactEst: '$25,000 operational buffer' }
    ],
    evidenceMap: {
      'ev-hha-1': { id: 'ev-hha-1', section: 'Section 1 - Need', exactQuote: 'Horizon Health Alliance operates 14 acute care hospitals and 82 outpatient clinics.', context: 'Organization scope.' },
      'ev-hha-2': { id: 'ev-hha-2', section: 'Section 2.3 - Budget', exactQuote: 'Board-approved maximum capital outlay of $3,200,000. Project kickoff target is Q1 2027.', context: 'Budget verification.' },
      'ev-hha-3': { id: 'ev-hha-3', section: 'Section 2.1 - Standards', exactQuote: 'System must implement HL7 FHIR Release 4 standard with automated patient matching achieving >99.4% deduplication accuracy.', context: 'Technical specification.' },
      'ev-hha-4': { id: 'ev-hha-4', section: 'Section 2.2 - Compliance', exactQuote: 'End-to-end encryption with BAA agreement, audit logging meeting 7-year federal compliance mandates.', context: 'Regulatory requirement.' },
      'ev-hha-5': { id: 'ev-hha-5', section: 'Section 1 - Platforms', exactQuote: '...disparate Cerner, Epic, and legacy Meditech platforms.', context: 'Integration risk.' }
    },
    proposal: {
      executiveSummary: 'Apex Intelligence proposes a carrier-grade Clinical Data Exchange platform built natively on HL7 FHIR R4 to unify patient histories across Horizon Health Alliance hospitals.',
      clientRequirements: 'Unify 14 regional hospital EHR systems, achieve >99.4% patient matching deduplication, and satisfy full HIPAA/HITECH federal compliance standards.',
      recommendedSolution: 'Zero-trust FHIR R4 interoperability layer connecting Epic App Orchard, Cerner FHIR Ignite, and Meditech APIs with probabilistic entity resolution.',
      deliverables: 'Phase 1: Architecture & BAA Execution; Phase 2: FHIR Connectors; Phase 3: Hospital Pilot; Phase 4: Network Rollout across all 14 hospitals.',
      assumptions: 'Horizon hospital IT teams will grant API gateway access within 30 days of contract signing.',
      dependencies: 'Execution of Business Associate Agreement (BAA) and vendor security review signoff.',
      risks: 'Third-party EHR certification delays mitigated by using pre-certified HL7 FHIR starter modules.',
      openQuestions: 'Will Horizon require custom FHIR extensions for oncology patient cohorts?',
      lastUpdated: '2026-11-11 10:15'
    },
    tags: ['Healthcare', 'FHIR R4', 'HIPAA', 'Clinical Interoperability']
  },
  {
    id: 'opp-fintech-204',
    title: 'Open Banking Payment & Real-Time Fraud Gateway',
    organization: 'VantagePay Global FinTech',
    industry: 'Financial Services & Banking',
    type: 'Discovery Notes',
    submittedDate: '2026-11-02',
    deadline: '2026-12-22',
    estimatedBudget: '$1,600,000',
    estimatedBudgetNumeric: 1600000,
    stage: 'discovery',
    overallScore: 76,
    riskLevel: 'High',
    recommendation: 'investigate',
    recommendationReason: 'Attractive commercial margin ($1.6M fixed fee + $250k completion bonus), but compressed 90-day production timeline and strict PCI-DSS Level 1 operational compliance require senior team commitment.',
    assignedOwner: 'David K. Chen (Delivery VP)',
    sourceDocumentName: 'VantagePay-Discovery-Notes-Nov2026.txt',
    summary: 'Open Banking API gateway and sub-80ms real-time fraud scoring engine processing 10,000 card authorization transactions per second.',
    sourceDocumentText: `MEETING NOTES: VANTAGEPAY LEAD ARCHITECT DISCOVERY
DATE: November 2, 2026
ATTENDEES: Julian Ross (VP of Engineering), Maya Lindqvist (Head of Risk), Apex Team.

KEY TAKEAWAYS & BUSINESS OBJECTIVES:
1. VantagePay is launching a cross-border merchant payout network across the UK, EU, and North America.
2. Engineering strike team needed to build Open Banking API gateway and real-time fraud scoring engine within 90 days.
3. Target: Process 10,000 transaction auths/sec with latency under 80 milliseconds.
4. Budget: $1.5M fixed fee with $250k performance bonus if live before Easter 2027.
5. Critical Requirement: Vendor must provide certified engineers with active PCI-DSS Level 1 operational experience.`,
    decisionMakers: [
      { name: 'Julian Ross', role: 'VP of Engineering', influence: 'High' },
      { name: 'Maya Lindqvist', role: 'Head of Risk & Fraud Modeling', influence: 'High' }
    ],
    keyDates: [
      { event: 'Technical Proposal Due', date: '2026-12-22' },
      { event: 'Production Launch Deadline', date: '2027-04-10' }
    ],
    extractedEntities: [
      { label: 'Client', value: 'VantagePay Global FinTech', confidence: 99, evidenceId: 'ev-vp-1', category: 'Organization' },
      { label: 'Commercial Value', value: '$1.5M Fixed + $250k Performance Bonus', confidence: 95, evidenceId: 'ev-vp-2', category: 'Budget' },
      { label: 'Performance Latency SLA', value: '< 80ms at 10,000 requests/sec', confidence: 96, evidenceId: 'ev-vp-3', category: 'Scope' }
    ],
    requirements: [
      { id: 'req-vp-1', title: 'Sub-80ms Real-Time Fraud Scoring Engine', category: 'Technical', mandatory: true, confidence: 96, evidenceId: 'ev-vp-3', description: 'Evaluate graph fraud features and ML inference within 80ms round-trip.', companyProficiencyMatch: 85 },
      { id: 'req-vp-2', title: 'Aggressive 90-Day Production Launch', category: 'Delivery', mandatory: true, confidence: 94, evidenceId: 'ev-vp-4', description: 'Deliver production-ready gateway in 90 calendar days.', companyProficiencyMatch: 70 }
    ],
    capabilities: [
      { domain: 'Software Architecture & APIs', requiredLevel: 5, currentLevel: 5, matchPercentage: 94, confidence: 94, gapSummary: 'High-throughput Go / Rust microservices match our skills.', mitigationStrategy: 'Assign senior distributed systems engineers.', verifiedAssets: ['Go Microservices Framework', 'gRPC Gateways'] },
      { domain: 'Delivery Management & PMO', requiredLevel: 5, currentLevel: 4, matchPercentage: 72, confidence: 85, gapSummary: '90-day delivery requires dedicated engineering strike team.', mitigationStrategy: 'Deploy experienced team with ring-fenced sprint allocations.', verifiedAssets: ['Agile Sprint Playbook'] }
    ],
    risks: [
      { id: 'risk-vp-1', title: 'Compressed 90-Day Production Timeline', category: 'Timeline', severity: 'Critical', impact: 'Leaves zero margin for third-party banking integration delays.', description: 'Fixed schedule with launch target prior to Easter 2027.', evidenceId: 'ev-vp-4', mitigation: 'Phase deliverables into Core Card Gateway (Day 60) and Advanced Graph Fraud (Day 90).', costImpactEst: 'Overtime engineering costs ($40,000)' }
    ],
    evidenceMap: {
      'ev-vp-1': { id: 'ev-vp-1', section: 'Notes - Header', exactQuote: 'VantagePay is launching a cross-border merchant payout network across the UK, EU, and North America.', context: 'Business mission.' },
      'ev-vp-2': { id: 'ev-vp-2', section: 'Notes - Item 4', exactQuote: 'Budget: $1.5M fixed fee with $250k performance bonus if live before Easter 2027.', context: 'Commercial value.' },
      'ev-vp-3': { id: 'ev-vp-3', section: 'Notes - Item 3', exactQuote: 'Target: Process 10,000 transaction auths/sec with latency under 80 milliseconds.', context: 'Performance specification.' },
      'ev-vp-4': { id: 'ev-vp-4', section: 'Notes - Item 2', exactQuote: '...build their Open Banking API gateway and real-time fraud scoring engine within 90 days.', context: 'Timeline pressure.' }
    },
    proposal: {
      executiveSummary: 'Apex Intelligence proposes a High-Velocity Engineering Strike Team to architect VantagePay\'s Open Banking Gateway and Sub-80ms Fraud Shield.',
      clientRequirements: 'Process 10,000 transaction authorizations per second under 80ms while upholding full PCI-DSS Level 1 operational standards.',
      recommendedSolution: 'Low-latency Go microservices and Redis in-memory feature caches integrated with Apache Kafka event streams.',
      deliverables: 'Sprint 1-2: Core Gateway & Auth; Sprint 3-4: Fraud Evaluation Engine; Sprint 5-6: Load Testing and PCI-DSS Audit Validation.',
      assumptions: 'VantagePay provides direct sandbox connectivity to merchant bank rails by Week 2.',
      dependencies: 'Merchant acquiring bank certification test windows.',
      risks: 'Tight schedule mitigated by utilizing proven Go microservice boilerplate libraries.',
      openQuestions: 'Will transaction authorization traffic spike during Black Friday / holiday peaks beyond 10,000 RPS?',
      lastUpdated: '2026-11-09 14:20'
    },
    tags: ['Fintech', 'Open Banking', 'Low Latency', 'PCI-DSS']
  },
  {
    id: 'opp-fed-509',
    title: 'Defense Logistics Mainframe Reverse Engineering Tender',
    organization: 'Defense Logistics Support Command (DLSC)',
    industry: 'Defense & Federal Government',
    type: 'Tender',
    submittedDate: '2026-10-05',
    deadline: '2026-12-10',
    estimatedBudget: '$8,500,000',
    estimatedBudgetNumeric: 8500000,
    stage: 'verification',
    overallScore: 34,
    riskLevel: 'High',
    recommendation: 'do_not_pursue',
    recommendationReason: 'FATAL COMPLIANCE FAILURE: Section 2.1 mandates an active Top Secret Facility Security Clearance (FCL) with operational SCIF processing at proposal submission. We hold Secret only; bid will be disqualified on day 1. Contract also imposes toxic unlimited indemnification liability for logistics disruptions.',
    assignedOwner: 'Elena Rostova (Compliance Director)',
    sourceDocumentName: 'DLSC-RFP-Mainframe-Modernization-2026.pdf',
    summary: 'Rewriting 4.2 million lines of 1984 COBOL/CICS inventory software hosted on IBM z/OS mainframes into a private sovereign cloud. Mandatory 100% on-site TS/SCI cleared personnel.',
    sourceDocumentText: `DEFENSE LOGISTICS SUPPORT COMMAND (DLSC)
SOLICITATION: DLSC-2026-MF-0994
CLASSIFICATION: CUI // FEDCON

SECTION C - PERFORMANCE WORK STATEMENT
1. OVERVIEW: Contractor shall furnish personnel, facilities, and technical capabilities to perform full automated conversion and business-rule extraction of 4,200,000 lines of legacy COBOL/CICS inventory software on IBM z15 mainframes.
2. MANDATORY CLEARANCE GATES: Prime contractor must possess active Top Secret Facility Security Clearance (FCL) with approved SCIF processing capabilities at time of proposal submission. Non-negotiable. 100% of staff must hold active TS/SCI clearances.
3. LIABILITY: Contractor warrants zero inventory discrepancy during parallel shadow execution. Contractor indemnifies the Government for any logistics routing failure with unlimited liability.`,
    decisionMakers: [
      { name: 'Col. Raymond Sterling', role: 'Program Executive Officer', influence: 'High' },
      { name: 'Harriet Vance', role: 'Defense Contracting Officer', influence: 'High' }
    ],
    keyDates: [
      { event: 'Classified Briefing', date: '2026-11-15' },
      { event: 'Proposal Cutoff', date: '2026-12-10' }
    ],
    extractedEntities: [
      { label: 'Agency', value: 'Defense Logistics Support Command (DLSC)', confidence: 99, evidenceId: 'ev-dlsc-1', category: 'Organization' },
      { label: 'Contract Cap', value: '$8,500,000 Firm-Fixed Price', confidence: 94, evidenceId: 'ev-dlsc-2', category: 'Budget' },
      { label: 'Security Clearance Gate', value: 'Top Secret FCL with SCIF Mandatory', confidence: 100, evidenceId: 'ev-dlsc-4', category: 'Compliance' }
    ],
    requirements: [
      { id: 'req-dlsc-1', title: 'Top Secret FCL with SCIF Facility Access', category: 'Compliance', mandatory: true, confidence: 100, evidenceId: 'ev-dlsc-4', description: 'Mandatory active TS FCL facility clearance at submission.', companyProficiencyMatch: 10 },
      { id: 'req-dlsc-2', title: 'Unlimited Logistics Discrepancy Liability', category: 'Commercial', mandatory: true, confidence: 99, evidenceId: 'ev-dlsc-5', description: 'Contractor assumes unlimited indemnification liability for logistics errors.', companyProficiencyMatch: 0 }
    ],
    capabilities: [
      { domain: 'Software Architecture & APIs', requiredLevel: 5, currentLevel: 5, matchPercentage: 40, confidence: 95, gapSummary: 'Firm specializes in modern cloud and AI, not 1980s mainframe COBOL.', mitigationStrategy: 'Extensive subcontracting required; unacceptable margins.', verifiedAssets: [] }
    ],
    risks: [
      { id: 'risk-dlsc-1', title: 'Fatal Gate: Missing Top Secret FCL', category: 'Compliance', severity: 'Critical', impact: 'Immediate administrative rejection without review.', description: 'RFP mandates active Top Secret FCL at submission. We hold Secret only.', evidenceId: 'ev-dlsc-4', mitigation: 'None feasible. Immediate disqualification recommended.', costImpactEst: '100% loss of proposal preparation budget ($85,000)' }
    ],
    evidenceMap: {
      'ev-dlsc-1': { id: 'ev-dlsc-1', section: 'Cover Page', exactQuote: 'DEFENSE LOGISTICS SUPPORT COMMAND (DLSC) SOLICITATION: DLSC-2026-MF-0994', context: 'Procuring entity.' },
      'ev-dlsc-2': { id: 'ev-dlsc-2', section: 'Section B', exactQuote: 'Total Evaluated Price Cap: $8,500,000 Firm-Fixed Price over 36 months.', context: 'Total value.' },
      'ev-dlsc-4': { id: 'ev-dlsc-4', section: 'Section C - 2.1', exactQuote: 'Prime contractor must possess active Top Secret Facility Security Clearance (FCL) with approved SCIF processing capabilities at time of proposal submission. Non-negotiable.', context: 'Fatal compliance gate.' },
      'ev-dlsc-5': { id: 'ev-dlsc-5', section: 'Section 3.1', exactQuote: 'Contractor shall indemnify the Government for any logistics routing failure with unlimited liability.', context: 'Uncapped commercial liability.' }
    },
    proposal: {
      executiveSummary: 'INTERNAL BID DISQUALIFICATION ADVISORY: Do not pursue DLSC-2026-MF-0994. Reallocate bid budget to high-probability commercial and public transit bids.',
      clientRequirements: 'Automated reverse engineering of 4.2M lines of COBOL on IBM z15 mainframes with TS/SCI staffing.',
      recommendedSolution: 'N/A - Bid disqualified due to fatal compliance clearance requirement.',
      deliverables: 'N/A',
      assumptions: 'N/A',
      dependencies: 'N/A',
      risks: 'Fatal compliance failure: Lacking Top Secret FCL facility accreditation.',
      openQuestions: 'N/A',
      lastUpdated: '2026-11-06 09:15'
    },
    tags: ['Defense', 'COBOL', 'Disqualified', 'High Risk']
  },
  {
    id: 'opp-energy-301',
    title: 'Smart Substation IoT Telemetry & Grid Analytics',
    organization: 'Nordic Energy Power Grid',
    industry: 'Energy & Utilities',
    type: 'Procurement Notice',
    submittedDate: '2026-10-28',
    deadline: '2026-12-30',
    estimatedBudget: '$2,400,000',
    estimatedBudgetNumeric: 2400000,
    stage: 'verification',
    overallScore: 84,
    riskLevel: 'Low',
    recommendation: 'pursue',
    recommendationReason: 'Solid match with our industrial IoT streaming components and ISO 27001 data governance standards. Clean procurement terms with milestone-based progress disbursements.',
    assignedOwner: 'Sarah Jenkins (Enterprise Lead)',
    sourceDocumentName: 'Nordic-Grid-Substation-IoT-Notice.pdf',
    summary: 'Ingestion of SCADA and high-voltage transformer sensor data across 45 regional electrical substations to predict transformer insulation degradation.',
    sourceDocumentText: `NORDIC ENERGY POWER GRID
PROCUREMENT NOTICE: NEPG-2026-SUBSTATION-45
PROJECT: Industrial Substation Sensor Telemetry & Predictive Maintenance
Estimated Budget: $2,400,000 EUR
Target Go-Live: Q3 2027
Requirements: Edge MQTT connectors, IEC 61850 compliance, and sub-second transformer anomaly detection. ISO 27001 certification required.`,
    decisionMakers: [
      { name: 'Henrik Lind', role: 'VP Grid Operations', influence: 'High' }
    ],
    keyDates: [
      { event: 'Clarification Deadline', date: '2026-12-08' },
      { event: 'Submission Due', date: '2026-12-30' }
    ],
    extractedEntities: [
      { label: 'Procuring Entity', value: 'Nordic Energy Power Grid', confidence: 99, evidenceId: 'ev-ne-1', category: 'Organization' },
      { label: 'Budget Allocation', value: '$2,400,000 EUR Capital Fund', confidence: 96, evidenceId: 'ev-ne-2', category: 'Budget' }
    ],
    requirements: [
      { id: 'req-ne-1', title: 'IEC 61850 Substation Protocol Integration', category: 'Technical', mandatory: true, confidence: 95, evidenceId: 'ev-ne-3', description: 'Direct protocol interface for substation relays and transformers.', companyProficiencyMatch: 86 }
    ],
    capabilities: [
      { domain: 'Data Engineering & Streaming', requiredLevel: 4, currentLevel: 5, matchPercentage: 92, confidence: 93, gapSummary: 'Industrial IoT protocols match our streaming engine.', mitigationStrategy: 'Deploy pre-tested MQTT / Kafka bridges.', verifiedAssets: ['Industrial IoT Broker'] }
    ],
    risks: [
      { id: 'risk-ne-1', title: 'Hardware Edge Testing Access Window', category: 'Timeline', severity: 'Low', impact: 'Requires substation maintenance outages for testing.', description: 'Substation hardware access restricted to scheduled maintenance windows.', evidenceId: 'ev-ne-4', mitigation: 'Coordinate shadow test bench during month 2.', costImpactEst: 'Standard contingency' }
    ],
    evidenceMap: {
      'ev-ne-1': { id: 'ev-ne-1', section: 'Header', exactQuote: 'NORDIC ENERGY POWER GRID PROCUREMENT NOTICE: NEPG-2026-SUBSTATION-45', context: 'Procuring organization.' },
      'ev-ne-2': { id: 'ev-ne-2', section: 'Notice - Budget', exactQuote: 'Estimated Budget: $2,400,000 EUR Target Go-Live: Q3 2027', context: 'Budget allocation.' },
      'ev-ne-3': { id: 'ev-ne-3', section: 'Notice - Scope', exactQuote: 'Requirements: Edge MQTT connectors, IEC 61850 compliance, and sub-second transformer anomaly detection.', context: 'Technical scope.' },
      'ev-ne-4': { id: 'ev-ne-4', section: 'Notice - Governance', exactQuote: 'ISO 27001 certification required.', context: 'Compliance requirement.' }
    },
    proposal: {
      executiveSummary: 'Apex Intelligence delivers a unified SCADA IoT telemetry platform for Nordic Energy Power Grid to safeguard critical electrical substation transformers.',
      clientRequirements: 'Continuous IEC 61850 data ingestion across 45 substations with automated thermal failure prediction.',
      recommendedSolution: 'Containerized edge MQTT collectors transmitting encrypted telemetry to a centralized real-time predictive lakehouse.',
      deliverables: 'Phase 1: Substation Edge Adapters; Phase 2: Pilot on 5 Substations; Phase 3: Grid-Wide Deployment.',
      assumptions: 'Nordic Energy provides substation optical network access.',
      dependencies: 'Substation scheduled maintenance calendars.',
      risks: 'On-site access constraints mitigated by using digital-twin simulations.',
      openQuestions: 'Are SCADA feeds broadcast via IEC 60870-5-104 or DNP3?',
      lastUpdated: '2026-11-10 11:45'
    },
    tags: ['Energy', 'IoT', 'SCADA', 'Predictive Maintenance']
  }
];

export const initialActivityEvents: ActivityEvent[] = [
  {
    id: 'act-1',
    timestamp: '15 mins ago',
    opportunityId: 'opp-transit-402',
    opportunityTitle: 'MTA Fleet Telemetry',
    type: 'qualification',
    message: 'Opportunity qualified with Score 88/100. Recommendation: PURSUE.',
    actor: 'Marcus Vance',
    badgeType: 'emerald'
  },
  {
    id: 'act-2',
    timestamp: '1 hour ago',
    opportunityId: 'opp-health-109',
    opportunityTitle: 'Horizon Health Clinical Exchange',
    type: 'proposal_generated',
    message: 'Proposal studio generated 8 complete sections. DOCX ready for review.',
    actor: 'Sarah Jenkins',
    badgeType: 'blue'
  },
  {
    id: 'act-3',
    timestamp: '3 hours ago',
    opportunityId: 'opp-fed-509',
    opportunityTitle: 'Defense Logistics Command',
    type: 'risk_detected',
    message: 'Fatal Gate Detected: Missing Top Secret FCL. Recommendation: DO NOT PURSUE.',
    actor: 'Compliance System',
    badgeType: 'rose'
  },
  {
    id: 'act-4',
    timestamp: '5 hours ago',
    opportunityId: 'opp-fintech-204',
    opportunityTitle: 'VantagePay Open Banking',
    type: 'extraction',
    message: 'Discovery notes parsed: Extracted 3 requirements and sub-80ms SLA.',
    actor: 'David K. Chen',
    badgeType: 'amber'
  }
];
