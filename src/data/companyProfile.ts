import { CompanyCapabilityProfile } from '../types';

export const initialCompanyProfile: CompanyCapabilityProfile = {
  companyName: 'Apex Intelligence & Systems Group',
  tagline: 'Enterprise AI & Modern Cloud Engineering Partners',
  annualRevenue: '$28.4M',
  teamSize: 142,
  primaryIndustries: [
    'Public Sector & Transit',
    'Healthcare & Life Sciences',
    'Financial Services & Fintech',
    'Energy & Utilities',
    'Enterprise SaaS'
  ],
  services: [
    {
      name: 'Business Intelligence',
      level: 4,
      description: 'Executive dashboards, semantic layers, Looker, PowerBI, Tableau, and automated telemetry.',
      pastProjectsCount: 38
    },
    {
      name: 'Data Engineering',
      level: 5,
      description: 'Distributed data pipelines, Snowflake, Databricks, Kafka real-time streaming, dbt, Lakehouse architectures.',
      pastProjectsCount: 46
    },
    {
      name: 'Software Development',
      level: 5,
      description: 'Microservices, React, Next.js, Node.js, Go, Python FastAPI, Kubernetes, and event-driven architectures.',
      pastProjectsCount: 62
    },
    {
      name: 'AI & ML',
      level: 4,
      description: 'LLM orchestrations, RAG pipelines, fine-tuned agentic workflows, predictive ML, computer vision.',
      pastProjectsCount: 29
    },
    {
      name: 'Consulting',
      level: 4,
      description: 'Digital transformation strategy, enterprise RFP compliance, change management, Agile/SAFe coaching.',
      pastProjectsCount: 51
    }
  ],
  certifications: [
    { name: 'ISO 27001 Information Security', issuer: 'BSI', validThrough: '2028-12-31', status: 'Active' },
    { name: 'SOC 2 Type II Compliance', issuer: 'AICPA Accredited', validThrough: '2027-08-30', status: 'Active' },
    { name: 'HIPAA Security & Privacy Certified', issuer: 'HealthSec Assurance', validThrough: '2027-11-15', status: 'Active' },
    { name: 'AWS Premier Tier Services Partner', issuer: 'Amazon Web Services', validThrough: '2028-05-01', status: 'Active' },
    { name: 'Google Cloud Premier Partner', issuer: 'Google Cloud Platform', validThrough: '2027-09-30', status: 'Active' },
    { name: 'FedRAMP Moderate Readiness', issuer: '3PAO Assessment', validThrough: '2026-12-01', status: 'In Progress' }
  ],
  techStack: [
    { category: 'AI & Machine Learning', technologies: ['Gemini 2.5/Pro', 'OpenAI', 'PyTorch', 'LangChain', 'Vector DBs (pgvector/Pinecone)', 'vLLM'] },
    { category: 'Data & Streaming', technologies: ['Apache Kafka', 'Snowflake', 'Databricks', 'Apache Spark', 'dbt', 'PostgreSQL'] },
    { category: 'Cloud & Infrastructure', technologies: ['AWS EKS', 'Google Cloud Run / GKE', 'Terraform', 'ArgoCD', 'Docker'] },
    { category: 'Frontend & APIs', technologies: ['Next.js 15', 'React 19', 'TypeScript', 'TailwindCSS', 'GraphQL', 'FastAPI'] }
  ],
  keyPersonnel: [
    { name: 'Dr. Marcus Vance', title: 'VP of AI & Chief Architect', experienceYears: 16, clearance: 'Secret' },
    { name: 'Elena Rostova', title: 'Director of Cloud & Data Platform', experienceYears: 14, clearance: 'Public Trust' },
    { name: 'David K. Chen', title: 'Head of Enterprise Delivery', experienceYears: 18, clearance: 'None' },
    { name: 'Sarah Al-Mansoor', title: 'Lead Compliance & Risk Officer', experienceYears: 12, clearance: 'Secret' }
  ]
};
