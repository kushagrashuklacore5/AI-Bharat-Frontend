import { Section } from '../ui/Section'
import { SectionHeading } from '../ui/SectionHeading'
import { Button } from '../ui/Button'
import { GpuCatalogue } from '../gpu/GpuCatalogue'

const MODES = [
  ['Pay-as-you-go', 'Hourly compute for experiments, batch jobs and spiky workloads.'],
  ['Monthly plans', 'Predictable capacity for steady production traffic.'],
  ['Dedicated GPUs', 'Reserved resources for isolation and consistent performance.'],
  ['Inference', 'Serve open-weight or fine-tuned models behind managed endpoints.'],
  ['Fine-tuning', 'Adapt base models to your domain data.'],
  ['Training', 'Run longer training workloads without buying hardware.'],
]

export function GpuSection({ index = '06' }: { index?: string }) {
  return (
    <Section id="gpu" labelledBy="gpu-title" className="py-28 md:py-36">
      <div className="container-x">
        <div className="grid gap-12 lg:grid-cols-[1.2fr_1fr] lg:items-end">
          <SectionHeading
            id="gpu-title"
            index={index}
            eyebrow="GPU Cloud · partner-powered"
            title={
              <>
                High-performance compute, <span className="serif-accent text-gradient">without the hardware.</span>
              </>
            }
            lead="Access high-performance computing resources on flexible usage-based pricing without purchasing and maintaining your own GPU hardware. Capacity is provisioned through our infrastructure partners and managed by AI Bharat."
          />
          <div data-reveal="3" className="lg:justify-self-end">
            <Button to="/gpu-cloud">Explore GPU Infrastructure</Button>
          </div>
        </div>
        <ul className="mt-12 grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-line bg-line md:grid-cols-3 lg:grid-cols-6">
          {MODES.map(([t, d], i) => (
            <li key={t} data-reveal={String(i)} className="bg-ink-950 p-5">
              <p className="text-[14px] text-fg">{t}</p>
              <p className="mt-2 text-[12.5px] leading-relaxed text-muted">{d}</p>
            </li>
          ))}
        </ul>
        <div data-reveal="2" className="mt-8">
          <GpuCatalogue />
        </div>
      </div>
    </Section>
  )
}
