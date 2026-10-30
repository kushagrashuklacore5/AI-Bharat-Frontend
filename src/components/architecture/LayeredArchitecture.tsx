import { useCallback, useEffect, useRef, useState } from 'react'
import { useLocation, useNavigate } from 'react-router'
import { ArrowUpRight, MousePointerClick } from 'lucide-react'
import { flushSync } from 'react-dom'
import { LAYERS, type LayerId } from '../../lib/layers'
import { LayerSlab } from './LayerSlab'
import { ScrollTrigger } from '../../lib/gsap'
import { useMediaQuery } from '../../hooks/useMediaQuery'
import { useReducedMotion } from '../../hooks/useReducedMotion'

const clamp = (v: number, a = 0, b = 1) => Math.min(b, Math.max(a, v))

/**
 * Signature component: an exploded, extruded 3D stack of the AI Bharat
 * architecture with linked descriptions, connectors, scroll assembly and
 * click-through into each layer's detail view.
 */
export function LayeredArchitecture() {
  const location = useLocation()
  const navigate = useNavigate()
  const desktop = useMediaQuery('(min-width: 1024px) and (hover: hover)')
  const reduced = useReducedMotion()

  const initial = (location.state as { layer?: LayerId } | null)?.layer ?? null
  const [active, setActive] = useState<LayerId | null>(initial)
  const [selected, setSelected] = useState<LayerId>(initial ?? 'orchestration') // mobile tap selection
  const [leaving, setLeaving] = useState<LayerId | null>(null)

  const rootRef = useRef<HTMLDivElement>(null)
  const stageRef = useRef<HTMLDivElement>(null)
  const slabRefs = useRef<(HTMLDivElement | null)[]>([])
  const anchorRefs = useRef<(HTMLDivElement | null)[]>([])
  const itemRefs = useRef<(HTMLElement | null)[]>([])
  const dotRefs = useRef<(HTMLSpanElement | null)[]>([])
  const pathRefs = useRef<(SVGPathElement | null)[]>([])
  const pulseRef = useRef<SVGCircleElement>(null)
  const progress = useRef(reduced ? 1 : 0)
  const activeRef = useRef<LayerId | null>(active)
  activeRef.current = active

  const focus = desktop ? active : selected

  // ── Scroll-driven assembly: one progress value drives slabs, connectors & copy
  useEffect(() => {
    const stage = stageRef.current
    if (!stage) return
    if (reduced) {
      progress.current = 1
      return
    }
    const st = ScrollTrigger.create({
      trigger: stage,
      start: 'top 88%',
      end: 'center 52%',
      scrub: 0.8,
      onUpdate: (self) => (progress.current = self.progress),
    })
    return () => st.kill()
  }, [reduced, desktop])

  // ── Per-frame layout: apply progress + draw connectors to projected slab anchors
  const tick = useCallback(() => {
    const root = rootRef.current
    if (!root) return
    const p = progress.current
    const box = root.getBoundingClientRect()
    const n = LAYERS.length
    LAYERS.forEach((layer, i) => {
      // assemble from the foundation (compute) upwards
      const order = n - 1 - i
      const enter = clamp((p - order * 0.09) / 0.45)
      const e = 1 - Math.pow(1 - enter, 3)
      const slab = slabRefs.current[i]
      if (slab) {
        slab.style.setProperty('--enter', e.toFixed(4))
        slab.style.setProperty('--fade', clamp(enter * 1.6).toFixed(3))
      }
      const item = itemRefs.current[i]
      const textIn = clamp((p - 0.25 - i * 0.07) / 0.3)
      if (item) {
        item.style.opacity = String(textIn)
        item.style.transform = `translateX(${(1 - textIn) * 24}px)`
      }
      const path = pathRefs.current[i]
      const a = anchorRefs.current[i]
      const d = dotRefs.current[i]
      if (path && a && d && desktop) {
        const ar = a.getBoundingClientRect()
        const dr = d.getBoundingClientRect()
        const ax = ar.left + ar.width / 2 - box.left
        const ay = ar.top + ar.height / 2 - box.top
        const dx = dr.left + dr.width / 2 - box.left
        const dy = dr.top + dr.height / 2 - box.top
        const mx = ax + (dx - ax) * 0.55
        path.setAttribute('d', `M${ax.toFixed(1)} ${ay.toFixed(1)} C${mx.toFixed(1)} ${ay.toFixed(1)} ${mx.toFixed(1)} ${dy.toFixed(1)} ${dx.toFixed(1)} ${dy.toFixed(1)}`)
        const draw = clamp((p - 0.35 - i * 0.06) / 0.3)
        path.style.strokeDashoffset = String(1 - draw)
        if (layer.id === activeRef.current && pulseRef.current) {
          const len = path.getTotalLength()
          const t = (performance.now() / 1600) % 1
          const pt = path.getPointAtLength(len * t)
          pulseRef.current.setAttribute('cx', pt.x.toFixed(1))
          pulseRef.current.setAttribute('cy', pt.y.toFixed(1))
          pulseRef.current.style.opacity = draw > 0.95 ? '1' : '0'
        }
      }
    })
    if (!activeRef.current && pulseRef.current) pulseRef.current.style.opacity = '0'
  }, [desktop])

  useEffect(() => {
    const root = rootRef.current
    if (!root) return
    let raf = 0
    let visible = false
    const loop = () => {
      tick()
      if (visible) raf = requestAnimationFrame(loop)
    }
    const io = new IntersectionObserver(([e]) => {
      visible = e.isIntersecting
      cancelAnimationFrame(raf)
      if (visible) raf = requestAnimationFrame(loop)
    })
    io.observe(root)
    tick()
    return () => {
      io.disconnect()
      cancelAnimationFrame(raf)
    }
  }, [tick])

  const open = (id: LayerId) => {
    const go = () => navigate(`/architecture/${id}`, { viewTransition: true })
    // name the outgoing slab so the browser morphs it into the detail header
    flushSync(() => setLeaving(id))
    go()
  }

  const onItemActivate = (id: LayerId) => {
    if (desktop) open(id)
    else setSelected(id)
  }

  const size = desktop ? 300 : 210
  const gap = desktop ? 68 : 40

  return (
    <div ref={rootRef} className="relative">
      <div className="grid items-center gap-10 lg:grid-cols-[1.15fr_1fr] lg:gap-6">
        {/* ── 3D stage ─────────────────────────── */}
        <div
          ref={stageRef}
          className="relative mx-auto h-[500px] w-full max-w-[640px] [perspective:2000px] sm:h-[540px] lg:h-[700px]"
          onMouseLeave={() => desktop && setActive(null)}
        >
          {/* floor glow */}
          <div className="pointer-events-none absolute left-1/2 top-[72%] h-40 w-[80%] -translate-x-1/2 rounded-[50%] bg-[radial-gradient(closest-side,rgba(69,211,230,.12),transparent)] blur-2xl" />
          <div
            className="absolute left-1/2 top-[50%] [transform-style:preserve-3d]"
            style={{
              width: size,
              height: size,
              marginLeft: -size / 2,
              marginTop: -size / 2 + (desktop ? 100 : 140),
              transform: 'rotateX(58deg) rotateZ(-40deg)',
            }}
          >
            {LAYERS.map((layer, i) => {
              const state = focus === null ? 'idle' : focus === layer.id ? 'active' : 'dim'
              const z = (LAYERS.length - 1 - i) * gap
              const lift = state === 'active' ? 30 : 0
              return (
                <div
                  key={layer.id}
                  ref={(el) => {
                    slabRefs.current[i] = el
                  }}
                  className="absolute inset-0 cursor-pointer [transform-style:preserve-3d]"
                  style={{
                    // --enter is driven per frame by scroll progress
                    transform: `translateZ(calc(${z + lift}px + (1 - var(--enter, 1)) * ${180 + i * 30}px)) scale(${state === 'active' ? 1.04 : 1})`,
                    transition: 'transform .6s cubic-bezier(.16,1,.3,1)',
                  }}
                  onMouseEnter={() => desktop && setActive(layer.id)}
                  onClick={() => (desktop ? open(layer.id) : setSelected(layer.id))}
                  aria-hidden="true"
                >
                  <LayerSlab
                    layer={layer}
                    size={size}
                    state={state}
                    faceStyle={leaving === layer.id ? { viewTransitionName: 'layer-hero' } : undefined}
                  />
                  {/* connector anchor at the slab's outer (right-most) corner */}
                  <div
                    ref={(el) => {
                      anchorRefs.current[i] = el
                    }}
                    className="absolute bottom-0 right-0 size-1"
                  />
                </div>
              )
            })}
          </div>

          {/* hover caption on the stage */}
          {desktop && (
            <div className="pointer-events-none absolute bottom-2 left-0 flex items-center gap-2 font-mono text-[11px] text-muted">
              <MousePointerClick size={14} />
              {active ? (
                <span>
                  <span style={{ color: LAYERS.find((l) => l.id === active)?.accent }}>{LAYERS.find((l) => l.id === active)?.name}</span> — click to
                  explore the layer
                </span>
              ) : (
                <span>Hover a layer or a description · click to explore</span>
              )}
            </div>
          )}
        </div>

        {/* ── Descriptions ─────────────────────── */}
        <ol className="relative z-10 space-y-1.5" aria-label="Architecture layers">
          {LAYERS.map((layer, i) => {
            const isFocus = focus === layer.id
            const isDim = focus !== null && !isFocus
            return (
              <li
                key={layer.id}
                ref={(el) => {
                  itemRefs.current[i] = el
                }}
              >
                <div
                  className={`group relative rounded-2xl border transition-all duration-500 ${
                    isFocus ? 'border-line-strong bg-white/[0.035]' : 'border-transparent'
                  } ${isDim ? 'opacity-45' : 'opacity-100'}`}
                  onMouseEnter={() => desktop && setActive(layer.id)}
                  onMouseLeave={() => desktop && setActive(null)}
                >
                  <button
                    type="button"
                    className="flex w-full items-start gap-4 px-4 py-3.5 text-left sm:px-5"
                    onFocus={() => desktop && setActive(layer.id)}
                    onBlur={() => desktop && setActive(null)}
                    onClick={() => onItemActivate(layer.id)}
                    aria-expanded={!desktop ? isFocus : undefined}
                    aria-label={desktop ? `${layer.name}: open layer details` : undefined}
                  >
                    <span
                      ref={(el) => {
                        dotRefs.current[i] = el
                      }}
                      className="mt-[7px] size-2 shrink-0 rounded-full border transition-all duration-500"
                      style={{
                        borderColor: layer.accent,
                        background: isFocus ? layer.accent : 'transparent',
                        boxShadow: isFocus ? `0 0 14px ${layer.accent}` : 'none',
                      }}
                    />
                    <span className="min-w-0 flex-1">
                      <span className="flex items-baseline gap-3">
                        <span className="font-mono text-[11px] text-faint">{layer.index}</span>
                        <span
                          className="font-mono text-[12px] uppercase tracking-[0.14em] transition-colors"
                          style={{ color: isFocus ? layer.accent : 'var(--color-fg)' }}
                        >
                          {layer.name}
                        </span>
                      </span>
                      <span className="mt-1.5 block text-[14.5px] leading-relaxed text-fg-soft">{layer.description}</span>
                      <span
                        className={`grid transition-all duration-500 ${isFocus ? 'mt-3 grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}
                      >
                        <span className="overflow-hidden">
                          <span className="block border-l pl-3 text-[13px] leading-relaxed text-muted" style={{ borderColor: `${layer.accent}66` }}>
                            {layer.summary}
                          </span>
                          {desktop && (
                            <span className="mt-3 inline-flex items-center gap-1 text-[12.5px]" style={{ color: layer.accent }}>
                              Explore layer <ArrowUpRight size={14} />
                            </span>
                          )}
                        </span>
                      </span>
                    </span>
                  </button>
                  {!desktop && isFocus && (
                    <div className="px-4 pb-4 pl-10 sm:px-5 sm:pl-11">
                      <button
                        type="button"
                        onClick={() => open(layer.id)}
                        className="inline-flex h-10 items-center gap-1.5 rounded-full border px-4 text-[13px]"
                        style={{ borderColor: `${layer.accent}66`, color: layer.accent }}
                      >
                        Explore {layer.short.toLowerCase()} layer <ArrowUpRight size={14} />
                      </button>
                    </div>
                  )}
                </div>
              </li>
            )
          })}
        </ol>
      </div>

      {/* connectors */}
      {desktop && (
        <svg className="pointer-events-none absolute inset-0 h-full w-full overflow-visible" aria-hidden="true">
          {LAYERS.map((layer, i) => {
            const isFocus = active === layer.id
            return (
              <path
                key={layer.id}
                ref={(el) => {
                  pathRefs.current[i] = el
                }}
                pathLength={1}
                fill="none"
                stroke={isFocus ? layer.accent : 'rgba(148,170,210,.22)'}
                strokeWidth={isFocus ? 1.5 : 1}
                strokeDasharray="1"
                style={{
                  opacity: active && !isFocus ? 0.25 : 1,
                  transition: 'stroke .4s, opacity .4s',
                  filter: isFocus ? `drop-shadow(0 0 4px ${layer.accent})` : undefined,
                }}
              />
            )
          })}
          <circle ref={pulseRef} r="3" fill="#fff" style={{ opacity: 0, filter: 'drop-shadow(0 0 6px #45d3e6)' }} />
        </svg>
      )}
    </div>
  )
}
