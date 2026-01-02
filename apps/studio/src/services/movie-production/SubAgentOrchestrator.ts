// src/services/movie-production/SubAgentOrchestrator.ts
import {
  SubAgent,
  ProductionContext,
  DepartmentTask,
  DepartmentTaskResult,
  FilmDepartment,
  CollaborationRequest,
  CollaborationResponse,
  ProductionPhase,
  ProductionReport,
  AgentContribution,
} from '../types';

/**
 * Orchestrates all sub-agents, managing workflow dependencies, 
 * collaboration, and production phases.
 */
export class SubAgentOrchestrator {
  private agents: Map<FilmDepartment, SubAgent> = new Map();
  private context: ProductionContext | null = null;
  private taskQueue: DepartmentTask[] = [];
  private completedTasks: Map<string, DepartmentTaskResult> = new Map();
  private agentStates: Map<string, 'idle' | 'working' | 'waiting' | 'blocked' | 'error'> = new Map();
  private collaborationLog: CollaborationRequest[] = [];

  async initialize(
    agents: SubAgent[],
    context: ProductionContext
  ): Promise<void> {
    this.context = context;

    // Register and initialize all agents
    for (const agent of agents) {
      this.agents.set(agent.department, agent);
      this.agentStates.set(agent.id, 'idle');
      await agent.initialize(context);
      console.log(`[Orchestrator] Initialized ${agent.name}`);
    }
  }

  /**
   * Execute a task through the appropriate department agent
   */
  async executeTask(task: DepartmentTask): Promise<DepartmentTaskResult> {
    if (!this.context) {
      throw new Error('Orchestrator not initialized');
    }

    const agent = this.agents.get(task.department);
    if (!agent) {
      throw new Error(`No agent found for department: ${task.department}`);
    }

    console.log(`[Orchestrator] Executing task: ${task.id} in ${task.department}`);
    this.agentStates.set(agent.id, 'working');

    try {
      const result = await agent.executeTask(task);
      this.completedTasks.set(task.id, result);
      this.agentStates.set(agent.id, 'idle');
      return result;
    } catch (error) {
      this.agentStates.set(agent.id, 'error');
      throw error;
    }
  }

  /**
   * Execute multiple tasks respecting dependencies
   */
  async executeWorkflow(tasks: DepartmentTask[]): Promise<DepartmentTaskResult[]> {
    const results: DepartmentTaskResult[] = [];
    const executed: Set<string> = new Set();

    while (executed.size < tasks.length) {
      const executableTasks = tasks.filter(
        task => 
          !executed.has(task.id) &&
          (!task.dependencies || task.dependencies.every(dep => executed.has(dep)))
      );

      if (executableTasks.length === 0) {
        console.warn('[Orchestrator] Circular dependency detected or missing artifacts');
        break;
      }

      // Execute tasks in parallel where possible
      const parallelResults = await Promise.all(
        executableTasks.map(task => this.executeTask(task))
      );

      results.push(...parallelResults);
      executableTasks.forEach(task => executed.add(task.id));
    }

    return results;
  }

  /**
   * Facilitate collaboration between agents
   */
  async requestCollaboration(
    request: CollaborationRequest
  ): Promise<CollaborationResponse> {
    if (!this.context) {
      throw new Error('Orchestrator not initialized');
    }

    this.collaborationLog.push(request);
    const targetAgent = Array.from(this.agents.values()).find(
      a => a.id === request.toAgent
    );

    if (!targetAgent) {
      return {
        approved: false,
        feedback: `Agent ${request.toAgent} not found`,
      };
    }

    console.log(
      `[Orchestrator] Collaboration: ${request.fromAgent} → ${request.toAgent} (${request.type})`
    );

    return await targetAgent.collaborate(request);
  }

