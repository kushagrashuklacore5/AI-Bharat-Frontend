import { lazy, useRef } from 'react'
import { PageHero, FeatureGrid } from '../components/ui/PageHero'
import { Button } from '../components/ui/Button'
import { LazyMount } from '../components/ui/LazyMount'
import { Section } from '../components/ui/Section'
import { SectionHeading } from '../components/ui/SectionHeading'
import { FinalCta } from '../components/sections/FinalCta'
import { KIND_META, type NodeKind } from '../components/workflow-studio/workflows'
import { KIND_ICON } from '../components/workflow-studio/StudioNode'
import { useReveal } from '../hooks/useReveal'

const StudioDemo = lazy(() => import('../components/workflow-studio/StudioDemo'))

const NODE_DOCS: { kind: NodeKind; d: string }[] = [
  { kind: 'trigger', d: 'Start runs from webhooks, schedules, emails, form submissions or application events.' },
  { kind: 'llm', d: 'Prompt a model through the gateway, with routing policy, fallbacks and structured output.' },
  { kind: 'agent', d: 'Give an agent a goal, tools and memory; it reasons through multiple steps.' },
  { kind: 'knowledge', d: 'Retrieve relevant passages from indexed documents (RAG) with filters and citations.' },
  { kind: 'condition', d: 'Branch on rules or model outputs; loop over lists of items.' },
  { kind: 'parallel', d: 'Run branches at the same time and merge results when all complete.' },
  { kind: 'human', d: 'Pause for a person to approve, edit or reject before the run continues.' },
  { kind: 'database', d: 'Read and write rows in SQL and NoSQL databases.' },
  { kind: 'integration', d: 'Call REST APIs and connected applications; build custom nodes for internal systems.' },
  { kind: 'output', d: 'Send messages, update records, call webhooks or return a response.' },
]

const CAPABILITIES = [
  { t: 'Visual drag-and-drop builder', d: 'Compose workflows on a canvas: add nodes, connect them, configure each step.' },
  { t: 'AI-assisted workflow generation', d: 'Describe a process in plain language and get a starting workflow to refine.', tag: 'Planned' },
  { t: 'Trigger & event automation', d: 'Webhooks, schedules and application events start runs automatically.' },
  { t: 'Multi-agent orchestration', d: 'Orchestrator and specialist agents coordinate inside a single workflow.' },
  { t: 'Model routing', d: 'Every LLM node can route by task, cost, latency and availability.' },
  { t: 'Branches, loops & parallel paths', d: 'Express real business logic, not just straight-line chains.' },
  { t: 'Human-in-the-loop approvals', d: 'Insert review steps wherever a person must decide.' },
  { t: 'Templates', d: 'Start from support, lead-gen, recruitment, invoice and research templates.' },
  { t: 'Custom integrations & nodes', d: 'Extend the node library for your own systems.' },
  { t: 'Monitoring & execution history', d: 'Inspect every run, step input and output, error and retry.' },
  { t: 'Managed deployment', d: 'Deploy workflows to managed execution with scaling handled for you.' },
  { t: 'Versioning & environments', d: 'Promote workflows from draft to production with confidence.', tag: 'Planned' },
]

const TEMPLATES = ['AI customer support', 'AI lead generation', 'Automated recruitment screening', 'Invoice processing', 'AI research pipeline', 'Email triage & automation', 'Enterprise document processing', 'Multi-agent research & reporting']

export default function WorkflowStudioPage() {
  const ref = useRef<HTMLDivElement>(null)
  useReveal(ref)
  return (
    <div ref={ref}>
      <PageHero
        docTitle="AI Workflow Studio"
        eyebrow="Flagship product · AI Workflow Studio"
        title={
          <>
            The visual builder for <span className="serif-accent text-gradient">AI-native</span> automation.
          </>
        }
        lead="Connect applications, data, models and intelligent agents through a visual workflow builder to automate complex business processes — then deploy and monitor them on managed infrastructure."
        actions={
          <>
            <Button href="#demo">Try the live demo</Button>
            <Button to="/build-with-us?type=workflow-studio" variant="secondary">
              Request early access
            </Button>
          </>
        }
        aside={
          <div className="panel p-6">
            <p className="font-mono text-[10.5px] uppercase tracking-[0.16em] text-faint">Product status</p>
            <p className="mt-3 text-[14.5px] leading-relaxed text-fg-soft">
              Workflow Studio is in active development. The demo on this page is a browser-only simulation of the builder experience. Capabilities marked
              “Planned” are on the roadmap.
            </p>
          </div>
        }
      />

      <Section id="demo" className="pb-24">
        <div className="container-x">
          <LazyMount minHeight={680} rootMargin="200px">
            <StudioDemo />
          </LazyMount>
        </div>
      </Section>

      <Section className="py-24">
        <div className="container-x">
          <SectionHeading eyebrow="Capabilities" title="Everything a production workflow needs." />
          <div className="mt-12">
            <FeatureGrid items={CAPABILITIES} cols={4} />
          </div>
        </div>
      </Section>

      <Section id="nodes" className="py-24">
        <div className="container-x">
          <SectionHeading eyebrow="Node library" title="Building blocks, designed for AI." lead="Each node is a typed, configurable step. Combine them to express anything from a simple notification to a supervised multi-agent process." />
          <ul className="mt-12 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
            {NODE_DOCS.map((n, i) => {
              const Icon = KIND_ICON[n.kind]
              const m = KIND_META[n.kind]
              return (
                <li key={n.kind} data-reveal={String(i % 5)} className="panel p-5">
                  <span className="grid size-9 place-items-center rounded-xl" style={{ background: `${m.color}1a`, color: m.color }}>
                    <Icon size={16} />
                  </span>
                  <p className="mt-4 text-fg">{m.label}</p>
                  <p className="mt-1.5 text-[13px] leading-relaxed text-muted">{n.d}</p>
                </li>
              )
            })}
          </ul>
        </div>
      </Section>

      <Section className="py-24">
        <div className="container-x grid gap-12 lg:grid-cols-[1fr_1.4fr]">
          <SectionHeading eyebrow="Templates" title="Start from a proven pattern." lead="Templates encode common processes. Adapt them to your systems instead of starting from a blank canvas." />
          <ul data-reveal="2" className="grid content-start gap-2 sm:grid-cols-2">
            {TEMPLATES.map((t) => (
              <li key={t} className="flex items-center justify-between rounded-xl border border-line px-4 py-3.5 text-[14px] text-fg-soft">
                {t}
                <span className="font-mono text-[10px] text-faint">template</span>
              </li>
            ))}
          </ul>
        </div>
      </Section>

      <FinalCta title="Automate your first workflow with us." body="Join early access, or tell us the process you want to automate and our team will build it on Workflow Studio for you." />
    </div>
  )
}
