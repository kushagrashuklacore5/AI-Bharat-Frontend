import { useEffect, useRef, type ReactNode } from 'react'
import { useReveal } from '../../hooks/useReveal'

interface Props {
  eyebrow: string
  title: ReactNode
  lead: ReactNode
  actions?: ReactNode
  aside?: ReactNode
  accent?: string
  docTitle: string
}

/** Typographic header used by every inner page. */
export function PageHero({ eyebrow, title, lead, actions, aside, accent = '#45d3e6', docTitle }: Props) {
  const ref = useRef<HTMLElement>(null)
  useReveal(ref)
  useEffect(() => {
    document.title = `${docTitle} — AI Bharat`
  }, [docTitle])
  return (
    <section ref={ref} className="noise relative overflow-hidden pb-20 pt-36 md:pb-28 md:pt-44">
      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        <div className="absolute inset-0" style={{ background: `radial-gradient(55% 60% at 80% 20%, ${accent}1c, transparent 70%)` }} />
        <div className="grid-bg absolute inset-0 opacity-50 [mask-image:radial-gradient(60%_70%_at_70%_30%,black,transparent)]" />
        <div className="jaali absolute inset-y-0 left-0 w-1/3 opacity-[0.03] [mask-image:linear-gradient(90deg,black,transparent)]" />
      </div>
      <div className="container-x relative grid items-end gap-12 lg:grid-cols-[1.4fr_1fr]">
        <div>
          <p data-reveal className="eyebrow">
            {eyebrow}
          </p>
          <h1 data-reveal="1" className="display mt-6 text-[clamp(2.5rem,6vw,5.2rem)]">
            {title}
          </h1>
          <p data-reveal="2" className="mt-7 max-w-2xl text-[1.08rem] leading-relaxed text-fg-soft">
            {lead}
          </p>
          {actions && (
            <div data-reveal="3" className="mt-10 flex flex-wrap gap-3">
              {actions}
            </div>
          )}
        </div>
        {aside && <div data-reveal="3">{aside}</div>}
      </div>
    </section>
  )
}

/** Simple feature grid for inner pages. */
export function FeatureGrid({ items, cols = 3 }: { items: { t: string; d: string; tag?: string }[]; cols?: 2 | 3 | 4 }) {
  const c = cols === 4 ? 'lg:grid-cols-4' : cols === 2 ? 'lg:grid-cols-2' : 'lg:grid-cols-3'
  return (
    <div className={`grid gap-px overflow-hidden rounded-2xl border border-line bg-line sm:grid-cols-2 ${c}`}>
      {items.map((it, i) => (
        <div key={it.t} data-reveal={String(i % 4)} className="bg-ink-950 p-7">
          <div className="flex items-center justify-between">
            <span className="font-mono text-[11px] text-faint">{String(i + 1).padStart(2, '0')}</span>
            {it.tag && <span className="rounded-full border border-line px-2 py-0.5 font-mono text-[9.5px] uppercase tracking-[0.12em] text-muted">{it.tag}</span>}
          </div>
          <h3 className="mt-5 text-[17px] text-fg">{it.t}</h3>
          <p className="mt-2 text-[14px] leading-relaxed text-muted">{it.d}</p>
        </div>
      ))}
    </div>
  )
}
