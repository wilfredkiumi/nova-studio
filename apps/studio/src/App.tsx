import '@/App.css'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { StudioLayout } from '@/layouts/StudioLayout'
import { Dashboard } from '@/pages/Dashboard'
import Projects from '@/pages/Projects'
import Team from '@/pages/Team'
import NewProject from '@/pages/NewProject'
import Settings from '@/pages/Settings'
import Help from '@/pages/Help'

function App() {
  return (
    <BrowserRouter>
      <StudioLayout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/projects/new" element={<NewProject />} />
          <Route path="/team" element={<Team />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/help" element={<Help />} />
          {/* Placeholder routes for tool pages */}
          <Route path="/film/*" element={<ToolPage domain="Film & Video" />} />
          <Route path="/animation/*" element={<ToolPage domain="Animation" />} />
          <Route path="/games/*" element={<ToolPage domain="Game Dev" />} />
          <Route path="/music/*" element={<ToolPage domain="Music" />} />
          <Route path="/design/*" element={<ToolPage domain="Graphic Design" />} />
        </Routes>
      </StudioLayout>
    </BrowserRouter>
  )
}

// Placeholder component for tool pages
function ToolPage({ domain }: { domain: string }) {
  return (
    <div className="flex flex-col h-full items-center justify-center p-6">
      <div className="max-w-md text-center">
        <div className="size-20 rounded-2xl bg-gradient-to-br from-violet-600/20 to-fuchsia-600/20 flex items-center justify-center mx-auto mb-6">
          <span className="text-4xl">🚧</span>
        </div>
        <h1 className="text-2xl font-semibold mb-2">{domain} Tools</h1>
        <p className="text-zinc-400 mb-6">
          This workspace is under construction. Our AI-powered {domain.toLowerCase()} tools are coming soon!
        </p>
        <a 
          href="/"
          className="inline-flex items-center justify-center px-4 py-2 rounded-lg bg-violet-600 text-white hover:bg-violet-700 transition-colors"
        >
          Back to Dashboard
        </a>
      </div>
    </div>
  )
}

export default App
