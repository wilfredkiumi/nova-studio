// src/pages/FilmProduction.tsx
import React, { useState } from 'react';
import { FilmProductionProvider, useFilmProduction } from '@/components/film-production/FilmProductionProvider';
import { ProducerDashboard } from '@/components/film-production/ProducerDashboard';
import { NewProjectWizard } from '@/components/film-production/NewProjectWizard';
import { DeliverableList } from '@/components/film-production/DeliverableReview';
import { ActivityFeed, ActivityIndicator } from '@/components/film-production/ActivityFeed';
import { DepartmentOverview } from '@/components/film-production/DepartmentView';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { 
  Film, 
  Plus, 
  LayoutDashboard, 
  Users, 
  FileCheck, 
  Activity,
  Settings,
  HelpCircle,
} from 'lucide-react';

/**
 * Main Film Production Page
 */
function FilmProductionContent() {
  const { currentProject, isLoading } = useFilmProduction();
  const [showNewProject, setShowNewProject] = useState(false);
  const [activeTab, setActiveTab] = useState('dashboard');

  // Show wizard if no project
  if (!currentProject && !showNewProject) {
    return (
      <div className="container mx-auto py-8 max-w-4xl">
        <div className="text-center mb-8">
          <Film className="h-16 w-16 mx-auto mb-4 text-primary" />
          <h1 className="text-3xl font-bold mb-2">AI Film Production Studio</h1>
          <p className="text-muted-foreground max-w-md mx-auto">
            Create professional films with AI-powered sub-agents handling every department, 
            from writing to final cut.
          </p>
        </div>
        
        <div className="grid gap-4 md:grid-cols-3 mb-8">
          <FeatureCard
            icon={Users}
            title="7 AI Departments"
            description="Writer, Director, Cinematographer, Audio, Editor, Production Designer, Production Manager"
          />
          <FeatureCard
            icon={Settings}
            title="Pro Tools Integrated"
            description="Celtx, StudioBinder, Veo 2, InVideo, ElevenLabs, Midjourney, and more"
          />
          <FeatureCard
            icon={Film}
            title="End-to-End Production"
            description="From logline to final export with full producer oversight"
          />
        </div>
        
        <div className="flex justify-center">
          <Button size="lg" onClick={() => setShowNewProject(true)}>
            <Plus className="h-5 w-5 mr-2" />
            Create Your First Film
          </Button>
        </div>
      </div>
    );
  }

  if (showNewProject) {
    return (
      <div className="container mx-auto py-8">
        <NewProjectWizard 
          onComplete={() => setShowNewProject(false)} 
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Film className="h-6 w-6 text-primary" />
            <div>
              <h1 className="font-semibold">{currentProject.brief.title}</h1>
              <p className="text-xs text-muted-foreground capitalize">
                {currentProject.currentPhase} Phase
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <ActivityIndicator />
            <Button variant="outline" size="sm" onClick={() => setShowNewProject(true)}>
              <Plus className="h-4 w-4 mr-2" />
              New Project
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-6">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-6">
            <TabsTrigger value="dashboard" className="flex items-center gap-2">
              <LayoutDashboard className="h-4 w-4" />
              Dashboard
            </TabsTrigger>
            <TabsTrigger value="departments" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              Departments
            </TabsTrigger>
            <TabsTrigger value="deliverables" className="flex items-center gap-2">
              <FileCheck className="h-4 w-4" />
              Deliverables
            </TabsTrigger>
            <TabsTrigger value="activity" className="flex items-center gap-2">
              <Activity className="h-4 w-4" />
              Activity
            </TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard">
            <ProducerDashboard />
          </TabsContent>

          <TabsContent value="departments">
            <DepartmentOverview />
          </TabsContent>

          <TabsContent value="deliverables">
            <DeliverableList />
          </TabsContent>

          <TabsContent value="activity">
            <div className="max-w-2xl">
              <ActivityFeed />
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

function FeatureCard({ 
  icon: Icon, 
  title, 
  description 
}: { 
  icon: React.ComponentType<any>;
  title: string;
  description: string;
}) {
  return (
    <div className="p-4 border rounded-lg text-center">
      <Icon className="h-8 w-8 mx-auto mb-2 text-primary" />
      <h3 className="font-medium mb-1">{title}</h3>
      <p className="text-sm text-muted-foreground">{description}</p>
    </div>
  );
}

/**
 * Film Production Page with Provider
 */
export default function FilmProduction() {
  return (
    <FilmProductionProvider>
      <FilmProductionContent />
    </FilmProductionProvider>
  );
}
