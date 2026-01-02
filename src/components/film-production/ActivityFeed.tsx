// src/components/film-production/ActivityFeed.tsx
import React, { useEffect, useState } from 'react';
import { useFilmProduction } from './FilmProductionProvider';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Activity,
  CheckCircle,
  AlertCircle,
  Clock,
  MessageSquare,
  FileText,
  Film,
  Image,
  Music,
  Clapperboard,
  Sparkles,
  User,
  Bot,
  ArrowRight,
} from 'lucide-react';

interface ActivityItem {
  id: string;
  type: 'task_started' | 'task_completed' | 'artifact_created' | 'approval_needed' | 'message' | 'phase_change' | 'tool_used';
  title: string;
  description: string;
  department?: string;
  agent?: string;
  timestamp: Date;
  metadata?: Record<string, any>;
}

/**
 * Real-time activity feed showing what agents are doing
 */
export function ActivityFeed() {
  const { currentProject } = useFilmProduction();
  const [activities, setActivities] = useState<ActivityItem[]>([]);
  
  // Simulate activity updates (in real implementation, this would come from websocket/event system)
  useEffect(() => {
    if (!currentProject) return;
    
    // Generate mock activities based on project state
    const mockActivities: ActivityItem[] = [
      {
        id: '1',
        type: 'phase_change',
        title: 'Production Phase Started',
        description: `Entering ${currentProject.currentPhase} phase`,
        timestamp: new Date(Date.now() - 3600000),
      },
      {
        id: '2',
        type: 'task_started',
        title: 'Writing Script',
        description: 'Writer Agent is developing the screenplay',
        department: 'writing',
        agent: 'writer',
        timestamp: new Date(Date.now() - 3000000),
      },
      {
        id: '3',
        type: 'tool_used',
        title: 'Using Celtx',
        description: 'Formatting screenplay in industry-standard format',
        department: 'writing',
        agent: 'writer',
        timestamp: new Date(Date.now() - 2400000),
        metadata: { tool: 'celtx' },
      },
      {
        id: '4',
        type: 'artifact_created',
        title: 'Script Draft Complete',
        description: 'First draft of screenplay ready for review',
        department: 'writing',
        agent: 'writer',
        timestamp: new Date(Date.now() - 1800000),
      },
      {
        id: '5',
        type: 'approval_needed',
        title: 'Review Required',
        description: 'Script draft needs producer approval',
        department: 'writing',
        timestamp: new Date(Date.now() - 1200000),
      },
      {
        id: '6',
        type: 'task_started',
        title: 'Creating Storyboards',
        description: 'Generating visual story frames with AI',
        department: 'direction',
        agent: 'director',
        timestamp: new Date(Date.now() - 600000),
      },
    ];
    
    setActivities(mockActivities);
  }, [currentProject]);

  const getActivityIcon = (type: string, department?: string) => {
    const icons: Record<string, React.ComponentType<any>> = {
      task_started: Clock,
      task_completed: CheckCircle,
      artifact_created: FileText,
      approval_needed: AlertCircle,
      message: MessageSquare,
      phase_change: Clapperboard,
      tool_used: Sparkles,
    };
    
    return icons[type] || Activity;
  };

  const getActivityColor = (type: string) => {
    const colors: Record<string, string> = {
      task_started: 'text-blue-500 bg-blue-500/10',
      task_completed: 'text-green-500 bg-green-500/10',
      artifact_created: 'text-purple-500 bg-purple-500/10',
      approval_needed: 'text-yellow-500 bg-yellow-500/10',
      message: 'text-gray-500 bg-gray-500/10',
      phase_change: 'text-primary bg-primary/10',
      tool_used: 'text-pink-500 bg-pink-500/10',
    };
    
    return colors[type] || 'text-muted-foreground bg-muted';
  };

  const formatTime = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    
    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return date.toLocaleDateString();
  };

  const getDepartmentColor = (department?: string) => {
    const colors: Record<string, string> = {
      writing: 'bg-amber-500',
      direction: 'bg-blue-500',
      cinematography: 'bg-purple-500',
      audio: 'bg-green-500',
      editing: 'bg-red-500',
      production_design: 'bg-pink-500',
      production: 'bg-gray-500',
    };
    
    return colors[department || ''] || 'bg-gray-500';
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-base">
          <Activity className="h-5 w-5" />
          Activity Feed
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[400px] pr-4">
          <div className="space-y-4">
            {activities.map((activity, index) => {
              const Icon = getActivityIcon(activity.type, activity.department);
              const colorClass = getActivityColor(activity.type);
              
              return (
                <div key={activity.id} className="flex gap-3">
                  {/* Timeline line */}
                  <div className="flex flex-col items-center">
                    <div className={`p-2 rounded-full ${colorClass}`}>
                      <Icon className="h-4 w-4" />
                    </div>
                    {index < activities.length - 1 && (
                      <div className="w-0.5 h-full bg-border mt-2" />
                    )}
                  </div>
                  
                  {/* Content */}
                  <div className="flex-1 pb-4">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="font-medium text-sm">{activity.title}</p>
                      {activity.department && (
                        <Badge 
                          variant="outline" 
                          className={`text-xs text-white ${getDepartmentColor(activity.department)}`}
                        >
                          {activity.department.replace('_', ' ')}
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">
                      {activity.description}
                    </p>
                    <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
                      {activity.agent && (
                        <span className="flex items-center gap-1">
                          <Bot className="h-3 w-3" />
                          {activity.agent}
                        </span>
                      )}
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {formatTime(activity.timestamp)}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
            
            {activities.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                <Activity className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p>No activity yet</p>
              </div>
            )}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}

/**
 * Compact activity indicator for header/sidebar
 */
export function ActivityIndicator() {
  const { currentProject } = useFilmProduction();
  const [isActive, setIsActive] = useState(false);
  
  // Pulse when there's active work
  useEffect(() => {
    if (!currentProject) return;
    setIsActive(currentProject.status === 'in_progress');
  }, [currentProject]);

  if (!currentProject) return null;

  return (
    <div className="flex items-center gap-2">
      <div className={`relative ${isActive ? 'animate-pulse' : ''}`}>
        <Activity className="h-4 w-4 text-muted-foreground" />
        {isActive && (
          <span className="absolute -top-1 -right-1 h-2 w-2 bg-green-500 rounded-full" />
        )}
      </div>
      <span className="text-xs text-muted-foreground">
        {isActive ? 'Working...' : 'Idle'}
      </span>
    </div>
  );
}
