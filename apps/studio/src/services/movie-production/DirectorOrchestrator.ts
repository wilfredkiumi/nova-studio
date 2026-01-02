// src/services/movie-production/DirectorOrchestrator.ts
import { BaseSubAgent } from './SubAgent';
import {
  SubAgent,
  FilmDepartment,
  DepartmentTask,
  DepartmentTaskResult,
  CollaborationRequest,
  CollaborationResponse,
  ProductionContext,
  ProductionArtifact,
  ProductionPhase,
} from '../types';

/**
 * Task assigned by Director to a sub-agent
 */
interface DirectorTask {
  id: string;
  assignedTo: FilmDepartment;
  task: DepartmentTask;
  priority: 'critical' | 'high' | 'normal' | 'low';
  deadline?: Date;
  notes?: string;
}

/**
 * Director's review of work
 */
interface DirectorReview {
  taskId: string;
  department: FilmDepartment;
  approved: boolean;
  rating: number; // 1-10
  feedback: string;
  revisionRequired: boolean;
  revisionNotes?: string;
}

/**
 * Creative decision made by Director
 */
interface CreativeDecision {
  id: string;
  type: 'visual-style' | 'narrative' | 'pacing' | 'performance' | 'technical';
  description: string;
  affectedDepartments: FilmDepartment[];
  artifacts?: string[];
  timestamp: Date;
}

/**
 * Director Agent - The Creative Orchestrator
 * 
 * The Director is responsible for:
 * - Overseeing all creative aspects of the production
 * - Assigning tasks to sub-agents
 * - Reviewing and approving work from each department
 * - Making creative decisions
 * - Ensuring creative vision consistency
 * - Coordinating between departments
 */
export class DirectorOrchestrator extends BaseSubAgent {
  private subAgents: Map<FilmDepartment, SubAgent> = new Map();
  private pendingTasks: Map<string, DirectorTask> = new Map();
  private reviews: DirectorReview[] = [];
  private creativeDecisions: CreativeDecision[] = [];
  private creativeVision: Record<string, any> = {};

  constructor() {
    super({
      id: 'director-orchestrator',
      name: 'Director',
      department: 'direction',
      role: 'Creative Orchestrator',
      description: 'Oversees all creative aspects, assigns tasks to departments, reviews work, and ensures creative vision consistency',
    });
  }

  protected async onInitialize(): Promise<void> {
    // Register director-specific skills
    this.registerSkill({
      id: 'creative-vision',
      name: 'Creative Vision Development',
      description: 'Develop and maintain the creative vision for the project',
      department: 'direction',
      inputs: ['concept', 'script', 'references'],
      outputs: ['creative-brief', 'mood-board', 'visual-style-guide'],
      execute: async (input) => ({
        success: true,
        artifacts: [],
        quality: 0.9,
        notes: ['Creative vision established'],
      }),
    });

    this.registerSkill({
      id: 'department-coordination',
      name: 'Department Coordination',
      description: 'Coordinate work between departments',
      department: 'direction',
      inputs: ['department-outputs'],
      outputs: ['coordination-notes', 'revision-requests'],
      execute: async (input) => ({
        success: true,
        artifacts: [],
        quality: 0.9,
        notes: ['Departments coordinated'],
      }),
    });

    this.registerSkill({
      id: 'quality-review',
      name: 'Quality Review',
      description: 'Review and approve work from departments',
      department: 'direction',
      inputs: ['department-deliverables'],
      outputs: ['approval', 'revision-notes'],
      execute: async (input) => ({
        success: true,
        artifacts: [],
        quality: 0.9,
        notes: ['Review completed'],
      }),
    });
  }

  /**
   * Register a sub-agent under the Director's supervision
   */
  registerSubAgent(agent: SubAgent): void {
    this.subAgents.set(agent.department, agent);
    console.log(`[Director] Registered ${agent.name} (${agent.department})`);
  }

  /**
   * Get all registered sub-agents
   */
  getSubAgents(): SubAgent[] {
    return Array.from(this.subAgents.values());
  }

  /**
   * Set the creative vision for the project
   */
  setCreativeVision(vision: Record<string, any>): void {
    this.creativeVision = vision;
    console.log('[Director] Creative vision established');
  }

