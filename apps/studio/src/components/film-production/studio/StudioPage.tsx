// src/components/film-production/studio/StudioPage.tsx
// Modern Glassmorphism Film Production Interface
// Abstracts AI language → Film Industry terminology

import React, { useState } from 'react';
import '../styles/glass-theme.css';
import { 
  Film, 
  Clapperboard,
  Play,
  Pause,
  Eye,
  CheckCircle,
  Clock,
  Calendar,
  DollarSign,
  Users,
  FileText,
  Video,
  Camera,
  Music,
  Scissors,
  Palette,
  Briefcase,
  ChevronRight,
  Bell,
  Settings,
  Search,
  Plus,
  TrendingUp,
  AlertTriangle,
  Sparkles,
} from 'lucide-react';

// ============================================================================
// TYPES - Film Industry Language (No AI terms)
// ============================================================================

interface ProductionProject {
  id: string;
  title: string;
  logline: string;
  genre: string;
  stage: 'development' | 'pre-production' | 'principal' | 'post' | 'delivery';
  progress: number;
  budget: { total: number; spent: number };
  schedule: { startDate: Date; targetWrap: Date; daysRemaining: number };
  crew: CrewDepartment[];
  callSheet: CallSheetItem[];
  dailies: DailyItem[];
}

interface CrewDepartment {
  id: string;
  name: string;
  head: string; // "Director of Photography" not "Cinematography Agent"
  status: 'rolling' | 'standby' | 'wrapped' | 'needs-review';
  currentTask: string;
  progress: number;
}

interface CallSheetItem {
  id: string;
  department: string;
  task: string;
  priority: 'critical' | 'high' | 'normal';
  status: 'pending' | 'in-progress' | 'review' | 'approved';
}

interface DailyItem {
  id: string;
  name: string;
  department: string;
  thumbnail?: string;
  timestamp: Date;
  status: 'pending-review' | 'approved' | 'revision-requested';
}

// ============================================================================
// MAIN STUDIO PAGE
// ============================================================================

