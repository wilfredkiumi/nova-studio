// src/components/film-production/ProducerDashboard.tsx
import React from 'react';
import { useFilmProduction } from './FilmProductionProvider';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Film, 
  DollarSign, 
  Calendar, 
  Users, 
  AlertTriangle,
  CheckCircle,
  Clock,
  Play,
  Loader2,
  RefreshCw
} from 'lucide-react';

/**
 * Producer Dashboard - Main control panel for the film owner
 */
export function ProducerDashboard() {
  const { 
    currentProject, 
    isLoading, 
    error,
    runPhase,
    refreshStatus 
  } = useFilmProduction();

  if (!currentProject) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <Film className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
          <h2 className="text-xl font-semibold mb-2">No Active Project</h2>
          <p className="text-muted-foreground mb-4">
            Start a new project to see your producer dashboard
          </p>
          <Button>Create New Project</Button>
        </div>
      </div>
    );
  }

  const phases = ['development', 'pre-production', 'production', 'post-production', 'distribution'];
  const currentPhaseIndex = phases.indexOf(currentProject.phase);

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Film className="h-8 w-8" />
            {currentProject.title}
          </h1>
          <p className="text-muted-foreground">Producer Dashboard</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={refreshStatus}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        </div>
      </div>

      {/* Error Alert */}
      {error && (
        <div className="bg-destructive/10 border border-destructive text-destructive px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      {/* Phase Progress */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">Production Phase</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between mb-4">
            {phases.map((phase, index) => (
              <div 
                key={phase}
                className={`flex flex-col items-center ${
                  index <= currentPhaseIndex ? 'text-primary' : 'text-muted-foreground'
                }`}
              >
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  index < currentPhaseIndex 
                    ? 'bg-primary text-primary-foreground' 
                    : index === currentPhaseIndex
                    ? 'bg-primary/20 border-2 border-primary'
                    : 'bg-muted'
                }`}>
                  {index < currentPhaseIndex ? <CheckCircle className="h-4 w-4" /> : index + 1}
                </div>
                <span className="text-xs mt-1 capitalize">{phase.replace('-', ' ')}</span>
              </div>
            ))}
          </div>
          <Progress value={currentProject.progress} className="h-2" />
          <p className="text-sm text-muted-foreground mt-2">
            Overall Progress: {currentProject.progress.toFixed(1)}%
          </p>
        </CardContent>
      </Card>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Budget */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <DollarSign className="h-4 w-4" />
              Budget
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${currentProject.budget.remaining.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">
              of ${currentProject.budget.total.toLocaleString()} remaining
            </p>
            <Progress 
              value={(currentProject.budget.spent / currentProject.budget.total) * 100} 
              className={`h-2 mt-2 ${!currentProject.budget.isOnTrack ? '[&>div]:bg-destructive' : ''}`}
            />
            <Badge 
              variant={currentProject.budget.isOnTrack ? 'default' : 'destructive'}
              className="mt-2"
            >
              {currentProject.budget.isOnTrack ? 'On Track' : 'Over Budget'}
            </Badge>
          </CardContent>
        </Card>

        {/* Schedule */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Schedule
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {currentProject.schedule.daysRemaining} days
            </div>
            <p className="text-xs text-muted-foreground">
              remaining until delivery
            </p>
            <div className="mt-2">
              <Badge variant={currentProject.schedule.isOnSchedule ? 'default' : 'destructive'}>
                {currentProject.schedule.isOnSchedule ? 'On Schedule' : 'Behind Schedule'}
              </Badge>
            </div>
            <p className="text-xs mt-2">
              Next: {currentProject.schedule.currentMilestone}
            </p>
          </CardContent>
        </Card>

        {/* Alerts */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <AlertTriangle className="h-4 w-4" />
              Alerts
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {currentProject.alerts.length}
            </div>
            <p className="text-xs text-muted-foreground mb-2">
              items need attention
            </p>
            {currentProject.alerts.slice(0, 2).map((alert, i) => (
              <p key={i} className="text-xs text-destructive truncate">
                • {alert}
              </p>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Departments & Pending Approvals */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Department Status */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Departments
            </CardTitle>
            <CardDescription>
              Status of each department under Director's supervision
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {currentProject.departments.map((dept) => (
                <div key={dept.name} className="flex items-center justify-between">
                  <span className="font-medium">{dept.name}</span>
                  <Badge variant={
                    dept.status === 'completed' ? 'default' :
                    dept.status === 'working' ? 'secondary' :
                    dept.status === 'blocked' ? 'destructive' : 'outline'
                  }>
                    {dept.status === 'working' && <Loader2 className="h-3 w-3 mr-1 animate-spin" />}
                    {dept.status === 'completed' && <CheckCircle className="h-3 w-3 mr-1" />}
                    {dept.status === 'idle' && <Clock className="h-3 w-3 mr-1" />}
                    {dept.status}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Pending Approvals */}
        <Card>
          <CardHeader>
            <CardTitle>Pending Approvals</CardTitle>
            <CardDescription>
              Items waiting for your decision
            </CardDescription>
          </CardHeader>
          <CardContent>
            {currentProject.pendingApprovals.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <CheckCircle className="h-8 w-8 mx-auto mb-2" />
                <p>No pending approvals</p>
              </div>
            ) : (
              <div className="space-y-3">
                {currentProject.pendingApprovals.map((item) => (
                  <div key={item.id} className="border rounded-lg p-3">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium">{item.title}</span>
                      <Badge variant="outline">{item.type}</Badge>
                    </div>
                    <p className="text-xs text-muted-foreground mb-2">
                      From: {item.department}
                    </p>
                    <div className="flex gap-2">
                      <Button size="sm" className="flex-1">Approve</Button>
                      <Button size="sm" variant="outline" className="flex-1">Review</Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Action Buttons */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-wrap gap-3">
            {currentPhaseIndex < phases.length - 1 && (
              <Button 
                onClick={() => runPhase(phases[currentPhaseIndex + 1] as any)}
                disabled={isLoading}
              >
                {isLoading ? (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <Play className="h-4 w-4 mr-2" />
                )}
                Start {phases[currentPhaseIndex + 1]?.replace('-', ' ')}
              </Button>
            )}
            <Button variant="outline">View All Deliverables</Button>
            <Button variant="outline">Budget Details</Button>
            <Button variant="outline">Schedule Timeline</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
