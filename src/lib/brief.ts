export interface BriefForm {
  name: string
  email: string
  company: string
  role: string
  types: string[]
  problem: string
  outcome: string
  integrations: string[]
  integrationsOther: string
  users: string
  budget: string
  timeline: string
  deployment: string
}

export const EMPTY_BRIEF: BriefForm = {
  name: '',
  email: '',
  company: '',
  role: '',
  types: [],
  problem: '',
  outcome: '',
  integrations: [],
  integrationsOther: '',
  users: '',
  budget: '',
  timeline: '',
  deployment: '',
}

export const SOLUTION_TYPES = [
  { id: 'workflow-studio', label: 'Workflow automation' },
  { id: 'agents', label: 'AI agents' },
  { id: 'rag', label: 'Knowledge assistant (RAG)' },
  { id: 'voice', label: 'Voice AI' },
  { id: 'documents', label: 'Document intelligence' },
  { id: 'orchestration', label: 'Multi-model orchestration' },
  { id: 'gpu', label: 'GPU compute / model hosting' },
  { id: 'app', label: 'Custom AI application' },
  { id: 'unsure', label: 'Not sure yet' },
]

export const INTEGRATIONS = ['CRM', 'ERP', 'Helpdesk', 'Email', 'Team chat', 'WhatsApp', 'Databases', 'Document storage', 'Internal APIs', 'Website']
export const USERS = ['Under 50', '50–500', '500–5,000', '5,000+', 'Customer-facing (public)']
export const BUDGETS = ['Under ₹5 lakh', '₹5–15 lakh', '₹15–50 lakh', '₹50 lakh+', 'Not decided yet']
export const TIMELINES = ['As soon as possible', 'Within 3 months', '3–6 months', 'Exploring for now']
export const DEPLOYMENTS = [
  { id: 'managed', label: 'Managed by AI Bharat', d: 'We host and operate it' },
  { id: 'cloud', label: 'Our cloud account', d: 'Deployed in your cloud' },
  { id: 'onprem', label: 'On-premises / private', d: 'Your own infrastructure' },
  { id: 'unsure', label: 'Not sure', d: 'Recommend one' },
]

const KEYWORDS: [RegExp, string][] = [
  [/support|ticket|customer|complain|query|enquir/i, 'Support agent with knowledge retrieval and escalation'],
  [/invoice|receipt|purchase order|\bpo\b|bill/i, 'Document extraction with PO matching and finance review'],
  [/lead|sales|crm|prospect/i, 'Lead enrichment and scoring workflow connected to CRM'],
  [/recruit|resume|cv|candidate|hiring/i, 'Candidate screening workflow with recruiter approval'],
  [/document|pdf|contract|form|kyc/i, 'Document intelligence pipeline (OCR, extraction, validation)'],
  [/policy|knowledge|manual|faq|wiki|search/i, 'RAG knowledge base with permission-aware retrieval'],
  [/call|phone|voice|speech/i, 'Voice agent with hand-off to staff'],
  [/report|research|analys/i, 'Multi-agent research and report generation'],
  [/email|inbox/i, 'Email triage and automated drafting'],
  [/train|fine-?tun|model|gpu|inference|host/i, 'Model hosting / fine-tuning on GPU Cloud'],
]

const TYPE_BLOCKS: Record<string, string> = {
  'workflow-studio': 'Workflow Studio automation with triggers, branches and approvals',
  agents: 'Specialist agents coordinated by an orchestrator',
  rag: 'RAG knowledge base with citations',
  voice: 'Voice AI agent',
  documents: 'Document intelligence pipeline',
  orchestration: 'Model gateway with routing policies and fallbacks',
  gpu: 'GPU capacity sized to the workload',
  app: 'Custom web application with AI features',
}

/** Rule-based brief composer. Runs entirely in the browser; no AI service is called. */
export function composeBrief(f: BriefForm) {
  const typeLabels = f.types.map((t) => SOLUTION_TYPES.find((s) => s.id === t)?.label).filter(Boolean) as string[]
  const blocks = new Set<string>()
  f.types.forEach((t) => TYPE_BLOCKS[t] && blocks.add(TYPE_BLOCKS[t]))
  const text = `${f.problem} ${f.outcome}`
  KEYWORDS.forEach(([re, b]) => re.test(text) && blocks.add(b))
  if (f.deployment === 'onprem' || /sensitive|patient|medical|confidential|pii|personal data/i.test(text)) blocks.add('Self-hosted models with data redaction and audit logging')
  if (/approv|review|check|sign.?off/i.test(text)) blocks.add('Human-in-the-loop approval steps')

  const integrations = [...f.integrations, ...f.integrationsOther.split(',').map((s) => s.trim()).filter(Boolean)]
  const questions: string[] = []
  if (f.problem.trim().length < 60) questions.push('What does the process look like today, step by step?')
  if (!f.outcome.trim()) questions.push('How will you measure success (time saved, accuracy, response time)?')
  if (!integrations.length) questions.push('Which systems hold the data this solution needs?')
  if (!f.budget || f.budget === 'Not decided yet') questions.push('Is there a budget range we should design within?')
  if (!f.deployment || f.deployment === 'unsure') questions.push('Are there data residency or hosting requirements?')

  const title = `${typeLabels[0] && typeLabels[0] !== 'Not sure yet' ? typeLabels[0] : 'AI solution'}${f.company ? ` for ${f.company}` : ''}`
  return {
    title,
    typeLabels,
    blocks: [...blocks],
    integrations,
    questions,
  }
}

export function briefToText(f: BriefForm) {
  const b = composeBrief(f)
  const dep = DEPLOYMENTS.find((d) => d.id === f.deployment)?.label ?? '—'
  return [
    `PROJECT BRIEF — ${b.title}`,
    ``,
    `Contact: ${f.name} <${f.email}>${f.role ? `, ${f.role}` : ''}${f.company ? ` · ${f.company}` : ''}`,
    `Solution types: ${b.typeLabels.join(', ') || '—'}`,
    ``,
    `Business problem:`,
    f.problem || '—',
    ``,
    `Expected outcome:`,
    f.outcome || '—',
    ``,
    `Integrations: ${b.integrations.join(', ') || '—'}`,
    `Expected users: ${f.users || '—'}`,
    `Budget: ${f.budget || '—'}`,
    `Timeline: ${f.timeline || '—'}`,
    `Deployment: ${dep}`,
    ``,
    `Suggested building blocks (rule-based, to discuss):`,
    ...(b.blocks.length ? b.blocks.map((x) => `- ${x}`) : ['- To be defined in discovery']),
    ``,
    `Open questions:`,
    ...(b.questions.length ? b.questions.map((x) => `- ${x}`) : ['- None for now']),
  ].join('\n')
}
