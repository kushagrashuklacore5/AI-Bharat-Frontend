import { Section } from '../ui/Section'
import { Button } from '../ui/Button'

interface Props {
  title?: string
  body?: string
}

export function FinalCta({
  title = 'Your Next AI System Starts Here.',
  body = 'Whether you need computing power, intelligent automation or a complete enterprise AI ecosystem, let’s build it together.',
}: Props) {
  return (
    <Section labelledBy="cta-title" className="overflow-hidden py-28 md:py-40">
      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        <div className="jaali absolute inset-0 opacity-[0.06] [mask-image:radial-gradient(50%_60%_at_50%_50%,black,transparent)]" />
        <div className="absolute inset-0 bg-[radial-gradient(40%_50%_at_50%_55%,rgba(69,211,230,.12),transparent_70%)]" />
        <svg className="absolute left-1/2 top-1/2 h-[140%] -translate-x-1/2 -translate-y-1/2 opacity-40" viewBox="-200 -200 400 400">
          {[80, 120, 160, 195].map((r, i) => (
            <circle key={r} r={r} fill="none" stroke={i === 1 ? '#e09a52' : '#94aad2'} strokeOpacity={i === 1 ? 0.25 : 0.12} strokeDasharray={i % 2 ? '2 6' : undefined} />
          ))}
        </svg>
      </div>
      <div className="container-x relative text-center">
        <p data-reveal className="eyebrow justify-center">
          Start building
        </p>
        <h2 id="cta-title" data-reveal="1" className="display mx-auto mt-6 max-w-4xl text-[clamp(2.6rem,6.4vw,5.6rem)]">
          {title}
        </h2>
        <p data-reveal="2" className="mx-auto mt-7 max-w-xl text-lg leading-relaxed text-fg-soft">
          {body}
        </p>
        <div data-reveal="3" className="mt-10 flex flex-wrap justify-center gap-3">
          <Button to="/build-with-us">Start Building with AI Bharat</Button>
          <Button to="/contact" variant="secondary">
            Discuss Your Project
          </Button>
        </div>
      </div>
    </Section>
  )
}
