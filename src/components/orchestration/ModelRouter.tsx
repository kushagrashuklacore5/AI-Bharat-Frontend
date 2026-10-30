import { useMemo, useState } from 'react'
import { AlertTriangle, ShieldCheck } from 'lucide-react'
import { DemoBadge } from '../ui/DemoBadge'

type Pool = 'frontier' | 'compact' | 'code' | 'open'
type Task = 'classify' | 'reason' | 'code' | 'sensitive'
type Policy = 'quality' | 'balanced' | 'cost' | 'latency'

const POOLS: Record<Pool, { name: string; via: string; color: string; q: number; s: number; c: number }> = {
  frontier: { name: 'Large reasoning model', via: 'Hosted provider A', color: '#5b8cff', q: 4, s: 2, c: 1 },
  compact: { name: 'Fast compact model', via: 'Hosted provider B', color: '#45d3e6', q: 2, s: 4, c: 4 },
  code: { name: 'Code-specialised model', via: 'Hosted provider C', color: '#a48bff', q: 3, s: 3, c: 3 },
  open: { name: 'Open-weight model', via: 'Self-hosted · GPU Cloud', color: '#2fb9a6', q: 3, s: 3, c: 3 },
}

const TASKS: { id: Task; label: string; example: string }[] = [
  { id: 'classify', label: 'Classify a ticket', example: '“Route this support email to the right team.”' },
  { id: 'reason', label: 'Analyse a contract', example: '“Summarise obligations and risks in this agreement.”' },
  { id: 'code', label: 'Generate SQL', example: '“Write a query for monthly revenue by region.”' },
  { id: 'sensitive', label: 'Summarise patient notes', example: '“Summarise this discharge note for the care team.”' },
]

const POLICIES: { id: Policy; label: string }[] = [
  { id: 'quality', label: 'Quality first' },
  { id: 'balanced', label: 'Balanced' },
  { id: 'cost', label: 'Cost first' },
  { id: 'latency', label: 'Latency first' },
]

function decide(task: Task, policy: Policy): { primary: Pool; fallback: Pool; why: string } {
  if (task === 'sensitive')
    return { primary: 'open', fallback: 'open', why: 'A data-handling rule restricts this request to models running in an approved, self-hosted environment — regardless of the cost or speed preference. Fallback is a second replica of the same deployment.' }
  if (task === 'classify') {
    if (policy === 'quality') return { primary: 'frontier', fallback: 'compact', why: 'Quality-first sends even simple labelling to the strongest model; the compact model is the fallback.' }
    return { primary: 'compact', fallback: 'open', why: 'Classification is a short, well-defined task — a fast compact model is usually sufficient and far cheaper per request.' }
  }
  if (task === 'code') {
    if (policy === 'cost' || policy === 'latency') return { primary: 'compact', fallback: 'code', why: 'For cost or speed, a compact model drafts the query; output is validated, and the code model takes over if validation fails.' }
    return { primary: 'code', fallback: 'frontier', why: 'A code-specialised model is selected for structured query generation; the reasoning model is the fallback.' }
  }
  if (policy === 'cost') return { primary: 'open', fallback: 'frontier', why: 'Cost-first routes long documents to the self-hosted open-weight model, keeping the larger hosted model as fallback.' }
  if (policy === 'latency') return { primary: 'compact', fallback: 'frontier', why: 'Latency-first favours the fastest model; complex outputs that fail validation escalate to the reasoning model.' }
  return { primary: 'frontier', fallback: 'open', why: 'Multi-step legal reasoning benefits from the strongest model; the open-weight model is the fallback.' }
}

const POOL_ORDER: Pool[] = ['frontier', 'compact', 'code', 'open']
const PY = [70, 160, 250, 340]

