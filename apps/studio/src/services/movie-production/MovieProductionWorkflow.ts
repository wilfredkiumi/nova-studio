// src/services/movie-production/MovieProductionWorkflow.ts
import {
  MovieProductionRequest,
  MovieProductionResult,
  MovieProject,
  ProductionContext,
  ProductionPhase,
  ProductionTimeline,
  Milestone,
  MovieStyle,
} from '../types';
import { SubAgentOrchestrator } from './SubAgentOrchestrator';
import { WriterAgent } from './agents/WriterAgent';
import { DirectorAgent } from './agents/DirectorAgent';
import { CinematographerAgent } from './agents/CinematographerAgent';
import { ProductionAgent } from './agents/ProductionAgent';
import { AudioAgent } from './agents/AudioAgent';
import { EditorAgent } from './agents/EditorAgent';
import { ProductionDesignerAgent } from './agents/ProductionDesignerAgent';

/**
 * High-level workflow orchestrating the complete movie creation process
 * from concept to final deliverable.
 */
export class MovieProductionWorkflow {
  private orchestrator: SubAgentOrchestrator;
  private project: MovieProject | null = null;

  constructor() {
    this.orchestrator = new SubAgentOrchestrator();
  }

  /**
   * Execute the complete movie production workflow
   */
  async produceMovie(request: MovieProductionRequest): Promise<MovieProductionResult> {
    console.log('[MovieProduction] Starting production workflow');
    console.log(`[MovieProduction] Project: ${request.concept}`);

    try {
      // Step 1: Create project and context
      this.project = this.createProject(request);
      const context = this.createProductionContext(request);

      // Step 2: Initialize all agents
      const agents = [
        new WriterAgent(),
        new DirectorAgent(),
        new CinematographerAgent(),
        new ProductionAgent(),
        new AudioAgent(),
        new EditorAgent(),
        new ProductionDesignerAgent(),
      ];

      await this.orchestrator.initialize(agents, context);
      console.log('[MovieProduction] All agents initialized');

      // Step 3: Execute production workflow
      await this.orchestrator.coordiateFullProduction();
      console.log('[MovieProduction] Production workflow completed');

      // Step 4: Generate report and deliverables
      const report = this.orchestrator.generateProductionReport();
      const result = this.compileResult(request, report);

      await this.orchestrator.shutdown();
      return result;

    } catch (error) {
      console.error('[MovieProduction] Error during production:', error);
      await this.orchestrator.shutdown();
      throw error;
    }
  }

  /**
   * Create project from request
   */
  private createProject(request: MovieProductionRequest): MovieProject {
    return {
      id: `project-${Date.now()}`,
      title: request.concept.split('\n')[0].substring(0, 50),
      logline: request.concept,
      genre: request.genre,
      targetDuration: request.targetDuration,
      style: this.createMovieStyle(request),
      status: 'development',
      createdAt: new Date(),
      updatedAt: new Date(),
    };
  }

  /**
   * Create movie style from request
   */
  private createMovieStyle(request: MovieProductionRequest): MovieStyle {
    return {
      visualTone: request.style?.visualTone || 'cinematic',
      colorPalette: request.style?.colorPalette || ['#1a1a1a', '#e8e8e8', '#d4a574'],
      cinematicReferences: request.style?.cinematicReferences || ['Contemporary cinema'],
      audioStyle: request.style?.audioStyle || 'immersive',
      pacing: request.style?.pacing || 'dynamic',
    };
  }

  /**
   * Create production context
   */
  private createProductionContext(request: MovieProductionRequest): ProductionContext {
    const project = this.project!;

    return {
      project,
      currentPhase: 'development',
      artifacts: new Map(),
      agentStates: new Map([
        ['writer-agent', 'idle'],
        ['director-agent', 'idle'],
        ['cinematographer-agent', 'idle'],
        ['production-agent', 'idle'],
        ['audio-agent', 'idle'],
        ['editor-agent', 'idle'],
        ['production-designer-agent', 'idle'],
      ]),
      timeline: this.createProductionTimeline(),
      constraints: {
        budget: request.constraints?.budget,
        maxDuration: request.targetDuration,
        styleGuidelines: request.constraints?.styleGuidelines,
        technicalRequirements: request.constraints?.technicalRequirements,
        contentRating: request.constraints?.contentRating,
      },
    };
  }

