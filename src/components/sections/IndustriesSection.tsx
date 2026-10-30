import { Link } from 'react-router'
import { ArrowUpRight } from 'lucide-react'
import { Section } from '../ui/Section'
import { SectionHeading } from '../ui/SectionHeading'
import { INDUSTRIES } from '../../lib/content'
import { IndustryGlyph } from './IndustryGlyph'

export function IndustryCard({ ind, i }: { ind: (typeof INDUSTRIES)[number]; i: number }) {
  return (
    <Link
      to={`/solutions#${ind.id}`}
      data-reveal={String(i % 4)}
      className="ind-card group relative flex min-h-[300px] flex-col overflow-hidden rounded-2xl border border-line bg-ink-900/70 p-6 transition-colors duration-500 hover:border-line-strong focus-visible:border-line-strong"
    >
      <div
        className="pointer-events-none absolute -right-20 -top-20 size-56 rounded-full opacity-0 blur-3xl transition-opacity duration-700 group-hover:opacity-100 group-focus-visible:opacity-100"
        style={{ background: `${ind.color}22` }}
      />
      <div className="flex items-start justify-between">
        <IndustryGlyph glyph={ind.glyph} color={ind.color} />
        <ArrowUpRight size={18} className="text-faint transition-all duration-500 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-fg" />
      </div>
      <h3 className="mt-6 text-xl tracking-tight text-fg">{ind.name}</h3>
      {/* problem → solution swap */}
      <div className="relative mt-3 flex-1">
        <div className="transition-all duration-500 group-hover:-translate-y-2 group-hover:opacity-0 group-focus-visible:opacity-0">
          <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-faint">The problem</p>
          <p className="mt-2 text-[13.5px] leading-relaxed text-muted">{ind.problem}</p>
        </div>
        <div className="absolute inset-0 translate-y-2 opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100 group-focus-visible:translate-y-0 group-focus-visible:opacity-100">
          <p className="font-mono text-[10px] uppercase tracking-[0.14em]" style={{ color: ind.color }}>
            How we solve it
          </p>
          <p className="mt-2 text-[13.5px] leading-relaxed text-fg-soft">{ind.solution}</p>
        </div>
      </div>
      <span className="absolute inset-x-0 bottom-0 h-px origin-left scale-x-0 transition-transform duration-700 group-hover:scale-x-100" style={{ background: ind.color }} />
    </Link>
  )
}

export function IndustriesSection({ index = '08' }: { index?: string }) {
  return (
    <Section id="industries" labelledBy="ind-title" className="py-28 md:py-36">
      <div className="container-x">
        <SectionHeading
          id="ind-title"
          index={index}
          eyebrow="Industry solutions"
          title={
            <>
              Applied AI for <span className="serif-accent text-gradient">real operations.</span>
            </>
          }
          lead="The same platform, shaped around the problems each industry actually has. Hover a card to see how we approach it."
        />
        <div className="mt-14 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {INDUSTRIES.map((ind, i) => (
            <IndustryCard key={ind.id} ind={ind} i={i} />
          ))}
          <Link
            to="/build-with-us"
            data-reveal="3"
            className="group flex min-h-[300px] flex-col justify-between rounded-2xl border border-dashed border-line-strong p-6 transition-colors hover:border-fg-soft/40"
          >
            <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-faint">Your industry</span>
            <span>
              <span className="block text-xl tracking-tight text-fg">Not listed?</span>
              <span className="mt-2 block text-[13.5px] leading-relaxed text-muted">
                Describe your process and we’ll assess where AI can help — and where it can’t.
              </span>
              <span className="mt-5 inline-flex items-center gap-1.5 text-[13px] text-cyan">
                Start a brief <ArrowUpRight size={14} />
              </span>
            </span>
          </Link>
        </div>
      </div>
    </Section>
  )
}