export function StudioPage() {
  const [activeView, setActiveView] = useState<'overview' | 'crew' | 'dailies' | 'schedule'>('overview');
  
  // Mock project data
  const project: ProductionProject = {
    id: '1',
    title: 'The Last Algorithm',
    logline: 'A retired cryptographer must decode one final message to save her estranged daughter.',
    genre: 'Thriller',
    stage: 'pre-production',
    progress: 35,
    budget: { total: 75000, spent: 18500 },
    schedule: { 
      startDate: new Date('2026-01-01'), 
      targetWrap: new Date('2026-03-15'),
      daysRemaining: 72
    },
    crew: [
      { id: '1', name: 'Script Department', head: 'Head Writer', status: 'rolling', currentTask: 'Scene 12 dialogue polish', progress: 78 },
      { id: '2', name: 'Direction', head: 'Director', status: 'rolling', currentTask: 'Shot list for Act 2', progress: 45 },
      { id: '3', name: 'Camera', head: 'Director of Photography', status: 'standby', currentTask: 'Awaiting shot list', progress: 20 },
      { id: '4', name: 'Sound', head: 'Sound Designer', status: 'standby', currentTask: 'Location audio planning', progress: 15 },
      { id: '5', name: 'Editorial', head: 'Editor', status: 'standby', currentTask: 'Assembly prep', progress: 10 },
      { id: '6', name: 'Art Department', head: 'Production Designer', status: 'rolling', currentTask: 'Set concepts for Scene 8', progress: 55 },
    ],
    callSheet: [
      { id: '1', department: 'Script', task: 'Final draft review', priority: 'critical', status: 'review' },
      { id: '2', department: 'Direction', task: 'Storyboard approval', priority: 'high', status: 'pending' },
      { id: '3', department: 'Art', task: 'Mood board delivery', priority: 'normal', status: 'approved' },
    ],
    dailies: [
      { id: '1', name: 'Script Draft v3', department: 'Script', timestamp: new Date(), status: 'pending-review' },
      { id: '2', name: 'Opening Sequence Boards', department: 'Direction', timestamp: new Date(), status: 'pending-review' },
      { id: '3', name: 'Apartment Set Concept', department: 'Art', timestamp: new Date(), status: 'approved' },
    ],
  };

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white film-reel-bg">
      {/* Top Navigation */}
      <StudioHeader project={project} />
      
      {/* Main Content */}
      <main className="container mx-auto px-6 py-8">
        {/* Hero Section - Current Production Status */}
        <ProductionHero project={project} />
        
        {/* Navigation Tabs */}
        <div className="flex gap-2 mb-8 mt-8">
          {[
            { id: 'overview', label: 'Production Overview' },
            { id: 'crew', label: 'Crew & Departments' },
            { id: 'dailies', label: 'Dailies & Deliverables' },
            { id: 'schedule', label: 'Schedule & Budget' },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveView(tab.id as any)}
              className={`px-5 py-2.5 rounded-lg text-sm font-medium transition-all ${
                activeView === tab.id
                  ? 'bg-gradient-to-r from-[#d4af37] to-[#c9a227] text-[#0a0a0f] shadow-[0_0_20px_rgba(212,175,55,0.3)]'
                  : 'glass-card hover:bg-white/5'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
        
        {/* Content Views */}
        {activeView === 'overview' && <OverviewView project={project} />}
        {activeView === 'crew' && <CrewView project={project} />}
        {activeView === 'dailies' && <DailiesView project={project} />}
        {activeView === 'schedule' && <ScheduleView project={project} />}
      </main>
    </div>
  );
}

// ============================================================================
// HEADER COMPONENT
// ============================================================================

function StudioHeader({ project }: { project: ProductionProject }) {
  return (
    <header className="border-b border-white/5 bg-black/20 backdrop-blur-xl sticky top-0 z-50">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo & Project */}
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-gradient-to-br from-[#d4af37] to-[#c9a227]">
                <Film className="h-5 w-5 text-[#0a0a0f]" />
              </div>
              <span className="font-semibold text-lg">Studio</span>
            </div>
            
            <div className="h-6 w-px bg-white/10" />
            
            <div>
              <h1 className="font-semibold">{project.title}</h1>
              <p className="text-xs text-white/50 capitalize">{project.stage.replace('-', ' ')} • {project.genre}</p>
            </div>
          </div>
          
          {/* Actions */}
          <div className="flex items-center gap-3">
            <button className="glass-card p-2.5 rounded-lg hover:bg-white/5 relative">
              <Bell className="h-4 w-4 text-white/70" />
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-[#d4af37] rounded-full text-[10px] flex items-center justify-center text-[#0a0a0f] font-bold">
                3
              </span>
            </button>
            <button className="glass-card p-2.5 rounded-lg hover:bg-white/5">
              <Settings className="h-4 w-4 text-white/70" />
            </button>
            <button className="glass-button-primary px-4 py-2.5 rounded-lg flex items-center gap-2 font-medium text-sm">
              <Plus className="h-4 w-4" />
              New Project
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}

// ============================================================================
// PRODUCTION HERO - Main Status Display
// ============================================================================

function ProductionHero({ project }: { project: ProductionProject }) {
  const stageLabels: Record<string, string> = {
    'development': 'Development',
    'pre-production': 'Pre-Production',
    'principal': 'Principal Photography',
    'post': 'Post-Production',
    'delivery': 'Final Delivery',
  };
  
  const stages = ['development', 'pre-production', 'principal', 'post', 'delivery'];
  const currentIndex = stages.indexOf(project.stage);

  return (
    <div className="glass-card glass-card-accent p-8 rounded-2xl">
      <div className="flex items-start justify-between mb-8">
        <div className="max-w-2xl">
          <div className="flex items-center gap-3 mb-3">
            <Clapperboard className="h-6 w-6 text-[#d4af37]" />
            <span className="text-[#d4af37] font-medium text-sm uppercase tracking-wider">
              Now In Production
            </span>
          </div>
          <h2 className="text-3xl font-bold mb-3">{project.title}</h2>
          <p className="text-white/60 text-lg leading-relaxed">{project.logline}</p>
        </div>
        
        <div className="flex gap-3">
          <button className="glass-button flex items-center gap-2 text-sm">
            <Pause className="h-4 w-4" />
            Hold Production
          </button>
          <button className="glass-button-primary px-5 py-2.5 rounded-lg flex items-center gap-2 font-medium text-sm">
            <Play className="h-4 w-4" />
            Continue Rolling
          </button>
        </div>
      </div>
      
      {/* Production Stage Progress */}
      <div className="relative">
        <div className="flex justify-between mb-3">
          {stages.map((stage, index) => (
            <div 
              key={stage}
              className={`flex flex-col items-center ${
                index <= currentIndex ? 'text-white' : 'text-white/30'
              }`}
            >
              <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 transition-all ${
                index < currentIndex 
                  ? 'bg-[#d4af37] text-[#0a0a0f]' 
                  : index === currentIndex
                  ? 'bg-[#d4af37]/20 border-2 border-[#d4af37] text-[#d4af37]'
                  : 'bg-white/5 border border-white/10'
              }`}>
                {index < currentIndex ? (
                  <CheckCircle className="h-5 w-5" />
                ) : (
                  <span className="text-sm font-medium">{index + 1}</span>
                )}
              </div>
              <span className="text-xs font-medium">{stageLabels[stage]}</span>
            </div>
          ))}
        </div>
        
        {/* Progress Line */}
        <div className="absolute top-5 left-0 right-0 h-0.5 bg-white/10 -z-10" style={{ margin: '0 40px' }}>
          <div 
            className="h-full bg-gradient-to-r from-[#d4af37] to-[#f4cf67]"
            style={{ width: `${(currentIndex / (stages.length - 1)) * 100}%` }}
          />
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// OVERVIEW VIEW
// ============================================================================

