// src/services/movie-production/FilmProductionSystem.ts
import { DirectorOrchestrator } from './DirectorOrchestrator';
import { ProductionManager } from './ProductionManager';
import { WriterAgent } from './agents/WriterAgent';
import { CinematographerAgent } from './agents/CinematographerAgent';
import { AudioAgent } from './agents/AudioAgent';
import { EditorAgent } from './agents/EditorAgent';
import { ProductionDesignerAgent } from './agents/ProductionDesignerAgent';
import { initializeToolRegistry } from './tools';
import {
  MovieProject,
  ProductionPhase,
  ProductionContext,
  FilmDepartment,
} from '../types';

/**
 * Producer's project brief
 */
interface ProducerBrief {
  title: string;
  logline: string;      // One sentence hook (e.g., "A detective must solve...")
  synopsis?: string;    // 2-4 sentence summary with more plot detail
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
  requirements?: string[];
}

/**
 * Production status for Producer dashboard
 */
interface ProducerDashboard {
  project: {
    title: string;
    status: ProductionPhase;
    progress: number;
  };
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
    status: 'idle' | 'working' | 'blocked' | 'error';
    lastDeliverable?: string;
  }>;
  alerts: string[];
  recentActivity: string[];
}

/**
 * Film Production System
 * 
 * This is the main entry point for creating films with AI agents.
 * 
 * Hierarchy:
 * - Producer (Owner/Human) - Provides brief, approves major decisions, owns the work
 * - Production Manager - Manages budget, schedule, resources
 * - Director (Orchestrator) - Creative lead, coordinates all sub-agents
 * - Sub-Agents - Writer, Cinematographer, Audio, Editor, Production Designer
 * 
 * The system makes filmmaking as easy as content creation using AI workflows.
 */
export class FilmProductionSystem {
  private productionManager: ProductionManager;
  private director: DirectorOrchestrator;
  private project: MovieProject | null = null;
  private context: ProductionContext | null = null;
  private activityLog: string[] = [];

  // Sub-agents under Director
  private writerAgent: WriterAgent;
  private cinematographerAgent: CinematographerAgent;
  private audioAgent: AudioAgent;
  private editorAgent: EditorAgent;
  private productionDesignerAgent: ProductionDesignerAgent;

  constructor() {
    // Create the hierarchy
    this.productionManager = new ProductionManager();
    this.director = new DirectorOrchestrator();
    
    // Create sub-agents that assist the Director
    this.writerAgent = new WriterAgent();
    this.cinematographerAgent = new CinematographerAgent();
    this.audioAgent = new AudioAgent();
    this.editorAgent = new EditorAgent();
    this.productionDesignerAgent = new ProductionDesignerAgent();

    // Wire up hierarchy
    this.productionManager.setDirector(this.director);
    
    // Register sub-agents with Director
    this.director.registerSubAgent(this.writerAgent);
    this.director.registerSubAgent(this.cinematographerAgent);
    this.director.registerSubAgent(this.audioAgent);
    this.director.registerSubAgent(this.editorAgent);
    this.director.registerSubAgent(this.productionDesignerAgent);
  }

  /**
   * Initialize the production system
   * Call this before starting a project
   */
  async initialize(): Promise<void> {
    // Initialize tool registry
    await initializeToolRegistry();
    
    this.log('Film Production System initialized');
    this.log('Hierarchy: Producer → Production Manager → Director → Sub-Agents');
  }

