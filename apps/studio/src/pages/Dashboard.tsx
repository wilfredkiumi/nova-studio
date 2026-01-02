import { 
  Plus, 
  Play, 
  Clock, 
  Film,
  Calendar,
  Users,
  Sparkles
} from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'

// Mock data for projects
const projects = [
  {
    id: 1,
    title: 'The Last Frontier',
    type: 'Feature Film',
    status: 'In Production',
    progress: 65,
    lastUpdated: '2 hours ago',
    team: ['WK', 'JD', 'AM'],
  },
  {
    id: 2,
    title: 'Urban Legends',
    type: 'Documentary',
    status: 'Pre-Production',
    progress: 25,
    lastUpdated: '1 day ago',
    team: ['WK', 'SM'],
  },
  {
    id: 3,
    title: 'Midnight Express',
    type: 'Short Film',
    status: 'Post-Production',
    progress: 90,
    lastUpdated: '3 hours ago',
    team: ['WK', 'JD', 'AM', 'TC'],
  },
]

const recentActivity = [
  { id: 1, action: 'Generated new scene', project: 'The Last Frontier', tool: 'AI Director', time: '10 min ago' },
  { id: 2, action: 'Exported video draft', project: 'Midnight Express', tool: 'Editor', time: '1 hour ago' },
  { id: 3, action: 'Created storyboard', project: 'Urban Legends', tool: 'Production Design', time: '2 hours ago' },
  { id: 4, action: 'Generated voiceover', project: 'The Last Frontier', tool: 'Audio & Voice', time: '3 hours ago' },
]

const stats = [
  { label: 'Active Projects', value: '3', icon: Film, trend: '+1 this month' },
  { label: 'AI Credits Used', value: '2,847', icon: Sparkles, trend: '15% of quota' },
  { label: 'Hours Saved', value: '127', icon: Clock, trend: '+23 this week' },
  { label: 'Team Members', value: '4', icon: Users, trend: '2 online' },
]

export function Dashboard() {
  return (
    <div className="p-6 space-y-6 bg-zinc-950 min-h-full w-full">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white">Dashboard</h1>
          <p className="text-zinc-400">Welcome back, Wilfred. Here's your production overview.</p>
        </div>
        <button className="flex items-center gap-2 bg-violet-600 hover:bg-violet-500 text-white px-4 py-2 rounded-lg font-medium transition-colors">
          <Plus className="size-4" />
          New Project
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <div key={stat.label} className="bg-zinc-900 border border-zinc-800 rounded-xl p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-zinc-400">{stat.label}</span>
              <stat.icon className="size-4 text-zinc-500" />
            </div>
            <div className="text-2xl font-bold text-white">{stat.value}</div>
            <p className="text-xs text-zinc-500">{stat.trend}</p>
          </div>
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Projects Section */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-white">Active Projects</h2>
            <button className="text-sm text-zinc-400 hover:text-white transition-colors">View All</button>
          </div>
          
          <div className="grid gap-4">
            {projects.map((project) => (
              <div key={project.id} className="bg-zinc-900 border border-zinc-800 hover:border-violet-500/50 rounded-xl p-4 transition-colors cursor-pointer">
                <div className="flex gap-4">
                  {/* Thumbnail */}
                  <div className="w-32 h-20 rounded-lg bg-gradient-to-br from-violet-500/20 to-pink-500/20 flex items-center justify-center shrink-0">
                    <Film className="size-8 text-violet-500" />
                  </div>
                  
                  {/* Details */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h3 className="font-semibold text-white truncate">{project.title}</h3>
                        <p className="text-sm text-zinc-400">{project.type}</p>
                      </div>
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        project.status === 'In Production' 
                          ? 'bg-violet-500/20 text-violet-300' 
                          : project.status === 'Post-Production'
                          ? 'bg-green-500/20 text-green-300'
                          : 'bg-zinc-700 text-zinc-300'
                      }`}>
                        {project.status}
                      </span>
                    </div>
                    
                    <div className="mt-3 space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-zinc-500">Progress</span>
                        <span className="font-medium text-white">{project.progress}%</span>
                      </div>
                      <div className="h-1.5 bg-zinc-800 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-violet-500 rounded-full transition-all"
                          style={{ width: `${project.progress}%` }}
                        />
                      </div>
                    </div>
                    
                    <div className="mt-3 flex items-center justify-between">
                      <div className="flex -space-x-2">
                        {project.team.map((member, i) => (
                          <Avatar key={i} className="size-6 border-2 border-zinc-900">
                            <AvatarFallback className="text-xs bg-violet-600">{member}</AvatarFallback>
                          </Avatar>
                        ))}
                      </div>
                      <span className="text-xs text-zinc-500 flex items-center gap-1">
                        <Clock className="size-3" />
                        {project.lastUpdated}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-white">Recent Activity</h2>
            <button className="text-sm text-zinc-400 hover:text-white transition-colors">View All</button>
          </div>
          
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 space-y-4">
            {recentActivity.map((activity) => (
              <div key={activity.id} className="flex gap-3">
                <div className="w-8 h-8 rounded-full bg-violet-500/10 flex items-center justify-center shrink-0">
                  <Sparkles className="size-4 text-violet-500" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-white">{activity.action}</p>
                  <p className="text-xs text-zinc-500 truncate">
                    {activity.project} • {activity.tool}
                  </p>
                  <p className="text-xs text-zinc-600 mt-1">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Quick Actions */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4">
            <h3 className="text-base font-semibold text-white mb-3">Quick Actions</h3>
            <div className="grid gap-2">
              <button className="flex items-center gap-2 w-full text-left px-3 py-2 rounded-lg border border-zinc-700 text-zinc-300 hover:bg-zinc-800 hover:text-white transition-colors">
                <Play className="size-4" />
                Continue Last Project
              </button>
              <button className="flex items-center gap-2 w-full text-left px-3 py-2 rounded-lg border border-zinc-700 text-zinc-300 hover:bg-zinc-800 hover:text-white transition-colors">
                <Sparkles className="size-4" />
                Generate with AI
              </button>
              <button className="flex items-center gap-2 w-full text-left px-3 py-2 rounded-lg border border-zinc-700 text-zinc-300 hover:bg-zinc-800 hover:text-white transition-colors">
                <Calendar className="size-4" />
                Schedule Review
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