  /**
   * Make a creative decision that affects departments
   */
  makeCreativeDecision(
    type: CreativeDecision['type'],
    description: string,
    affectedDepartments: FilmDepartment[]
  ): CreativeDecision {
    const decision: CreativeDecision = {
      id: `decision-${Date.now()}`,
      type,
      description,
      affectedDepartments,
      timestamp: new Date(),
    };

    this.creativeDecisions.push(decision);
    console.log(`[Director] Creative decision: ${description}`);

    // Notify affected departments
    this.notifyDepartments(affectedDepartments, decision);

    return decision;
  }

  /**
   * Assign a task to a specific department
   */
  async assignTask(
    department: FilmDepartment,
    task: DepartmentTask,
    priority: DirectorTask['priority'] = 'normal',
    notes?: string
  ): Promise<string> {
    const agent = this.subAgents.get(department);
    if (!agent) {
      throw new Error(`No agent registered for department: ${department}`);
    }

    const directorTask: DirectorTask = {
      id: `dir-task-${Date.now()}`,
      assignedTo: department,
      task,
      priority,
      notes,
    };

    this.pendingTasks.set(directorTask.id, directorTask);
    console.log(`[Director] Assigned task to ${department}: ${task.type}`);

    return directorTask.id;
  }

  /**
   * Execute a task and review the results
   */
  async executeAndReview(taskId: string): Promise<{
    result: DepartmentTaskResult;
    review: DirectorReview;
  }> {
    const directorTask = this.pendingTasks.get(taskId);
    if (!directorTask) {
      throw new Error(`Task not found: ${taskId}`);
    }

    const agent = this.subAgents.get(directorTask.assignedTo);
    if (!agent) {
      throw new Error(`Agent not found for task: ${taskId}`);
    }

    // Execute the task
    console.log(`[Director] Executing task ${taskId} with ${agent.name}`);
    const result = await agent.executeTask(directorTask.task);

    // Review the results
    const review = await this.reviewWork(directorTask, result);

    // Handle revision if needed
    if (review.revisionRequired && result.success) {
      console.log(`[Director] Revision required for ${directorTask.assignedTo}: ${review.revisionNotes}`);
    }

    this.pendingTasks.delete(taskId);

    return { result, review };
  }

  /**
   * Review work from a department
   */
  private async reviewWork(
    task: DirectorTask,
    result: DepartmentTaskResult
  ): Promise<DirectorReview> {
    // Analyze the result quality and alignment with creative vision
    const qualityScore = result.quality * 10;
    const approved = result.success && qualityScore >= 7;

    const review: DirectorReview = {
      taskId: task.id,
      department: task.assignedTo,
      approved,
      rating: Math.round(qualityScore),
      feedback: this.generateFeedback(task, result, qualityScore),
      revisionRequired: !approved && result.success,
      revisionNotes: !approved ? this.generateRevisionNotes(task, result) : undefined,
    };

    this.reviews.push(review);
    console.log(`[Director] Reviewed ${task.assignedTo} work: ${approved ? 'Approved' : 'Needs revision'} (${review.rating}/10)`);

    return review;
  }

  /**
   * Generate feedback for department work
   */
  private generateFeedback(
    task: DirectorTask,
    result: DepartmentTaskResult,
    score: number
  ): string {
    if (score >= 9) return 'Excellent work. Perfectly aligned with creative vision.';
    if (score >= 7) return 'Good work. Minor adjustments may be needed.';
    if (score >= 5) return 'Acceptable but needs improvement in key areas.';
    return 'Significant revision required to meet creative standards.';
  }

  /**
   * Generate revision notes
   */
  private generateRevisionNotes(
    task: DirectorTask,
    result: DepartmentTaskResult
  ): string {
    return `Please revise based on the creative vision. Focus on: ${task.notes || 'overall quality improvement'}`;
  }

  /**
   * Notify departments about a creative decision
   */
  private notifyDepartments(
    departments: FilmDepartment[],
    decision: CreativeDecision
  ): void {
    for (const dept of departments) {
      const agent = this.subAgents.get(dept);
      if (agent) {
        // In a real implementation, this would update the agent's context
        console.log(`[Director] Notified ${dept} about: ${decision.description}`);
      }
    }
  }

