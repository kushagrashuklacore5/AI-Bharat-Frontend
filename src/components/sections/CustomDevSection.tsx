import { useState } from 'react'
import { Section } from '../ui/Section'
import { SectionHeading } from '../ui/SectionHeading'
import { Button } from '../ui/Button'
import { USE_CASES } from '../../lib/content'

const ART_COLORS = ['#45d3e6', '#2fb9a6', '#e09a52', '#5b8cff', '#a48bff', '#8fa3c7']

export function CustomDevSection({ index = '07' }: { index?: string }) {
  const [open, setOpen] = useState(0)
  return (
    <Section id="custom-ai" labelledBy="custom-title" className="py-28 md:py-36">
      <div className="container-x">
        <div className="grid gap-10 lg:grid-cols-[1.2fr_1fr] lg:items-end">
          <SectionHeading
            id="custom-title"
            index={index}
            eyebrow="Custom AI development"
            title={
              <>
                Prefer it built for you? <span className="serif-accent text-fg-soft">We’ll build it.</span>
              </>
            }
          />
          <div data-reveal="2">
            <p className="text-[1.05rem] leading-relaxed text-fg-soft">
              Tell us what you want to automate, improve or build. Our team will architect, develop, integrate and deploy your AI solution —
              and can maintain it afterwards.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Button to="/build-with-us">Describe your project</Button>
              <Button to="/custom-ai-development" variant="secondary">
                Our services
              </Button>
            </div>
          </div>
        </div>

        {/* expanding panels */}
        <div data-reveal="2" className="mt-14 flex flex-col gap-2 lg:h-[420px] lg:flex-row">
          {USE_CASES.map((u, i) => {
            const on = open === i
            const c = ART_COLORS[i]
            return (
              <button
                key={u.id}
                type="button"
                onMouseEnter={() => setOpen(i)}
                onFocus={() => setOpen(i)}
                onClick={() => setOpen(i)}
                aria-expanded={on}
                className={`group relative overflow-hidden rounded-2xl border text-left transition-[flex-grow,border-color,background] duration-700 ease-[cubic-bezier(.16,1,.3,1)] lg:min-w-0 ${
                  on ? 'border-line-strong bg-ink-850 lg:flex-[4]' : 'border-line bg-ink-900/60 lg:flex-[1]'
                }`}
              >
                {/* art */}
                <svg className="pointer-events-none absolute -right-10 -top-10 size-64 transition-opacity duration-700" style={{ opacity: on ? 0.9 : 0.25 }} viewBox="0 0 200 200" aria-hidden="true">
                  {Array.from({ length: 6 }, (_, k) => (
                    <rect key={k} x={40 + k * 8} y={40 + k * 8} width={120 - k * 16} height={120 - k * 16} rx={14} fill="none" stroke={c} strokeOpacity={0.12 + k * 0.08} transform={`rotate(${k * 7} 100 100)`} />
                  ))}
                </svg>
                <div className="relative flex h-full flex-col p-6">
                  <span className="font-mono text-[11px]" style={{ color: c }}>
                    0{i + 1}
                  </span>
                  <span
                    className={`mt-3 text-lg leading-snug text-fg transition-all duration-500 lg:mt-auto ${
                      on ? '' : 'lg:[writing-mode:vertical-rl] lg:rotate-180 lg:text-[15px] lg:text-fg-soft'
                    }`}
                  >
                    {u.title}
                  </span>
                  <span className={`grid transition-all duration-700 ${on ? 'mt-3 grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}>
                    <span className="overflow-hidden">
                      <span className="block max-w-md text-[14px] leading-relaxed text-fg-soft/85">{u.body}</span>
                      <span className="mt-4 flex flex-wrap gap-1.5">
                        {u.tags.map((t) => (
                          <span key={t} className="rounded-md border border-line px-2 py-0.5 font-mono text-[10.5px] text-muted">
                            {t}
                          </span>
                        ))}
                      </span>
                    </span>
                  </span>
                </div>
              </button>
            )
          })}
        </div>
      </div>
    </Section>
  )
}
