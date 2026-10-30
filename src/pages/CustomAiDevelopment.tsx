import { useRef } from 'react'
import { PageHero, FeatureGrid } from '../components/ui/PageHero'
import { Button } from '../components/ui/Button'
import { Section } from '../components/ui/Section'
import { SectionHeading } from '../components/ui/SectionHeading'
import { CustomDevSection } from '../components/sections/CustomDevSection'
import { ProcessSection } from '../components/sections/ProcessSection'
import { FinalCta } from '../components/sections/FinalCta'
import { useReveal } from '../hooks/useReveal'

const SERVICES = [
  { t: 'Custom AI application development', d: 'Full-stack applications with AI at the core, built to your requirements.' },
  { t: 'Enterprise RAG systems', d: 'Knowledge systems over your documents with permissions and citations.' },
  { t: 'AI chatbots', d: 'Customer- and employee-facing assistants grounded in your content.' },
  { t: 'Voice AI', d: 'Speech-enabled agents for calls, bookings and enquiries.' },
  { t: 'Document intelligence', d: 'Extraction, classification and validation for business documents.' },
  { t: 'AI integrations', d: 'Connect AI capabilities to your CRM, ERP, helpdesk and internal tools.' },
  { t: 'Custom business automation', d: 'End-to-end automated processes built on Workflow Studio.' },
  { t: 'LLM integration & fine-tuning', d: 'Adapt models to your domain and integrate them safely.' },
  { t: 'AI consulting & architecture', d: 'Independent assessment of where AI helps, with a practical roadmap.' },
  { t: 'Managed AI solutions', d: 'We operate, monitor and improve the system after launch.' },
]

const MODELS = [
  ['Use the platform', 'Your team builds on Workflow Studio, agents, orchestration and GPU Cloud. We provide the platform and support.'],
  ['Build together', 'Our engineers work alongside yours — architecture, first workflows and integrations — then hand over.'],
  ['We build it for you', 'Describe the outcome. We design, develop, integrate, deploy and maintain the complete solution.'],
]

export default function CustomAiDevelopmentPage() {
  const ref = useRef<HTMLDivElement>(null)
  useReveal(ref)
  return (
    <div ref={ref}>
      <PageHero
        docTitle="Custom AI Development"
        accent="#e09a52"
        eyebrow="Custom AI development & enterprise solutions"
        title={
          <>
            Tell us the problem. <span className="serif-accent text-gradient">We’ll build the system.</span>
          </>
        }
        lead="Tell us what you want to automate, improve or build. Our team will architect, develop, integrate and deploy your AI solution — and can run it for you afterwards."
        actions={
          <>
            <Button to="/build-with-us">Start your project brief</Button>
            <Button to="/contact" variant="secondary">
              Talk to an engineer
            </Button>
          </>
        }
      />
      <Section className="pb-24">
        <div className="container-x">
          <SectionHeading eyebrow="Engagement models" title="Use the platform, or hire the team." />
          <div className="mt-12 grid gap-3 md:grid-cols-3">
            {MODELS.map(([t, d], i) => (
              <div key={t} data-reveal={String(i)} className={`panel p-8 ${i === 2 ? 'border-saffron/30' : ''}`}>
                <span className="font-mono text-[11px] text-saffron">0{i + 1}</span>
                <h3 className="mt-4 text-xl text-fg">{t}</h3>
                <p className="mt-3 text-[14.5px] leading-relaxed text-muted">{d}</p>
              </div>
            ))}
          </div>
        </div>
      </Section>
      <CustomDevSection index="" />
      <Section className="py-24">
        <div className="container-x">
          <SectionHeading eyebrow="Services" title="End-to-end capability." />
          <div className="mt-12">
            <FeatureGrid items={SERVICES} cols={2} />
          </div>
        </div>
      </Section>
      <ProcessSection index="" />
      <FinalCta />
    </div>
  )
}