  /**
   * Coordinate a handoff between departments
   */
  async coordinateHandoff(
    fromDepartment: FilmDepartment,
    toDepartment: FilmDepartment,
    artifactIds: string[]
  ): Promise<CollaborationResponse> {
    const fromAgent = this.subAgents.get(fromDepartment);
    const toAgent = this.subAgents.get(toDepartment);

    if (!fromAgent || !toAgent) {
      return { approved: false, feedback: 'One or both departments not available' };
    }

    // Request collaboration
    const request: CollaborationRequest = {
      fromAgent: fromAgent.id,
      toAgent: toAgent.id,
      type: 'handoff',
      artifactIds,
      message: `Handoff from ${fromDepartment} to ${toDepartment}`,
    };

    // Director reviews before allowing handoff
    console.log(`[Director] Reviewing handoff from ${fromDepartment} to ${toDepartment}`);

    const response = await toAgent.collaborate(request);

    if (response.approved) {
      console.log(`[Director] Approved handoff to ${toDepartment}`);
    } else {
      console.log(`[Director] Handoff needs attention: ${response.feedback}`);
    }

    return response;
  }

  /**
   * Run a production phase with all relevant departments
   */
  async runProductionPhase(phase: ProductionPhase): Promise<{
    phase: ProductionPhase;
    results: Map<FilmDepartment, DepartmentTaskResult[]>;
    decisions: CreativeDecision[];
  }> {
    console.log(`[Director] Starting ${phase} phase`);

    const results = new Map<FilmDepartment, DepartmentTaskResult[]>();
    const phaseDecisions: CreativeDecision[] = [];

    // Get departments active in this phase
    const activeDepartments = this.getDepartmentsForPhase(phase);

    for (const dept of activeDepartments) {
      const agent = this.subAgents.get(dept);
      if (!agent) continue;

      // Generate tasks for this department in this phase
      const tasks = this.generatePhaseTasks(phase, dept);
      const deptResults: DepartmentTaskResult[] = [];

      for (const task of tasks) {
        const taskId = await this.assignTask(dept, task, 'high');
        const { result, review } = await this.executeAndReview(taskId);
        deptResults.push(result);

        // Store artifacts
        if (result.success && result.artifacts.length > 0) {
          // Make creative decisions based on results
          if (review.approved) {
            const decision = this.makeCreativeDecision(
              'visual-style',
              `Approved ${dept} work for ${phase}`,
              [dept]
            );
            decision.artifacts = result.artifacts.map(a => a.id);
            phaseDecisions.push(decision);
          }
        }
      }

      results.set(dept, deptResults);
    }

    console.log(`[Director] Completed ${phase} phase`);

    return {
      phase,
      results,
      decisions: phaseDecisions,
    };
  }

  /**
   * Get departments active in a specific phase
   */
  private getDepartmentsForPhase(phase: ProductionPhase): FilmDepartment[] {
    const phaseMap: Record<ProductionPhase, FilmDepartment[]> = {
      'development': ['writing', 'direction'],
      'pre-production': ['writing', 'direction', 'production', 'production-design', 'cinematography'],
      'production': ['direction', 'cinematography', 'audio', 'production'],
      'post-production': ['editing', 'audio', 'direction'],
      'distribution': ['production'],
    };
    return phaseMap[phase] || [];
  }

  /**
   * Generate tasks for a department in a phase
   */
  private generatePhaseTasks(phase: ProductionPhase, department: FilmDepartment): DepartmentTask[] {
    // This would be more sophisticated in production
    const taskId = `${phase}-${department}-${Date.now()}`;
    return [{
      id: taskId,
      type: `${phase}-work`,
      department,
      priority: 'high',
      inputs: {},
    }];
  }

  /**
   * Get production status summary
   */
  getProductionStatus(): {
    registeredDepartments: FilmDepartment[];
    pendingTasks: number;
    completedReviews: number;
    approvalRate: number;
    recentDecisions: CreativeDecision[];
  } {
    const approvedReviews = this.reviews.filter(r => r.approved).length;

    return {
      registeredDepartments: Array.from(this.subAgents.keys()),
      pendingTasks: this.pendingTasks.size,
      completedReviews: this.reviews.length,
      approvalRate: this.reviews.length > 0 ? approvedReviews / this.reviews.length : 0,
      recentDecisions: this.creativeDecisions.slice(-5),
    };
  }

  protected async reviewCollaboration(
    request: CollaborationRequest,
    artifacts: ProductionArtifact[]
  ): Promise<CollaborationResponse> {
    // Director approves collaborations that align with creative vision
    return {
      approved: true,
      feedback: 'Director approved collaboration',
      suggestedChanges: [],
    };
  }
}
