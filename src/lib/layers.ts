export type LayerId =
  | 'orchestration'
  | 'intelligence'
  | 'governance'
  | 'knowledge'
  | 'data'
  | 'compute'

export interface ArchitectureLayer {
  id: LayerId
  index: string
  name: string
  short: string
  description: string
  summary: string
  /** hue used for the slab's light & accents */
  accent: string
  capabilities: { title: string; body: string }[]
  flow: string[]
  useCases: { title: string; body: string }[]
  technologies: string[]
  businessValue: string[]
}

export const LAYERS: ArchitectureLayer[] = [
  {
    id: 'orchestration',
    index: '01',
    name: 'Agentic Orchestration',
    short: 'Agents',
    description:
      'Multi-agent coordination, task delegation, deterministic execution and intelligent automation.',
    summary:
      'Plans work, delegates it to specialised agents, tracks state and combines their outputs into a complete result.',
    accent: '#45d3e6',
    capabilities: [
      {
        title: 'Task decomposition & delegation',
        body: 'An orchestrator breaks a goal into steps and assigns each step to the agent best suited for it — research, analysis, verification or writing.',
      },
      {
        title: 'Deterministic execution paths',
        body: 'Critical steps run as explicit workflow logic rather than free-form model decisions, so the same input follows the same audited path.',
      },
      {
        title: 'Stateful runs with memory',
        body: 'Each run keeps a shared context and per-agent memory, so long tasks can pause, resume and be inspected step by step.',
      },
      {
        title: 'Human-in-the-loop checkpoints',
        body: 'Approvals can be placed before any sensitive action — sending, paying, publishing — with the full context shown to the reviewer.',
      },
    ],
    flow: ['Goal received', 'Plan generated', 'Agents delegated', 'Tools executed', 'Outputs verified', 'Result delivered'],
    useCases: [
      { title: 'Research & reporting', body: 'Agents gather sources, analyse them, cross-check claims and draft a structured report for review.' },
      { title: 'Support resolution', body: 'Triage, retrieve policy, draft a reply and escalate only the cases that need a person.' },
      { title: 'Operations automation', body: 'Coordinate multi-step back-office tasks that span several systems and approvals.' },
    ],
    technologies: ['Orchestrator / worker agents', 'Tool & function calling', 'Execution state store', 'Retry & timeout policies', 'Approval queues', 'Run tracing'],
    businessValue: [
      'Automate processes that are too complex for a single prompt or a single model.',
      'Keep people in control of high-impact decisions without slowing routine work.',
      'Inspect exactly what each agent did, in what order, and why.',
    ],
  },
  {
    id: 'intelligence',
    index: '02',
    name: 'Multi-Model Intelligence',
    short: 'Models',
    description:
      'Unified model routing, multi-provider orchestration, model selection and intelligent inference.',
    summary:
      'One interface in front of many models, routing each request by task, cost, latency and availability.',
    accent: '#5b8cff',
    capabilities: [
      {
        title: 'Unified model gateway',
        body: 'Applications call a single API; the gateway handles provider differences in request formats, streaming and errors.',
      },
      {
        title: 'Policy-based routing',
        body: 'Route by task type, required quality, response-time budget or cost ceiling — for example, a compact model for classification and a larger one for reasoning.',
      },
      {
        title: 'Fallbacks & retries',
        body: 'If a provider is slow or unavailable, requests move to a configured alternative instead of failing the workflow.',
      },
      {
        title: 'Structured outputs & validation',
        body: 'Responses can be checked against a schema before they reach downstream systems, and retried when they do not conform.',
      },
    ],
    flow: ['Request', 'Policy check', 'Model selected', 'Inference', 'Validation', 'Response'],
    useCases: [
      { title: 'Cost-aware assistants', body: 'Answer routine questions with efficient models and reserve larger models for complex ones.' },
      { title: 'Provider independence', body: 'Avoid lock-in by keeping application code separate from any single model vendor.' },
      { title: 'Regulated workloads', body: 'Send sensitive requests only to models deployed in approved environments.' },
    ],
    technologies: ['Model gateway API', 'Routing policies', 'Open-weight & hosted models', 'Schema validation', 'Usage metering', 'Response caching'],
    businessValue: [
      'Balance quality, speed and cost per request rather than per project.',
      'Switch or add models without rewriting your applications.',
      'Keep workflows running when an individual provider has issues.',
    ],
  },
  {
    id: 'governance',
    index: '03',
    name: 'Governance & Security',
    short: 'Governance',
    description:
      'Secure execution, access policies, data protection, model governance and enterprise controls.',
    summary:
      'Defines who can run what, on which data, with which models — and records it.',
    accent: '#e09a52',
    capabilities: [
      {
        title: 'Role-based access',
        body: 'Control who can build, edit, run or approve workflows, and which connections and data sources each role can use.',
      },
      {
        title: 'Secrets & credential isolation',
        body: 'API keys and database credentials are stored separately from workflow definitions and never exposed in node configuration.',
      },
      {
        title: 'Data handling policies',
        body: 'Mask or redact sensitive fields before they are sent to a model, and restrict certain data to approved deployments.',
      },
      {
        title: 'Audit trails',
        body: 'Every run, model call, tool execution and approval can be logged for review and compliance reporting.',
      },
    ],
    flow: ['Identity', 'Permission check', 'Data policy', 'Execution', 'Audit log'],
    useCases: [
      { title: 'Enterprise rollout', body: 'Give teams access to AI tooling with guardrails defined centrally.' },
      { title: 'Sensitive documents', body: 'Process contracts, records or financial data with redaction and restricted model access.' },
      { title: 'Review & compliance', body: 'Provide traceable evidence of how automated decisions were produced.' },
    ],
    technologies: ['RBAC', 'Secret vaulting', 'PII redaction', 'Environment isolation', 'Audit logging', 'Policy configuration'],
    businessValue: [
      'Adopt AI without losing control of data or accountability.',
      'Reduce the risk of sensitive information leaving approved boundaries.',
      'Answer “who ran this, and what did it do?” with records, not guesses.',
    ],
  },
  {
    id: 'knowledge',
    index: '04',
    name: 'Knowledge & Context',
    short: 'Knowledge',
    description:
      'RAG pipelines, vector search, contextual retrieval and domain-specific enterprise intelligence.',
    summary:
      'Grounds model responses in your own documents and data instead of general knowledge alone.',
    accent: '#2fb9a6',
    capabilities: [
      {
        title: 'Ingestion & chunking',
        body: 'Documents, wikis, tickets and PDFs are parsed, split into meaningful sections and indexed with metadata.',
      },
      {
        title: 'Hybrid retrieval',
        body: 'Combine semantic vector search with keyword and metadata filters to find the passages that actually answer the question.',
      },
      {
        title: 'Permission-aware context',
        body: 'Retrieval can respect the access rights of the person asking, so answers only draw on what they are allowed to see.',
      },
      {
        title: 'Citations & grounding',
        body: 'Answers can reference the source passages they were built from, making them verifiable.',
      },
    ],
    flow: ['Sources', 'Parse & chunk', 'Embed & index', 'Retrieve', 'Re-rank', 'Grounded answer'],
    useCases: [
      { title: 'Internal knowledge assistant', body: 'Employees ask questions across policies, manuals and past tickets.' },
      { title: 'Customer self-service', body: 'Accurate answers from product documentation, with sources.' },
      { title: 'Domain research', body: 'Search large document collections in legal, medical or technical domains.' },
    ],
    technologies: ['Document parsers', 'Embedding models', 'Vector databases', 'Hybrid search', 'Re-rankers', 'Citation tracking'],
    businessValue: [
      'Turn existing documents into answers people can trust and verify.',
      'Reduce time spent searching across disconnected tools.',
      'Keep AI responses specific to your business, not generic.',
    ],
  },
  {
    id: 'data',
    index: '05',
    name: 'Data Integration',
    short: 'Data',
    description:
      'AI-ready data transformation across fragmented enterprise systems, databases and APIs.',
    summary:
      'Connects the systems you already run and shapes their data into a form AI can use.',
    accent: '#7aae86',
    capabilities: [
      {
        title: 'Connectors & webhooks',
        body: 'Read from and write to databases, SaaS tools, REST APIs and event sources; trigger workflows from incoming events.',
      },
      {
        title: 'Transformation steps',
        body: 'Map, filter, merge and normalise records between systems as part of the workflow, without separate scripts.',
      },
      {
        title: 'Document & form extraction',
        body: 'Turn invoices, forms and emails into structured fields that downstream systems can consume.',
      },
      {
        title: 'Custom integrations',
        body: 'Where no connector exists, our team builds one for your internal systems.',
      },
    ],
    flow: ['Source systems', 'Connect', 'Extract', 'Transform', 'Validate', 'Deliver'],
    useCases: [
      { title: 'CRM enrichment', body: 'Combine form submissions, email and web data into qualified CRM records.' },
      { title: 'Finance operations', body: 'Extract invoice data and reconcile it against purchase orders.' },
      { title: 'Unified reporting', body: 'Pull data from several tools into one AI-generated summary.' },
    ],
    technologies: ['REST & GraphQL', 'Webhooks', 'SQL & NoSQL databases', 'Queues & events', 'OCR / document AI', 'Custom connectors'],
    businessValue: [
      'Use AI on the data you already have, where it already lives.',
      'Remove manual copy-paste between systems.',
      'Extend automation to legacy and internal tools.',
    ],
  },
  {
    id: 'compute',
    index: '06',
    name: 'Compute & Inference',
    short: 'Compute',
    description:
      'GPU-backed inference, model hosting, workload optimization and cost-efficient AI computing.',
    summary:
      'Partner-powered GPU capacity for running, fine-tuning and serving models — without buying hardware.',
    accent: '#8fa3c7',
    capabilities: [
      {
        title: 'On-demand GPU instances',
        body: 'Provision GPU compute through our infrastructure partners for experiments, batch jobs or production workloads.',
      },
      {
        title: 'Model hosting & serving',
        body: 'Deploy open-weight or fine-tuned models behind managed endpoints sized to your traffic.',
      },
      {
        title: 'Training & fine-tuning',
        body: 'Run fine-tuning jobs on your data with environments configured for the workload.',
      },
      {
        title: 'Workload right-sizing',
        body: 'Match GPU class, memory and billing model — hourly, monthly or dedicated — to the job instead of over-provisioning.',
      },
    ],
    flow: ['Workload', 'Size & select', 'Provision', 'Run / serve', 'Monitor', 'Scale or release'],
    useCases: [
      { title: 'Private model inference', body: 'Serve models in an environment you control for sensitive workloads.' },
      { title: 'Fine-tuning projects', body: 'Adapt a base model to your domain without long-term hardware commitments.' },
      { title: 'Burst capacity', body: 'Add compute for a batch job or launch, then release it.' },
    ],
    technologies: ['Partner GPU infrastructure', 'Containerised runtimes', 'Inference servers', 'Fine-tuning pipelines', 'Usage-based billing', 'Monitoring'],
    businessValue: [
      'Access GPU compute without capital expenditure or hardware maintenance.',
      'Pay for the capacity you use, on the billing model that fits.',
      'Move from prototype to production on the same platform.',
    ],
  },
]

export const getLayer = (id: string | undefined) => LAYERS.find((l) => l.id === id)
