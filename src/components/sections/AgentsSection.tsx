import { Section } from '../ui/Section'
import { SectionHeading } from '../ui/SectionHeading'
import { Button } from '../ui/Button'
import { AgentMesh } from '../agents/AgentMesh'

export function AgentsSection({ index = '04' }: { index?: string }) {
  return (
    <Section id="agents" labelledBy="agents-title" className="py-28 md:py-36">
      <div className="container-x">
        <div className="grid gap-10 lg:grid-cols-[1.3fr_1fr] lg:items-end">
          <SectionHeading
            id="agents-title"
            index={index}
            eyebrow="AI agents & multi-agent orchestration"
            title={
              <>
                Complex work, broken down and done by <span className="serif-accent text-gradient">specialists.</span>
              </>
            }
            lead="Coordinate specialised AI agents, delegate tasks, manage execution state and combine their outputs into complete workflows — with people approving what matters."
          />
          <div data-reveal="3" className="lg:justify-self-end">
            <Button to="/ai-agents" variant="secondary">
              How our agents work
            </Button>
          </div>
        </div>
        <div data-reveal="2" className="mt-14">
          <AgentMesh />
        </div>
      </div>
    </Section>
  )
}