function OverviewView({ project }: { project: ProductionProject }) {
  return (
    <div className="grid grid-cols-12 gap-6">
      {/* Left Column - Stats & Call Sheet */}
      <div className="col-span-8 space-y-6">
        {/* Quick Stats */}
        <div className="grid grid-cols-4 gap-4">
          <StatCard
            icon={TrendingUp}
            label="Overall Progress"
            value={`${project.progress}%`}
            trend="+5% this week"
          />
          <StatCard
            icon={DollarSign}
            label="Budget Remaining"
            value={`$${((project.budget.total - project.budget.spent) / 1000).toFixed(0)}K`}
            trend={`${Math.round((1 - project.budget.spent / project.budget.total) * 100)}% of total`}
          />
          <StatCard
            icon={Calendar}
            label="Days to Wrap"
            value={project.schedule.daysRemaining.toString()}
            trend="On schedule"
            trendPositive
          />
          <StatCard
            icon={Users}
            label="Crew Rolling"
            value={project.crew.filter(c => c.status === 'rolling').length.toString()}
            trend={`of ${project.crew.length} departments`}
          />
        </div>
        
        {/* Today's Call Sheet */}
        <div className="glass-card p-6 rounded-xl">
          <div className="flex items-center justify-between mb-5">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <FileText className="h-5 w-5 text-[#d4af37]" />
              Today's Call Sheet
            </h3>
            <button className="text-sm text-[#d4af37] hover:text-[#f4cf67] transition-colors">
              View Full Schedule →
            </button>
          </div>
          
          <div className="space-y-3">
            {project.callSheet.map(item => (
              <CallSheetRow key={item.id} item={item} />
            ))}
          </div>
        </div>
        
        {/* Crew Status Grid */}
        <div className="glass-card p-6 rounded-xl">
          <h3 className="text-lg font-semibold mb-5 flex items-center gap-2">
            <Users className="h-5 w-5 text-[#d4af37]" />
            Department Status
          </h3>
          
          <div className="grid grid-cols-3 gap-4">
            {project.crew.map(dept => (
              <DepartmentCard key={dept.id} department={dept} />
            ))}
          </div>
        </div>
      </div>
      
      {/* Right Column - Dailies & Alerts */}
      <div className="col-span-4 space-y-6">
        {/* Pending Reviews */}
        <div className="glass-card p-6 rounded-xl">
          <div className="flex items-center justify-between mb-5">
            <h3 className="font-semibold flex items-center gap-2">
              <Eye className="h-5 w-5 text-[#d4af37]" />
              Awaiting Your Review
            </h3>
            <span className="px-2.5 py-1 rounded-full bg-[#d4af37]/20 text-[#d4af37] text-xs font-medium">
              {project.dailies.filter(d => d.status === 'pending-review').length} items
            </span>
          </div>
          
          <div className="space-y-3">
            {project.dailies
              .filter(d => d.status === 'pending-review')
              .map(daily => (
                <DailyCard key={daily.id} daily={daily} />
              ))}
          </div>
          
          <button className="w-full mt-4 glass-button text-sm py-3 rounded-lg flex items-center justify-center gap-2">
            Review All Dailies
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
        
        {/* Production Alerts */}
        <div className="glass-card p-6 rounded-xl">
          <h3 className="font-semibold mb-4 flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-amber-400" />
            Production Notes
          </h3>
          
          <div className="space-y-3">
            <AlertItem
              type="info"
              message="Script department ahead of schedule"
              time="2h ago"
            />
            <AlertItem
              type="warning"
              message="Sound design awaiting location specs"
              time="5h ago"
            />
            <AlertItem
              type="success"
              message="Art department concept approved"
              time="1d ago"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// CREW VIEW
// ============================================================================

function CrewView({ project }: { project: ProductionProject }) {
  const departmentIcons: Record<string, React.ComponentType<any>> = {
    'Script Department': FileText,
    'Direction': Video,
    'Camera': Camera,
    'Sound': Music,
    'Editorial': Scissors,
    'Art Department': Palette,
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-6">
        {project.crew.map(dept => {
          const Icon = departmentIcons[dept.name] || Briefcase;
          
          return (
            <div key={dept.id} className="glass-card p-6 rounded-xl hover:border-[#d4af37]/30 transition-all cursor-pointer">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-4">
                  <div className="p-3 rounded-xl bg-gradient-to-br from-[#d4af37]/20 to-transparent">
                    <Icon className="h-6 w-6 text-[#d4af37]" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">{dept.name}</h3>
                    <p className="text-white/50 text-sm">{dept.head}</p>
                  </div>
                </div>
                <StatusBadge status={dept.status} />
              </div>
              
              <div className="mb-4">
                <p className="text-sm text-white/70 mb-2">Current Task</p>
                <p className="text-white/90">{dept.currentTask}</p>
              </div>
              
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-white/50">Progress</span>
                  <span className="text-[#d4af37] font-medium">{dept.progress}%</span>
                </div>
                <div className="glass-progress">
                  <div 
                    className="glass-progress-fill"
                    style={{ width: `${dept.progress}%` }}
                  />
                </div>
              </div>
              
              <div className="mt-4 pt-4 border-t border-white/5 flex gap-2">
                <button className="flex-1 glass-button text-sm py-2 rounded-lg">
                  View Work
                </button>
                <button className="flex-1 glass-button text-sm py-2 rounded-lg">
                  Send Note
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ============================================================================
// DAILIES VIEW
// ============================================================================

function DailiesView({ project }: { project: ProductionProject }) {
  const [filter, setFilter] = useState<'all' | 'pending' | 'approved'>('all');
  
  const filtered = project.dailies.filter(d => {
    if (filter === 'pending') return d.status === 'pending-review';
    if (filter === 'approved') return d.status === 'approved';
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Filter Tabs */}
      <div className="flex gap-2">
        {[
          { id: 'all', label: 'All Deliverables' },
          { id: 'pending', label: 'Awaiting Review' },
          { id: 'approved', label: 'Approved' },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setFilter(tab.id as any)}
            className={`px-4 py-2 rounded-lg text-sm transition-all ${
              filter === tab.id
                ? 'bg-white/10 text-white'
                : 'text-white/50 hover:text-white/70'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>
      
      {/* Dailies Grid */}
      <div className="grid grid-cols-3 gap-6">
        {filtered.map(daily => (
          <div key={daily.id} className="glass-card rounded-xl overflow-hidden hover:border-[#d4af37]/30 transition-all">
            {/* Thumbnail */}
            <div className="aspect-video bg-gradient-to-br from-white/5 to-transparent flex items-center justify-center">
              <FileText className="h-12 w-12 text-white/20" />
            </div>
            
            {/* Info */}
            <div className="p-4">
              <div className="flex items-start justify-between mb-2">
                <h4 className="font-medium">{daily.name}</h4>
                <StatusBadge status={daily.status === 'pending-review' ? 'needs-review' : 'wrapped'} />
              </div>
              <p className="text-sm text-white/50 mb-4">{daily.department}</p>
              
              {daily.status === 'pending-review' && (
                <div className="flex gap-2">
                  <button className="flex-1 glass-button text-sm py-2 rounded-lg flex items-center justify-center gap-1">
                    <Eye className="h-3 w-3" />
                    Review
                  </button>
                  <button className="flex-1 bg-[#d4af37] text-[#0a0a0f] text-sm py-2 rounded-lg font-medium flex items-center justify-center gap-1">
                    <CheckCircle className="h-3 w-3" />
                    Approve
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ============================================================================
// SCHEDULE VIEW
// ============================================================================

function ScheduleView({ project }: { project: ProductionProject }) {
  const budgetPercent = (project.budget.spent / project.budget.total) * 100;
  
  return (
    <div className="grid grid-cols-2 gap-6">
      {/* Budget Section */}
      <div className="glass-card p-6 rounded-xl">
        <h3 className="text-lg font-semibold mb-6 flex items-center gap-2">
          <DollarSign className="h-5 w-5 text-[#d4af37]" />
          Production Budget
        </h3>
        
        <div className="flex items-end justify-between mb-6">
          <div>
            <p className="text-3xl font-bold">${project.budget.spent.toLocaleString()}</p>
            <p className="text-white/50">of ${project.budget.total.toLocaleString()} total</p>
          </div>
          <div className="text-right">
            <p className="text-2xl font-semibold text-[#d4af37]">{budgetPercent.toFixed(0)}%</p>
            <p className="text-white/50">utilized</p>
          </div>
        </div>
        
        <div className="glass-progress h-3 rounded-full mb-6">
          <div 
            className="glass-progress-fill rounded-full"
            style={{ width: `${budgetPercent}%` }}
          />
        </div>
        
        {/* Department Breakdown */}
        <div className="space-y-3">
          {[
            { name: 'Script & Development', amount: 3500, percent: 19 },
            { name: 'Direction', amount: 4200, percent: 23 },
            { name: 'Art Department', amount: 5800, percent: 31 },
            { name: 'Camera & Sound', amount: 2500, percent: 14 },
            { name: 'Post-Production', amount: 2500, percent: 14 },
          ].map(item => (
            <div key={item.name} className="flex items-center gap-4">
              <div className="flex-1">
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-white/70">{item.name}</span>
                  <span className="text-white/50">${item.amount.toLocaleString()}</span>
                </div>
                <div className="h-1.5 bg-white/5 rounded-full">
                  <div 
                    className="h-full bg-[#d4af37]/60 rounded-full"
                    style={{ width: `${item.percent}%` }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {/* Schedule Section */}
      <div className="glass-card p-6 rounded-xl">
        <h3 className="text-lg font-semibold mb-6 flex items-center gap-2">
          <Calendar className="h-5 w-5 text-[#d4af37]" />
          Production Schedule
        </h3>
        
        <div className="flex items-end justify-between mb-6">
          <div>
            <p className="text-3xl font-bold">{project.schedule.daysRemaining}</p>
            <p className="text-white/50">days until target wrap</p>
          </div>
          <div className="text-right">
            <p className="text-lg font-medium text-green-400">On Track</p>
            <p className="text-white/50">{project.schedule.targetWrap.toLocaleDateString()}</p>
          </div>
        </div>
        
        {/* Milestones */}
        <div className="space-y-4">
          {[
            { name: 'Script Lock', date: 'Jan 15', status: 'complete' },
            { name: 'Storyboard Complete', date: 'Jan 22', status: 'in-progress' },
            { name: 'Pre-Visualization', date: 'Feb 1', status: 'upcoming' },
            { name: 'Principal Photography', date: 'Feb 15', status: 'upcoming' },
            { name: 'Picture Lock', date: 'Mar 1', status: 'upcoming' },
            { name: 'Final Delivery', date: 'Mar 15', status: 'upcoming' },
          ].map((milestone, index) => (
            <div key={milestone.name} className="flex items-center gap-4">
              <div className={`w-3 h-3 rounded-full ${
                milestone.status === 'complete' 
                  ? 'bg-green-400' 
                  : milestone.status === 'in-progress'
                  ? 'bg-[#d4af37] animate-pulse'
                  : 'bg-white/20'
              }`} />
              <div className="flex-1 flex justify-between items-center">
                <span className={milestone.status === 'complete' ? 'text-white/50 line-through' : ''}>
                  {milestone.name}
                </span>
                <span className="text-sm text-white/40">{milestone.date}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// SUPPORTING COMPONENTS
// ============================================================================

function StatCard({ 
  icon: Icon, 
  label, 
  value, 
  trend,
  trendPositive = true 
}: { 
  icon: React.ComponentType<any>;
  label: string;
  value: string;
  trend: string;
  trendPositive?: boolean;
}) {
  return (
    <div className="glass-card p-5 rounded-xl">
      <div className="flex items-center gap-3 mb-3">
        <div className="p-2 rounded-lg bg-[#d4af37]/10">
          <Icon className="h-4 w-4 text-[#d4af37]" />
        </div>
        <span className="text-sm text-white/50">{label}</span>
      </div>
      <p className="text-2xl font-bold mb-1">{value}</p>
      <p className={`text-xs ${trendPositive ? 'text-green-400' : 'text-white/40'}`}>
        {trend}
      </p>
    </div>
  );
}

function CallSheetRow({ item }: { item: CallSheetItem }) {
  const priorityColors: Record<string, string> = {
    critical: 'bg-red-500/20 text-red-400 border-red-500/30',
    high: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
    normal: 'bg-white/5 text-white/60 border-white/10',
  };

  return (
    <div className="flex items-center gap-4 p-3 rounded-lg bg-white/[0.02] hover:bg-white/[0.04] transition-colors">
      <span className={`px-2 py-0.5 rounded text-xs font-medium border ${priorityColors[item.priority]}`}>
        {item.priority}
      </span>
      <div className="flex-1">
        <p className="text-sm font-medium">{item.task}</p>
        <p className="text-xs text-white/40">{item.department}</p>
      </div>
      <StatusBadge status={item.status === 'review' ? 'needs-review' : item.status === 'approved' ? 'wrapped' : 'standby'} />
    </div>
  );
}

function DepartmentCard({ department }: { department: CrewDepartment }) {
  const departmentIcons: Record<string, React.ComponentType<any>> = {
    'Script Department': FileText,
    'Direction': Video,
    'Camera': Camera,
    'Sound': Music,
    'Editorial': Scissors,
    'Art Department': Palette,
  };
  
  const Icon = departmentIcons[department.name] || Briefcase;

  return (
    <div className="p-4 rounded-lg bg-white/[0.02] hover:bg-white/[0.04] transition-colors cursor-pointer">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Icon className="h-4 w-4 text-[#d4af37]" />
          <span className="font-medium text-sm">{department.name}</span>
        </div>
        <StatusBadge status={department.status} small />
      </div>
      <div className="glass-progress h-1.5 rounded-full">
        <div 
          className="glass-progress-fill rounded-full"
          style={{ width: `${department.progress}%` }}
        />
      </div>
      <p className="text-xs text-white/40 mt-2 truncate">{department.currentTask}</p>
    </div>
  );
}

function DailyCard({ daily }: { daily: DailyItem }) {
  return (
    <div className="flex items-center gap-3 p-3 rounded-lg bg-white/[0.02] hover:bg-white/[0.04] transition-colors cursor-pointer">
      <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-[#d4af37]/20 to-transparent flex items-center justify-center">
        <FileText className="h-5 w-5 text-[#d4af37]" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-medium text-sm truncate">{daily.name}</p>
        <p className="text-xs text-white/40">{daily.department}</p>
      </div>
      <ChevronRight className="h-4 w-4 text-white/30" />
    </div>
  );
}

function StatusBadge({ status, small = false }: { status: string; small?: boolean }) {
  const configs: Record<string, { label: string; class: string }> = {
    rolling: { label: 'Rolling', class: 'bg-green-500/20 text-green-400' },
    standby: { label: 'Standby', class: 'bg-white/10 text-white/60' },
    wrapped: { label: 'Wrapped', class: 'bg-blue-500/20 text-blue-400' },
    'needs-review': { label: 'Review', class: 'bg-amber-500/20 text-amber-400' },
  };
  
  const config = configs[status] || configs.standby;
  
  return (
    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${config.class} ${small ? 'text-[10px]' : ''}`}>
      {config.label}
    </span>
  );
}

function AlertItem({ type, message, time }: { type: 'info' | 'warning' | 'success'; message: string; time: string }) {
  const colors: Record<string, string> = {
    info: 'bg-blue-500/20 border-blue-500/30',
    warning: 'bg-amber-500/20 border-amber-500/30',
    success: 'bg-green-500/20 border-green-500/30',
  };

  return (
    <div className={`p-3 rounded-lg border ${colors[type]}`}>
      <p className="text-sm">{message}</p>
      <p className="text-xs text-white/40 mt-1">{time}</p>
    </div>
  );
}

export default StudioPage;
