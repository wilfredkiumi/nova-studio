import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { 
  LayoutDashboard, 
  FolderKanban, 
  Users, 
  Settings, 
  HelpCircle,
  Sparkles,
  Video,
  FileText,
  Palette,
  Music,
  Scissors,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  Gamepad2,
  Clapperboard,
  Wand2,
  Mic2,
  PenTool,
  Layers,
  Box,
  ImageIcon,
  Glasses,
  Camera,
  Podcast,
  Tv,
  Megaphone,
  BookOpen,
  type LucideIcon
} from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

const mainNavItems = [
  { title: 'Dashboard', icon: LayoutDashboard, url: '/' },
  { title: 'Projects', icon: FolderKanban, url: '/projects' },
  { title: 'Team', icon: Users, url: '/team' },
]

// Creative domains with their specific tools
const creativeDomains: {
  id: string
  title: string
  icon: LucideIcon
  color: string
  tools: { title: string; icon: LucideIcon; url: string }[]
}[] = [
  {
    id: 'film',
    title: 'Film & Video',
    icon: Clapperboard,
    color: 'violet',
    tools: [
      { title: 'AI Director', icon: Sparkles, url: '/film/director' },
      { title: 'Script Writer', icon: FileText, url: '/film/writer' },
      { title: 'Video Generation', icon: Video, url: '/film/video' },
      { title: 'Production Design', icon: Palette, url: '/film/design' },
      { title: 'Audio & Voice', icon: Mic2, url: '/film/audio' },
      { title: 'Editor', icon: Scissors, url: '/film/editor' },
    ]
  },
  {
    id: 'animation',
    title: 'Animation',
    icon: Layers,
    color: 'pink',
    tools: [
      { title: '2D Animation', icon: PenTool, url: '/animation/2d' },
      { title: '3D Animation', icon: Box, url: '/animation/3d' },
      { title: 'Character Design', icon: Wand2, url: '/animation/character' },
      { title: 'Storyboarding', icon: ImageIcon, url: '/animation/storyboard' },
    ]
  },
  {
    id: 'games',
    title: 'Game Dev',
    icon: Gamepad2,
    color: 'emerald',
    tools: [
      { title: 'Game Design', icon: Sparkles, url: '/games/design' },
      { title: 'Level Editor', icon: Layers, url: '/games/levels' },
      { title: 'Asset Generation', icon: ImageIcon, url: '/games/assets' },
      { title: 'Audio & SFX', icon: Music, url: '/games/audio' },
    ]
  },
  {
    id: 'music',
    title: 'Music Production',
    icon: Music,
    color: 'amber',
    tools: [
      { title: 'AI Composer', icon: Sparkles, url: '/music/composer' },
      { title: 'Beat Maker', icon: Mic2, url: '/music/beats' },
      { title: 'Mixing Studio', icon: Scissors, url: '/music/mixing' },
      { title: 'Voice Synthesis', icon: Wand2, url: '/music/voice' },
    ]
  },
  {
    id: 'design',
    title: 'Graphic Design',
    icon: PenTool,
    color: 'cyan',
    tools: [
      { title: 'AI Designer', icon: Sparkles, url: '/design/ai' },
      { title: 'Brand Kit', icon: Palette, url: '/design/brand' },
      { title: 'Image Generation', icon: ImageIcon, url: '/design/images' },
      { title: 'Layout Editor', icon: Layers, url: '/design/layout' },
    ]
  },
  {
    id: 'vr-xr',
    title: 'VR / XR / Mixed Reality',
    icon: Glasses,
    color: 'indigo',
    tools: [
      { title: '3D Environment', icon: Box, url: '/vr-xr/environment' },
      { title: 'Spatial Audio', icon: Music, url: '/vr-xr/audio' },
      { title: 'Interaction Design', icon: Wand2, url: '/vr-xr/interaction' },
      { title: '360° Video', icon: Video, url: '/vr-xr/360' },
    ]
  },
  {
    id: 'podcast',
    title: 'Podcast & Audio',
    icon: Podcast,
    color: 'orange',
    tools: [
      { title: 'Audio Editor', icon: Scissors, url: '/podcast/editor' },
      { title: 'Voice Enhancement', icon: Mic2, url: '/podcast/voice' },
      { title: 'Transcription', icon: FileText, url: '/podcast/transcription' },
      { title: 'Sound Library', icon: Music, url: '/podcast/library' },
    ]
  },
  {
    id: 'photography',
    title: 'Photography',
    icon: Camera,
    color: 'rose',
    tools: [
      { title: 'AI Retouching', icon: Wand2, url: '/photography/retouch' },
      { title: 'Batch Editor', icon: Layers, url: '/photography/batch' },
      { title: 'Style Transfer', icon: Palette, url: '/photography/style' },
      { title: 'Gallery Builder', icon: ImageIcon, url: '/photography/gallery' },
    ]
  },
  {
    id: 'broadcast',
    title: 'Broadcast & Streaming',
    icon: Tv,
    color: 'blue',
    tools: [
      { title: 'Live Graphics', icon: Sparkles, url: '/broadcast/graphics' },
      { title: 'Stream Manager', icon: Video, url: '/broadcast/stream' },
      { title: 'Replay Editor', icon: Scissors, url: '/broadcast/replay' },
      { title: 'Multi-cam', icon: Camera, url: '/broadcast/multicam' },
    ]
  },
  {
    id: 'advertising',
    title: 'Advertising & Marketing',
    icon: Megaphone,
    color: 'yellow',
    tools: [
      { title: 'Ad Creator', icon: Sparkles, url: '/advertising/create' },
      { title: 'Campaign Manager', icon: Layers, url: '/advertising/campaigns' },
      { title: 'Asset Library', icon: ImageIcon, url: '/advertising/assets' },
      { title: 'Analytics', icon: FileText, url: '/advertising/analytics' },
    ]
  },
  {
    id: 'publishing',
    title: 'Digital Publishing',
    icon: BookOpen,
    color: 'teal',
    tools: [
      { title: 'Layout Editor', icon: Layers, url: '/publishing/layout' },
      { title: 'Typography', icon: FileText, url: '/publishing/typography' },
      { title: 'Interactive Elements', icon: Wand2, url: '/publishing/interactive' },
      { title: 'Export Tools', icon: Box, url: '/publishing/export' },
    ]
  },
]

