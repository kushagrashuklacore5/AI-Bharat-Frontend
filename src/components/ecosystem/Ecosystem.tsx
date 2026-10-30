import { useState } from 'react'
import { Link } from 'react-router'
import { ArrowUpRight, Boxes, Bot, Cpu, Network, Workflow, Wrench, type LucideIcon } from 'lucide-react'
import { Section } from '../ui/Section'
import { SectionHeading } from '../ui/SectionHeading'

interface Cap {
  id: string
  name: string
  role: string
  body: string
  to: string
  icon: LucideIcon
  color: string
  angle: number
}

const CAPS: Cap[] = [
  {
    id: 'studio',
    name: 'AI Workflow Studio',
    role: 'Where automation is designed',
    body: 'The visual builder that ties everything together. Workflows call agents, route to models and run on managed compute.',
    to: '/workflow-studio',
    icon: Workflow,
    color: '#45d3e6',
    angle: -90,
  },
  {
    id: 'agents',
    name: 'AI Agents',
    role: 'Who does the work',
    body: 'Specialised agents that research, analyse, verify and act — used as nodes inside workflows or deployed as copilots and assistants.',
    to: '/ai-agents',
    icon: Bot,
    color: '#5b8cff',
    angle: -30,
  },
  {
    id: 'models',
    name: 'Multi-Model Orchestration',
    role: 'Which model answers',
    body: 'A gateway that routes every model call by task, cost, latency and availability, with fallbacks and structured outputs.',
    to: '/ai-orchestration',
    icon: Network,
    color: '#a48bff',
    angle: 30,
  },
  {
    id: 'gpu',
    name: 'GPU Cloud',
    role: 'What it runs on',
    body: 'Partner-powered GPU capacity for inference, fine-tuning and model hosting — billed hourly, monthly or dedicated.',
    to: '/gpu-cloud',
    icon: Cpu,
    color: '#8fa3c7',
    angle: 90,
  },
  {
    id: 'custom',
    name: 'Custom AI Development',
    role: 'Who builds it with you',
    body: 'Our engineers architect, build, integrate and maintain solutions on the platform when you would rather not build in-house.',
    to: '/custom-ai-development',
    icon: Wrench,
    color: '#e09a52',
    angle: 150,
  },
  {
    id: 'enterprise',
    name: 'Enterprise AI Solutions',
    role: 'What the business receives',
    body: 'Complete systems — assistants, RAG knowledge bases, document intelligence, voice AI — governed and deployed for your teams.',
    to: '/solutions',
    icon: Boxes,
    color: '#2fb9a6',
    angle: 210,
  },
]

const LINKS: [string, string, string][] = [
  ['studio', 'agents', 'Workflows invoke agents as steps'],
  ['studio', 'models', 'LLM nodes call the model gateway'],
  ['agents', 'models', 'Agents reason through routed models'],
  ['models', 'gpu', 'Self-hosted models run on GPU Cloud'],
  ['gpu', 'custom', 'Custom models are trained & served here'],
  ['custom', 'enterprise', 'We deliver complete solutions'],
  ['enterprise', 'studio', 'Solutions are built as workflows'],
  ['custom', 'agents', 'We build bespoke agents'],
]

const R = 40 // % radius
const pos = (angle: number) => {
  const a = (angle * Math.PI) / 180
  return { x: 50 + Math.cos(a) * R, y: 50 + Math.sin(a) * R }
}

