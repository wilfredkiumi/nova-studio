// src/services/movie-production/SubAgent.ts
import {
  SubAgent,
  SubAgentStatus,
  SubAgentCapability,
  FilmDepartment,
  Skill,
  DepartmentTask,
  DepartmentTaskResult,
  CollaborationRequest,
  CollaborationResponse,
  ProductionContext,
  ProductionArtifact,
  SkillInput,
} from '../types';
import { IMovieTool, ToolExecutionParams, ToolExecutionResult, getToolRegistry, MovieToolRegistry } from './tools';

/**
 * Base class for all film production sub-agents.
 * Each department (Production, Direction, Writing, etc.) extends this.
 */
export abstract class BaseSubAgent implements SubAgent {
  readonly id: string;
  readonly name: string;
  readonly department: FilmDepartment;
  readonly role: string;
  readonly description: string;
  
  protected _skills: Skill[] = [];
  protected _status: SubAgentStatus = 'idle';
  protected context: ProductionContext | null = null;
  protected taskHistory: DepartmentTaskResult[] = [];
  protected toolRegistry: MovieToolRegistry;
  protected assignedTools: IMovieTool[] = [];

  constructor(config: {
    id: string;
    name: string;
    department: FilmDepartment;
    role: string;
    description: string;
  }) {
    this.id = config.id;
    this.name = config.name;
    this.department = config.department;
    this.role = config.role;
    this.description = config.description;
    this.toolRegistry = getToolRegistry();
  }

  get skills(): Skill[] {
    return this._skills;
  }

  get status(): SubAgentStatus {
    return this._status;
  }

  get tools(): IMovieTool[] {
    return this.assignedTools;
  }

  async initialize(context: ProductionContext): Promise<void> {
    this.context = context;
    this._status = 'idle';
    
    // Initialize tools for this department
    await this.initializeTools();
    
    await this.onInitialize();
    console.log(`[${this.name}] Initialized with ${this.assignedTools.length} tools for project: ${context.project.title}`);
  }

  /**
   * Initialize and assign tools for this agent's department
   */
  protected async initializeTools(): Promise<void> {
    // Ensure registry is initialized
    if (!this.toolRegistry.getAllTools().length) {
      await this.toolRegistry.initialize();
    }
    
    // Get all tools that support this department
    this.assignedTools = this.toolRegistry.getToolsForDepartment(this.department);
    
    console.log(`[${this.name}] Assigned tools: ${this.assignedTools.map(t => t.name).join(', ')}`);
  }

  /**
   * Get the primary tool for this agent
   */
  getPrimaryTool(): IMovieTool | null {
    return this.assignedTools.find(t => t.priority === 'primary') || null;
  }

  /**
   * Get tools by category
   */
  getToolsByCategory(category: string): IMovieTool[] {
    return this.assignedTools.filter(t => t.category === category);
  }

  /**
   * Execute a tool action
   */
  async executeTool(
    toolId: string,
    action: string,
    input: Record<string, any>,
    options?: Record<string, any>
  ): Promise<ToolExecutionResult> {
    const tool = this.assignedTools.find(t => t.id === toolId);
    
    if (!tool) {
      return {
        success: false,
        data: null,
        error: `Tool ${toolId} not assigned to ${this.name}`,
        metadata: { executionTime: 0 },
      };
    }

    const params: ToolExecutionParams = {
      action,
      input,
      context: this.context ? {
        projectId: this.context.project.id,
        phase: this.context.currentPhase,
        department: this.department,
      } : undefined,
      options,
    };

    try {
      const result = await tool.execute(params);
      
      // Store any generated artifacts in context
      if (result.success && result.artifacts && this.context) {
        for (const artifact of result.artifacts) {
          this.context.artifacts.set(artifact.id, artifact);
        }
      }
      
      return result;
    } catch (error) {
      return {
        success: false,
        data: null,
        error: error instanceof Error ? error.message : 'Tool execution failed',
        metadata: { executionTime: 0 },
      };
    }
  }

  /**
   * Execute an action using the best available tool
   */
  async executeWithBestTool(
    action: string,
    input: Record<string, any>,
    options?: Record<string, any>
  ): Promise<ToolExecutionResult & { toolUsed?: string }> {
    // Find tool that supports this action, preferring primary tools
    const eligibleTools = this.assignedTools
      .filter(t => t.capabilities.some(c => c.action === action))
      .sort((a, b) => {
        const priority: Record<string, number> = { primary: 0, secondary: 1, tertiary: 2 };
        return priority[a.priority] - priority[b.priority];
      });

    if (eligibleTools.length === 0) {
      return {
        success: false,
        data: null,
        error: `No tool available for action: ${action}`,
        metadata: { executionTime: 0 },
      };
    }

    // Try tools in priority order until one succeeds
    for (const tool of eligibleTools) {
      try {
        const result = await this.executeTool(tool.id, action, input, options);
        if (result.success) {
          return { ...result, toolUsed: tool.id };
        }
      } catch (error) {
        console.warn(`[${this.name}] Tool ${tool.id} failed for action ${action}, trying next...`);
      }
    }

    return {
      success: false,
      data: null,
      error: `All tools failed for action: ${action}`,
      metadata: { executionTime: 0 },
    };
  }

