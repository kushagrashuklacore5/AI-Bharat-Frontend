import { Section } from '../ui/Section'
import { SectionHeading } from '../ui/SectionHeading'
import { LayeredArchitecture } from './LayeredArchitecture'

export function ArchitectureSection({ index = '02' }: { index?: string }) {
  return (
    <Section id="architecture" labelledBy="architecture-title" className="overflow-x-clip py-28 md:py-36">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(60%_50%_at_30%_55%,rgba(91,140,255,.07),transparent_70%)]" aria-hidden="true" />
      <div className="container-x relative">
        <div className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
          <SectionHeading
            id="architecture-title"
            index={index}
            eyebrow="Platform architecture"
            title={
              <>
                Six layers. <span className="serif-accent text-fg-soft">One</span> intelligent system.
              </>
            }
            lead="Every AI Bharat workflow, agent and application runs through the same stack — from GPU compute at the foundation to agent orchestration at the top. Explore each layer to see what it does and why it matters."
          />
          <p data-reveal="3" className="max-w-[15rem] font-mono text-[11px] leading-relaxed text-faint md:text-right">
            Read top-down for how work is coordinated; bottom-up for how it is powered.
          </p>
        </div>
        <div className="mt-14 md:mt-6">
          <LayeredArchitecture />
        </div>
      </div>
    </Section>
  )
}
