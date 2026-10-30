import { useEffect, useRef, useState } from 'react'
import { Pause, Play } from 'lucide-react'
import { useInView } from '../../hooks/useInView'
import { useReducedMotion } from '../../hooks/useReducedMotion'

type NodeId = 'orch' | 'research' | 'analysis' | 'verify' | 'report' | 'human' | 'memory'

const NODES: Record<NodeId, { x: number; y: number; label: string; sub: string; color: string }> = {
  orch: { x: 400, y: 70, label: 'Orchestrator', sub: 'plans · delegates · tracks state', color: '#45d3e6' },
  research: { x: 115, y: 235, label: 'Research Agent', sub: 'web_search · read_page', color: '#5b8cff' },
  analysis: { x: 305, y: 235, label: 'Analysis Agent', sub: 'compare · compute', color: '#a48bff' },
  verify: { x: 495, y: 235, label: 'Verification Agent', sub: 'cite · cross-check', color: '#2fb9a6' },
  report: { x: 685, y: 235, label: 'Report Agent', sub: 'draft · format', color: '#8fa3c7' },
  human: { x: 685, y: 70, label: 'Human approval', sub: 'review before release', color: '#e09a52' },
  memory: { x: 400, y: 385, label: 'Shared context & memory', sub: '', color: '#7aae86' },
}

interface Step {
  from: NodeId
  to: NodeId
  title: string
  concept: string
  body: string
  tool?: string
}

const STEPS: Step[] = [
  { from: 'orch', to: 'research', title: 'Plan & delegate', concept: 'Task delegation', body: 'The orchestrator breaks “Prepare a competitor brief for the board” into sub-tasks and assigns research first.' },
  { from: 'research', to: 'memory', title: 'Gather sources', concept: 'Tool calling', body: 'The research agent calls search and page-reading tools, then writes sources and notes into shared context.', tool: 'web_search()' },
  { from: 'memory', to: 'analysis', title: 'Analyse', concept: 'Shared context', body: 'The analysis agent reads the same context — no copy-pasting between steps — and produces comparisons.', tool: 'compute_table()' },
  { from: 'analysis', to: 'verify', title: 'Verify claims', concept: 'Agent-to-agent communication', body: 'Findings are handed to a verification agent that checks each claim against its cited source and flags gaps.' },
  { from: 'verify', to: 'report', title: 'Draft the report', concept: 'Stateful execution', body: 'Verified findings move to the report agent. Every hand-off is recorded, so the run can be paused and resumed.' },
  { from: 'report', to: 'human', title: 'Request approval', concept: 'Human-in-the-loop', body: 'Before anything is shared, a reviewer sees the draft and its sources, and approves or sends it back.' },
  { from: 'human', to: 'orch', title: 'Deliver & log', concept: 'Execution monitoring', body: 'The orchestrator returns the approved brief. Steps, tool calls and decisions remain in the run history.' },
]

const anchor = (id: NodeId, toward: NodeId) => {
  const a = NODES[id]
  const b = NODES[toward]
  if (id === 'memory') return { x: b.x, y: a.y - 22 }
  const dy = b.y - a.y
  if (Math.abs(dy) < 10) return { x: a.x + (b.x > a.x ? 80 : -80), y: a.y }
  return { x: a.x, y: a.y + (dy > 0 ? 26 : -26) }
}

const pathFor = (s: Step) => {
  const A = anchor(s.from, s.to)
  const B = anchor(s.to, s.from)
  const my = (A.y + B.y) / 2
  return `M${A.x} ${A.y} C${A.x} ${my} ${B.x} ${my} ${B.x} ${B.y}`
}

