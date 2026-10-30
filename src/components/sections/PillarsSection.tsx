import { Section } from '../ui/Section'
import { SectionHeading } from '../ui/SectionHeading'

// isometric diamond for a plate centred at (cx, cy) with half-width w
const plate = (cx: number, cy: number, w: number) => `M${cx} ${cy - w * 0.5} L${cx + w} ${cy} L${cx} ${cy + w * 0.5} L${cx - w} ${cy} Z`
const side = (cx: number, cy: number, w: number, h: number) =>
  `M${cx - w} ${cy} L${cx} ${cy + w * 0.5} L${cx + w} ${cy} L${cx + w} ${cy + h} L${cx} ${cy + w * 0.5 + h} L${cx - w} ${cy + h} Z`

function Block({ cx, cy, w, h = 8, color, className = '', opacity = 1 }: { cx: number; cy: number; w: number; h?: number; color: string; className?: string; opacity?: number }) {
  return (
    <g className={className} opacity={opacity}>
      <path d={side(cx, cy, w, h)} fill={color} fillOpacity=".18" stroke={color} strokeOpacity=".5" strokeWidth=".8" />
      <path d={plate(cx, cy, w)} fill="#0e1524" stroke={color} strokeWidth="1" />
      <path d={plate(cx, cy, w)} fill={color} fillOpacity=".1" />
    </g>
  )
}

function SovereignArt() {
  return (
    <svg viewBox="0 0 240 200" className="w-full" aria-hidden="true">
      <path d={plate(120, 120, 100)} fill="none" stroke="#e09a52" strokeOpacity=".5" strokeDasharray="4 5" />
      <text x="120" y="185" textAnchor="middle" fill="#e09a52" fillOpacity=".7" fontFamily="Geist Mono" fontSize="8" letterSpacing="1.5">
        YOUR BOUNDARY
      </text>
      <g className="pl-lift-3">
        <Block cx={120} cy={128} w={64} color="#8fa3c7" />
      </g>
      <g className="pl-lift-2">
        <Block cx={120} cy={104} w={56} color="#2fb9a6" />
      </g>
      <g className="pl-lift-1">
        <Block cx={120} cy={80} w={48} color="#45d3e6" />
      </g>
    </svg>
  )
}

function ComposableArt() {
  return (
    <svg viewBox="0 0 240 200" className="w-full" aria-hidden="true">
      {/* back-to-front so the iso tiles overlap correctly */}
      <g className="pl-out-t">
        <Block cx={120} cy={82} w={32} h={14} color="#45d3e6" />
      </g>
      <g className="pl-out-l">
        <Block cx={88} cy={98} w={32} h={14} color="#5b8cff" />
      </g>
      <g className="pl-out-r">
        <Block cx={152} cy={98} w={32} h={14} color="#2fb9a6" />
      </g>
      <g className="pl-out-b">
        <Block cx={120} cy={114} w={32} h={14} color="#a48bff" />
      </g>
      <text x="120" y="185" textAnchor="middle" fill="#8fa3c7" fillOpacity=".7" fontFamily="Geist Mono" fontSize="8" letterSpacing="1.5">
        APIS · MODELS · APPS · DATA
      </text>
    </svg>
  )
}

function SecureArt() {
  return (
    <svg viewBox="0 0 240 200" className="w-full" aria-hidden="true">
      {[96, 72, 48].map((w, i) => (
        <path key={w} className={`pl-ring pl-ring-${i}`} d={plate(120, 110, w)} fill="none" stroke="#2fb9a6" strokeOpacity={0.25 + i * 0.25} strokeDasharray={i === 0 ? '3 4' : undefined} />
      ))}
      <Block cx={120} cy={104} w={24} h={14} color="#7aae86" />
      <path d="M114 92 v-6 a6 6 0 0 1 12 0 v6" fill="none" stroke="#e8eef8" strokeWidth="1.4" />
      <text x="120" y="185" textAnchor="middle" fill="#2fb9a6" fillOpacity=".8" fontFamily="Geist Mono" fontSize="8" letterSpacing="1.5">
        IDENTITY · POLICY · AUDIT
      </text>
    </svg>
  )
}

const PILLARS = [
  {
    k: 'Sovereign',
    art: SovereignArt,
    body: 'Control over your data, models, infrastructure and workflows where deployment arrangements permit.',
    points: ['Self-hosted and open-weight model options', 'Choice of deployment environment', 'Your data used only for your workloads'],
    color: '#e09a52',
  },
  {
    k: 'Composable',
    art: ComposableArt,
    body: 'Integrate with existing technology stacks, APIs, models and business applications.',
    points: ['Connectors, webhooks & custom nodes', 'Bring your own models and providers', 'Adopt one capability or the full stack'],
    color: '#45d3e6',
  },
  {
    k: 'Secure',
    art: SecureArt,
    body: 'Enterprise-oriented access control, isolation, governance and protection.',
    points: ['Role-based access & approvals', 'Credential isolation & redaction', 'Run histories and audit logging'],
    color: '#2fb9a6',
  },
]

export function PillarsSection({ index = '10' }: { index?: string }) {
  return (
    <Section id="why" labelledBy="why-title" className="py-28 md:py-36">
      <div className="container-x">
        <SectionHeading
          id="why-title"
          index={index}
          align="center"
          eyebrow="Why AI Bharat"
          title={
            <>
              Built on three <span className="serif-accent text-gradient">principles.</span>
            </>
          }
        />
        <div className="mt-16 grid gap-px overflow-hidden rounded-3xl border border-line bg-line md:grid-cols-3">
          {PILLARS.map((p, i) => {
            const Art = p.art
            return (
              <article key={p.k} data-reveal={String(i)} className="pillar group relative flex flex-col bg-ink-950 p-8 sm:p-10">
                <div className="pointer-events-none absolute inset-x-0 top-0 h-px opacity-0 transition-opacity duration-700 group-hover:opacity-100" style={{ background: `linear-gradient(90deg, transparent, ${p.color}, transparent)` }} />
                <div className="mx-auto w-full max-w-[280px] py-4">
                  <Art />
                </div>
                <p className="mt-6 font-mono text-[11px] uppercase tracking-[0.24em]" style={{ color: p.color }}>
                  0{i + 1}
                </p>
                <h3 className="mt-2 text-[2rem] font-medium uppercase tracking-[0.06em] text-fg">{p.k}</h3>
                <p className="mt-4 leading-relaxed text-fg-soft">{p.body}</p>
                <ul className="mt-6 space-y-2 border-t border-line pt-6">
                  {p.points.map((pt) => (
                    <li key={pt} className="flex gap-3 text-[13.5px] text-muted">
                      <span className="mt-2 size-1 shrink-0 rounded-full" style={{ background: p.color }} />
                      {pt}
                    </li>
                  ))}
                </ul>
              </article>
            )
          })}
        </div>
      </div>
    </Section>
  )
}