interface StudioLayoutProps {
  children: React.ReactNode
}

export function StudioLayout({ children }: StudioLayoutProps) {
  const [collapsed, setCollapsed] = useState(false)
  const [activeDomain, setActiveDomain] = useState('film')
  const location = useLocation()

  const currentDomain = creativeDomains.find(d => d.id === activeDomain) || creativeDomains[0]

  const isActive = (url: string) => {
    if (url === '/') return location.pathname === '/'
    return location.pathname.startsWith(url)
  }

  return (
    <div className="flex h-screen w-screen bg-zinc-950 text-white overflow-hidden">
      {/* Sidebar */}
      <aside 
        className={`${collapsed ? 'w-16' : 'w-64'} flex-shrink-0 flex flex-col border-r border-zinc-800 bg-zinc-900 transition-all duration-300`}
      >
        {/* Logo */}
        <div className="flex h-14 items-center gap-2 border-b border-zinc-800 px-4">
          <Link to="/" className="flex items-center gap-2">
            <div className="flex size-8 items-center justify-center rounded-lg bg-gradient-to-br from-violet-600 to-fuchsia-600">
              <Sparkles className="size-4" />
            </div>
            {!collapsed && (
              <div className="flex flex-col">
                <span className="text-sm font-semibold">Nova Studio</span>
                <span className="text-xs text-zinc-500">Creative AI Platform</span>
              </div>
            )}
          </Link>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto p-2">
          {/* Main Navigation */}
          <div className="mb-4">
            {!collapsed && <p className="mb-2 px-2 text-xs font-medium text-zinc-500">Main</p>}
            <ul className="space-y-1">
              {mainNavItems.map((item) => (
                <li key={item.title}>
                  <Link
                    to={item.url}
                    className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors ${
                      isActive(item.url)
                        ? 'bg-violet-600/20 text-violet-400'
                        : 'text-zinc-400 hover:bg-zinc-800 hover:text-white'
                    }`}
                  >
                    <item.icon className="size-4 shrink-0" />
                    {!collapsed && <span>{item.title}</span>}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Domain Selector - Dropdown */}
          <div className="mb-4">
            {!collapsed && <p className="mb-2 px-2 text-xs font-medium text-zinc-500">Creative Space</p>}
            {collapsed ? (
              // Collapsed: Show just the icon
              <button
                className="w-full flex items-center justify-center p-2 rounded-lg bg-zinc-800/50 text-zinc-400 hover:bg-zinc-700/50"
                title={currentDomain.title}
              >
                <currentDomain.icon className="size-4" />
              </button>
            ) : (
              // Expanded: Show dropdown
              <Select value={activeDomain} onValueChange={setActiveDomain}>
                <SelectTrigger className="w-full bg-zinc-800/50 border-zinc-700 text-white h-10">
                  <SelectValue>
                    <div className="flex items-center gap-2">
                      <currentDomain.icon className="size-4 text-zinc-400" />
                      <span className="truncate">{currentDomain.title}</span>
                    </div>
                  </SelectValue>
                </SelectTrigger>
                <SelectContent className="bg-zinc-900 border-zinc-800 max-h-72">
                  {creativeDomains.map((domain) => {
                    const Icon = domain.icon
                    return (
                      <SelectItem 
                        key={domain.id} 
                        value={domain.id}
                        className="text-zinc-300 focus:bg-zinc-800 focus:text-white"
                      >
                        <div className="flex items-center gap-2">
                          <Icon className="size-4 text-zinc-400" />
                          <span>{domain.title}</span>
                        </div>
                      </SelectItem>
                    )
                  })}
                </SelectContent>
              </Select>
            )}
          </div>

          {/* Domain-specific Tools */}
          <div>
            {!collapsed && <p className="mb-2 px-2 text-xs font-medium text-zinc-500">Tools</p>}
            <ul className="space-y-1">
              {currentDomain.tools.map((item) => (
                <li key={item.title}>
                  <Link
                    to={item.url}
                    className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors ${
                      isActive(item.url)
                        ? 'bg-zinc-800 text-white'
                        : 'text-zinc-400 hover:bg-zinc-800 hover:text-white'
                    }`}
                  >
                    <item.icon className="size-4 shrink-0" />
                    {!collapsed && <span>{item.title}</span>}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </nav>

        {/* Footer */}
        <div className="border-t border-zinc-800 p-2">
          <Link
            to="/settings"
            className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors ${
              isActive('/settings')
                ? 'bg-violet-600/20 text-violet-400'
                : 'text-zinc-400 hover:bg-zinc-800 hover:text-white'
            }`}
          >
            <Settings className="size-4 shrink-0" />
            {!collapsed && <span>Settings</span>}
          </Link>
          <Link
            to="/help"
            className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors ${
              isActive('/help')
                ? 'bg-violet-600/20 text-violet-400'
                : 'text-zinc-400 hover:bg-zinc-800 hover:text-white'
            }`}
          >
            <HelpCircle className="size-4 shrink-0" />
            {!collapsed && <span>Help & Support</span>}
          </Link>
          
          <div className="mt-2 border-t border-zinc-800 pt-2">
            <div className="flex items-center gap-3 rounded-lg px-3 py-2">
              <Avatar className="size-8">
                <AvatarImage src="/avatar.jpg" />
                <AvatarFallback className="bg-violet-600 text-xs">WK</AvatarFallback>
              </Avatar>
              {!collapsed && (
                <div className="flex flex-col">
                  <span className="text-sm font-medium">Wilfred Kiumi</span>
                  <span className="text-xs text-zinc-500">Producer</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Collapse Toggle */}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="flex h-10 items-center justify-center border-t border-zinc-800 text-zinc-500 hover:bg-zinc-800 hover:text-white"
        >
          {collapsed ? <ChevronRight className="size-4" /> : <ChevronLeft className="size-4" />}
        </button>
      </aside>

      {/* Main Content */}
      <main className="flex-1 min-w-0 overflow-auto">
        {children}
      </main>
    </div>
  )
}