  /**
   * Execute production phases in sequence
   */
  async executeProductionPhase(
    phase: ProductionPhase,
    tasks: DepartmentTask[]
  ): Promise<void> {
    console.log(`[Orchestrator] Starting ${phase} phase`);

    if (!this.context) {
      throw new Error('Orchestrator not initialized');
    }

    this.context.currentPhase = phase;

    try {
      await this.executeWorkflow(tasks);
      console.log(`[Orchestrator] Completed ${phase} phase`);
    } catch (error) {
      console.error(`[Orchestrator] Error in ${phase} phase:`, error);
      throw error;
    }
  }

  /**
   * Coordinate full production workflow
   */
  async coordiateFullProduction(): Promise<void> {
    if (!this.context) {
      throw new Error('Orchestrator not initialized');
    }

    // Development Phase
    await this.executeProductionPhase('development', [
      {
        id: 'dev-concept',
        department: 'writing',
        type: 'screenplay-writing',
        priority: 'critical',
        inputs: {
          concept: this.context.project.logline,
          tone: this.context.project.style.visualTone,
          characters: ['Protagonist', 'Antagonist'],
        },
      },
      {
        id: 'dev-character',
        department: 'writing',
        type: 'character-development',
        priority: 'critical',
        inputs: { storyConCept: this.context.project.logline },
        dependencies: ['dev-concept'],
      },
    ]);

    // Pre-Production Phase
    await this.executeProductionPhase('pre-production', [
      {
        id: 'prep-creative',
        department: 'direction',
        type: 'creative-direction',
        priority: 'critical',
        inputs: {
          screenplay: 'dev-concept',
          style: this.context.project.style,
        },
        dependencies: ['dev-concept'],
      },
      {
        id: 'prep-shots',
        department: 'direction',
        type: 'shot-planning',
        priority: 'high',
        inputs: {
          screenplay: 'dev-concept',
          creativeBrief: 'prep-creative',
        },
        dependencies: ['prep-creative'],
      },
      {
        id: 'prep-cinematography',
        department: 'cinematography',
        type: 'frame-composition',
        priority: 'high',
        inputs: {
          shotList: 'prep-shots',
          creativeBrief: 'prep-creative',
        },
        dependencies: ['prep-shots', 'prep-creative'],
      },
      {
        id: 'prep-design',
        department: 'production-design',
        type: 'set-design',
        priority: 'high',
        inputs: {
          screenplay: 'dev-concept',
          creativeBrief: 'prep-creative',
        },
        dependencies: ['prep-creative'],
      },
      {
        id: 'prep-production',
        department: 'production',
        type: 'production-scheduling',
        priority: 'high',
        inputs: {
          screenplay: 'dev-concept',
          shotList: 'prep-shots',
        },
        dependencies: ['prep-shots'],
      },
      {
        id: 'prep-sound',
        department: 'sound',
        type: 'sound-design',
        priority: 'medium',
        inputs: {
          screenplay: 'dev-concept',
          creativeBrief: 'prep-creative',
        },
        dependencies: ['prep-creative'],
      },
    ]);

    // Production Phase
    await this.executeProductionPhase('production', [
      {
        id: 'prod-blocking',
        department: 'direction',
        type: 'blocking-staging',
        priority: 'high',
        inputs: {
          screenplay: 'dev-concept',
          shotList: 'prep-shots',
        },
        dependencies: ['prep-shots'],
      },
      {
        id: 'prod-lighting',
        department: 'cinematography',
        type: 'lighting-design',
        priority: 'high',
        inputs: {
          shotList: 'prep-shots',
          creativeBrief: 'prep-creative',
        },
        dependencies: ['prep-shots', 'prep-creative'],
      },
      {
        id: 'prod-dialogue',
        department: 'sound',
        type: 'dialogue-recording',
        priority: 'critical',
        inputs: {
          screenplay: 'dev-concept',
          schedule: 'prep-production',
        },
        dependencies: ['prep-production'],
      },
    ]);

    // Post-Production Phase
    await this.executeProductionPhase('post-production', [
      {
        id: 'post-roughcut',
        department: 'editing',
        type: 'rough-cut-assembly',
        priority: 'critical',
        inputs: {
          footage: 'production',
          script: 'dev-concept',
        },
        dependencies: ['prod-dialogue'],
      },
      {
        id: 'post-music',
        department: 'sound',
        type: 'music-composition',
        priority: 'high',
        inputs: {
          creativeBrief: 'prep-creative',
          emotionalBeats: 'dev-concept',
        },
        dependencies: ['prep-creative', 'post-roughcut'],
      },
      {
        id: 'post-color',
        department: 'editing',
        type: 'color-grading',
        priority: 'high',
        inputs: {
          finalCut: 'post-roughcut',
          creativeBrief: 'prep-creative',
        },
        dependencies: ['post-roughcut'],
      },
      {
        id: 'post-finalcut',
        department: 'editing',
        type: 'final-cut-mastering',
        priority: 'critical',
        inputs: {
          roughCut: 'post-roughcut',
          soundDesign: 'prod-dialogue',
          colorGrade: 'post-color',
        },
        dependencies: ['post-roughcut', 'post-music', 'post-color'],
      },
    ]);

    // Delivery Phase
    await this.executeProductionPhase('delivery', [
      {
        id: 'delivery-masters',
        department: 'editing',
        type: 'final-cut-mastering',
        priority: 'critical',
        inputs: {
          roughCut: 'post-roughcut',
          soundDesign: 'prod-dialogue',
          colorGrade: 'post-color',
        },
        dependencies: ['post-finalcut'],
      },
    ]);
  }