  /**
   * Start a new film project (called by Producer)
   */
  async startProject(brief: ProducerBrief): Promise<{
    projectId: string;
    message: string;
  }> {
    this.log(`Producer initiated new project: ${brief.title}`);

    // Create project from brief
    this.project = {
      id: `film-${Date.now()}`,
      title: brief.title,
      logline: brief.logline,
      synopsis: brief.synopsis,
      genre: brief.genre as any,
      targetAudience: brief.targetAudience,
      budget: brief.budget,
      status: 'development',
      createdAt: new Date(),
    };

    // Create production context
    this.context = {
      project: this.project,
      currentPhase: 'development',
      activeAgents: new Set(),
      artifacts: new Map(),
      timeline: {
        startDate: brief.timeline.startDate,
        phases: {},
      },
    };

    // Initialize Production Manager budget
    this.productionManager.initializeBudget(brief.budget, {
      writing: brief.budget * 0.05,
      direction: brief.budget * 0.10,
      cinematography: brief.budget * 0.25,
      production: brief.budget * 0.15,
      audio: brief.budget * 0.10,
      editing: brief.budget * 0.15,
      'production-design': brief.budget * 0.20,
    });

    // Set schedule
    this.productionManager.setSchedule(
      brief.timeline.startDate,
      brief.timeline.targetReleaseDate,
      this.generateDefaultMilestones(brief.timeline.startDate, brief.timeline.targetReleaseDate)
    );

    // Initialize all agents with context
    await this.initializeAgents();

    // Set creative vision with Director
    if (brief.creativeBrief) {
      this.director.setCreativeVision(brief.creativeBrief);
    }

    this.log(`Project ${this.project.id} created successfully`);

    return {
      projectId: this.project.id,
      message: `Project "${brief.title}" is ready. Production Manager and Director are standing by.`,
    };
  }

  /**
   * Run a production phase (Producer approves, Production Manager coordinates, Director executes)
   */
  async runPhase(phase: ProductionPhase): Promise<{
    success: boolean;
    summary: string;
    dashboard: ProducerDashboard;
  }> {
    if (!this.project || !this.context) {
      throw new Error('No active project. Call startProject first.');
    }

    this.log(`Producer approved ${phase} phase to begin`);

    // Production Manager coordinates the phase
    const { success, report } = await this.productionManager.runPhase(phase);

    // Update project status
    this.project.status = phase;

    const summary = this.generatePhaseSummary(phase, report);
    this.log(summary);

    return {
      success,
      summary,
      dashboard: this.getProducerDashboard(),
    };
  }

  /**
   * Get the Producer dashboard with current status
   */
  getProducerDashboard(): ProducerDashboard {
    if (!this.project) {
      throw new Error('No active project');
    }

    const report = this.productionManager.generateReport();
    const directorStatus = this.director.getProductionStatus();

    return {
      project: {
        title: this.project.title,
        status: report.currentPhase,
        progress: report.overallProgress,
      },
      budget: {
        total: report.budgetStatus.total,
        spent: report.budgetStatus.spent,
        remaining: report.budgetStatus.remaining,
        isOnTrack: report.budgetStatus.onTrack,
      },
      schedule: {
        daysRemaining: report.scheduleStatus.daysRemaining,
        isOnSchedule: report.scheduleStatus.onSchedule,
        currentMilestone: report.scheduleStatus.nextMilestone?.name || 'Complete',
      },
      departments: this.getDepartmentStatus(directorStatus),
      alerts: report.risks,
      recentActivity: this.activityLog.slice(-10),
    };
  }

  /**
   * Producer makes a high-level decision
   */
  async makeDecision(decision: {
    type: 'approve' | 'reject' | 'modify';
    subject: string;
    details: string;
  }): Promise<void> {
    this.log(`Producer decision: ${decision.type} - ${decision.subject}`);
    
    if (decision.type === 'approve') {
      // Director is notified to proceed
      this.director.makeCreativeDecision(
        'narrative',
        `Producer approved: ${decision.subject}`,
        this.getAllDepartments()
      );
    }
  }

  /**
   * Get specific deliverables for Producer review
   */
  async getDeliverables(phase: ProductionPhase): Promise<{
    phase: ProductionPhase;
    deliverables: Array<{
      id: string;
      type: string;
      name: string;
      department: FilmDepartment;
      status: 'pending-review' | 'approved' | 'revision-needed';
    }>;
  }> {
    if (!this.context) {
      throw new Error('No active project');
    }

    const artifacts = Array.from(this.context.artifacts.values());
    
    return {
      phase,
      deliverables: artifacts.map(a => ({
        id: a.id,
        type: a.type,
        name: a.name,
        department: a.department,
        status: 'pending-review' as const,
      })),
    };
  }

