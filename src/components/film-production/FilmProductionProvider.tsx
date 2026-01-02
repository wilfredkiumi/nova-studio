// src/components/film-production/FilmProductionProvider.tsx
import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { FilmProductionSystem, createFilmProduction } from '@/services/movie-production';
import { ProductionPhase } from '@/services/types';

/**
 * Producer Brief for starting a new project
 */
export interface ProducerBrief {
  title: string;
  logline: string;
  synopsis?: string;
  genre: string;
  targetAudience: string;
  budget: number;
  timeline: {
    startDate: Date;
    targetReleaseDate: Date;
  };
  creativeBrief?: {
    tone: string;
    visualStyle: string;
    references: string[];
  };
}

/**
 * Project status for UI
 */
export interface ProjectStatus {
  id: string;
  title: string;
  phase: ProductionPhase;
  progress: number;
  budget: {
    total: number;
    spent: number;
    remaining: number;
    isOnTrack: boolean;
  };
  schedule: {
    daysRemaining: number;
    isOnSchedule: boolean;
    currentMilestone: string;
  };
  departments: Array<{
    name: string;
    status: 'idle' | 'working' | 'blocked' | 'completed';
    lastActivity?: string;
  }>;
  alerts: string[];
  pendingApprovals: Array<{
    id: string;
    type: 'deliverable' | 'budget' | 'decision';
    title: string;
    department: string;
    createdAt: Date;
  }>;
}

/**
 * Film Production Context
 */
interface FilmProductionContextType {
  // State
  system: FilmProductionSystem | null;
  isInitialized: boolean;
  isLoading: boolean;
  currentProject: ProjectStatus | null;
  error: string | null;

  // Actions
  initialize: () => Promise<void>;
  startProject: (brief: ProducerBrief) => Promise<string>;
  runPhase: (phase: ProductionPhase) => Promise<void>;
  approveDeliverable: (deliverableId: string) => Promise<void>;
  requestRevision: (deliverableId: string, notes: string) => Promise<void>;
  approveBudgetRequest: (requestId: string) => Promise<void>;
  getDeliverables: (phase: ProductionPhase) => Promise<any[]>;
  refreshStatus: () => void;
}

const FilmProductionContext = createContext<FilmProductionContextType | null>(null);

/**
 * Film Production Provider - Connects React UI to the production system
 */
export function FilmProductionProvider({ children }: { children: React.ReactNode }) {
  const [system, setSystem] = useState<FilmProductionSystem | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [currentProject, setCurrentProject] = useState<ProjectStatus | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Initialize the production system
  const initialize = useCallback(async () => {
    if (isInitialized) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      const productionSystem = await createFilmProduction();
      setSystem(productionSystem);
      setIsInitialized(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to initialize');
    } finally {
      setIsLoading(false);
    }
  }, [isInitialized]);

  // Start a new project
  const startProject = useCallback(async (brief: ProducerBrief): Promise<string> => {
    if (!system) throw new Error('System not initialized');
    
    setIsLoading(true);
    setError(null);
    
    try {
      const { projectId } = await system.startProject(brief);
      
      // Get initial status
      const dashboard = system.getProducerDashboard();
      setCurrentProject({
        id: projectId,
        title: dashboard.project.title,
        phase: dashboard.project.status,
        progress: dashboard.project.progress,
        budget: dashboard.budget,
        schedule: dashboard.schedule,
        departments: dashboard.departments.map(d => ({
          ...d,
          status: d.status as any,
        })),
        alerts: dashboard.alerts,
        pendingApprovals: [],
      });
      
      return projectId;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to start project');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [system]);

  // Run a production phase
  const runPhase = useCallback(async (phase: ProductionPhase) => {
    if (!system) throw new Error('System not initialized');
    
    setIsLoading(true);
    setError(null);
    
    try {
      const { dashboard } = await system.runPhase(phase);
      
      setCurrentProject(prev => prev ? {
        ...prev,
        phase: dashboard.project.status,
        progress: dashboard.project.progress,
        budget: dashboard.budget,
        schedule: dashboard.schedule,
        departments: dashboard.departments.map(d => ({
          ...d,
          status: d.status as any,
        })),
        alerts: dashboard.alerts,
      } : null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to run phase');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [system]);

  // Approve a deliverable
  const approveDeliverable = useCallback(async (deliverableId: string) => {
    if (!system) throw new Error('System not initialized');
    
    await system.makeDecision({
      type: 'approve',
      subject: `Deliverable ${deliverableId}`,
      details: 'Producer approved',
    });
    
    // Remove from pending
    setCurrentProject(prev => prev ? {
      ...prev,
      pendingApprovals: prev.pendingApprovals.filter(p => p.id !== deliverableId),
    } : null);
  }, [system]);

  // Request revision
  const requestRevision = useCallback(async (deliverableId: string, notes: string) => {
    if (!system) throw new Error('System not initialized');
    
    await system.makeDecision({
      type: 'modify',
      subject: `Deliverable ${deliverableId}`,
      details: notes,
    });
  }, [system]);

  // Approve budget request
  const approveBudgetRequest = useCallback(async (requestId: string) => {
    if (!system) throw new Error('System not initialized');
    
    await system.makeDecision({
      type: 'approve',
      subject: `Budget request ${requestId}`,
      details: 'Approved by Producer',
    });
    
    setCurrentProject(prev => prev ? {
      ...prev,
      pendingApprovals: prev.pendingApprovals.filter(p => p.id !== requestId),
    } : null);
  }, [system]);

  // Get deliverables for a phase
  const getDeliverables = useCallback(async (phase: ProductionPhase) => {
    if (!system) throw new Error('System not initialized');
    
    const { deliverables } = await system.getDeliverables(phase);
    return deliverables;
  }, [system]);

  // Refresh current status
  const refreshStatus = useCallback(() => {
    if (!system || !currentProject) return;
    
    try {
      const dashboard = system.getProducerDashboard();
      setCurrentProject(prev => prev ? {
        ...prev,
        phase: dashboard.project.status,
        progress: dashboard.project.progress,
        budget: dashboard.budget,
        schedule: dashboard.schedule,
        alerts: dashboard.alerts,
      } : null);
    } catch (err) {
      console.error('Failed to refresh status:', err);
    }
  }, [system, currentProject]);

  // Auto-initialize on mount
  useEffect(() => {
    initialize();
  }, [initialize]);

  const value: FilmProductionContextType = {
    system,
    isInitialized,
    isLoading,
    currentProject,
    error,
    initialize,
    startProject,
    runPhase,
    approveDeliverable,
    requestRevision,
    approveBudgetRequest,
    getDeliverables,
    refreshStatus,
  };

  return (
    <FilmProductionContext.Provider value={value}>
      {children}
    </FilmProductionContext.Provider>
  );
}

/**
 * Hook to use film production context
 */
export function useFilmProduction() {
  const context = useContext(FilmProductionContext);
  if (!context) {
    throw new Error('useFilmProduction must be used within FilmProductionProvider');
  }
  return context;
}
