export interface Industry {
  id: string
  name: string
  problem: string
  solution: string
  examples: string[]
  glyph: 'grid' | 'pulse' | 'bars' | 'cart' | 'gear' | 'org' | 'chat'
  color: string
}

export const INDUSTRIES: Industry[] = [
  {
    id: 'education',
    name: 'Education',
    problem: 'Teachers and administrators lose hours to grading support, timetabling questions and repetitive student queries.',
    solution: 'Course-aware assistants grounded in syllabus material, automated feedback drafts and admissions workflows with human review.',
    examples: ['Syllabus-grounded study assistant', 'Admissions document checks', 'Feedback drafting for assignments'],
    glyph: 'grid',
    color: '#e8c27a',
  },
  {
    id: 'healthcare',
    name: 'Healthcare',
    problem: 'Clinical and administrative staff handle large volumes of notes, forms and enquiries, often with sensitive data.',
    solution: 'Document summarisation and intake automation on self-hosted models, with redaction and clinician approval built in.',
    examples: ['Discharge-note summaries', 'Appointment & enquiry triage', 'Insurance form extraction'],
    glyph: 'pulse',
    color: '#2fb9a6',
  },
  {
    id: 'finance',
    name: 'Finance',
    problem: 'Invoices, statements and KYC documents arrive in inconsistent formats and must be checked against strict rules.',
    solution: 'Extraction, reconciliation and exception routing workflows with audit trails for every automated decision.',
    examples: ['Invoice-to-PO matching', 'KYC document review', 'Report and variance commentary'],
    glyph: 'bars',
    color: '#5b8cff',
  },
  {
    id: 'ecommerce',
    name: 'E-commerce',
    problem: 'Catalogue upkeep, order queries and returns consume support capacity, especially at peak season.',
    solution: 'Order-aware support agents, catalogue enrichment pipelines and returns workflows connected to your store and ERP.',
    examples: ['Order-status & returns assistant', 'Product description generation', 'Review and feedback analysis'],
    glyph: 'cart',
    color: '#e09a52',
  },
  {
    id: 'manufacturing',
    name: 'Manufacturing',
    problem: 'Maintenance knowledge lives in manuals and experienced staff; quality reports and procurement paperwork pile up.',
    solution: 'Maintenance copilots grounded in equipment manuals, quality-report analysis and supplier document automation.',
    examples: ['Maintenance knowledge assistant', 'Quality incident summaries', 'Supplier document processing'],
    glyph: 'gear',
    color: '#8fa3c7',
  },
  {
    id: 'enterprise-operations',
    name: 'Enterprise Operations',
    problem: 'HR, IT and procurement teams answer the same questions and move data between disconnected tools by hand.',
    solution: 'Internal assistants over company policies, plus workflows that connect HR, IT service and finance systems.',
    examples: ['Policy & HR assistant', 'IT request triage', 'Procurement approval workflows'],
    glyph: 'org',
    color: '#a48bff',
  },
  {
    id: 'customer-support',
    name: 'Customer Support',
    problem: 'Response times stretch as volumes grow, and answers vary depending on who replies.',
    solution: 'Grounded support agents that resolve routine requests, draft replies for complex ones and escalate with full context.',
    examples: ['Multilingual support assistant', 'Ticket classification & routing', 'Voice AI for first-line calls'],
    glyph: 'chat',
    color: '#45d3e6',
  },
]

export const USE_CASES = [
  {
    id: 'assistants',
    title: 'Enterprise AI Assistants',
    body: 'Assistants that answer from your policies, documents and systems — with permissions respected and sources cited.',
    tags: ['RAG', 'SSO', 'Permissions'],
  },
  {
    id: 'rag',
    title: 'RAG Knowledge Systems',
    body: 'Ingestion, indexing and retrieval pipelines that turn scattered documents into a searchable, trustworthy knowledge layer.',
    tags: ['Vector search', 'Re-ranking', 'Citations'],
  },
  {
    id: 'voice',
    title: 'Voice AI',
    body: 'Voice agents for first-line calls, appointment booking and enquiries — with hand-off to people when needed.',
    tags: ['Speech-to-text', 'TTS', 'Call routing'],
  },
  {
    id: 'documents',
    title: 'Document Intelligence',
    body: 'Extract, classify and validate data from invoices, contracts, forms and records, and push it into your systems.',
    tags: ['OCR', 'Extraction', 'Validation'],
  },
  {
    id: 'agents',
    title: 'Custom AI Agents',
    body: 'Agents designed around your process, tools and approvals — from single-task helpers to multi-agent systems.',
    tags: ['Tool calling', 'Multi-agent', 'HITL'],
  },
  {
    id: 'apps',
    title: 'AI-powered Business Applications',
    body: 'Complete web applications with AI at the core — designed, built, integrated and deployed by our team.',
    tags: ['Full-stack', 'Integrations', 'Managed'],
  },
]