  protected abstract onInitialize(): Promise<void>;

  async executeTask(task: DepartmentTask): Promise<DepartmentTaskResult> {
    if (!this.context) {
      throw new Error(`${this.name} not initialized with production context`);
    }

    this._status = 'working';
    const startTime = Date.now();

    try {
      // Check dependencies are satisfied
      if (task.dependencies?.length) {
        const missingDeps = this.checkDependencies(task.dependencies);
        if (missingDeps.length > 0) {
          this._status = 'blocked';
          return {
            taskId: task.id,
            success: false,
            artifacts: [],
            quality: 0,
            duration: Date.now() - startTime,
            blockers: missingDeps,
          };
        }
      }

      // Find appropriate skill for this task
      const skill = this.findSkillForTask(task);
      if (!skill) {
        throw new Error(`No skill found for task type: ${task.type}`);
      }

      // Gather required artifacts
      const dependencies = this.gatherDependencyArtifacts(task.requiredArtifacts || []);

      // Execute the skill
      const skillInput: SkillInput = {
        data: task.inputs,
        context: this.context,
        dependencies,
      };

      const skillOutput = await skill.execute(skillInput);

      const result: DepartmentTaskResult = {
        taskId: task.id,
        success: skillOutput.success,
        artifacts: skillOutput.artifacts,
        quality: skillOutput.quality,
        duration: Date.now() - startTime,
        feedback: skillOutput.notes.join('\n'),
      };

      // Store artifacts in context
      for (const artifact of skillOutput.artifacts) {
        this.context.artifacts.set(artifact.id, artifact);
      }

      this.taskHistory.push(result);
      this._status = 'idle';

      return result;

    } catch (error) {
      this._status = 'error';
      return {
        taskId: task.id,
        success: false,
        artifacts: [],
        quality: 0,
        duration: Date.now() - startTime,
        feedback: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  async collaborate(request: CollaborationRequest): Promise<CollaborationResponse> {
    if (!this.context) {
      return {
        approved: false,
        feedback: 'Agent not initialized',
      };
    }

    this._status = 'working';

    try {
      // Retrieve referenced artifacts
      const artifacts = request.artifactIds
        .map(id => this.context!.artifacts.get(id))
        .filter((a): a is ProductionArtifact => a !== undefined);

      // Department-specific review logic
      const response = await this.reviewCollaboration(request, artifacts);

      this._status = 'idle';
      return response;

    } catch (error) {
      this._status = 'error';
      return {
        approved: false,
        feedback: error instanceof Error ? error.message : 'Collaboration failed',
      };
    }
  }

  protected abstract reviewCollaboration(
    request: CollaborationRequest,
    artifacts: ProductionArtifact[]
  ): Promise<CollaborationResponse>;

  getCapabilities(): SubAgentCapability[] {
    return this._skills.map(skill => ({
      skillId: skill.id,
      proficiency: 0.85, // Can be made dynamic based on learning
      specializations: skill.outputs,
    }));
  }

  async shutdown(): Promise<void> {
    this._status = 'idle';
    this.context = null;
    console.log(`[${this.name}] Shutdown complete`);
  }

  // Utility methods
  protected registerSkill(skill: Skill): void {
    this._skills.push(skill);
  }

  protected findSkillForTask(task: DepartmentTask): Skill | undefined {
    return this._skills.find(skill => 
      skill.id === task.type || 
      skill.outputs.some(output => task.type.includes(output))
    );
  }

  protected checkDependencies(dependencies: string[]): string[] {
    if (!this.context) return dependencies;
    
    return dependencies.filter(dep => !this.context!.artifacts.has(dep));
  }

  protected gatherDependencyArtifacts(
    artifactIds: string[]
  ): Record<string, any> {
    const deps: Record<string, any> = {};
    
    if (!this.context) return deps;

    for (const id of artifactIds) {
      const artifact = this.context.artifacts.get(id);
      if (artifact) {
        deps[id] = artifact;
      }
    }

    return deps;
  }

  protected createArtifact(
    type: ProductionArtifact['type'],
    name: string,
    data: any,
    dependencies?: string[]
  ): ProductionArtifact {
    return {
      id: `${this.department}-${type}-${Date.now()}`,
      type,
      name,
      department: this.department,
      data,
      version: 1,
      createdAt: new Date(),
      createdBy: this.id,
      dependencies,
    };
  }
}