  /**
   * Generate comprehensive production report
   */
  generateProductionReport(): ProductionReport {
    const report: ProductionReport = {
      totalDuration: 0,
      phaseBreakdown: {
        development: 0,
        'pre-production': 0,
        production: 0,
        'post-production': 0,
        delivery: 0,
      },
      qualityScores: {
        production: 0,
        direction: 0,
        writing: 0,
        cinematography: 0,
        sound: 0,
        editing: 0,
        'production-design': 0,
      },
      agentContributions: {},
      issues: [],
    };

    // Calculate statistics from completed tasks
    let totalDuration = 0;
    const departmentScores: Map<FilmDepartment, number[]> = new Map();

    for (const result of this.completedTasks.values()) {
      totalDuration += result.duration;

      // Aggregate quality scores by department
      if (!departmentScores.has(result.taskId.split('-')[0] as FilmDepartment)) {
        departmentScores.set(result.taskId.split('-')[0] as FilmDepartment, []);
      }
      departmentScores.get(result.taskId.split('-')[0] as FilmDepartment)!.push(result.quality);
    }

    report.totalDuration = totalDuration;

    // Calculate average quality per department
    for (const [dept, scores] of departmentScores) {
      const avgScore = scores.reduce((a, b) => a + b, 0) / scores.length;
      report.qualityScores[dept] = Math.round(avgScore * 100) / 100;
    }

    // Agent contributions
    for (const agent of this.agents.values()) {
      const agentTasks = Array.from(this.completedTasks.values()).filter(
        result => result.taskId.includes(agent.id.split('-')[0])
      );

      report.agentContributions[agent.id] = {
        agentId: agent.id,
        tasksCompleted: agentTasks.length,
        artifactsProduced: agentTasks.reduce((sum, t) => sum + t.artifacts.length, 0),
        averageQuality: agentTasks.length > 0 
          ? agentTasks.reduce((sum, t) => sum + t.quality, 0) / agentTasks.length
          : 0,
        collaborations: this.collaborationLog.filter(
          c => c.fromAgent === agent.id || c.toAgent === agent.id
        ).length,
      };
    }

    return report;
  }

  /**
   * Shutdown all agents
   */
  async shutdown(): Promise<void> {
    for (const agent of this.agents.values()) {
      await agent.shutdown();
    }
    console.log('[Orchestrator] All agents shut down');
  }

  /**
   * Get current status
   */
  getStatus() {
    return {
      agents: Array.from(this.agents.values()).map(a => ({
        id: a.id,
        name: a.name,
        status: this.agentStates.get(a.id),
      })),
      completedTasks: this.completedTasks.size,
      collaborations: this.collaborationLog.length,
      currentPhase: this.context?.currentPhase || 'unknown',
    };
  }
}
