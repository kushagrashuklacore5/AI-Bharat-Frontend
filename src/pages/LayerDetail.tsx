import { useEffect, useRef } from 'react'
import { Link, useNavigate, useParams } from 'react-router'
import { ArrowLeft, ArrowRight, Check } from 'lucide-react'
import { LAYERS, getLayer } from '../lib/layers'
import { LayerSlab } from '../components/architecture/LayerSlab'
import { useReveal } from '../hooks/useReveal'
import { Button } from '../components/ui/Button'
import NotFound from './NotFound'

export default function LayerDetail() {
  const { layerId } = useParams()
  const layer = getLayer(layerId)
  const navigate = useNavigate()
  const ref = useRef<HTMLDivElement>(null)
  useReveal(ref)

  const back = () => navigate('/#architecture', { state: { layer: layer?.id }, viewTransition: true })

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && back()
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  })

  useEffect(() => {
    if (layer) document.title = `${layer.name} — AI Bharat Architecture`
  }, [layer])

  if (!layer) return <NotFound />
  const i = LAYERS.indexOf(layer)
  const prev = LAYERS[(i - 1 + LAYERS.length) % LAYERS.length]
  const next = LAYERS[(i + 1) % LAYERS.length]

  return (
    <div ref={ref} key={layer.id} className="relative overflow-x-clip">
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-[900px]"
        style={{ background: `radial-gradient(60% 50% at 75% 30%, ${layer.accent}1f, transparent 70%)` }}
        aria-hidden="true"
      />
      {/* ── Header ───────────────────────────── */}
      <section className="container-x relative grid min-h-[88vh] items-center gap-10 pb-16 pt-32 lg:grid-cols-[1.1fr_1fr]">
        <div>
          <button
            type="button"
            onClick={back}
            className="group inline-flex items-center gap-2 rounded-full border border-line px-3.5 py-1.5 text-[12.5px] text-fg-soft transition-colors hover:border-line-strong hover:text-fg"
          >
            <ArrowLeft size={14} className="transition-transform group-hover:-translate-x-0.5" />
            Back to architecture <span className="font-mono text-[10px] text-faint">ESC</span>
          </button>
          <p data-reveal className="mt-10 font-mono text-[12px] uppercase tracking-[0.18em]" style={{ color: layer.accent }}>
            Layer {layer.index} / 06
          </p>
          <h1 data-reveal="1" className="display mt-4 text-[clamp(2.6rem,6vw,5.4rem)]">
            {layer.name}
          </h1>
          <p data-reveal="2" className="mt-6 max-w-xl text-lg leading-relaxed text-fg-soft">
            {layer.description}
          </p>
          <p data-reveal="3" className="mt-4 max-w-xl leading-relaxed text-muted">
            {layer.summary}
          </p>
          {/* layer position indicator */}
          <nav data-reveal="4" aria-label="Layers" className="mt-10 flex flex-wrap gap-1.5">
            {LAYERS.map((l) => (
              <Link
                key={l.id}
                to={`/architecture/${l.id}`}
                viewTransition
                aria-current={l.id === layer.id ? 'page' : undefined}
                className="rounded-full border px-3 py-1 font-mono text-[10.5px] uppercase tracking-[0.12em] transition-colors"
                style={
                  l.id === layer.id
                    ? { borderColor: `${l.accent}aa`, color: l.accent, background: `${l.accent}14` }
                    : { borderColor: 'var(--color-line)', color: 'var(--color-muted)' }
                }
              >
                {l.short}
              </Link>
            ))}
          </nav>
        </div>

        <div className="relative mx-auto h-[340px] w-full max-w-[520px] [perspective:1600px] sm:h-[440px]" aria-hidden="true">
          <div className="absolute left-1/2 top-1/2 [transform-style:preserve-3d]" style={{ width: 280, height: 280, margin: '-140px 0 0 -140px', transform: 'rotateX(56deg) rotateZ(-40deg)' }}>
            {/* faint ghost of the neighbouring layers */}
            <div className="absolute inset-0 rounded-[14px] border border-line" style={{ transform: 'translateZ(-70px)' }} />
            <div className="absolute inset-0 rounded-[14px] border border-line opacity-50" style={{ transform: 'translateZ(-140px)' }} />
            <div className="absolute inset-0 rounded-[14px] border border-line" style={{ transform: 'translateZ(70px)', opacity: 0.4 }} />
            <LayerSlab layer={layer} size={280} depth={18} state="active" faceStyle={{ viewTransitionName: 'layer-hero' }} />
          </div>
        </div>
      </section>

      {/* ── Execution flow ───────────────────── */}
      <section className="container-x relative pb-24" aria-labelledby="flow-title">
        <h2 id="flow-title" data-reveal className="eyebrow">
          How a request moves through this layer
        </h2>
        <ol data-reveal="1" className="mt-8 grid gap-px overflow-hidden rounded-2xl border border-line bg-line sm:grid-cols-3 lg:grid-cols-6">
          {layer.flow.map((step, k) => (
            <li key={step} className="relative bg-ink-900 p-5">
              <span className="font-mono text-[11px] text-faint">{String(k + 1).padStart(2, '0')}</span>
              <p className="mt-6 text-[15px] text-fg">{step}</p>
              <span className="absolute bottom-0 left-0 h-px" style={{ width: `${((k + 1) / layer.flow.length) * 100}%`, background: layer.accent, opacity: 0.6 }} />
            </li>
          ))}
        </ol>
      </section>

      {/* ── Capabilities ─────────────────────── */}
      <section className="container-x relative pb-24" aria-labelledby="cap-title">
        <div className="grid gap-12 lg:grid-cols-[0.8fr_2fr]">
          <h2 id="cap-title" data-reveal className="display text-3xl md:text-4xl">
            Capabilities
          </h2>
          <div className="grid gap-px overflow-hidden rounded-2xl border border-line bg-line md:grid-cols-2">
            {layer.capabilities.map((c, k) => (
              <article key={c.title} data-reveal={String(k)} className="bg-ink-900 p-7">
                <span className="font-mono text-[11px]" style={{ color: layer.accent }}>
                  {layer.index}.{k + 1}
                </span>
                <h3 className="mt-4 text-lg text-fg">{c.title}</h3>
                <p className="mt-3 text-[14.5px] leading-relaxed text-fg-soft/85">{c.body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ── Use cases / technologies / value ─────── */}
      <section className="container-x relative pb-28" aria-label="Use cases, technologies and business value">
        <div className="grid gap-6 lg:grid-cols-3">
          <div data-reveal className="panel p-7">
            <h2 className="eyebrow">Use cases</h2>
            <ul className="mt-6 space-y-5">
              {layer.useCases.map((u) => (
                <li key={u.title}>
                  <p className="text-fg">{u.title}</p>
                  <p className="mt-1 text-[14px] leading-relaxed text-muted">{u.body}</p>
                </li>
              ))}
            </ul>
          </div>
          <div data-reveal="1" className="panel p-7">
            <h2 className="eyebrow">Technologies</h2>
            <ul className="mt-6 flex flex-wrap gap-2">
              {layer.technologies.map((t) => (
                <li key={t} className="rounded-lg border border-line bg-ink-800 px-3 py-1.5 font-mono text-[12px] text-fg-soft">
                  {t}
                </li>
              ))}
            </ul>
          </div>
          <div data-reveal="2" className="panel p-7">
            <h2 className="eyebrow">Business value</h2>
            <ul className="mt-6 space-y-4">
              {layer.businessValue.map((v) => (
                <li key={v} className="flex gap-3 text-[14.5px] leading-relaxed text-fg-soft">
                  <Check size={16} className="mt-1 shrink-0" style={{ color: layer.accent }} />
                  {v}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-16 flex flex-col gap-4 border-t border-line pt-8 sm:flex-row sm:items-center sm:justify-between">
          <Link to={`/architecture/${prev.id}`} viewTransition className="group flex items-center gap-3 text-fg-soft hover:text-fg">
            <ArrowLeft size={16} className="transition-transform group-hover:-translate-x-1" />
            <span>
              <span className="block font-mono text-[10.5px] uppercase tracking-[0.14em] text-faint">Previous layer</span>
              {prev.name}
            </span>
          </Link>
          <Button to="/build-with-us" variant="secondary">
            Discuss this layer for your project
          </Button>
          <Link to={`/architecture/${next.id}`} viewTransition className="group flex items-center gap-3 text-right text-fg-soft hover:text-fg sm:flex-row-reverse">
            <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
            <span>
              <span className="block font-mono text-[10.5px] uppercase tracking-[0.14em] text-faint">Next layer</span>
              {next.name}
            </span>
          </Link>
        </div>
      </section>
    </div>
  )
}
