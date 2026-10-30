import { lazy, Suspense, useEffect, useRef } from 'react'
import { Link } from 'react-router'
import { Button } from '../ui/Button'
import { gsap, prefersReducedMotion } from '../../lib/gsap'

const HeroCanvas = lazy(() => import('./HeroCanvas'))

const STRIP = [
  { label: 'Workflow Studio', to: '/workflow-studio', tag: 'Primary' },
  { label: 'AI Agents', to: '/ai-agents' },
  { label: 'Model Orchestration', to: '/ai-orchestration' },
  { label: 'GPU Cloud', to: '/gpu-cloud' },
  { label: 'Custom AI', to: '/custom-ai-development' },
]

export function Hero() {
  const root = useRef<HTMLElement>(null)

  useEffect(() => {
    const el = root.current
    if (!el) return
    if (prefersReducedMotion()) {
      el.classList.add('reveal-done')
      return
    }
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: 'expo.out' } })
      tl.from('[data-h="eyebrow"]', { y: 12, opacity: 0, duration: 1 }, 0.2)
        .from('.line-mask > span', { yPercent: 110, duration: 1.3, stagger: 0.09 }, 0.3)
        .from('[data-h="lead"]', { y: 16, opacity: 0, duration: 1.1 }, 0.8)
        .from('[data-h="cta"] > *', { y: 14, opacity: 0, duration: 1, stagger: 0.08 }, 0.95)
        .from('[data-h="strip"] > *', { y: 10, opacity: 0, duration: 0.9, stagger: 0.05 }, 1.15)
        .from('[data-h="meta"]', { opacity: 0, duration: 1.2 }, 1.3)
    }, el)
    return () => ctx.revert()
  }, [])

  return (
    <section ref={root} aria-labelledby="hero-title" className="noise relative isolate flex min-h-[100svh] flex-col overflow-hidden">
      {/* Atmosphere */}
      <div className="absolute inset-0 -z-10" aria-hidden="true">
        <div className="absolute inset-0 bg-[radial-gradient(80%_60%_at_72%_42%,rgba(46,92,170,.22),transparent_60%),radial-gradient(50%_40%_at_85%_80%,rgba(47,185,166,.10),transparent_70%),radial-gradient(40%_30%_at_12%_8%,rgba(224,154,82,.06),transparent_70%)]" />
        <div className="grid-bg absolute inset-0 opacity-60 [mask-image:radial-gradient(70%_60%_at_60%_45%,black,transparent)]" />
        <div className="jaali absolute inset-y-0 left-0 w-1/2 opacity-[0.035] [mask-image:linear-gradient(90deg,black,transparent)]" />
      </div>

      <div className="absolute inset-0 -z-10">
        <Suspense fallback={null}>
          <HeroCanvas />
        </Suspense>
      </div>
      {/* Legibility veil behind the headline on small screens */}
      <div className="pointer-events-none absolute inset-0 -z-10 bg-gradient-to-r from-ink-950/80 via-ink-950/30 to-transparent md:from-ink-950/70 md:via-transparent" aria-hidden="true" />

      <div className="container-x relative flex flex-1 flex-col justify-center pb-16 pt-32 md:pt-36">
        <div className="max-w-[50rem]">
          <p data-h="eyebrow" className="eyebrow">
            The unified AI platform
          </p>
          <h1 id="hero-title" className="display mt-7 text-[clamp(2.6rem,5.6vw,5.3rem)] text-fg">
            <span className="line-mask">
              <span>Everything you need</span>
            </span>
            <span className="line-mask">
              <span>
                to <span className="serif-accent text-gradient pr-2">build, deploy</span>
              </span>
            </span>
            <span className="line-mask">
              <span>&amp; orchestrate AI.</span>
            </span>
          </h1>
          <p data-h="lead" className="mt-8 max-w-xl text-[1.08rem] leading-relaxed text-fg-soft">
            From GPU computing and multi-model orchestration to intelligent workflows and enterprise AI systems — build your entire AI
            ecosystem with AI Bharat.
          </p>
          <div data-h="cta" className="mt-10 flex flex-wrap items-center gap-3">
            <Button to="/workflow-studio">Explore Workflow Studio</Button>
            <Button to="/build-with-us" variant="secondary">
              Build Your AI Solution
            </Button>
          </div>
        </div>
      </div>

      {/* Capability strip */}
      <div data-h="meta" className="container-x relative pb-8">
        <div className="hairline mb-5 opacity-50" />
        <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
          <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-muted">
            Infrastructure <span className="text-saffron/70">·</span> Intelligence <span className="text-teal/80">·</span> Automation
          </p>
          <nav aria-label="Platform capabilities" data-h="strip" className="flex flex-wrap gap-2">
            {STRIP.map((s) => (
              <Link
                key={s.to}
                to={s.to}
                className="group inline-flex items-center gap-2 rounded-full border border-line bg-ink-900/40 px-3.5 py-1.5 text-[12.5px] text-fg-soft backdrop-blur-sm transition-colors hover:border-line-strong hover:text-fg"
              >
                {s.tag && <span className="size-1.5 rounded-full bg-cyan pulse-dot" />}
                {s.label}
              </Link>
            ))}
          </nav>
        </div>
      </div>
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-b from-transparent to-ink-950" aria-hidden="true" />
    </section>
  )
}
