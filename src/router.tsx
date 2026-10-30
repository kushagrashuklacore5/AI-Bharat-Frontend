import { lazy, type ComponentType } from 'react'
import { createBrowserRouter } from 'react-router'
import { Layout } from './components/layout/Layout'
import Home from './pages/Home'

const page = (loader: () => Promise<{ default: ComponentType }>) => {
  const C = lazy(loader)
  return <C />
}

export const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      { path: '/', element: <Home /> },
      { path: '/workflow-studio', element: page(() => import('./pages/WorkflowStudio')) },
      { path: '/ai-agents', element: page(() => import('./pages/AiAgents')) },
      { path: '/ai-orchestration', element: page(() => import('./pages/AiOrchestration')) },
      { path: '/gpu-cloud', element: page(() => import('./pages/GpuCloud')) },
      { path: '/solutions', element: page(() => import('./pages/Solutions')) },
      { path: '/custom-ai-development', element: page(() => import('./pages/CustomAiDevelopment')) },
      { path: '/build-with-us', element: page(() => import('./pages/BuildWithUs')) },
      { path: '/about', element: page(() => import('./pages/About')) },
      { path: '/contact', element: page(() => import('./pages/Contact')) },
      { path: '/developers', element: page(() => import('./pages/Developers')) },
      { path: '/legal', element: page(() => import('./pages/Legal')) },
      { path: '/architecture/:layerId', element: page(() => import('./pages/LayerDetail')) },
      { path: '*', element: page(() => import('./pages/NotFound')) },
    ],
  },
])