export function EcosystemSection({ index = '01' }: { index?: string }) {
  const [active, setActive] = useState<string>('studio')
  const cur = CAPS.find((c) => c.id === active)!
  const related = LINKS.filter(([a, b]) => a === active || b === active)

  return (
    <Section id="ecosystem" labelledBy="eco-title" className="py-28 md:py-36">
      <div className="container-x">
        <SectionHeading
          id="eco-title"
          index={index}
          eyebrow="Our AI ecosystem"
          title={
            <>
              Six capabilities, <span className="serif-accent text-fg-soft">designed</span> to work as one.
            </>
          }
          lead="Use one capability or all of them. Each part of AI Bharat plugs into the others — so a prototype built in the Studio can grow into a governed, production system without changing platforms."
        />

        <div className="mt-16 grid items-center gap-12 lg:grid-cols-[1.1fr_1fr]">
          {/* diagram */}
          <div data-reveal="1" className="relative mx-auto aspect-square w-full max-w-[560px]">
            <svg viewBox="0 0 100 100" className="absolute inset-0 h-full w-full overflow-visible" aria-hidden="true">
              <defs>
                <radialGradient id="eco-core">
                  <stop offset="0" stopColor="#45d3e6" stopOpacity=".35" />
                  <stop offset="1" stopColor="#45d3e6" stopOpacity="0" />
                </radialGradient>
              </defs>
              <circle cx="50" cy="50" r={R} fill="none" stroke="rgba(148,170,210,.12)" strokeWidth=".2" strokeDasharray=".6 1.2" />
              <circle cx="50" cy="50" r={R * 0.55} fill="none" stroke="rgba(148,170,210,.08)" strokeWidth=".2" />
              {Array.from({ length: 24 }, (_, i) => {
                const a = (i / 24) * Math.PI * 2
                return <line key={i} x1={50 + Math.cos(a) * 46} y1={50 + Math.sin(a) * 46} x2={50 + Math.cos(a) * (i % 6 === 0 ? 48.5 : 47.2)} y2={50 + Math.sin(a) * (i % 6 === 0 ? 48.5 : 47.2)} stroke="#e09a52" strokeOpacity=".35" strokeWidth=".25" />
              })}
              {LINKS.map(([a, b], i) => {
                const A = pos(CAPS.find((c) => c.id === a)!.angle)
                const B = pos(CAPS.find((c) => c.id === b)!.angle)
                const on = a === active || b === active
                const d = `M${A.x} ${A.y} Q 50 50 ${B.x} ${B.y}`
                return (
                  <g key={i}>
                    <path d={d} fill="none" stroke={on ? cur.color : 'rgba(148,170,210,.14)'} strokeWidth={on ? 0.35 : 0.2} style={{ transition: 'stroke .4s' }} />
                    {on && <path d={d} fill="none" stroke="#fff" strokeOpacity=".7" strokeWidth=".35" strokeDasharray="1 5" className="dash-flow" />}
                  </g>
                )
              })}
              <circle cx="50" cy="50" r="14" fill="url(#eco-core)" />
            </svg>

            {/* center */}
            <div className="absolute left-1/2 top-1/2 grid size-[26%] -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full border border-line-strong bg-ink-900/90 text-center">
              <div>
                <p className="font-mono text-[9px] uppercase tracking-[0.18em] text-faint sm:text-[10px]">Unified</p>
                <p className="mt-1 text-[12px] font-medium text-fg sm:text-sm">AI Bharat</p>
                <p className="font-mono text-[9px] text-muted sm:text-[10px]">platform</p>
              </div>
            </div>

            {/* hotspots */}
            {CAPS.map((c) => {
              const p = pos(c.angle)
              const on = c.id === active
              const linked = related.some(([a, b]) => a === c.id || b === c.id)
              const Icon = c.icon
              return (
                <button
                  key={c.id}
                  type="button"
                  onMouseEnter={() => setActive(c.id)}
                  onFocus={() => setActive(c.id)}
                  onClick={() => setActive(c.id)}
                  aria-pressed={on}
                  className="group absolute -translate-x-1/2 -translate-y-1/2"
                  style={{ left: `${p.x}%`, top: `${p.y}%` }}
                >
                  <span
                    className="relative grid size-12 place-items-center rounded-2xl border bg-ink-900 transition-all duration-500 sm:size-14"
                    style={{
                      borderColor: on ? c.color : linked ? `${c.color}66` : 'var(--color-line-strong)',
                      boxShadow: on ? `0 0 0 6px ${c.color}14, 0 0 40px -6px ${c.color}` : 'none',
                      color: on || linked ? c.color : 'var(--color-fg-soft)',
                      transform: on ? 'scale(1.08)' : 'scale(1)',
                    }}
                  >
                    <Icon size={20} />
                  </span>
                  <span
                    className={`absolute left-1/2 top-full mt-2 w-max max-w-[9rem] -translate-x-1/2 text-center text-[11px] leading-tight transition-colors sm:text-[12px] ${
                      on ? 'text-fg' : 'text-muted'
                    }`}
                  >
                    {c.name}
                  </span>
                </button>
              )
            })}
          </div>

          {/* detail */}
          <div data-reveal="2" aria-live="polite">
            <div key={cur.id} className="panel relative overflow-hidden p-7 sm:p-9" style={{ animation: 'fade-up .6s cubic-bezier(.16,1,.3,1)' }}>
              <div className="absolute inset-x-0 top-0 h-px" style={{ background: `linear-gradient(90deg, transparent, ${cur.color}, transparent)` }} />
              <p className="font-mono text-[11px] uppercase tracking-[0.16em]" style={{ color: cur.color }}>
                {cur.role}
              </p>
              <h3 className="mt-3 text-3xl font-medium tracking-tight text-fg">{cur.name}</h3>
              <p className="mt-4 leading-relaxed text-fg-soft">{cur.body}</p>
              <p className="mt-8 font-mono text-[10.5px] uppercase tracking-[0.16em] text-faint">Connects with</p>
              <ul className="mt-3 space-y-2">
                {related.map(([a, b, why]) => {
                  const other = CAPS.find((c) => c.id === (a === active ? b : a))!
                  return (
                    <li key={a + b}>
                      <button
                        type="button"
                        onClick={() => setActive(other.id)}
                        className="flex w-full items-center justify-between gap-3 rounded-xl border border-line px-4 py-2.5 text-left transition-colors hover:border-line-strong"
                      >
                        <span>
                          <span className="block text-[14px] text-fg">{other.name}</span>
                          <span className="block text-[12.5px] text-muted">{why}</span>
                        </span>
                        <span className="size-2 shrink-0 rounded-full" style={{ background: other.color }} />
                      </button>
                    </li>
                  )
                })}
              </ul>
              <Link to={cur.to} className="mt-8 inline-flex items-center gap-1.5 text-sm" style={{ color: cur.color }}>
                Explore {cur.name} <ArrowUpRight size={15} />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </Section>
  )
}
