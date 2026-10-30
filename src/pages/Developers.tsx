import { useRef } from 'react'
import { PageHero, FeatureGrid } from '../components/ui/PageHero'
import { Button } from '../components/ui/Button'
import { Section } from '../components/ui/Section'
import { SectionHeading } from '../components/ui/SectionHeading'
import { useReveal } from '../hooks/useReveal'

const BUILD = [
  { t: 'Workflows as building blocks', d: 'Compose triggers, LLM calls, agents, retrieval, conditions and integrations visually — and extend them with custom nodes.' },
  { t: 'One model interface', d: 'Call many models through a single gateway with routing policies, fallbacks and structured outputs.' },
  { t: 'Agents with tools', d: 'Define agents with goals, tools and memory, and run them inside supervised workflows.' },
  { t: 'Bring your own compute', d: 'Deploy open-weight and fine-tuned models on partner GPU capacity, or connect existing endpoints.' },
]

const SNIPPET = `// Conceptual example — the public API is in development.
const run = await aibharat.workflows.run("support-triage", {
  input: { channel: "email", message: incoming.body },
  routing: { policy: "balanced", fallback: true },
});

run.on("approval.requested", (step) => notifyReviewer(step));
const result = await run.completed();`

export default function DevelopersPage() {
  const ref = useRef<HTMLDivElement>(null)
  useReveal(ref)
  return (
    <div ref={ref}>
      <PageHero
        docTitle="Developers"
        eyebrow="Developers"
        title={
          <>
            Build on AI Bharat, <span className="serif-accent text-gradient">your way.</span>
          </>
        }
        lead="Visual workflows when you want speed, APIs when you want control. Here’s how the platform fits into your stack."
        actions={
          <>
            <Button to="/build-with-us?type=workflow-studio">Join developer early access</Button>
            <Button to="/workflow-studio#demo" variant="secondary">
              Try the Studio demo
            </Button>
          </>
        }
      />
      <Section className="pb-24">
        <div className="container-x">
          <FeatureGrid items={BUILD} cols={4} />
        </div>
      </Section>
      <Section id="documentation" className="py-24">
        <div className="container-x grid gap-12 lg:grid-cols-[1fr_1.2fr]">
          <div>
            <SectionHeading
              eyebrow="Documentation"
              title="Docs are being written alongside the API."
              lead="Public API reference, SDKs and node-authoring guides will be published as the platform opens to developers. Join early access to receive them first and help shape the interfaces."
            />
          </div>
          <div data-reveal="2" className="panel overflow-hidden">
            <div className="flex items-center justify-between border-b border-line px-5 py-3">
              <span className="font-mono text-[11px] text-fg-soft">run-workflow.ts</span>
              <span className="font-mono text-[10px] text-amber/90">illustrative</span>
            </div>
            <pre className="overflow-x-auto p-5 font-mono text-[12.5px] leading-relaxed text-fg-soft">
              <code>{SNIPPET}</code>
            </pre>
          </div>
        </div>
      </Section>
    </div>
  )
}
