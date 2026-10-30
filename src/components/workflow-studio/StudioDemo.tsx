import { useCallback, useEffect, useMemo, useRef, useState, type DragEvent } from 'react'
import {
  ReactFlow,
  ReactFlowProvider,
  Background,
  BackgroundVariant,
  Controls,
  MiniMap,
  addEdge,
  useEdgesState,
  useNodesState,
  useReactFlow,
  type Connection,
  type NodeTypes,
  type EdgeTypes,
} from '@xyflow/react'
import '@xyflow/react/dist/base.css'
import { Check, ChevronRight, CircleDot, Play, Plus, RotateCcw, Search, Square, X } from 'lucide-react'
import { KIND_META, NODE_LIBRARY, WORKFLOWS, type NodeKind, type StudioNodeData, type WorkflowDef } from './workflows'
import { FlowEdge, KIND_ICON, StudioNode, type FlowEdgeType, type RunStatus, type StudioNodeType } from './StudioNode'
import { useMediaQuery } from '../../hooks/useMediaQuery'

const nodeTypes: NodeTypes = { studio: StudioNode }
const edgeTypes: EdgeTypes = { flow: FlowEdge }

const toNodes = (wf: WorkflowDef): StudioNodeType[] =>
  wf.nodes.map((n) => ({ id: n.id, type: 'studio', position: { x: n.x, y: n.y }, data: { ...n.data } }))
const toEdges = (wf: WorkflowDef): FlowEdgeType[] =>
  wf.edges.map((e) => ({ id: e.id, source: e.source, target: e.target, label: e.label, type: 'flow' }))

interface LogLine {
  t: number
  node?: string
  text: string
  tone?: 'info' | 'ok' | 'warn' | 'err'
}

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms))