export function AgentMesh() {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, '-15% 0px')
  const reduced = useReducedMotion()
  const [step, setStep] = useState(0)
  const [playing, setPlaying] = useState(!reduced)

  useEffect(() => {
    if (!inView || !playing) return
    const t = setInterval(() => setStep((s) => (s + 1) % STEPS.length), 3200)
    return () => clearInterval(t)
  }, [inView, playing])

  const cur = STEPS[step]
  const activeNodes = new Set<NodeId>([cur.from, cur.to])

  return (
    <div ref={ref} className="grid gap-8 lg:grid-cols-[1.5fr_1fr]">
      <div className="panel relative hidden overflow-hidden p-4 md:block">
        <div className="grid-bg absolute inset-0 opacity-40" />
        <svg viewBox="0 0 800 440" className="relative w-full" role="img" aria-label={`Multi-agent run, step ${step + 1}: ${cur.title}`}>
          {/* all channels */}
          {STEPS.map((s, i) => (
            <path key={i} d={pathFor(s)} fill="none" stroke={i === step ? NODES[s.from].color : 'rgba(148,170,210,.13)'} strokeWidth={i === step ? 1.6 : 1} style={{ transition: 'stroke .5s' }} />
          ))}
          {/* delegation fan from orchestrator */}
          {(['research', 'analysis', 'verify', 'report'] as NodeId[]).map((id) => (
            <line key={id} x1={400} y1={96} x2={NODES[id].x} y2={209} stroke="rgba(148,170,210,.07)" strokeDasharray="3 5" />
          ))}
          {(['research', 'analysis', 'verify', 'report'] as NodeId[]).map((id) => (
            <line key={`m-${id}`} x1={NODES[id].x} y1={261} x2={NODES[id].x} y2={363} stroke="rgba(122,174,134,.16)" strokeDasharray="2 4" />
          ))}
          {/* packet */}
          {!reduced && (
            <circle key={step} r="4.5" fill="#fff" style={{ filter: `drop-shadow(0 0 6px ${NODES[cur.from].color})` }}>
              <animateMotion dur="1.6s" repeatCount="indefinite" path={pathFor(cur)} keyPoints="0;1" keyTimes="0;1" calcMode="spline" keySplines=".6 0 .3 1" />
            </circle>
          )}
          {/* memory bar */}
          <g>
            <rect x="60" y="363" width="680" height="44" rx="12" fill="#0a101d" stroke={activeNodes.has('memory') ? NODES.memory.color : 'rgba(148,170,210,.18)'} />
            <text x="80" y="390" fill="#7aae86" fontFamily="Geist Mono" fontSize="11" letterSpacing="1.5">
              SHARED CONTEXT &amp; MEMORY
            </text>
            {['goal', 'plan', 'sources[14]', 'findings', 'checks', 'draft'].map((k, i) => (
              <g key={k} opacity={i <= Math.max(0, step - 0) ? 1 : 0.25} style={{ transition: 'opacity .5s' }}>
                <rect x={300 + i * 72} y="375" width="64" height="20" rx="5" fill="rgba(122,174,134,.1)" stroke="rgba(122,174,134,.3)" />
                <text x={332 + i * 72} y="389" textAnchor="middle" fill="#b6c2d8" fontFamily="Geist Mono" fontSize="9.5">
                  {k}
                </text>
              </g>
            ))}
          </g>
          {/* nodes */}
          {(Object.keys(NODES) as NodeId[])
            .filter((id) => id !== 'memory')
            .map((id) => {
              const n = NODES[id]
              const on = activeNodes.has(id)
              return (
                <g key={id} style={{ transition: 'opacity .5s' }} opacity={on ? 1 : 0.55}>
                  <rect x={n.x - 80} y={n.y - 26} width="160" height="52" rx="12" fill="#0e1524" stroke={on ? n.color : 'rgba(148,170,210,.2)'} strokeWidth={on ? 1.4 : 1} />
                  {on && <rect x={n.x - 80} y={n.y - 26} width="160" height="52" rx="12" fill="none" stroke={n.color} strokeOpacity=".25" strokeWidth="8" />}
                  <circle cx={n.x - 62} cy={n.y} r="4" fill={n.color} className={on ? 'pulse-dot' : ''} style={{ transformOrigin: `${n.x - 62}px ${n.y}px` }} />
                  <text x={n.x - 50} y={n.y - 3} fill="#e8eef8" fontFamily="Geist" fontSize="13">
                    {n.label}
                  </text>
                  <text x={n.x - 50} y={n.y + 13} fill="#7d8aa3" fontFamily="Geist Mono" fontSize="9">
                    {n.sub}
                  </text>
                </g>
              )
            })}
          {/* tool call chip */}
          {cur.tool && (
            <g key={`tool-${step}`} style={{ animation: 'fade-up .5s ease-out' }}>
              <rect x={NODES[cur.from === 'memory' ? cur.to : cur.from].x - 50} y={290} width="100" height="22" rx="11" fill="rgba(69,211,230,.1)" stroke="rgba(69,211,230,.45)" />
              <text x={NODES[cur.from === 'memory' ? cur.to : cur.from].x} y={305} textAnchor="middle" fill="#45d3e6" fontFamily="Geist Mono" fontSize="10">
                {cur.tool}
              </text>
            </g>
          )}
        </svg>
      </div>

      {/* step narrative */}
      <div className="flex flex-col">
        <div className="flex items-center justify-between">
          <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-faint">
            Run timeline · step {step + 1}/{STEPS.length}
          </p>
          <button
            type="button"
            onClick={() => setPlaying((p) => !p)}
            className="inline-flex h-8 items-center gap-1.5 rounded-full border border-line px-3 text-[12px] text-fg-soft hover:text-fg"
            aria-label={playing ? 'Pause animation' : 'Play animation'}
          >
            {playing ? <Pause size={12} /> : <Play size={12} />} {playing ? 'Pause' : 'Play'}
          </button>
        </div>
        <ol className="mt-4 space-y-1">
          {STEPS.map((s, i) => {
            const on = i === step
            return (
              <li key={s.title}>
                <button
                  type="button"
                  onClick={() => {
                    setStep(i)
                    setPlaying(false)
                  }}
                  className={`w-full rounded-xl border px-4 py-3 text-left transition-all duration-500 ${on ? 'border-line-strong bg-white/[0.035]' : 'border-transparent hover:bg-white/[0.02]'}`}
                  aria-current={on ? 'step' : undefined}
                >
                  <span className="flex items-center gap-3">
                    <span className="font-mono text-[11px] text-faint">{String(i + 1).padStart(2, '0')}</span>
                    <span className={`text-[14.5px] ${on ? 'text-fg' : i < step ? 'text-fg-soft' : 'text-muted'}`}>{s.title}</span>
                    <span className="ml-auto font-mono text-[10px] uppercase tracking-[0.12em]" style={{ color: on ? NODES[s.from].color : 'var(--color-faint)' }}>
                      {s.concept}
                    </span>
                  </span>
                  <span className={`grid transition-all duration-500 ${on ? 'mt-2 grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}>
                    <span className="overflow-hidden pl-8 text-[13.5px] leading-relaxed text-fg-soft/85">{s.body}</span>
                  </span>
                </button>
              </li>
            )
          })}
        </ol>
      </div>
    </div>
  )
}
