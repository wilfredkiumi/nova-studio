import { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  Plus,
  Search,
  Filter,
  Grid3X3,
  List,
  MoreVertical,
  Clapperboard,
  Layers,
  Gamepad2,
  Music,
  PenTool,
  Clock,
  Users,
  Sparkles,
  FolderKanban,
  Glasses,
  Camera,
  Podcast,
  Tv,
  Megaphone,
  BookOpen,
  ChevronDown,
  type LucideIcon
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

// Project types with their icons and colors
const projectTypes: { id: string; label: string; icon: LucideIcon; color: string }[] = [
  { id: 'all', label: 'All Projects', icon: Grid3X3, color: 'zinc' },
  { id: 'film', label: 'Film & Video', icon: Clapperboard, color: 'violet' },
  { id: 'animation', label: 'Animation', icon: Layers, color: 'pink' },
  { id: 'games', label: 'Game Dev', icon: Gamepad2, color: 'emerald' },
  { id: 'music', label: 'Music', icon: Music, color: 'amber' },
  { id: 'design', label: 'Design', icon: PenTool, color: 'cyan' },
  { id: 'vr-xr', label: 'VR / XR', icon: Glasses, color: 'indigo' },
  { id: 'podcast', label: 'Podcast', icon: Podcast, color: 'orange' },
  { id: 'photography', label: 'Photography', icon: Camera, color: 'rose' },
  { id: 'broadcast', label: 'Broadcast', icon: Tv, color: 'blue' },
  { id: 'advertising', label: 'Advertising', icon: Megaphone, color: 'yellow' },
  { id: 'publishing', label: 'Publishing', icon: BookOpen, color: 'teal' },
]

// Mock projects data
const mockProjects = [
  {
    id: 1,
    name: 'Stellar Horizons',
    type: 'film',
    description: 'A sci-fi short film about space exploration',
    thumbnail: '/projects/stellar.jpg',
    status: 'in-progress',
    progress: 65,
    team: 4,
    lastUpdated: '2 hours ago',
    aiAssisted: true,
  },
  {
    id: 2,
    name: 'Neon Dreams',
    type: 'animation',
    description: '2D animated music video with cyberpunk aesthetics',
    thumbnail: '/projects/neon.jpg',
    status: 'in-progress',
    progress: 40,
    team: 2,
    lastUpdated: '1 day ago',
    aiAssisted: true,
  },
  {
    id: 3,
    name: 'Echoes',
    type: 'music',
    description: 'Electronic ambient album with AI-generated elements',
    thumbnail: '/projects/echoes.jpg',
    status: 'completed',
    progress: 100,
    team: 1,
    lastUpdated: '3 days ago',
    aiAssisted: true,
  },
  {
    id: 4,
    name: 'Pixel Quest',
    type: 'games',
    description: 'Retro-style platformer with procedural levels',
    thumbnail: '/projects/pixel.jpg',
    status: 'planning',
    progress: 15,
    team: 3,
    lastUpdated: '1 week ago',
    aiAssisted: false,
  },
  {
    id: 5,
    name: 'Brand Refresh 2024',
    type: 'design',
    description: 'Complete visual identity redesign',
    thumbnail: '/projects/brand.jpg',
    status: 'in-progress',
    progress: 80,
    team: 2,
    lastUpdated: '4 hours ago',
    aiAssisted: true,
  },
  {
    id: 6,
    name: 'The Last Light',
    type: 'film',
    description: 'Documentary about renewable energy',
    thumbnail: '/projects/light.jpg',
    status: 'in-progress',
    progress: 30,
    team: 5,
    lastUpdated: '12 hours ago',
    aiAssisted: true,
  },
  {
    id: 7,
    name: 'Character Pack Vol. 1',
    type: 'animation',
    description: '3D character assets for game development',
    thumbnail: '/projects/chars.jpg',
    status: 'completed',
    progress: 100,
    team: 1,
    lastUpdated: '2 weeks ago',
    aiAssisted: true,
  },
  {
    id: 8,
    name: 'Synth Wave EP',
    type: 'music',
    description: 'Synthwave EP with retro vibes',
    thumbnail: '/projects/synth.jpg',
    status: 'planning',
    progress: 5,
    team: 1,
    lastUpdated: '5 days ago',
    aiAssisted: false,
  },
]

const statusColors: Record<string, string> = {
  'planning': 'bg-zinc-500',
  'in-progress': 'bg-blue-500',
  'review': 'bg-yellow-500',
  'completed': 'bg-green-500',
}

const statusLabels: Record<string, string> = {
  'planning': 'Planning',
  'in-progress': 'In Progress',
  'review': 'In Review',
  'completed': 'Completed',
}

export default function Projects() {
  const [activeFilter, setActiveFilter] = useState('all')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [searchQuery, setSearchQuery] = useState('')

  const filteredProjects = mockProjects.filter(project => {
    const matchesFilter = activeFilter === 'all' || project.type === activeFilter
    const matchesSearch = project.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.description.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesFilter && matchesSearch
  })

  const getTypeInfo = (typeId: string) => {
    return projectTypes.find(t => t.id === typeId) || projectTypes[0]
  }

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-zinc-800 px-6 py-4">
        <div>
          <h1 className="text-xl font-semibold">Projects</h1>
          <p className="text-sm text-zinc-400">Manage your creative projects</p>
        </div>
        <Link to="/projects/new">
          <Button className="bg-violet-600 hover:bg-violet-700">
            <Plus className="size-4 mr-2" />
            New Project
          </Button>
        </Link>
      </div>

      {/* Filters and Search */}
      <div className="border-b border-zinc-800 px-6 py-3">
        <div className="flex items-center justify-between gap-4">
          {/* Type Filter Dropdown */}
          <div className="flex items-center gap-3">
            <Select value={activeFilter} onValueChange={setActiveFilter}>
              <SelectTrigger className="w-48 bg-zinc-800 border-zinc-700 text-white">
                <SelectValue>
                  {(() => {
                    const activeType = projectTypes.find(t => t.id === activeFilter)
                    if (!activeType) return 'All Projects'
                    const Icon = activeType.icon
                    return (
                      <div className="flex items-center gap-2">
                        <Icon className="size-4 text-zinc-400" />
                        <span>{activeType.label}</span>
                      </div>
                    )
                  })()}
                </SelectValue>
              </SelectTrigger>
              <SelectContent className="bg-zinc-900 border-zinc-800 max-h-72">
                {projectTypes.map((type) => {
                  const Icon = type.icon
                  return (
                    <SelectItem 
                      key={type.id} 
                      value={type.id}
                      className="text-zinc-300 focus:bg-zinc-800 focus:text-white"
                    >
                      <div className="flex items-center gap-2">
                        <Icon className="size-4 text-zinc-400" />
                        <span>{type.label}</span>
                      </div>
                    </SelectItem>
                  )
                })}
              </SelectContent>
            </Select>
            {activeFilter !== 'all' && (
              <button
                onClick={() => setActiveFilter('all')}
                className="text-xs text-zinc-500 hover:text-zinc-300"
              >
                Clear filter
              </button>
            )}
          </div>

          {/* Search and View Toggle */}
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-zinc-500" />
              <input
                type="text"
                placeholder="Search projects..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-64 bg-zinc-800 border border-zinc-700 rounded-lg pl-10 pr-4 py-2 text-sm text-white placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-violet-600"
              />
            </div>
            <div className="flex items-center bg-zinc-800 rounded-lg p-1">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-1.5 rounded ${viewMode === 'grid' ? 'bg-zinc-700 text-white' : 'text-zinc-400'}`}
              >
                <Grid3X3 className="size-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-1.5 rounded ${viewMode === 'list' ? 'bg-zinc-700 text-white' : 'text-zinc-400'}`}
              >
                <List className="size-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Projects Grid/List */}
      <div className="flex-1 overflow-y-auto p-6">
        {filteredProjects.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 text-center">
            <div className="size-16 rounded-full bg-zinc-800 flex items-center justify-center mb-4">
              <FolderKanban className="size-8 text-zinc-500" />
            </div>
            <h3 className="text-lg font-medium text-zinc-300 mb-1">No projects found</h3>
            <p className="text-sm text-zinc-500 mb-4">
              {searchQuery ? 'Try a different search term' : 'Create your first project to get started'}
            </p>
            <Link to="/projects/new">
              <Button className="bg-violet-600 hover:bg-violet-700">
                <Plus className="size-4 mr-2" />
                New Project
              </Button>
            </Link>
          </div>
        ) : viewMode === 'grid' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredProjects.map((project) => {
              const typeInfo = getTypeInfo(project.type)
              const TypeIcon = typeInfo.icon
              return (
                <Card key={project.id} className="bg-zinc-900 border-zinc-800 hover:border-zinc-700 transition-colors cursor-pointer group">
                  <CardContent className="p-0">
                    {/* Thumbnail */}
                    <div className="relative h-36 bg-zinc-800 rounded-t-lg overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-br from-violet-600/20 to-fuchsia-600/20" />
                      <div className="absolute top-2 left-2">
                        <div className={`flex items-center gap-1.5 px-2 py-1 rounded-full bg-zinc-900/80 text-xs`}>
                          <TypeIcon className="size-3" />
                          {typeInfo.label}
                        </div>
                      </div>
                      {project.aiAssisted && (
                        <div className="absolute top-2 right-2">
                          <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-violet-600/80 text-xs">
                            <Sparkles className="size-3" />
                            AI
                          </div>
                        </div>
                      )}
                      <div className="absolute bottom-2 right-2">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <button className="p-1.5 rounded-lg bg-zinc-900/80 text-zinc-400 opacity-0 group-hover:opacity-100 transition-opacity">
                              <MoreVertical className="size-4" />
                            </button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="bg-zinc-900 border-zinc-800">
                            <DropdownMenuItem className="text-zinc-300 focus:bg-zinc-800">Open</DropdownMenuItem>
                            <DropdownMenuItem className="text-zinc-300 focus:bg-zinc-800">Duplicate</DropdownMenuItem>
                            <DropdownMenuItem className="text-zinc-300 focus:bg-zinc-800">Archive</DropdownMenuItem>
                            <DropdownMenuItem className="text-red-400 focus:bg-zinc-800">Delete</DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-4">
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <h3 className="font-medium text-white truncate">{project.name}</h3>
                        <Badge variant="secondary" className={`${statusColors[project.status]} text-white text-xs shrink-0`}>
                          {statusLabels[project.status]}
                        </Badge>
                      </div>
                      <p className="text-sm text-zinc-400 line-clamp-2 mb-3">{project.description}</p>
                      
                      {/* Progress */}
                      <div className="mb-3">
                        <div className="flex items-center justify-between text-xs text-zinc-500 mb-1">
                          <span>Progress</span>
                          <span>{project.progress}%</span>
                        </div>
                        <div className="h-1.5 bg-zinc-800 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-violet-600 rounded-full transition-all"
                            style={{ width: `${project.progress}%` }}
                          />
                        </div>
                      </div>

                      {/* Meta */}
                      <div className="flex items-center justify-between text-xs text-zinc-500">
                        <div className="flex items-center gap-1">
                          <Users className="size-3" />
                          {project.team}
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="size-3" />
                          {project.lastUpdated}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        ) : (
          <div className="space-y-2">
            {filteredProjects.map((project) => {
              const typeInfo = getTypeInfo(project.type)
              const TypeIcon = typeInfo.icon
              return (
                <div 
                  key={project.id} 
                  className="flex items-center gap-4 p-4 bg-zinc-900 border border-zinc-800 rounded-lg hover:border-zinc-700 transition-colors cursor-pointer"
                >
                  <div className="size-12 rounded-lg bg-zinc-800 flex items-center justify-center">
                    <TypeIcon className="size-6 text-zinc-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h3 className="font-medium text-white truncate">{project.name}</h3>
                      {project.aiAssisted && (
                        <div className="flex items-center gap-1 px-1.5 py-0.5 rounded bg-violet-600/20 text-violet-400 text-xs">
                          <Sparkles className="size-3" />
                          AI
                        </div>
                      )}
                    </div>
                    <p className="text-sm text-zinc-500 truncate">{project.description}</p>
                  </div>
                  <div className="flex items-center gap-6 text-sm">
                    <div className="w-24">
                      <div className="flex items-center justify-between text-xs text-zinc-500 mb-1">
                        <span>{project.progress}%</span>
                      </div>
                      <div className="h-1.5 bg-zinc-800 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-violet-600 rounded-full"
                          style={{ width: `${project.progress}%` }}
                        />
                      </div>
                    </div>
                    <Badge variant="secondary" className={`${statusColors[project.status]} text-white text-xs`}>
                      {statusLabels[project.status]}
                    </Badge>
                    <div className="flex items-center gap-1 text-zinc-500">
                      <Users className="size-4" />
                      {project.team}
                    </div>
                    <div className="flex items-center gap-1 text-zinc-500 w-24">
                      <Clock className="size-4" />
                      {project.lastUpdated}
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <button className="p-1.5 rounded-lg text-zinc-400 hover:bg-zinc-800">
                          <MoreVertical className="size-4" />
                        </button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="bg-zinc-900 border-zinc-800">
                        <DropdownMenuItem className="text-zinc-300 focus:bg-zinc-800">Open</DropdownMenuItem>
                        <DropdownMenuItem className="text-zinc-300 focus:bg-zinc-800">Duplicate</DropdownMenuItem>
                        <DropdownMenuItem className="text-zinc-300 focus:bg-zinc-800">Archive</DropdownMenuItem>
                        <DropdownMenuItem className="text-red-400 focus:bg-zinc-800">Delete</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
