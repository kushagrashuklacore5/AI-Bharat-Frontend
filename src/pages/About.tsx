import { useRef } from 'react'
import { PageHero } from '../components/ui/PageHero'
import { Button } from '../components/ui/Button'
import { Section } from '../components/ui/Section'
import { SectionHeading } from '../components/ui/SectionHeading'
import { PillarsSection } from '../components/sections/PillarsSection'
import { FinalCta } from '../components/sections/FinalCta'
import { useReveal } from '../hooks/useReveal'
import { SITE } from '../lib/config'

const BELIEFS = [
  ['Useful over impressive', 'We measure AI by the work it removes and the decisions it improves, not by demos.'],
  ['Honest about limits', 'We tell customers when a simpler approach — or no AI at all — is the better answer.'],
  ['People stay accountable', 'Automation should keep humans in control of the decisions that matter.'],
  ['Open to your stack', 'Our platform is built to integrate with the models, systems and clouds you already use.'],
]

export default function AboutPage() {
  const ref = useRef<HTMLDivElement>(null)
  useReveal(ref)
  return (
    <div ref={ref}>
      <PageHero
        docTitle="About"
        accent="#e09a52"
        eyebrow="About AI Bharat"
        title={
          <>
            An AI infrastructure & intelligence partner, <span className="serif-accent text-gradient">built in India.</span>
          </>
        }
        lead="AI Bharat brings together the pieces organisations need to put AI to work: compute, models, agents, workflows — and the engineering team to assemble them into systems that run reliably."
        actions={
          <>
            <Button to="/contact">Get in touch</Button>
            <Button to="/build-with-us" variant="secondary">
              Start a project
            </Button>
          </>
        }
      />
      <Section className="pb-24">
        <div className="container-x grid gap-14 lg:grid-cols-2">
          <div data-reveal className="space-y-5 text-[1.05rem] leading-relaxed text-fg-soft">
            <p>
              Most organisations don’t need another chatbot. They need AI that connects to their data and systems, follows their rules, and does useful work
              inside real processes.
            </p>
            <p>
              AI Bharat is a hybrid AI-as-a-Service company. Developers and teams can use our platform — Workflow Studio, agents, multi-model orchestration and
              partner-powered GPU Cloud — to build for themselves. Businesses that prefer a complete solution can engage our team to design, build, deploy and
              maintain it.
            </p>
          </div>
          <div data-reveal="1" className="panel p-8">
            <p className="font-mono text-[10.5px] uppercase tracking-[0.16em] text-faint">Ownership</p>
            <p className="mt-4 text-2xl tracking-tight text-fg">{SITE.owner}</p>
            <p className="mt-3 leading-relaxed text-muted">
              AI Bharat is owned and operated by Core5 Systems and Services Pvt. Ltd., which provides the engineering, delivery and support behind the platform and
              its services.
            </p>
          </div>
        </div>
      </Section>
      <Section className="py-24">
        <div className="container-x">
          <SectionHeading eyebrow="What we believe" title="How we approach AI work." />
          <div className="mt-12 grid gap-px overflow-hidden rounded-2xl border border-line bg-line md:grid-cols-2">
            {BELIEFS.map(([t, d], i) => (
              <div key={t} data-reveal={String(i)} className="bg-ink-950 p-8">
                <span className="font-mono text-[11px] text-saffron">0{i + 1}</span>
                <h3 className="mt-4 text-xl text-fg">{t}</h3>
                <p className="mt-2 leading-relaxed text-muted">{d}</p>
              </div>
            ))}
          </div>
        </div>
      </Section>
      <PillarsSection index="" />
      <FinalCta />
    </div>
  )
}