  /**
   * Create production timeline
   */
  private createProductionTimeline(): ProductionTimeline {
    const now = new Date();
    const phases: ProductionPhase[] = ['development', 'pre-production', 'production', 'post-production', 'delivery'];

    return {
      phases: phases.map((phase, index) => {
        const startDate = new Date(now.getTime() + index * 14 * 24 * 60 * 60 * 1000);
        const endDate = new Date(startDate.getTime() + 14 * 24 * 60 * 60 * 1000);

        return {
          phase,
          startDate,
          endDate,
          milestones: this.createMilestonesForPhase(phase, startDate, endDate),
        };
      }),
    };
  }

  /**
   * Create milestones for each phase
   */
  private createMilestonesForPhase(
    phase: ProductionPhase,
    startDate: Date,
    endDate: Date
  ): Milestone[] {
    const milestones: Record<ProductionPhase, Milestone[]> = {
      development: [
        {
          id: 'dev-1',
          name: 'Screenplay Complete',
          phase: 'development',
          dueDate: new Date(startDate.getTime() + 10 * 24 * 60 * 60 * 1000),
          requiredArtifacts: ['screenplay', 'character-bible'],
          completed: false,
        },
      ],
      'pre-production': [
        {
          id: 'prep-1',
          name: 'Creative Direction Locked',
          phase: 'pre-production',
          dueDate: new Date(startDate.getTime() + 3 * 24 * 60 * 60 * 1000),
          requiredArtifacts: ['creative-brief', 'shot-list'],
          completed: false,
        },
        {
          id: 'prep-2',
          name: 'Production Schedule Finalized',
          phase: 'pre-production',
          dueDate: new Date(startDate.getTime() + 10 * 24 * 60 * 60 * 1000),
          requiredArtifacts: ['schedule', 'budget'],
          completed: false,
        },
      ],
      production: [
        {
          id: 'prod-1',
          name: 'Principal Photography Complete',
          phase: 'production',
          dueDate: endDate,
          requiredArtifacts: ['footage'],
          completed: false,
        },
      ],
      'post-production': [
        {
          id: 'post-1',
          name: 'Rough Cut Complete',
          phase: 'post-production',
          dueDate: new Date(startDate.getTime() + 7 * 24 * 60 * 60 * 1000),
          requiredArtifacts: ['rough-cut'],
          completed: false,
        },
        {
          id: 'post-2',
          name: 'Final Cut Locked',
          phase: 'post-production',
          dueDate: new Date(startDate.getTime() + 25 * 24 * 60 * 60 * 1000),
          requiredArtifacts: ['final-cut'],
          completed: false,
        },
      ],
      delivery: [
        {
          id: 'del-1',
          name: 'All Deliverables Completed',
          phase: 'delivery',
          dueDate: endDate,
          requiredArtifacts: ['final-cut'],
          completed: false,
        },
      ],
    };

    return milestones[phase] || [];
  }

  /**
   * Compile final result
   */
  private compileResult(request: MovieProductionRequest, report: any): MovieProductionResult {
    const project = this.project!;

    return {
      success: true,
      project,
      artifacts: Array.from(report.artifacts?.values?.() || []),
      finalOutputs: {
        video: `file://output/${project.id}/final-cut.mov`,
        screenplay: `file://output/${project.id}/screenplay.pdf`,
        storyboard: [`file://output/${project.id}/storyboard-1.pdf`],
        soundtrack: `file://output/${project.id}/soundtrack.wav`,
      },
      productionReport: {
        totalDuration: report.totalDuration,
        phaseBreakdown: report.phaseBreakdown,
        qualityScores: report.qualityScores,
        agentContributions: report.agentContributions,
        issues: report.issues,
      },
    };
  }

  /**
   * Get production status
   */
  getStatus() {
    return {
      project: this.project,
      orchestratorStatus: this.orchestrator.getStatus(),
    };
  }
}

/**
 * Simple factory function to start movie production
 */
export async function createMovie(request: MovieProductionRequest): Promise<MovieProductionResult> {
  const workflow = new MovieProductionWorkflow();
  return await workflow.produceMovie(request);
}