  /**
   * Quick create - simplified workflow for the Producer
   * Runs all phases automatically with default settings
   */
  async quickCreate(brief: ProducerBrief): Promise<{
    projectId: string;
    finalDeliverables: string[];
    dashboard: ProducerDashboard;
  }> {
    this.log('Producer initiated Quick Create mode');

    // Start project
    const { projectId } = await this.startProject(brief);

    // Run all phases
    const phases: ProductionPhase[] = [
      'development',
      'pre-production', 
      'production',
      'post-production',
    ];

    for (const phase of phases) {
      await this.runPhase(phase);
    }

    const deliverables = await this.getDeliverables('post-production');

    this.log('Quick Create completed');

    return {
      projectId,
      finalDeliverables: deliverables.deliverables.map(d => d.id),
      dashboard: this.getProducerDashboard(),
    };
  }

  // Private helper methods

  private async initializeAgents(): Promise<void> {
    if (!this.context) return;

    await this.productionManager.initialize(this.context);
    await this.director.initialize(this.context);
    await this.writerAgent.initialize(this.context);
    await this.cinematographerAgent.initialize(this.context);
    await this.audioAgent.initialize(this.context);
    await this.editorAgent.initialize(this.context);
    await this.productionDesignerAgent.initialize(this.context);

    this.log('All agents initialized and ready');
  }

  private generateDefaultMilestones(start: Date, end: Date): any[] {
    const totalDays = Math.floor((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
    
    return [
      {
        id: 'ms-1',
        name: 'Script Complete',
        phase: 'development' as ProductionPhase,
        dueDate: new Date(start.getTime() + totalDays * 0.15 * 24 * 60 * 60 * 1000),
        deliverables: ['script'],
      },
      {
        id: 'ms-2',
        name: 'Pre-Production Complete',
        phase: 'pre-production' as ProductionPhase,
        dueDate: new Date(start.getTime() + totalDays * 0.30 * 24 * 60 * 60 * 1000),
        deliverables: ['storyboard', 'shot-list', 'production-schedule'],
      },
      {
        id: 'ms-3',
        name: 'Principal Photography Complete',
        phase: 'production' as ProductionPhase,
        dueDate: new Date(start.getTime() + totalDays * 0.60 * 24 * 60 * 60 * 1000),
        deliverables: ['raw-footage'],
      },
      {
        id: 'ms-4',
        name: 'Picture Lock',
        phase: 'post-production' as ProductionPhase,
        dueDate: new Date(start.getTime() + totalDays * 0.85 * 24 * 60 * 60 * 1000),
        deliverables: ['edit-sequence'],
      },
      {
        id: 'ms-5',
        name: 'Final Delivery',
        phase: 'post-production' as ProductionPhase,
        dueDate: end,
        deliverables: ['final-video'],
      },
    ];
  }

  private getDepartmentStatus(directorStatus: any): ProducerDashboard['departments'] {
    return (directorStatus?.registeredDepartments || []).map((dept: FilmDepartment) => ({
      name: dept.charAt(0).toUpperCase() + dept.slice(1),
      status: 'idle' as const,
    }));
  }

  private getAllDepartments(): FilmDepartment[] {
    return ['writing', 'direction', 'cinematography', 'production', 'audio', 'editing', 'production-design'];
  }

  private generatePhaseSummary(phase: ProductionPhase, report: any): string {
    return `${phase.toUpperCase()} phase complete. Progress: ${report.overallProgress.toFixed(1)}%. Budget: $${report.budgetStatus.remaining.toLocaleString()} remaining.`;
  }

  private log(message: string): void {
    const timestamp = new Date().toISOString();
    const entry = `[${timestamp}] ${message}`;
    this.activityLog.push(entry);
    console.log(entry);
  }
}

/**
 * Create a new film production system instance
 */
export async function createFilmProduction(): Promise<FilmProductionSystem> {
  const system = new FilmProductionSystem();
  await system.initialize();
  return system;
}

/**
 * Quick way to create a film from a simple brief
 */
export async function makeFilm(brief: ProducerBrief): Promise<{
  projectId: string;
  dashboard: ProducerDashboard;
}> {
  const system = await createFilmProduction();
  const result = await system.quickCreate(brief);
  return {
    projectId: result.projectId,
    dashboard: result.dashboard,
  };
}
