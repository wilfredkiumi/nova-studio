// src/components/film-production/DepartmentView.tsx
import React, { useState } from 'react';
import { useFilmProduction } from './FilmProductionProvider';
import { FilmDepartment, ProductionArtifact, Skill } from '@/services/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Pen,
  Video,
  Camera,
  Music,
  Scissors,
  Palette,
  Briefcase,
  User,
  Bot,
  Wrench,
  FileText,
  CheckCircle,
  Clock,
  AlertCircle,
  ChevronRight,
} from 'lucide-react';

interface DepartmentConfig {
  id: FilmDepartment;
  name: string;
  icon: React.ComponentType<any>;
  color: string;
  description: string;
}

const DEPARTMENTS: DepartmentConfig[] = [
  {
    id: 'writing',
    name: 'Writing',
    icon: Pen,
    color: 'bg-amber-500',
    description: 'Screenplay, dialogue, and story development',
  },
  {
    id: 'direction',
    name: 'Direction',
    icon: Video,
    color: 'bg-blue-500',
    description: 'Creative vision and shot planning',
  },
  {
    id: 'cinematography',
    name: 'Cinematography',
    icon: Camera,
    color: 'bg-purple-500',
    description: 'Visual capture and camera work',
  },
  {
    id: 'audio',
    name: 'Audio',
    icon: Music,
    color: 'bg-green-500',
    description: 'Sound design, music, and voice',
  },
  {
    id: 'editing',
    name: 'Editing',
    icon: Scissors,
    color: 'bg-red-500',
    description: 'Post-production and assembly',
  },
  {
    id: 'production_design',
    name: 'Production Design',
    icon: Palette,
    color: 'bg-pink-500',
    description: 'Sets, props, and visual environment',
  },
  {
    id: 'production',
    name: 'Production',
    icon: Briefcase,
    color: 'bg-gray-500',
    description: 'Scheduling and resource management',
  },
];

/**
 * Department Overview Grid
 */
