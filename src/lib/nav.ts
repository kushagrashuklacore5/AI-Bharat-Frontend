export interface NavItem {
  label: string
  to: string
  desc?: string
}

export const PRODUCTS: NavItem[] = [
  { label: 'Workflow Studio', to: '/workflow-studio', desc: 'Visual builder for AI-native automation' },
  { label: 'AI Agents', to: '/ai-agents', desc: 'Specialised agents that work together' },
  { label: 'AI Orchestration', to: '/ai-orchestration', desc: 'Multi-model routing & execution' },
  { label: 'GPU Cloud', to: '/gpu-cloud', desc: 'Partner-powered compute on demand' },
]

export const SERVICES: NavItem[] = [
  { label: 'Custom AI Development', to: '/custom-ai-development', desc: 'We design, build and run it for you' },
  { label: 'Industry Solutions', to: '/solutions', desc: 'Applied AI by sector' },
  { label: 'Build With Us', to: '/build-with-us', desc: 'Describe your project' },
]

export const PRIMARY_NAV: NavItem[] = [
  { label: 'Workflow Studio', to: '/workflow-studio' },
  { label: 'Agents', to: '/ai-agents' },
  { label: 'Orchestration', to: '/ai-orchestration' },
  { label: 'GPU Cloud', to: '/gpu-cloud' },
  { label: 'Solutions', to: '/solutions' },
  { label: 'About', to: '/about' },
]
