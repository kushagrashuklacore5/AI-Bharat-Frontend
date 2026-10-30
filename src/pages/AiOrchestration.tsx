import { useRef } from 'react'
import { PageHero, FeatureGrid } from '../components/ui/PageHero'
import { Button } from '../components/ui/Button'
import { Section } from '../components/ui/Section'
import { SectionHeading } from '../components/ui/SectionHeading'
import { ModelRouter } from '../components/orchestration/ModelRouter'
import { FinalCta } from '../components/sections/FinalCta'
import { useReveal } from '../hooks/useReveal'

const FEATURES = [
  { t: 'Unified API access', d: 'Call many models through one interface; provider differences are handled by the gateway.' },
  { t: 'Intelligent model routing', d: 'Policies route requests by task type, quality needs, latency budget and cost ceiling.' },
  { t: 'Task-specific selection', d: 'Classification, extraction, reasoning and code generation can each use a suitable model.' },
  { t: 'Provider abstraction', d: 'Switch or add providers without changing application code.' },
  { t: 'Fallback strategies', d: 'Automatic retry on alternate models when a provider is slow or unavailable.' },
  { t: 'Structured outputs', d: 'Validate responses against schemas; retry or escalate when they don’t conform.' },
  { t: 'Response aggregation', d: 'Combine or compare outputs from several models for higher-stakes decisions.', tag: 'Planned' },
  { t: 'Usage visibility', d: 'Understand requests, tokens and cost per project, workflow and model.' },
  { t: 'Policy-aware routing', d: 'Keep sensitive requests on approved, self-hosted deployments.' },
]

const PIPELINE = [
  ['Customer application', 'Your app, workflow or agent sends one request.'],
  ['Model gateway', 'Authenticates, normalises formats and meters usage.'],
  ['Routing & policy engine', 'Applies data rules, then picks a model by task, cost and latency.'],
  ['Model providers', 'Hosted providers or open-weight models on GPU Cloud.'],
  ['Validation & aggregation', 'Checks schema, retries or falls back, returns a clean response.'],
]

export default function AiOrchestrationPage() {
  const ref = useRef<HTMLDivElement>(null)
  useReveal(ref)
  return (
    <div ref={ref}>
      <PageHero
        docTitle="Multi-Model Orchestration"
        accent="#a48bff"
        eyebrow="AI orchestration · multi-model"
        title={
          <>
            One gateway. <span className="serif-accent text-gradient">Every model</span> you need.
          </>
        }
        lead="Route workloads across different AI models and providers based on task requirements, performance, cost and availability — and keep your applications independent of any single vendor."
        actions={
          <>
            <Button to="/build-with-us?type=orchestration">Discuss your model strategy</Button>
            <Button to="/developers" variant="secondary">
              Developer overview
            </Button>
          </>
        }
      />
      <Section className="pb-20">
        <div className="container-x">
          <ol className="grid gap-px overflow-hidden rounded-2xl border border-line bg-line md:grid-cols-5">
            {PIPELINE.map(([t, d], i) => (
              <li key={t} data-reveal={String(i)} className="relative bg-ink-950 p-6">
                <span className="font-mono text-[11px] text-electric">0{i + 1}</span>
                <p className="mt-4 text-fg">{t}</p>
                <p className="mt-2 text-[13px] leading-relaxed text-muted">{d}</p>
                {i < PIPELINE.length - 1 && <span className="absolute right-3 top-6 hidden font-mono text-faint md:block">→</span>}
              </li>
            ))}
          </ol>
        </div>
      </Section>
      <Section className="pb-24">
        <div className="container-x">
          <ModelRouter />
        </div>
      </Section>
      <Section className="py-24">
        <div className="container-x">
          <SectionHeading
            eyebrow="Capabilities"
            title="Orchestration, not just access."
            lead="Delivered through the AI Bharat platform and managed integrations with model providers. Items marked “Planned” are on the roadmap."
          />
          <div className="mt-12">
            <FeatureGrid items={FEATURES} />
          </div>
        </div>
      </Section>
      <FinalCta title="Use the best model for every task." body="Tell us about your workloads and constraints; we’ll design routing policies that balance quality, speed and cost." />
    </div>
  )
}
