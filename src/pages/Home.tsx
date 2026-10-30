import { useEffect } from 'react'
import { Hero } from '../components/hero/Hero'
import { EcosystemSection } from '../components/ecosystem/Ecosystem'
import { StudioSection } from '../components/workflow-studio/StudioSection'
import { ArchitectureSection } from '../components/architecture/ArchitectureSection'
import { AgentsSection } from '../components/sections/AgentsSection'
import { OrchestrationSection } from '../components/sections/OrchestrationSection'
import { GpuSection } from '../components/sections/GpuSection'
import { CustomDevSection } from '../components/sections/CustomDevSection'
import { IndustriesSection } from '../components/sections/IndustriesSection'
import { ProcessSection } from '../components/sections/ProcessSection'
import { PillarsSection } from '../components/sections/PillarsSection'
import { FinalCta } from '../components/sections/FinalCta'

export default function Home() {
  useEffect(() => {
    document.title = 'AI Bharat — Build, Connect, Automate, Orchestrate'
  }, [])
  return (
    <>
      <Hero />
      <EcosystemSection index="01" />
      <StudioSection index="02" />
      <ArchitectureSection index="03" />
      <AgentsSection index="04" />
      <OrchestrationSection index="05" />
      <GpuSection index="06" />
      <CustomDevSection index="07" />
      <IndustriesSection index="08" />
      <ProcessSection index="09" />
      <PillarsSection index="10" />
      <FinalCta />
    </>
  )
}
