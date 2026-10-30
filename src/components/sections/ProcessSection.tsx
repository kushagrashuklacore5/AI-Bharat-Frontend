import { useEffect, useRef, useState } from 'react'
import { Section } from '../ui/Section'
import { SectionHeading } from '../ui/SectionHeading'
import { ScrollTrigger } from '../../lib/gsap'

const STEPS = [
  { n: '01', t: 'Discover', d: 'Understand your requirement.', more: 'We map the process, the data involved, the people affected and what success looks like — and say plainly if AI is not the right tool.', out: 'Scope & success criteria' },
  { n: '02', t: 'Architect', d: 'Design the AI system.', more: 'Choose models, agents, workflows, data flows, governance controls and deployment environment for your constraints.', out: 'Solution architecture' },
  { n: '03', t: 'Build', d: 'Develop agents, workflows and integrations.', more: 'Iterative delivery with working demos, evaluation on your real examples and integration with your systems.', out: 'Working, tested system' },
  { n: '04', t: 'Deploy', d: 'Launch on suitable infrastructure.', more: 'Deploy on managed infrastructure, partner GPU capacity or your environment, with access control and monitoring.', out: 'Production rollout' },
  { n: '05', t: 'Optimize', d: 'Monitor, maintain and improve.', more: 'Track quality, cost and usage; refine prompts, routing and workflows as your needs change.', out: 'Ongoing improvement' },
]

export function ProcessSection({ index = '09' }: { index?: string }) {
  const listRef = useRef<HTMLOListElement>(null)
  const fillRef = useRef<HTMLSpanElement>(null)
  const [active, setActive] = useState(0)

  useEffect(() => {
    const list = listRef.current
    if (!list) return
    const st = ScrollTrigger.create({
      trigger: list,
      start: 'top 65%',
      end: 'bottom 55%',
      onUpdate: (self) => {
        if (fillRef.current) fillRef.current.style.transform = `scaleY(${self.progress})`
        setActive(Math.min(STEPS.length - 1, Math.floor(self.progress * STEPS.length)))
      },
    })
    return () => st.kill()
  }, [])

  return (
    <Section id="process" labelledBy="process-title" className="py-28 md:py-36">
      <div className="container-x grid gap-14 lg:grid-cols-[1fr_1.3fr]">
        <div className="lg:sticky lg:top-32 lg:self-start">
          <SectionHeading
            id="process-title"
            index={index}
            eyebrow="How we work"
            title={
              <>
                From idea to <span className="serif-accent text-fg-soft">running system</span>, in five steps.
              </>
            }
            lead="A clear, engineering-led process whether you build on the platform yourself or engage our team."
          />
          <p data-reveal="3" className="mt-10 hidden font-mono text-[11px] text-faint lg:block">
            Current step · <span className="text-cyan">{STEPS[active].t}</span> → {STEPS[active].out}
          </p>
        </div>

        <ol ref={listRef} className="relative space-y-4 pl-10 sm:pl-14">
          <span className="absolute bottom-6 left-[11px] top-6 w-px bg-line sm:left-[19px]" aria-hidden="true" />
          <span
            ref={fillRef}
            className="absolute bottom-6 left-[11px] top-6 w-px origin-top bg-gradient-to-b from-saffron via-cyan to-teal sm:left-[19px]"
            style={{ transform: 'scaleY(0)' }}
            aria-hidden="true"
          />
          {STEPS.map((s, i) => {
            const on = i <= active
            return (
              <li key={s.n} className="relative">
                <span
                  className="absolute -left-10 top-7 grid size-6 place-items-center rounded-full border bg-ink-950 font-mono text-[9px] transition-all duration-500 sm:-left-14 sm:size-10 sm:text-[11px]"
                  style={{ borderColor: on ? '#45d3e6' : 'var(--color-line-strong)', color: on ? '#45d3e6' : 'var(--color-faint)', boxShadow: i === active ? '0 0 24px -4px #45d3e6' : 'none' }}
                  aria-hidden="true"
                >
                  {s.n}
                </span>
                <article className={`panel p-6 transition-all duration-700 sm:p-8 ${i === active ? 'border-line-strong' : 'opacity-60'}`}>
                  <div className="flex flex-wrap items-baseline justify-between gap-3">
                    <h3 className="text-2xl tracking-tight text-fg">{s.t}</h3>
                    <span className="font-mono text-[10.5px] uppercase tracking-[0.14em] text-faint">Output · {s.out}</span>
                  </div>
                  <p className="mt-2 text-fg-soft">{s.d}</p>
                  <p className="mt-3 text-[14px] leading-relaxed text-muted">{s.more}</p>
                </article>
              </li>
            )
          })}
        </ol>
      </div>
    </Section>
  )
}