export function DepartmentOverview() {
  const { currentProject } = useFilmProduction();
  const [selectedDepartment, setSelectedDepartment] = useState<FilmDepartment | null>(null);

  if (!currentProject) return null;

  const getDepartmentStatus = (deptId: FilmDepartment) => {
    // In real implementation, check agent status and tasks
    const artifacts = currentProject.context.artifacts.filter(
      a => a.createdBy?.toLowerCase().includes(deptId.split('_')[0])
    );
    
    if (artifacts.some(a => a.status === 'pending_review')) return 'review_needed';
    if (artifacts.some(a => a.status === 'in_progress')) return 'working';
    return 'idle';
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Departments</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {DEPARTMENTS.map(dept => {
          const Icon = dept.icon;
          const status = getDepartmentStatus(dept.id);
          
          return (
            <Card 
              key={dept.id}
              className={`cursor-pointer transition-all hover:shadow-md ${
                selectedDepartment === dept.id ? 'ring-2 ring-primary' : ''
              }`}
              onClick={() => setSelectedDepartment(
                selectedDepartment === dept.id ? null : dept.id
              )}
            >
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <div className={`p-2 rounded-lg ${dept.color}`}>
                    <Icon className="h-4 w-4 text-white" />
                  </div>
                  <StatusBadge status={status} />
                </div>
                <CardTitle className="text-base mt-2">{dept.name}</CardTitle>
                <CardDescription className="text-xs">
                  {dept.description}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">View details</span>
                  <ChevronRight className="h-4 w-4" />
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {selectedDepartment && (
        <DepartmentDetail 
          department={selectedDepartment} 
          onClose={() => setSelectedDepartment(null)}
        />
      )}
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const config: Record<string, { label: string; variant: 'default' | 'secondary' | 'destructive' | 'outline' }> = {
    working: { label: 'Working', variant: 'default' },
    review_needed: { label: 'Review', variant: 'destructive' },
    idle: { label: 'Idle', variant: 'secondary' },
  };
  
  const { label, variant } = config[status] || config.idle;
  
  return (
    <Badge variant={variant} className="text-xs">
      {label}
    </Badge>
  );
}

/**
 * Detailed view of a single department
 */
export function DepartmentDetail({ 
  department, 
  onClose 
}: { 
  department: FilmDepartment;
  onClose: () => void;
}) {
  const { currentProject } = useFilmProduction();
  const deptConfig = DEPARTMENTS.find(d => d.id === department);
  
  if (!deptConfig || !currentProject) return null;

  const Icon = deptConfig.icon;
  
  // Get department-specific data
  const artifacts = currentProject.context.artifacts.filter(
    a => a.createdBy?.toLowerCase().includes(department.split('_')[0])
  );

  // Mock skills for demonstration
  const skills: Skill[] = [
    { id: '1', name: 'Script Writing', description: 'Create screenplays', level: 'expert', department },
    { id: '2', name: 'Dialogue', description: 'Write character dialogue', level: 'advanced', department },
    { id: '3', name: 'Story Structure', description: 'Plot development', level: 'expert', department },
  ];

  // Mock tools for demonstration  
  const tools = [
    { name: 'Celtx', status: 'connected', usage: '5 API calls today' },
    { name: 'Claude AI', status: 'connected', usage: '12 requests' },
  ];

  return (
    <Card className="mt-4">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`p-3 rounded-lg ${deptConfig.color}`}>
              <Icon className="h-6 w-6 text-white" />
            </div>
            <div>
              <CardTitle>{deptConfig.name} Department</CardTitle>
              <CardDescription>{deptConfig.description}</CardDescription>
            </div>
          </div>
          <Button variant="outline" size="sm" onClick={onClose}>
            Close
          </Button>
        </div>
      </CardHeader>
      
      <CardContent>
        <Tabs defaultValue="agent">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="agent">Agent</TabsTrigger>
            <TabsTrigger value="skills">Skills</TabsTrigger>
            <TabsTrigger value="tools">Tools</TabsTrigger>
            <TabsTrigger value="outputs">Outputs</TabsTrigger>
          </TabsList>
          
          <TabsContent value="agent" className="mt-4">
            <div className="space-y-4">
              <div className="flex items-center gap-3 p-4 bg-muted/50 rounded-lg">
                <div className="p-2 bg-background rounded-full">
                  <Bot className="h-6 w-6" />
                </div>
                <div>
                  <p className="font-medium capitalize">{department.replace('_', ' ')} Agent</p>
                  <p className="text-sm text-muted-foreground">AI-powered sub-agent</p>
                </div>
                <Badge className="ml-auto bg-green-500">Active</Badge>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 border rounded-lg">
                  <p className="text-sm text-muted-foreground">Tasks Completed</p>
                  <p className="text-2xl font-bold">12</p>
                </div>
                <div className="p-3 border rounded-lg">
                  <p className="text-sm text-muted-foreground">Pending Tasks</p>
                  <p className="text-2xl font-bold">3</p>
                </div>
              </div>
              
              <div>
                <p className="text-sm font-medium mb-2">Current Task</p>
                <div className="p-3 border rounded-lg flex items-center gap-3">
                  <Clock className="h-4 w-4 text-blue-500" />
                  <div className="flex-1">
                    <p className="text-sm">Writing scene 3 dialogue</p>
                    <Progress value={65} className="h-1 mt-2" />
                  </div>
                  <span className="text-sm text-muted-foreground">65%</span>
                </div>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="skills" className="mt-4">
            <ScrollArea className="h-[200px]">
              <div className="space-y-2">
                {skills.map(skill => (
                  <div key={skill.id} className="flex items-center gap-3 p-3 border rounded-lg">
                    <Wrench className="h-4 w-4 text-muted-foreground" />
                    <div className="flex-1">
                      <p className="font-medium text-sm">{skill.name}</p>
                      <p className="text-xs text-muted-foreground">{skill.description}</p>
                    </div>
                    <Badge variant="outline" className="capitalize">
                      {skill.level}
                    </Badge>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </TabsContent>
          
          <TabsContent value="tools" className="mt-4">
            <div className="space-y-2">
              {tools.map(tool => (
                <div key={tool.name} className="flex items-center gap-3 p-3 border rounded-lg">
                  <div className="p-2 bg-muted rounded">
                    <Wrench className="h-4 w-4" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-sm">{tool.name}</p>
                    <p className="text-xs text-muted-foreground">{tool.usage}</p>
                  </div>
                  <Badge variant="outline" className="bg-green-500/10 text-green-500">
                    {tool.status}
                  </Badge>
                </div>
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="outputs" className="mt-4">
            <ScrollArea className="h-[200px]">
              <div className="space-y-2">
                {artifacts.length > 0 ? (
                  artifacts.map(artifact => (
                    <div key={artifact.id} className="flex items-center gap-3 p-3 border rounded-lg">
                      <FileText className="h-4 w-4 text-muted-foreground" />
                      <div className="flex-1">
                        <p className="font-medium text-sm">{artifact.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(artifact.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      <Badge variant={
                        artifact.status === 'approved' ? 'default' :
                        artifact.status === 'pending_review' ? 'secondary' :
                        'outline'
                      }>
                        {artifact.status.replace('_', ' ')}
                      </Badge>
                    </div>
                  ))
                ) : (
                  <p className="text-center text-muted-foreground py-8">
                    No outputs yet
                  </p>
                )}
              </div>
            </ScrollArea>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
