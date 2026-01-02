// src/services/movie-production/ProductionManager.ts
import { DirectorOrchestrator } from './DirectorOrchestrator';
import { BaseSubAgent } from './SubAgent';
import {
  ProductionContext,
  ProductionPhase,
  MovieProject,
  FilmDepartment,
  ProductionArtifact,
  CollaborationRequest,
  CollaborationResponse,
} from '../types';

/**
 * Budget allocation by department
 */
interface BudgetAllocation {
  department: FilmDepartment;
  allocated: number;
  spent: number;
  remaining: number;
}

/**
 * Schedule milestone
 */
interface Milestone {
  id: string;
  name: string;
  phase: ProductionPhase;
  dueDate: Date;
  completed: boolean;
  completedDate?: Date;
  deliverables: string[];
}

/**
 * Production report for the Producer
 */
interface ProductionReport {
  projectId: string;
  projectTitle: string;
  currentPhase: ProductionPhase;
  overallProgress: number;
  budgetStatus: {
    total: number;
    spent: number;
    remaining: number;
    onTrack: boolean;
  };
  scheduleStatus: {
    daysElapsed: number;
    daysRemaining: number;
    onSchedule: boolean;
    nextMilestone: Milestone | null;
  };
  departmentStatus: Array<{
    department: FilmDepartment;
    tasksCompleted: number;
    tasksPending: number;
    approvalRate: number;
  }>;
  risks: string[];
  recommendations: string[];
}

/**
 * Production Manager - Process Management
 * 
 * Reports to: Producer (Owner)
 * Manages: Director and production process
 * 
 * Responsibilities:
 * - Budget management and tracking
 * - Schedule management
 * - Resource allocation
 * - Risk management
 * - Progress reporting to Producer
 * - Ensuring production runs smoothly
 */
export class ProductionManager extends BaseSubAgent {
  private director: DirectorOrchestrator | null = null;
  private budget: Map<FilmDepartment, BudgetAllocation> = new Map();
  private milestones: Milestone[] = [];
  private risks: string[] = [];
  private projectStartDate: Date | null = null;
  private projectEndDate: Date | null = null;

  constructor() {
    super({
      id: 'production-manager',
      name: 'Production Manager',
      department: 'production',
      role: 'Process Manager',
      description: 'Manages budget, schedule, resources, and ensures smooth production operations',
    });
  }

  protected async onInitialize(): Promise<void> {
    this.registerSkill({
      id: 'budget-management',
      name: 'Budget Management',
      description: 'Track and manage production budget',
      department: 'production',
      inputs: ['budget', 'expenses'],
      outputs: ['budget-report', 'cost-forecast'],
      execute: async () => ({
        success: true,
        artifacts: [],
        quality: 0.9,
        notes: ['Budget tracked'],
      }),
    });

    this.registerSkill({
      id: 'schedule-management',
      name: 'Schedule Management',
      description: 'Manage production schedule and milestones',
      department: 'production',
      inputs: ['schedule', 'tasks'],
      outputs: ['schedule-update', 'milestone-report'],
      execute: async () => ({
        success: true,
        artifacts: [],
        quality: 0.9,
        notes: ['Schedule updated'],
      }),
    });

    this.registerSkill({
      id: 'resource-allocation',
      name: 'Resource Allocation',
      description: 'Allocate resources across departments',
      department: 'production',
      inputs: ['resource-requests'],
      outputs: ['resource-assignments'],
      execute: async () => ({
        success: true,
        artifacts: [],
        quality: 0.9,
        notes: ['Resources allocated'],
      }),
    });
  }

  /**
   * Set the Director that Production Manager works with
   */
  setDirector(director: DirectorOrchestrator): void {
    this.director = director;
    console.log('[Production Manager] Director assigned');
  }

  /**
   * Initialize budget for the project
   */
  initializeBudget(totalBudget: number, allocations: Partial<Record<FilmDepartment, number>>): void {
    const departments: FilmDepartment[] = [
      'writing', 'direction', 'cinematography', 'production',
      'audio', 'editing', 'production-design'
    ];

    // Default allocation if not specified
    const defaultAllocation = totalBudget / departments.length;

    for (const dept of departments) {
      const allocated = allocations[dept] || defaultAllocation;
      this.budget.set(dept, {
        department: dept,
        allocated,
        spent: 0,
        remaining: allocated,
      });
    }

    console.log(`[Production Manager] Budget initialized: $${totalBudget.toLocaleString()}`);
  }

  /**
   * Record an expense
   */
  recordExpense(department: FilmDepartment, amount: number, description: string): boolean {
    const allocation = this.budget.get(department);
    if (!allocation) {
      console.error(`[Production Manager] No budget for department: ${department}`);
      return false;
    }

    if (amount > allocation.remaining) {
      this.addRisk(`Budget overrun risk in ${department}: requested $${amount}, only $${allocation.remaining} remaining`);
      console.warn(`[Production Manager] Budget warning for ${department}`);
    }

    allocation.spent += amount;
    allocation.remaining = allocation.allocated - allocation.spent;

    console.log(`[Production Manager] Expense recorded: ${department} - $${amount} (${description})`);
    return true;
  }

  /**
   * Set project schedule
   */
  setSchedule(startDate: Date, endDate: Date, milestones: Omit<Milestone, 'completed' | 'completedDate'>[]): void {
    this.projectStartDate = startDate;
    this.projectEndDate = endDate;
    this.milestones = milestones.map(m => ({
      ...m,
      completed: false,
    }));

    console.log(`[Production Manager] Schedule set: ${startDate.toDateString()} - ${endDate.toDateString()}`);
    console.log(`[Production Manager] ${this.milestones.length} milestones defined`);
  }