export function ModelRouter() {
  const [task, setTask] = useState<Task>('reason')
  const [policy, setPolicy] = useState<Policy>('balanced')
  const [outage, setOutage] = useState(false)
  const d = useMemo(() => decide(task, policy), [task, policy])
  const served: Pool = outage ? d.fallback : d.primary
  const color = POOLS[served].color

  return (
    <div className="panel overflow-hidden">
      {/* controls */}
      <div className="grid gap-6 border-b border-line p-5 sm:p-7 lg:grid-cols-[1.4fr_1fr_auto] lg:items-end">
        <fieldset>
          <legend className="font-mono text-[10.5px] uppercase tracking-[0.16em] text-faint">1 · Request</legend>
          <div className="mt-3 flex flex-wrap gap-2">
            {TASKS.map((t) => (
              <button
                key={t.id}
                type="button"
                aria-pressed={task === t.id}
                onClick={() => setTask(t.id)}
                className={`rounded-full border px-3.5 py-1.5 text-[12.5px] transition-colors ${task === t.id ? 'border-fg/40 bg-white/[0.06] text-fg' : 'border-line text-muted hover:text-fg-soft'}`}
              >
                {t.label}
              </button>
            ))}
          </div>
        </fieldset>
        <fieldset>
          <legend className="font-mono text-[10.5px] uppercase tracking-[0.16em] text-faint">2 · Routing policy</legend>
          <div className="mt-3 flex flex-wrap gap-2">
            {POLICIES.map((p) => (
              <button
                key={p.id}
                type="button"
                aria-pressed={policy === p.id}
                onClick={() => setPolicy(p.id)}
                className={`rounded-full border px-3.5 py-1.5 text-[12.5px] transition-colors ${policy === p.id ? 'border-fg/40 bg-white/[0.06] text-fg' : 'border-line text-muted hover:text-fg-soft'}`}
              >
                {p.label}
              </button>
            ))}
          </div>
        </fieldset>
        <label className="flex cursor-pointer items-center gap-3 text-[12.5px] text-fg-soft">
          <span className="relative inline-flex">
            <input type="checkbox" className="peer sr-only" checked={outage} onChange={(e) => setOutage(e.target.checked)} />
            <span className="h-6 w-11 rounded-full border border-line-strong bg-ink-800 transition-colors peer-checked:border-danger/50 peer-checked:bg-danger/20 peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-cyan" />
            <span className="absolute left-1 top-1 size-4 rounded-full bg-fg-soft transition-transform peer-checked:translate-x-5 peer-checked:bg-danger" />
          </span>
          Simulate primary outage
        </label>
      </div>

      <div className="grid lg:grid-cols-[1.7fr_1fr]">
        {/* route diagram */}
        <div className="relative border-b border-line p-4 lg:border-b-0 lg:border-r">
          <svg viewBox="0 0 900 410" className="w-full" role="img" aria-label={`Request routed to ${POOLS[served].name}`}>
            {/* app → gateway → policy */}
            <Box x={20} y={175} w={130} label="Your application" sub="one API call" />
            <Box x={200} y={175} w={150} label="Model Gateway" sub="auth · format · meter" accent="#45d3e6" />
            <Box x={400} y={175} w={130} label="Policy engine" sub={POLICIES.find((p) => p.id === policy)!.label.toLowerCase()} accent={color} />
            <line x1={150} y1={205} x2={200} y2={205} stroke={color} strokeWidth="1.5" />
            <line x1={350} y1={205} x2={400} y2={205} stroke={color} strokeWidth="1.5" />
            {/* pools */}
            {POOL_ORDER.map((p, i) => {
              const isServed = p === served
              const isFailed = outage && p === d.primary && d.primary !== d.fallback
              const path = `M530 205 C 580 205, 570 ${PY[i]}, 610 ${PY[i]}`
              const back = `M790 ${PY[i]} C 820 ${PY[i]}, 810 205, 840 205`
              return (
                <g key={p}>
                  <path d={path} fill="none" stroke={isServed ? POOLS[p].color : isFailed ? '#ef7a7a' : 'rgba(148,170,210,.14)'} strokeWidth={isServed ? 1.8 : 1} strokeDasharray={isFailed ? '4 4' : undefined} style={{ transition: 'stroke .4s' }} />
                  <path d={back} fill="none" stroke={isServed ? POOLS[p].color : 'rgba(148,170,210,.1)'} strokeWidth={isServed ? 1.8 : 1} style={{ transition: 'stroke .4s' }} />
                  {isServed && (
                    <circle r="4" fill="#fff" style={{ filter: `drop-shadow(0 0 6px ${POOLS[p].color})` }}>
                      <animateMotion dur="1.4s" repeatCount="indefinite" path={`M150 205 L530 205 ${path.replace('M530 205', '')} L790 ${PY[i]} ${back.replace(`M790 ${PY[i]}`, '')}`} />
                    </circle>
                  )}
                  <g opacity={isServed ? 1 : isFailed ? 0.8 : 0.45} style={{ transition: 'opacity .4s' }}>
                    <rect x={610} y={PY[i] - 30} width={180} height={60} rx={12} fill="#0e1524" stroke={isServed ? POOLS[p].color : isFailed ? '#ef7a7a' : 'rgba(148,170,210,.2)'} />
                    <text x={624} y={PY[i] - 7} fill="#e8eef8" fontFamily="Geist" fontSize="13">
                      {POOLS[p].name}
                    </text>
                    <text x={624} y={PY[i] + 10} fill="#7d8aa3" fontFamily="Geist Mono" fontSize="9.5">
                      {POOLS[p].via}
                    </text>
                    {isFailed && (
                      <text x={624} y={PY[i] + 23} fill="#ef7a7a" fontFamily="Geist Mono" fontSize="9">
                        unavailable → fallback
                      </text>
                    )}
                    {!isFailed && (
                      <g>
                        {[0, 1, 2, 3].map((k) => (
                          <rect key={k} x={624 + k * 9} y={PY[i] + 18} width="6" height="4" rx="1" fill={POOLS[p].color} opacity={k < POOLS[p].q ? 0.9 : 0.2} />
                        ))}
                        {[0, 1, 2, 3].map((k) => (
                          <rect key={k} x={672 + k * 9} y={PY[i] + 18} width="6" height="4" rx="1" fill="#e8c27a" opacity={k < POOLS[p].s ? 0.9 : 0.2} />
                        ))}
                        {[0, 1, 2, 3].map((k) => (
                          <rect key={k} x={720 + k * 9} y={PY[i] + 18} width="6" height="4" rx="1" fill="#7aae86" opacity={k < POOLS[p].c ? 0.9 : 0.2} />
                        ))}
                      </g>
                    )}
                  </g>
                </g>
              )
            })}
            <Box x={840} y={175} w={0} label="" sub="" />
            <g>
              <rect x={812} y={225} width={80} height={44} rx={10} fill="#0e1524" stroke={color} />
              <text x={852} y={244} textAnchor="middle" fill="#e8eef8" fontFamily="Geist" fontSize="11">
                Validate
              </text>
              <text x={852} y={259} textAnchor="middle" fill="#7d8aa3" fontFamily="Geist Mono" fontSize="8.5">
                schema ✓
              </text>
              <line x1={852} y1={205} x2={852} y2={225} stroke={color} strokeWidth="1.5" />
            </g>
            <text x={20} y={395} fill="#4f5b73" fontFamily="Geist Mono" fontSize="9.5">
              bars: quality · speed · cost-efficiency (relative, illustrative)
            </text>
          </svg>
        </div>

        {/* decision explanation */}
        <div className="p-6 sm:p-7" aria-live="polite">
          <DemoBadge label="Illustrative routing" />
          <p className="mt-5 text-[13px] text-muted">{TASKS.find((t) => t.id === task)!.example}</p>
          <p className="mt-5 font-mono text-[10.5px] uppercase tracking-[0.16em] text-faint">Routed to</p>
          <p className="mt-2 text-2xl font-medium tracking-tight" style={{ color }}>
            {POOLS[served].name}
          </p>
          <p className="text-[13px] text-muted">{POOLS[served].via}</p>
          <p className="mt-5 text-[14px] leading-relaxed text-fg-soft">{d.why}</p>
          {outage && (
            <p className="mt-4 flex gap-2 rounded-xl border border-danger/25 bg-danger/[0.06] p-3 text-[13px] leading-relaxed text-fg-soft">
              <AlertTriangle size={16} className="mt-0.5 shrink-0 text-danger" />
              {d.primary === d.fallback
                ? 'The primary replica is unavailable; the request moves to another replica inside the same approved environment.'
                : `${POOLS[d.primary].name} is unavailable. The gateway retries on ${POOLS[d.fallback].name} without the application changing anything.`}
            </p>
          )}
          {task === 'sensitive' && (
            <p className="mt-4 flex gap-2 text-[13px] text-fg-soft">
              <ShieldCheck size={16} className="mt-0.5 shrink-0 text-teal" /> Governance policy applied before routing.
            </p>
          )}
        </div>
      </div>
    </div>
  )
}

function Box({ x, y, w, label, sub, accent }: { x: number; y: number; w: number; label: string; sub: string; accent?: string }) {
  if (!w) return null
  return (
    <g>
      <rect x={x} y={y} width={w} height={60} rx={12} fill="#0e1524" stroke={accent ?? 'rgba(148,170,210,.25)'} style={{ transition: 'stroke .4s' }} />
      <text x={x + 14} y={y + 26} fill="#e8eef8" fontFamily="Geist" fontSize="13">
        {label}
      </text>
      <text x={x + 14} y={y + 43} fill="#7d8aa3" fontFamily="Geist Mono" fontSize="9.5">
        {sub}
      </text>
    </g>
  )
}
