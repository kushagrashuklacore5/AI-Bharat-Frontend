import { Section } from '../ui/Section'
import { SectionHeading } from '../ui/SectionHeading'
import { ModelRouter } from '../orchestration/ModelRouter'
import { Button } from '../ui/Button'

const TERMS = [
  ['Provider abstraction', 'One API for many model providers and self-hosted models.'],
  ['Task-specific selection', 'Each request type can use the model that suits it.'],
  ['Cost & latency control', 'Policies decide when cheaper or faster models are good enough.'],
  ['Fallback strategies', 'Requests move to an alternative when a provider fails.'],
  ['Structured outputs', 'Responses are validated against a schema before use.'],
]

export function OrchestrationSection({ index = '05' }: { index?: string }) {
  return (
    <Section id="orchestration" labelledBy="orch-title" className="py-28 md:py-36">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(50%_50%_at_80%_40%,rgba(164,139,255,.06),transparent_70%)]" aria-hidden="true" />
      <div className="container-x relative">
        <div className="grid gap-12 lg:grid-cols-[1.3fr_1fr]">
          <SectionHeading
            id="orch-title"
            index={index}
            eyebrow="Multi-model orchestration"
            title={
              <>
                The right model for <span className="serif-accent text-fg-soft">every</span> request.
              </>
            }
            lead="Route workloads across different AI models and providers based on task requirements, performance, cost and availability. Change the request and policy below to see how a routing decision is made."
          />
          <dl data-reveal="2" className="grid content-end gap-3">
            {TERMS.map(([t, d]) => (
              <div key={t} className="flex gap-4 border-b border-line pb-3">
                <dt className="w-44 shrink-0 text-[13.5px] text-fg">{t}</dt>
                <dd className="text-[13px] text-muted">{d}</dd>
              </div>
            ))}
          </dl>
        </div>
        <div data-reveal="2" className="mt-14">
          <ModelRouter />
        </div>
        <p data-reveal="3" className="mt-6 flex flex-wrap items-center justify-between gap-4 text-[13px] text-muted">
          <span>Capabilities are delivered through our platform and managed integrations with model providers; routing policies are configured per project.</span>
          <Button to="/ai-orchestration" variant="ghost">
            Learn about orchestration
          </Button>
        </p>
      </div>
    </Section>
  )
}
