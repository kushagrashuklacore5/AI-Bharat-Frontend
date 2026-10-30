export type NodeKind = 'trigger' | 'agent' | 'llm' | 'knowledge' | 'condition' | 'database' | 'integration' | 'human' | 'output' | 'parallel'

export interface StudioNodeData extends Record<string, unknown> {
  kind: NodeKind
  title: string
  subtitle: string
  /** illustrative configuration fields shown in the inspector */
  config: { label: string; value: string }[]
  /** what this step produces in the simulated run */
  output: string
  /** for condition nodes: the id of the branch taken in the demo run */
  takes?: string
}

export interface WorkflowDef {
  id: string
  name: string
  description: string
  nodes: { id: string; x: number; y: number; data: StudioNodeData }[]
  edges: { id: string; source: string; target: string; label?: string }[]
}

export const KIND_META: Record<NodeKind, { label: string; color: string }> = {
  trigger: { label: 'Trigger', color: '#e09a52' },
  agent: { label: 'AI Agent', color: '#45d3e6' },
  llm: { label: 'LLM', color: '#5b8cff' },
  knowledge: { label: 'Knowledge', color: '#2fb9a6' },
  condition: { label: 'Condition', color: '#e8c27a' },
  database: { label: 'Database', color: '#7aae86' },
  integration: { label: 'Integration', color: '#8fa3c7' },
  human: { label: 'Human approval', color: '#ef9a7a' },
  output: { label: 'Action', color: '#b7c6e3' },
  parallel: { label: 'Parallel', color: '#a48bff' },
}

export const NODE_LIBRARY: { kind: NodeKind; title: string; subtitle: string; group: string }[] = [
  { kind: 'trigger', title: 'Webhook', subtitle: 'Start on an HTTP event', group: 'Triggers' },
  { kind: 'trigger', title: 'Schedule', subtitle: 'Run on a cron schedule', group: 'Triggers' },
  { kind: 'trigger', title: 'New email', subtitle: 'Inbox event', group: 'Triggers' },
  { kind: 'agent', title: 'AI Agent', subtitle: 'Reasoning with tools', group: 'AI' },
  { kind: 'llm', title: 'LLM Call', subtitle: 'Routed model prompt', group: 'AI' },
  { kind: 'knowledge', title: 'Knowledge Retrieval', subtitle: 'RAG over your sources', group: 'AI' },
  { kind: 'condition', title: 'If / Switch', subtitle: 'Branch on a rule', group: 'Logic' },
  { kind: 'parallel', title: 'Parallel', subtitle: 'Fan out & merge', group: 'Logic' },
  { kind: 'human', title: 'Approval', subtitle: 'Human-in-the-loop', group: 'Logic' },
  { kind: 'database', title: 'Database', subtitle: 'Query or write rows', group: 'Data' },
  { kind: 'integration', title: 'HTTP / API', subtitle: 'Call any REST API', group: 'Data' },
  { kind: 'output', title: 'Send message', subtitle: 'Email, chat or webhook', group: 'Actions' },
]

const cfg = (...pairs: [string, string][]) => pairs.map(([label, value]) => ({ label, value }))

