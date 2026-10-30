import { useEffect, useRef, useState } from 'react'
import { createHeroScene, hasWebGL } from './heroScene'
import { useReducedMotion } from '../../hooks/useReducedMotion'

const LABELS = [
  { k: 'Workflows', v: 'trigger → agent → action' },
  { k: 'Agents', v: 'delegate · verify · report' },
  { k: 'GPU compute', v: 'inference · fine-tuning' },
  { k: 'Model routing', v: 'task · cost · latency' },
]

/** WebGL hero canvas. Loaded lazily; pauses when off-screen or the tab is hidden. */
export default function HeroCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const labelRefs = useRef<(HTMLDivElement | null)[]>([])
  const reduced = useReducedMotion()
  const [failed, setFailed] = useState(false)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    if (!hasWebGL()) {
      setFailed(true)
      return
    }
    let api: ReturnType<typeof createHeroScene>
    try {
      api = createHeroScene(canvas, {
        reducedMotion: reduced,
        compact: window.innerWidth < 768,
        labels: labelRefs.current,
      })
    } catch {
      setFailed(true)
      return
    }
    setReady(true)
    let visible = true
    const sync = () => (visible && !document.hidden ? api.start() : api.stop())
    const io = new IntersectionObserver(([e]) => {
      visible = e.isIntersecting
      sync()
    })
    io.observe(canvas)
    document.addEventListener('visibilitychange', sync)
    sync()
    return () => {
      io.disconnect()
      document.removeEventListener('visibilitychange', sync)
      api.dispose()
    }
  }, [reduced])

  if (failed) return <StaticConstellation />

  return (
    <div className={`absolute inset-0 transition-opacity duration-[1600ms] ${ready ? 'opacity-100' : 'opacity-0'}`}>
      <canvas ref={canvasRef} className="block h-full w-full" aria-hidden="true" />
      <div className="pointer-events-none absolute inset-0 hidden md:block" aria-hidden="true">
        {LABELS.map((l, i) => (
          <div
            key={l.k}
            ref={(el) => {
              labelRefs.current[i] = el
            }}
            className="absolute left-0 top-0 opacity-0 will-change-transform"
          >
            <div className="ml-4 -mt-3 flex items-center gap-2 whitespace-nowrap">
              <span className="h-px w-6 bg-fg-soft/40" />
              <span className="rounded-md border border-line bg-ink-900/70 px-2 py-1 font-mono text-[10px] uppercase tracking-[0.14em] text-fg-soft backdrop-blur-sm">
                {l.k}
                <span className="ml-2 normal-case tracking-normal text-faint">{l.v}</span>
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

/** Shown when WebGL is unavailable — a static vector rendition of the same system. */
export function StaticConstellation() {
  const rings = [120, 175, 235]
  return (
    <svg viewBox="-300 -300 600 600" className="absolute right-[-10%] top-1/2 h-[90%] -translate-y-1/2 opacity-80 md:right-[2%]" aria-hidden="true">
      <defs>
        <radialGradient id="sc-core">
          <stop offset="0" stopColor="#e8f6ff" />
          <stop offset=".3" stopColor="#45d3e6" stopOpacity=".6" />
          <stop offset="1" stopColor="#5b8cff" stopOpacity="0" />
        </radialGradient>
      </defs>
      {rings.map((r, i) => (
        <ellipse key={r} rx={r} ry={r * 0.38} fill="none" stroke={['#45d3e6', '#5b8cff', '#2fb9a6'][i]} strokeOpacity=".3" transform={`rotate(${[-12, 8, -4][i]})`} />
      ))}
      {rings.flatMap((r, i) =>
        Array.from({ length: 6 + i * 2 }, (_, k) => {
          const a = (k / (6 + i * 2)) * Math.PI * 2
          return <circle key={`${i}-${k}`} cx={Math.cos(a) * r} cy={Math.sin(a) * r * 0.38} r="3.5" fill="#bfe9f5" transform={`rotate(${[-12, 8, -4][i]})`} />
        }),
      )}
      <circle r="70" fill="url(#sc-core)" />
    </svg>
  )
}
