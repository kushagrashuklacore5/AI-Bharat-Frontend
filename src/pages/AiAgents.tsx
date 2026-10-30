import { useRef } from 'react'
import { PageHero, FeatureGrid } from '../components/ui/PageHero'
import { Button } from '../components/ui/Button'
import { Section } from '../components/ui/Section'
import { SectionHeading } from '../components/ui/SectionHeading'
import { AgentMesh } from '../components/agents/AgentMesh'
import { FinalCta } from '../components/sections/FinalCta'
import { useReveal } from '../hooks/useReveal'

const CONCEPTS = [
  ['Agent orchestration', 'An orchestrator agent plans the work, decides which specialist handles each part and assembles the final result.', 'Large tasks get done reliably instead of failing in one oversized prompt.'],
  ['Deterministic execution', 'Critical paths are defined as explicit workflow steps; agents operate inside them rather than improvising the whole process.', 'Predictable, auditable behaviour for business-critical processes.'],
  ['Model routing', 'Each agent can use a different model, chosen by the gateway for the task, cost and latency budget.', 'Better results per rupee spent.'],
  ['Context management', 'Agents receive only the information relevant to their step — retrieved documents, prior outputs, user data.', 'Higher accuracy and lower token cost.'],
  ['Memory', 'Short-term run state and long-term memory let agents continue work, remember preferences and avoid repeating steps.', 'Continuity across long or recurring tasks.'],
  ['Tool execution', 'Agents call functions — search, databases, APIs, calculators — and use the results in their reasoning.', 'Agents act on real systems, not just generate text.'],
  ['Human approval', 'Sensitive actions pause for a reviewer who sees the full context and decides.', 'Automation without losing accountability.'],
]

const SERVICES = [
  { t: 'Custom AI agent development', d: 'Agents designed around your process, data and tools.' },
  { t: 'Multi-agent systems', d: 'Teams of specialist agents coordinated by an orchestrator.' },
  { t: 'Agent-to-agent communication', d: 'Structured hand-offs with shared context and clear contracts.' },
  { t: 'Tool calling & function execution', d: 'Secure connections to your APIs, databases and applications.' },
  { t: 'RAG-powered agents', d: 'Agents grounded in your documents, with citations.' },
  { t: 'AI copilots', d: 'In-app assistants that help people work faster in existing tools.' },
  { t: 'Voice AI agents', d: 'Agents that handle calls, bookings and first-line enquiries.' },
  { t: 'Autonomous & supervised workflows', d: 'Choose the level of autonomy per step, from fully automatic to approval-gated.' },
  { t: 'Enterprise AI assistants', d: 'Organisation-wide assistants with access control and audit logging.' },
]

export default function AiAgentsPage() {
  const ref = useRef<HTMLDivElement>(null)
  useReveal(ref)
  return (
    <div ref={ref}>
      <PageHero
        docTitle="AI Agents & Multi-Agent Orchestration"
        accent="#5b8cff"
        eyebrow="AI agents · multi-agent orchestration"
        title={
          <>
            Agents that <span className="serif-accent text-gradient">collaborate</span> — under your control.
          </>
        }
        lead="We design and build intelligent agent systems that break complex work into steps, use your tools and data, and hand results to people for approval where it matters."
        actions={
          <>
            <Button to="/build-with-us?type=agents">Build an agent system</Button>
            <Button to="/workflow-studio" variant="secondary">
              Agents in Workflow Studio
            </Button>
          </>
        }
      />
      <Section className="pb-24">
        <div className="container-x">
          <AgentMesh />
        </div>
      </Section>
      <Section className="py-24">
        <div className="container-x">
          <SectionHeading eyebrow="Concepts, explained" title="How reliable agent systems work." lead="The vocabulary of agentic AI — and what each idea means for your business." />
          <div className="mt-12 divide-y divide-line border-y border-line">
            {CONCEPTS.map(([t, d, v], i) => (
              <div key={t} data-reveal={String(i % 3)} className="grid gap-3 py-7 md:grid-cols-[0.8fr_1.4fr_1fr] md:gap-10">
                <h3 className="flex items-baseline gap-3 text-lg text-fg">
                  <span className="font-mono text-[11px] text-faint">{String(i + 1).padStart(2, '0')}</span>
                  {t}
                </h3>
                <p className="text-[14.5px] leading-relaxed text-fg-soft">{d}</p>
                <p className="text-[13.5px] leading-relaxed text-cyan/80">→ {v}</p>
              </div>
            ))}
          </div>
        </div>
      </Section>
      <Section className="py-24">
        <div className="container-x">
          <SectionHeading eyebrow="Services" title="What we build." />
          <div className="mt-12">
            <FeatureGrid items={SERVICES} />
          </div>
        </div>
      </Section>
      <FinalCta title="Put a team of agents to work." body="Describe the process and the systems involved. We’ll propose an agent architecture, with the right level of human oversight." />
    </div>
  )
}