  /**
   * Mark a milestone as complete
   */
  completeMilestone(milestoneId: string): void {
    const milestone = this.milestones.find(m => m.id === milestoneId);
    if (milestone) {
      milestone.completed = true;
      milestone.completedDate = new Date();
      console.log(`[Production Manager] Milestone completed: ${milestone.name}`);
    }
  }

  /**
   * Add a risk to track
   */
  addRisk(risk: string): void {
    this.risks.push(risk);
    console.log(`[Production Manager] Risk identified: ${risk}`);
  }

  /**
   * Start production with Director
   */
  async startProduction(project: MovieProject): Promise<void> {
    if (!this.director) {
      throw new Error('Director not assigned');
    }

    console.log(`[Production Manager] Starting production: ${project.title}`);

    // Create production context
    const context: ProductionContext = {
      project,
      currentPhase: 'development',
      activeAgents: new Set(),
      artifacts: new Map(),
      timeline: {
        startDate: this.projectStartDate || new Date(),
        phases: {},
      },
    };

    // Initialize Director
    await this.director.initialize(context);

    console.log('[Production Manager] Production initialized');
  }

  /**
   * Run a production phase through the Director
   */
  async runPhase(phase: ProductionPhase): Promise<{
    success: boolean;
    report: ProductionReport;
  }> {
    if (!this.director || !this.context) {
      throw new Error('Production not started');
    }

    console.log(`[Production Manager] Initiating ${phase} phase`);

    // Update context
    this.context.currentPhase = phase;

    // Let Director run the phase
    const phaseResult = await this.director.runProductionPhase(phase);

    // Update milestones for this phase
    const phaseMilestones = this.milestones.filter(m => m.phase === phase);
    for (const milestone of phaseMilestones) {
      // Check if deliverables are complete
      const allDelivered = milestone.deliverables.every(d => 
        this.context.artifacts.has(d)
      );
      if (allDelivered) {
        this.completeMilestone(milestone.id);
      }
    }

    // Generate report for Producer
    const report = this.generateReport();

    return {
      success: true,
      report,
    };
  }

  /**
   * Generate production report for the Producer
   */
  generateReport(): ProductionReport {
    const totalBudget = Array.from(this.budget.values()).reduce((sum, b) => sum + b.allocated, 0);
    const totalSpent = Array.from(this.budget.values()).reduce((sum, b) => sum + b.spent, 0);

    const completedMilestones = this.milestones.filter(m => m.completed).length;
    const nextMilestone = this.milestones.find(m => !m.completed) || null;

    const now = new Date();
    const daysElapsed = this.projectStartDate 
      ? Math.floor((now.getTime() - this.projectStartDate.getTime()) / (1000 * 60 * 60 * 24))
      : 0;
    const daysRemaining = this.projectEndDate
      ? Math.floor((this.projectEndDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
      : 0;

    const directorStatus = this.director?.getProductionStatus();

    return {
      projectId: this.context?.project.id || '',
      projectTitle: this.context?.project.title || '',
      currentPhase: this.context?.currentPhase || 'development',
      overallProgress: this.milestones.length > 0 
        ? (completedMilestones / this.milestones.length) * 100 
        : 0,
      budgetStatus: {
        total: totalBudget,
        spent: totalSpent,
        remaining: totalBudget - totalSpent,
        onTrack: totalSpent <= totalBudget * 0.9, // Within 90% is on track
      },
      scheduleStatus: {
        daysElapsed,
        daysRemaining,
        onSchedule: daysRemaining > 0,
        nextMilestone,
      },
      departmentStatus: (directorStatus?.registeredDepartments || []).map(dept => ({
        department: dept,
        tasksCompleted: 0, // Would be tracked in real implementation
        tasksPending: 0,
        approvalRate: directorStatus?.approvalRate || 0,
      })),
      risks: this.risks,
      recommendations: this.generateRecommendations(),
    };
  }

  /**
   * Generate recommendations based on current status
   */
  private generateRecommendations(): string[] {
    const recommendations: string[] = [];

    // Check budget
    for (const [dept, allocation] of this.budget) {
      if (allocation.spent > allocation.allocated * 0.8) {
        recommendations.push(`Consider reviewing ${dept} expenses - 80%+ of budget used`);
      }
    }

    // Check schedule
    const incompleteMilestones = this.milestones.filter(m => !m.completed && m.dueDate < new Date());
    if (incompleteMilestones.length > 0) {
      recommendations.push(`${incompleteMilestones.length} milestone(s) are overdue - review timeline`);
    }

    // Check risks
    if (this.risks.length > 3) {
      recommendations.push('Multiple risks identified - consider risk mitigation meeting');
    }

    return recommendations;
  }

  /**
   * Approve budget request (from departments via Director)
   */
  approveBudgetRequest(department: FilmDepartment, amount: number, reason: string): boolean {
    const allocation = this.budget.get(department);
    if (!allocation) return false;

    if (amount <= allocation.remaining) {
      console.log(`[Production Manager] Approved budget request: ${department} - $${amount}`);
      return true;
    }

    console.log(`[Production Manager] Denied budget request: ${department} - insufficient funds`);
    return false;
  }

  protected async reviewCollaboration(
    request: CollaborationRequest,
    artifacts: ProductionArtifact[]
  ): Promise<CollaborationResponse> {
    return {
      approved: true,
      feedback: 'Production Manager approved',
    };
  }
}