function Studio() {
  const [wfId, setWfId] = useState(WORKFLOWS[0].id)
  const wf = WORKFLOWS.find((w) => w.id === wfId)!
  const [nodes, setNodes, onNodesChange] = useNodesState<StudioNodeType>(toNodes(wf))
  const [edges, setEdges, onEdgesChange] = useEdgesState<FlowEdgeType>(toEdges(wf))
  const [status, setStatus] = useState<Record<string, RunStatus>>({})
  const [skippedEdges, setSkippedEdges] = useState<Set<string>>(new Set())
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [running, setRunning] = useState(false)
  const [log, setLog] = useState<LogLine[]>([])
  const [libQuery, setLibQuery] = useState('')
  const [libOpen, setLibOpen] = useState(false)
  const runToken = useRef(0)
  const approval = useRef<((ok: boolean) => void) | null>(null)
  const startTime = useRef(0)
  const wrapRef = useRef<HTMLDivElement>(null)
  const logRef = useRef<HTMLOListElement>(null)
  const { screenToFlowPosition, fitView } = useReactFlow()
  const finePointer = useMediaQuery('(pointer: fine)')
  const wide = useMediaQuery('(min-width: 1024px)')

  // ── Workflow switching ───────────────────────────────
  const load = useCallback(
    (id: string) => {
      runToken.current++
      approval.current = null
      const next = WORKFLOWS.find((w) => w.id === id)!
      setWfId(id)
      setNodes(toNodes(next))
      setEdges(toEdges(next))
      setStatus({})
      setSkippedEdges(new Set())
      setSelectedId(null)
      setRunning(false)
      setLog([])
      requestAnimationFrame(() => fitView({ padding: 0.12, maxZoom: 1, duration: 500 }))
    },
    [setNodes, setEdges, fitView],
  )

  useEffect(() => {
    logRef.current?.scrollTo({ top: logRef.current.scrollHeight, behavior: 'smooth' })
  }, [log])

  const pushLog = (text: string, tone: LogLine['tone'] = 'info', node?: string) =>
    setLog((l) => [...l, { t: performance.now() - startTime.current, text, tone, node }])

  // ── Simulated execution engine ───────────────────────
  const run = async () => {
    const token = ++runToken.current
    const alive = () => runToken.current === token
    const ns = nodes
    const es = edges
    const byId = new Map(ns.map((n) => [n.id, n]))
    const incoming = new Map<string, string[]>()
    const outgoing = new Map<string, FlowEdgeType[]>()
    es.forEach((e) => {
      incoming.set(e.target, [...(incoming.get(e.target) ?? []), e.id])
      outgoing.set(e.source, [...(outgoing.get(e.source) ?? []), e])
    })
    const st: Record<string, RunStatus> = Object.fromEntries(ns.map((n) => [n.id, 'queued' as RunStatus]))
    const edgeState = new Map<string, 'pending' | 'fired' | 'skipped'>(es.map((e) => [e.id, 'pending']))
    const skippedSet = new Set<string>()
    startTime.current = performance.now()
    setRunning(true)
    setLog([])
    setStatus({ ...st })
    setSkippedEdges(new Set())
    pushLog(`Run started · ${wf.name}`, 'info')

    const roots = ns.filter((n) => !(incoming.get(n.id)?.length))
    if (!roots.length) {
      pushLog('No trigger found — add a trigger node to start the workflow.', 'err')
      setRunning(false)
      return
    }
    const disconnected = ns.filter((n) => n.data.kind !== 'trigger' && !(incoming.get(n.id)?.length))
    disconnected.forEach((n) => {
      st[n.id] = 'skipped'
      pushLog(`${n.data.title} is not connected — skipped`, 'warn', n.id)
    })

    const settle = (id: string, s: RunStatus) => {
      st[id] = s
      setStatus({ ...st })
    }
    const skipEdge = (eid: string) => {
      edgeState.set(eid, 'skipped')
      skippedSet.add(eid)
      setSkippedEdges(new Set(skippedSet))
    }

    let frontier = roots.filter((r) => r.data.kind === 'trigger').map((r) => r.id)
    if (!frontier.length) frontier = [roots[0].id]
    const visited = new Set<string>()

    while (frontier.length && alive()) {
      // run the current wave in parallel
      await Promise.all(
        frontier.map(async (id) => {
          visited.add(id)
          const n = byId.get(id)!
          const allSkipped = (incoming.get(id) ?? []).length > 0 && (incoming.get(id) ?? []).every((e) => edgeState.get(e) === 'skipped')
          if (allSkipped) {
            settle(id, 'skipped')
            ;(outgoing.get(id) ?? []).forEach((e) => skipEdge(e.id))
            return
          }
          settle(id, 'running')
          pushLog(`${n.data.title} · started`, 'info', id)
          await sleep(n.data.kind === 'trigger' ? 600 : 850 + Math.random() * 500)
          if (!alive()) return
          if (n.data.kind === 'human') {
            settle(id, 'waiting')
            setSelectedId(id)
            pushLog(`${n.data.title} · waiting for a decision`, 'warn', id)
            const ok = await new Promise<boolean>((res) => (approval.current = res))
            approval.current = null
            if (!alive()) return
            if (!ok) {
              settle(id, 'rejected')
              pushLog(`${n.data.title} · rejected — run stopped`, 'err', id)
              runToken.current++
              return
            }
          }
          settle(id, 'done')
          pushLog(`${n.data.output || `${n.data.title} · completed`}`, 'ok', id)
          ;(outgoing.get(id) ?? []).forEach((e) => {
            if (n.data.kind === 'condition') {
              const takes = n.data.takes ?? e.target
              if (e.target === takes) edgeState.set(e.id, 'fired')
              else skipEdge(e.id)
            } else edgeState.set(e.id, 'fired')
          })
        }),
      )
      if (!alive()) break
      // next wave: nodes whose inputs are all resolved
      const next = ns
        .filter((n) => !visited.has(n.id) && st[n.id] !== 'skipped')
        .filter((n) => {
          const ins = incoming.get(n.id) ?? []
          return ins.length > 0 && ins.every((e) => edgeState.get(e) !== 'pending')
        })
        .map((n) => n.id)
      frontier = next
    }

    const wasStopped = !alive()
    if (!wasStopped) {
      ns.forEach((n) => {
        if (st[n.id] === 'queued') st[n.id] = 'skipped'
      })
      setStatus({ ...st })
      const done = Object.values(st).filter((s) => s === 'done').length
      pushLog(`Run completed · ${done} steps executed in ${((performance.now() - startTime.current) / 1000).toFixed(1)}s (simulated)`, 'ok')
      runToken.current++
    }
    setRunning(false)
  }

  const stop = () => {
    runToken.current++
    approval.current?.(false)
    setRunning(false)
    pushLog('Run cancelled by user', 'warn')
    setStatus((s) => Object.fromEntries(Object.entries(s).map(([k, v]) => [k, v === 'running' || v === 'queued' || v === 'waiting' ? 'idle' : v])))
  }

  const reset = () => {
    runToken.current++
    approval.current = null
    setRunning(false)
    setStatus({})
    setSkippedEdges(new Set())
    setLog([])
  }

  // ── Derived view state ─────────────────────────────
  const viewNodes = useMemo(() => nodes.map((n) => ({ ...n, data: { ...n.data, status: status[n.id] ?? 'idle' } })), [nodes, status])
  const viewEdges = useMemo(
    () =>
      edges.map((e) => {
        const s = status[e.source]
        const t = status[e.target]
        const color = KIND_META[(nodes.find((n) => n.id === e.source)?.data.kind ?? 'agent') as NodeKind].color
        let state: 'idle' | 'active' | 'done' | 'skipped' = 'idle'
        if (skippedEdges.has(e.id)) state = 'skipped'
        else if (s === 'done' && (t === 'running' || t === 'queued')) state = t === 'running' ? 'active' : 'done'
        else if (s === 'done' && (t === 'done' || t === 'waiting' || t === 'rejected')) state = 'done'
        return { ...e, data: { state, color } }
      }),
    [edges, status, skippedEdges, nodes],
  )

  const onConnect = useCallback((c: Connection) => setEdges((es) => addEdge({ ...c, type: 'flow' }, es)), [setEdges])

  const addNode = (kind: NodeKind, title: string, subtitle: string, position?: { x: number; y: number }) => {
    const id = `n${Date.now().toString(36)}`
    let pos = position
    if (!pos) {
      const r = wrapRef.current!.getBoundingClientRect()
      pos = screenToFlowPosition({ x: r.left + r.width / 2, y: r.top + r.height / 2 })
    }
    const data: StudioNodeData = { kind, title, subtitle, config: [{ label: 'Status', value: 'Not configured' }], output: `${title} · completed` }
    setNodes((ns) => [...ns.map((n) => ({ ...n, selected: false })), { id, type: 'studio', position: pos!, data, selected: true }])
    setSelectedId(id)
    setLibOpen(false)
  }

  const onDragStart = (e: DragEvent, i: number) => {
    e.dataTransfer.setData('application/x-aib-node', String(i))
    e.dataTransfer.effectAllowed = 'move'
  }
  const onDrop = (e: DragEvent) => {
    e.preventDefault()
    const i = e.dataTransfer.getData('application/x-aib-node')
    if (i === '') return
    const item = NODE_LIBRARY[Number(i)]
    addNode(item.kind, item.title, item.subtitle, screenToFlowPosition({ x: e.clientX - 98, y: e.clientY - 30 }))
  }

  const selected = viewNodes.find((n) => n.id === selectedId) ?? null
  const updateTitle = (title: string) =>
    setNodes((ns) => ns.map((n) => (n.id === selectedId ? { ...n, data: { ...n.data, title } } : n)))
  const deleteSelected = () => {
    if (!selectedId) return
    setNodes((ns) => ns.filter((n) => n.id !== selectedId))
    setEdges((es) => es.filter((e) => e.source !== selectedId && e.target !== selectedId))
    setSelectedId(null)
  }

  const filtered = NODE_LIBRARY.map((n, i) => ({ ...n, i })).filter((n) =>
    `${n.title} ${n.subtitle} ${n.group}`.toLowerCase().includes(libQuery.toLowerCase()),
  )
  const groups = [...new Set(filtered.map((f) => f.group))]
  const waitingNode = viewNodes.find((n) => n.data.status === 'waiting')
  const doneCount = Object.values(status).filter((s) => s === 'done').length

  return (
    <div className="overflow-hidden rounded-[20px] border border-line-strong bg-ink-900 shadow-[0_60px_120px_-40px_rgba(0,0,0,.9),0_0_0_1px_rgba(255,255,255,.02)]">
      {/* ── Window chrome / toolbar ─────────────────── */}
      <div className="flex flex-wrap items-center gap-3 border-b border-line bg-ink-850 px-3 py-2.5 sm:px-4">
        <div className="hidden items-center gap-1.5 sm:flex" aria-hidden="true">
          <span className="size-2.5 rounded-full bg-white/10" />
          <span className="size-2.5 rounded-full bg-white/10" />
          <span className="size-2.5 rounded-full bg-white/10" />
        </div>
        <div className="flex items-center gap-1.5 font-mono text-[11px] text-muted">
          <span className="text-fg-soft">Workflow Studio</span>
          <ChevronRight size={12} />
          <span className="text-fg">{wf.name}</span>
        </div>
        <div className="ml-auto flex items-center gap-2">
          <span className="hidden font-mono text-[10.5px] text-faint md:inline">Simulated run · runs in your browser</span>
          <button
            type="button"
            onClick={reset}
            disabled={running}
            className="inline-flex h-8 items-center gap-1.5 rounded-lg border border-line px-2.5 text-[12px] text-fg-soft transition-colors hover:text-fg disabled:opacity-40"
          >
            <RotateCcw size={13} /> Reset
          </button>
          {running ? (
            <button type="button" onClick={stop} className="inline-flex h-8 items-center gap-1.5 rounded-lg bg-danger/15 px-3 text-[12px] font-medium text-danger">
              <Square size={12} /> Stop
            </button>
          ) : (
            <button
              type="button"
              onClick={run}
              className="inline-flex h-8 items-center gap-1.5 rounded-lg bg-cyan px-3 text-[12px] font-medium text-ink-950 transition-colors hover:bg-[#6fe2f0]"
            >
              <Play size={12} fill="currentColor" /> Run workflow
            </button>
          )}
        </div>
      </div>

      {/* workflow tabs */}
      <div role="tablist" aria-label="Example workflows" className="flex gap-1 overflow-x-auto border-b border-line px-3 py-2 sm:px-4">
        {WORKFLOWS.map((w) => (
          <button
            key={w.id}
            role="tab"
            aria-selected={w.id === wfId}
            type="button"
            onClick={() => load(w.id)}
            className={`shrink-0 rounded-lg px-3 py-1.5 text-[12.5px] transition-colors ${
              w.id === wfId ? 'bg-white/[0.07] text-fg' : 'text-muted hover:text-fg-soft'
            }`}
          >
            {w.name}
          </button>
        ))}
      </div>

      <div className="relative grid lg:grid-cols-[220px_1fr_280px]">
        {/* ── Node library ─────────────────────────── */}
        <aside
          className={`${libOpen ? 'block' : 'hidden'} absolute inset-y-0 left-0 z-20 w-[240px] border-r border-line bg-ink-850 lg:static lg:block lg:w-auto`}
          aria-label="Node library"
        >
          <div className="p-3">
            <label className="flex items-center gap-2 rounded-lg border border-line bg-ink-900 px-2.5 py-1.5">
              <Search size={13} className="text-faint" />
              <input
                value={libQuery}
                onChange={(e) => setLibQuery(e.target.value)}
                placeholder="Search nodes"
                aria-label="Search nodes"
                className="w-full bg-transparent text-[12px] text-fg placeholder:text-faint focus:outline-none"
              />
            </label>
          </div>
          <div className="max-h-[520px] overflow-y-auto px-2 pb-3">
            {groups.map((g) => (
              <div key={g} className="mb-2">
                <p className="px-2 py-1.5 font-mono text-[9.5px] uppercase tracking-[0.16em] text-faint">{g}</p>
                {filtered
                  .filter((f) => f.group === g)
                  .map((item) => {
                    const Icon = KIND_ICON[item.kind]
                    const c = KIND_META[item.kind].color
                    return (
                      <button
                        key={item.i}
                        type="button"
                        draggable
                        onDragStart={(e) => onDragStart(e, item.i)}
                        onClick={() => addNode(item.kind, item.title, item.subtitle)}
                        className="group flex w-full cursor-grab items-center gap-2.5 rounded-lg px-2 py-1.5 text-left transition-colors hover:bg-white/[0.04] active:cursor-grabbing"
                        title="Drag onto the canvas or click to add"
                      >
                        <span className="grid size-6 shrink-0 place-items-center rounded-md" style={{ background: `${c}1a`, color: c }}>
                          <Icon size={12} />
                        </span>
                        <span className="min-w-0 flex-1">
                          <span className="block truncate text-[12px] text-fg-soft group-hover:text-fg">{item.title}</span>
                          <span className="block truncate text-[10.5px] text-faint">{item.subtitle}</span>
                        </span>
                        <Plus size={12} className="text-faint opacity-0 group-hover:opacity-100" />
                      </button>
                    )
                  })}
              </div>
            ))}
            {!filtered.length && <p className="px-2 text-[12px] text-faint">No nodes match “{libQuery}”.</p>}
          </div>
        </aside>

        {/* ── Canvas ───────────────────────────────── */}
        <div ref={wrapRef} className="studio-flow relative h-[400px] sm:h-[540px] lg:h-auto lg:min-h-[600px]" onDragOver={(e) => e.preventDefault()} onDrop={onDrop}>
          <ReactFlow<StudioNodeType, FlowEdgeType>
            nodes={viewNodes}
            edges={viewEdges}
            nodeTypes={nodeTypes}
            edgeTypes={edgeTypes}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            onNodeClick={(_, n) => setSelectedId(n.id)}
            onPaneClick={() => setSelectedId(null)}
            fitView
            fitViewOptions={{ padding: 0.12, maxZoom: 1 }}
            minZoom={0.3}
            maxZoom={1.6}
            zoomOnScroll={false}
            zoomOnPinch
            panOnScroll={false}
            preventScrolling={false}
            panOnDrag={finePointer}
            nodesDraggable={!running}
            colorMode="dark"
            attributionPosition="bottom-center"
          >
            <Background variant={BackgroundVariant.Dots} gap={22} size={1} color="#26324a" />
            <Controls showInteractive={false} position="bottom-left" />
            {wide && (
              <MiniMap
                position="bottom-right"
                pannable
                zoomable
                maskColor="rgba(4,6,11,.7)"
                nodeColor={(n) => KIND_META[(n.data as StudioNodeData).kind].color}
                nodeStrokeWidth={0}
                style={{ width: 150, height: 96 }}
              />
            )}
          </ReactFlow>
          <button
            type="button"
            onClick={() => setLibOpen((o) => !o)}
            className="absolute left-3 top-3 z-10 inline-flex h-8 items-center gap-1.5 rounded-lg border border-line bg-ink-850 px-2.5 text-[12px] text-fg-soft lg:hidden"
            aria-expanded={libOpen}
          >
            {libOpen ? <X size={13} /> : <Plus size={13} />} Nodes
          </button>
          {/* run progress */}
          {(running || doneCount > 0) && (
            <div className="pointer-events-none absolute right-3 top-3 z-10 rounded-lg border border-line bg-ink-850/90 px-3 py-2 font-mono text-[10.5px] text-fg-soft backdrop-blur">
              <span className="flex items-center gap-2">
                <CircleDot size={11} className={running ? 'text-cyan pulse-dot' : 'text-leaf'} />
                {running ? 'Executing' : 'Last run'} · {doneCount}/{nodes.length} steps
              </span>
            </div>
          )}
        </div>

        {/* ── Inspector ─────────────────────────────── */}
        <aside className="border-t border-line bg-ink-850 lg:border-l lg:border-t-0" aria-label="Node inspector">
          {waitingNode ? (
            <div className="border-b border-line bg-amber/[0.06] p-4">
              <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-amber">Approval required</p>
              <p className="mt-2 text-[13px] text-fg">{waitingNode.data.title}</p>
              <p className="mt-1 text-[12px] leading-relaxed text-muted">The run is paused. Review the context and decide whether it may continue.</p>
              <div className="mt-3 flex gap-2">
                <button type="button" onClick={() => approval.current?.(true)} className="inline-flex h-8 flex-1 items-center justify-center gap-1.5 rounded-lg bg-leaf/90 text-[12px] font-medium text-ink-950">
                  <Check size={13} /> Approve
                </button>
                <button type="button" onClick={() => approval.current?.(false)} className="inline-flex h-8 flex-1 items-center justify-center gap-1.5 rounded-lg border border-danger/40 text-[12px] text-danger">
                  <X size={13} /> Reject
                </button>
              </div>
            </div>
          ) : null}
          {selected ? (
            <div className="p-4">
              <div className="flex items-center justify-between">
                <span className="font-mono text-[10px] uppercase tracking-[0.14em]" style={{ color: KIND_META[selected.data.kind].color }}>
                  {KIND_META[selected.data.kind].label}
                </span>
                <span className="font-mono text-[10px] text-faint">id: {selected.id}</span>
              </div>
              <label className="mt-3 block">
                <span className="text-[11px] text-muted">Name</span>
                <input
                  value={selected.data.title}
                  onChange={(e) => updateTitle(e.target.value)}
                  className="mt-1 w-full rounded-lg border border-line bg-ink-900 px-2.5 py-1.5 text-[13px] text-fg focus:border-cyan/50 focus:outline-none"
                />
              </label>
              <dl className="mt-4 space-y-2">
                {selected.data.config.map((c) => (
                  <div key={c.label} className="flex items-start justify-between gap-3 rounded-lg border border-line bg-ink-900/60 px-2.5 py-1.5">
                    <dt className="text-[11px] text-muted">{c.label}</dt>
                    <dd className="text-right font-mono text-[11px] text-fg-soft">{c.value}</dd>
                  </div>
                ))}
              </dl>
              <div className="mt-4">
                <p className="text-[11px] text-muted">Last output</p>
                <p className="mt-1 rounded-lg border border-line bg-ink-950 px-2.5 py-2 font-mono text-[11px] leading-relaxed text-fg-soft">
                  {selected.data.status === 'done' ? selected.data.output : selected.data.status === 'skipped' ? 'Branch not taken in this run' : 'Run the workflow to see output'}
                </p>
              </div>
              <button type="button" onClick={deleteSelected} disabled={running} className="mt-4 text-[11.5px] text-muted underline-offset-4 hover:text-danger hover:underline disabled:opacity-40">
                Remove node
              </button>
            </div>
          ) : (
            !waitingNode && (
              <div className="p-4">
                <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-faint">Inspector</p>
                <p className="mt-3 text-[13px] leading-relaxed text-fg-soft">{wf.description}</p>
                <ul className="mt-4 space-y-1.5 text-[12px] text-muted">
                  <li>• Select a node to inspect its configuration</li>
                  <li>• {finePointer ? "Drag nodes from the library onto the canvas" : "Tap + Nodes to add steps to the canvas"}</li>
                  <li>• Connect handles to create new edges</li>
                  <li>• Press Run to simulate execution</li>
                </ul>
              </div>
            )
          )}
          {/* execution log */}
          <div className="border-t border-line">
            <p className="px-4 pt-3 font-mono text-[10px] uppercase tracking-[0.14em] text-faint">Execution history</p>
            <ol ref={logRef} className="max-h-[180px] space-y-1 overflow-y-auto px-4 pb-4 pt-2 font-mono text-[10.5px] leading-relaxed" aria-live="polite">
              {log.length === 0 && <li className="text-faint">No runs yet.</li>}
              {log.map((l, i) => (
                <li key={i} className="flex gap-2">
                  <span className="shrink-0 text-faint">{(l.t / 1000).toFixed(1).padStart(4, '0')}s</span>
                  <span className={l.tone === 'ok' ? 'text-leaf' : l.tone === 'warn' ? 'text-amber' : l.tone === 'err' ? 'text-danger' : 'text-fg-soft'}>{l.text}</span>
                </li>
              ))}
            </ol>
          </div>
        </aside>
      </div>
    </div>
  )
}

/** Interactive, fully client-side demonstration of the Workflow Studio. */
export default function StudioDemo() {
  return (
    <ReactFlowProvider>
      <Studio />
    </ReactFlowProvider>
  )
}