export const WORKFLOWS: WorkflowDef[] = [
  {
    id: 'support',
    name: 'AI Customer Support',
    description: 'Classify an incoming message, ground the answer in your help centre, and route sensitive replies for approval.',
    nodes: [
      { id: 't', x: 0, y: 0, data: { kind: 'trigger', title: 'Incoming message', subtitle: 'Chat · email webhook', config: cfg(['Source', 'Support inbox'], ['Payload', 'customer_id, message']), output: 'Message received: “I was charged twice for my order.”' } },
      { id: 'a', x: 250, y: 0, data: { kind: 'agent', title: 'Intent Detection', subtitle: 'Agent · classifier', config: cfg(['Labels', 'billing, shipping, account, other'], ['Tools', 'customer_lookup']), output: 'Intent: billing · sentiment: frustrated · priority: high' } },
      { id: 'k', x: 500, y: -75, data: { kind: 'knowledge', title: 'Knowledge Retrieval', subtitle: 'Help centre + policies', config: cfg(['Index', 'help-centre-v3'], ['Top K', '5'], ['Filter', 'topic = billing']), output: '3 passages retrieved from “Refunds & duplicate charges”' } },
      { id: 'd', x: 500, y: 75, data: { kind: 'database', title: 'Order history', subtitle: 'Postgres · read', config: cfg(['Query', 'orders by customer_id'], ['Limit', '10']), output: '2 payments found for order #A-1042' } },
      { id: 'm', x: 750, y: 0, data: { kind: 'llm', title: 'Multi-Model Reasoning', subtitle: 'Routed by policy', config: cfg(['Routing', 'quality-first'], ['Fallback', 'enabled'], ['Output', 'JSON schema']), output: 'Draft reply prepared · refund eligible: yes' } },
      { id: 'c', x: 0, y: 290, data: { kind: 'condition', title: 'Needs approval?', subtitle: 'refund OR low confidence', config: cfg(['Rule', 'action = refund']), output: 'Refund requested → human approval', takes: 'h' } },
      { id: 'h', x: 270, y: 215, data: { kind: 'human', title: 'Human Approval', subtitle: 'Support lead', config: cfg(['Assignee', 'Support lead'], ['Timeout', '4h → escalate']), output: 'Approved by reviewer' } },
      { id: 'o', x: 540, y: 290, data: { kind: 'output', title: 'Customer Response', subtitle: 'Reply + refund ticket', config: cfg(['Channel', 'Same as source'], ['Also', 'create refund ticket']), output: 'Reply sent · refund ticket created' } },
    ],
    edges: [
      { id: 'e1', source: 't', target: 'a' },
      { id: 'e2', source: 'a', target: 'k' },
      { id: 'e3', source: 'a', target: 'd' },
      { id: 'e4', source: 'k', target: 'm' },
      { id: 'e5', source: 'd', target: 'm' },
      { id: 'e6', source: 'm', target: 'c' },
      { id: 'e7', source: 'c', target: 'h', label: 'yes' },
      { id: 'e8', source: 'c', target: 'o', label: 'no' },
      { id: 'e9', source: 'h', target: 'o' },
    ],
  },
  {
    id: 'leads',
    name: 'AI Lead Generation',
    description: 'Enrich new sign-ups, score them against your ideal customer profile and hand qualified leads to sales.',
    nodes: [
      { id: 't', x: 0, y: 0, data: { kind: 'trigger', title: 'New sign-up', subtitle: 'Form webhook', config: cfg(['Form', 'Website contact form']), output: 'Lead: priya@company.example, “Ops automation”' } },
      { id: 'p', x: 250, y: 0, data: { kind: 'parallel', title: 'Enrich in parallel', subtitle: 'Fan out · merge', config: cfg(['Branches', '2'], ['Merge', 'wait for all']), output: '2 branches started' } },
      { id: 'w', x: 500, y: -75, data: { kind: 'integration', title: 'Company lookup', subtitle: 'HTTP · enrichment API', config: cfg(['Method', 'GET'], ['Timeout', '10s']), output: 'Industry: logistics · size: 200–500' } },
      { id: 'r', x: 500, y: 75, data: { kind: 'agent', title: 'Research Agent', subtitle: 'Web research', config: cfg(['Tools', 'web_search, read_page'], ['Max steps', '6']), output: 'Summary of company priorities compiled' } },
      { id: 's', x: 750, y: 0, data: { kind: 'llm', title: 'Score vs ICP', subtitle: 'Structured output', config: cfg(['Schema', '{score, reasons[]}'], ['Routing', 'cost-first']), output: 'Score: 82 / 100' } },
      { id: 'c', x: 0, y: 290, data: { kind: 'condition', title: 'Score ≥ 70?', subtitle: 'Qualification rule', config: cfg(['Rule', 'score >= 70']), output: 'Qualified', takes: 'crm' } },
      { id: 'crm', x: 270, y: 215, data: { kind: 'database', title: 'Create CRM deal', subtitle: 'CRM · write', config: cfg(['Pipeline', 'Inbound'], ['Owner', 'round-robin']), output: 'Deal created in “Inbound”' } },
      { id: 'n', x: 270, y: 365, data: { kind: 'output', title: 'Nurture email', subtitle: 'Email sequence', config: cfg(['Sequence', 'Educational']), output: 'Skipped' } },
      { id: 'o', x: 540, y: 215, data: { kind: 'output', title: 'Notify sales', subtitle: 'Team chat', config: cfg(['Channel', '#sales-inbound']), output: 'Sales notified with research summary' } },
    ],
    edges: [
      { id: 'e1', source: 't', target: 'p' },
      { id: 'e2', source: 'p', target: 'w' },
      { id: 'e3', source: 'p', target: 'r' },
      { id: 'e4', source: 'w', target: 's' },
      { id: 'e5', source: 'r', target: 's' },
      { id: 'e6', source: 's', target: 'c' },
      { id: 'e7', source: 'c', target: 'crm', label: 'yes' },
      { id: 'e8', source: 'c', target: 'n', label: 'no' },
      { id: 'e9', source: 'crm', target: 'o' },
    ],
  },
  {
    id: 'invoice',
    name: 'Invoice Processing',
    description: 'Extract fields from invoices, match them to purchase orders, and route exceptions to finance.',
    nodes: [
      { id: 't', x: 0, y: 0, data: { kind: 'trigger', title: 'Invoice received', subtitle: 'Email attachment', config: cfg(['Mailbox', 'accounts-payable'], ['Types', 'PDF, image']), output: 'invoice_0931.pdf received' } },
      { id: 'x', x: 250, y: 0, data: { kind: 'agent', title: 'Document Extraction', subtitle: 'OCR + LLM', config: cfg(['Fields', 'vendor, total, tax, PO, lines']), output: 'Vendor, totals, 6 line items extracted' } },
      { id: 'po', x: 500, y: 0, data: { kind: 'database', title: 'Match purchase order', subtitle: 'ERP · read', config: cfg(['Key', 'PO number'], ['Tolerance', '±1%']), output: 'PO matched · variance 0.4%' } },
      { id: 'c', x: 0, y: 250, data: { kind: 'condition', title: 'Within tolerance?', subtitle: 'Three-way match', config: cfg(['Rule', 'variance <= 1%']), output: 'Within tolerance', takes: 'erp' } },
      { id: 'erp', x: 250, y: 180, data: { kind: 'integration', title: 'Post to ERP', subtitle: 'Accounts payable', config: cfg(['Status', 'Ready for payment']), output: 'Bill posted to ERP' } },
      { id: 'h', x: 250, y: 330, data: { kind: 'human', title: 'Finance review', subtitle: 'Exception queue', config: cfg(['Assignee', 'AP team']), output: 'Skipped' } },
      { id: 'o', x: 500, y: 180, data: { kind: 'output', title: 'Confirm to vendor', subtitle: 'Email', config: cfg(['Template', 'Invoice accepted']), output: 'Confirmation sent' } },
    ],
    edges: [
      { id: 'e1', source: 't', target: 'x' },
      { id: 'e2', source: 'x', target: 'po' },
      { id: 'e3', source: 'po', target: 'c' },
      { id: 'e4', source: 'c', target: 'erp', label: 'yes' },
      { id: 'e5', source: 'c', target: 'h', label: 'no' },
      { id: 'e6', source: 'erp', target: 'o' },
    ],
  },
  {
    id: 'research',
    name: 'Multi-Agent Research',
    description: 'An orchestrator plans the work, specialised agents research and verify, and a report is produced for review.',
    nodes: [
      { id: 't', x: 0, y: 0, data: { kind: 'trigger', title: 'Research brief', subtitle: 'Manual / API', config: cfg(['Input', 'topic, depth, audience']), output: 'Brief: “Market for AI in Indian logistics”' } },
      { id: 'o', x: 250, y: 0, data: { kind: 'agent', title: 'Orchestrator', subtitle: 'Plans & delegates', config: cfg(['Strategy', 'plan → delegate → verify'], ['Memory', 'shared run context']), output: 'Plan with 4 sub-questions delegated' } },
      { id: 'r', x: 500, y: -75, data: { kind: 'agent', title: 'Research Agent', subtitle: 'Sources & notes', config: cfg(['Tools', 'web_search, read_page']), output: '14 sources collected' } },
      { id: 'k', x: 500, y: 75, data: { kind: 'knowledge', title: 'Internal knowledge', subtitle: 'Past reports', config: cfg(['Index', 'reports-archive']), output: '5 relevant internal passages' } },
      { id: 'an', x: 750, y: 0, data: { kind: 'agent', title: 'Analysis Agent', subtitle: 'Synthesise findings', config: cfg(['Model routing', 'reasoning-heavy']), output: 'Key findings drafted' } },
      { id: 'v', x: 0, y: 290, data: { kind: 'agent', title: 'Verification Agent', subtitle: 'Check claims', config: cfg(['Checks', 'citation per claim']), output: '2 claims flagged and corrected' } },
      { id: 'h', x: 250, y: 290, data: { kind: 'human', title: 'Editor review', subtitle: 'Approve report', config: cfg(['Assignee', 'Research lead']), output: 'Approved' } },
      { id: 'out', x: 500, y: 290, data: { kind: 'output', title: 'Publish report', subtitle: 'Docs + summary email', config: cfg(['Format', 'Document + 1-page summary']), output: 'Report published' } },
    ],
    edges: [
      { id: 'e1', source: 't', target: 'o' },
      { id: 'e2', source: 'o', target: 'r' },
      { id: 'e3', source: 'o', target: 'k' },
      { id: 'e4', source: 'r', target: 'an' },
      { id: 'e5', source: 'k', target: 'an' },
      { id: 'e6', source: 'an', target: 'v' },
      { id: 'e7', source: 'v', target: 'h' },
      { id: 'e8', source: 'h', target: 'out' },
    ],
  },
]
