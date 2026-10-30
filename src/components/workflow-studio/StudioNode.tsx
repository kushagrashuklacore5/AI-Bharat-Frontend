import { memo } from 'react'
import { Handle, Position, BaseEdge, EdgeLabelRenderer, getBezierPath, type NodeProps, type EdgeProps, type Node, type Edge } from '@xyflow/react'
import { Bot, BookOpen, Check, Database, GitBranch, Loader2, Pause, Plug, Send, Sparkles, Split, UserCheck, Zap, type LucideIcon } from 'lucide-react'
import { KIND_META, type NodeKind, type StudioNodeData } from './workflows'

export type RunStatus = 'idle' | 'queued' | 'running' | 'done' | 'waiting' | 'skipped' | 'rejected'

export const KIND_ICON: Record<NodeKind, LucideIcon> = {
  trigger: Zap,
  agent: Bot,
  llm: Sparkles,
  knowledge: BookOpen,
  condition: GitBranch,
  database: Database,
  integration: Plug,
  human: UserCheck,
  output: Send,
  parallel: Split,
}

export type StudioNodeType = Node<StudioNodeData & { status?: RunStatus }, 'studio'>

function StudioNodeImpl({ data, selected }: NodeProps<StudioNodeType>) {
  const meta = KIND_META[data.kind]
  const Icon = KIND_ICON[data.kind]
  const status = data.status ?? 'idle'
  const running = status === 'running'
  const waiting = status === 'waiting'
  const skipped = status === 'skipped'
  return (
    <div
      className="relative w-[196px] rounded-xl border bg-ink-850 transition-[border-color,box-shadow,opacity] duration-300"
      style={{
        borderColor: selected ? meta.color : running || waiting ? `${meta.color}aa` : status === 'done' ? `${meta.color}55` : 'rgba(148,170,210,.16)',
        boxShadow: running ? `0 0 0 3px ${meta.color}22, 0 0 28px -6px ${meta.color}` : selected ? `0 0 0 3px ${meta.color}22` : '0 10px 30px -18px rgba(0,0,0,.9)',
        opacity: skipped ? 0.4 : 1,
      }}
    >
      {data.kind !== 'trigger' && <Handle type="target" position={Position.Left} />}
      <div className="flex items-center gap-2.5 px-3 pb-2 pt-3">
        <span className="grid size-7 shrink-0 place-items-center rounded-lg" style={{ background: `${meta.color}1c`, color: meta.color }}>
          <Icon size={14} />
        </span>
        <div className="min-w-0">
          <p className="truncate text-[12.5px] font-medium leading-tight text-fg">{data.title}</p>
          <p className="truncate text-[10.5px] leading-tight text-muted">{data.subtitle}</p>
        </div>
      </div>
      <div className="flex items-center justify-between border-t border-line px-3 py-1.5">
        <span className="font-mono text-[9px] uppercase tracking-[0.14em]" style={{ color: `${meta.color}cc` }}>
          {meta.label}
        </span>
        <StatusPill status={status} />
      </div>
      {running && (
        <span
          className="absolute inset-x-3 bottom-0 h-px overflow-hidden"
          style={{ background: `linear-gradient(90deg, transparent, ${meta.color}, transparent)`, backgroundSize: '200% 100%', animation: 'shimmer 1.2s linear infinite' }}
        />
      )}
      <Handle type="source" position={Position.Right} />
    </div>
  )
}

function StatusPill({ status }: { status: RunStatus }) {
  const map: Record<RunStatus, { t: string; c: string }> = {
    idle: { t: 'ready', c: 'text-faint' },
    queued: { t: 'queued', c: 'text-muted' },
    running: { t: 'running', c: 'text-cyan' },
    done: { t: 'done', c: 'text-leaf' },
    waiting: { t: 'awaiting', c: 'text-amber' },
    skipped: { t: 'skipped', c: 'text-faint' },
    rejected: { t: 'rejected', c: 'text-danger' },
  }
  const s = map[status]
  return (
    <span className={`flex items-center gap-1 font-mono text-[9.5px] ${s.c}`}>
      {status === 'running' && <Loader2 size={10} className="animate-spin" />}
      {status === 'done' && <Check size={10} />}
      {status === 'waiting' && <Pause size={10} />}
      {status === 'idle' && <span className="size-1.5 rounded-full bg-faint/70" />}
      {s.t}
    </span>
  )
}

export const StudioNode = memo(StudioNodeImpl)

export type FlowEdgeType = Edge<{ state?: 'idle' | 'active' | 'done' | 'skipped'; color?: string }, 'flow'>

export function FlowEdge({ id, sourceX, sourceY, targetX, targetY, sourcePosition, targetPosition, data, label, selected }: EdgeProps<FlowEdgeType>) {
  const [path, lx, ly] = getBezierPath({ sourceX, sourceY, targetX, targetY, sourcePosition, targetPosition })
  const state = data?.state ?? 'idle'
  const color = data?.color ?? '#45d3e6'
  const stroke = state === 'active' || state === 'done' ? color : selected ? '#45d3e6' : '#2c3a55'
  return (
    <>
      <BaseEdge
        id={id}
        path={path}
        style={{
          stroke,
          strokeWidth: state === 'active' ? 2 : 1.5,
          opacity: state === 'skipped' ? 0.25 : state === 'done' ? 0.75 : 1,
          strokeDasharray: state === 'skipped' ? '4 5' : undefined,
          transition: 'stroke .4s, opacity .4s',
        }}
      />
      {state === 'idle' && <path d={path} fill="none" stroke="#45d3e6" strokeOpacity=".22" strokeWidth="1.5" className="dash-flow" />}
      {state === 'active' && (
        <circle r="3.5" fill="#fff" style={{ filter: `drop-shadow(0 0 5px ${color})` }}>
          <animateMotion dur="0.9s" repeatCount="indefinite" path={path} />
        </circle>
      )}
      {label && (
        <EdgeLabelRenderer>
          <div
            className="nodrag nopan pointer-events-none absolute rounded-md border border-line bg-ink-900 px-1.5 py-0.5 font-mono text-[9.5px] text-fg-soft"
            style={{ transform: `translate(-50%, -50%) translate(${lx}px, ${ly}px)`, opacity: state === 'skipped' ? 0.4 : 1 }}
          >
            {label}
          </div>
        </EdgeLabelRenderer>
      )}
    </>
  )
}
