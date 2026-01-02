// src/services/movie-production/tools/MovieToolRegistry.ts
import { IMovieTool, ToolCategory, ToolPriority, ToolStatus, ToolExecutionParams, ToolExecutionResult } from './MovieTool';
import { FilmDepartment } from '../../types';

// Import all tools
import { CeltxTool } from './primary/CeltxTool';
import { StudioBinderTool } from './primary/StudioBinderTool';
import { Veo2Tool } from './primary/Veo2Tool';
import { YamduTool } from './primary/YamduTool';
import { ElevenLabsTool } from './primary/ElevenLabsTool';
import { InVideoTool } from './primary/InVideoTool';
import { MidjourneyTool } from './primary/MidjourneyTool';
import { RunwayTool } from './secondary/RunwayTool';

/**
 * Tool Registry Configuration
 */
interface ToolRegistryConfig {
  autoInitialize?: boolean;
  enabledCategories?: ToolCategory[];
  departmentOverrides?: Record<FilmDepartment, string[]>;
}

/**
 * Tool Selection Criteria
 */
interface ToolSelectionCriteria {
  department?: FilmDepartment;
  category?: ToolCategory;
  priority?: ToolPriority;
  action?: string;
  capabilities?: string[];
}

/**
 * Department Tool Mapping
 */
interface DepartmentToolMapping {
  department: FilmDepartment;
  primaryTools: string[];
  secondaryTools: string[];
  tertiaryTools: string[];
}

/**
 * MovieToolRegistry - Central registry for all movie production tools
 * Manages tool lifecycle, selection, and execution routing
 */
export class MovieToolRegistry {
  private tools: Map<string, IMovieTool> = new Map();
  private toolsByDepartment: Map<FilmDepartment, IMovieTool[]> = new Map();
  private toolsByCategory: Map<ToolCategory, IMovieTool[]> = new Map();
  private initialized = false;
  private config: ToolRegistryConfig;

  // Default department-to-tool mappings
  private static readonly DEFAULT_DEPARTMENT_MAPPINGS: DepartmentToolMapping[] = [
    {
      department: 'writing',
      primaryTools: ['celtx'],
      secondaryTools: ['studioibinder'],
      tertiaryTools: [],
    },
    {
      department: 'direction',
      primaryTools: ['studiobinder'],
      secondaryTools: ['midjourney', 'celtx'],
      tertiaryTools: ['yamdu'],
    },
    {
      department: 'cinematography',
      primaryTools: ['veo2'],
      secondaryTools: ['midjourney'],
      tertiaryTools: [],
    },
    {
      department: 'production',
      primaryTools: ['yamdu'],
      secondaryTools: ['studiobinder', 'celtx'],
      tertiaryTools: [],
    },
    {
      department: 'audio',
      primaryTools: ['elevenlabs'],
      secondaryTools: [],
      tertiaryTools: [],
    },
    {
      department: 'editing',
      primaryTools: ['invideo'],
      secondaryTools: ['veo2'],
      tertiaryTools: [],
    },
    {
      department: 'production-design',
      primaryTools: ['midjourney'],
      secondaryTools: [],
      tertiaryTools: [],
    },
  ];

  constructor(config: ToolRegistryConfig = {}) {
    this.config = {
      autoInitialize: true,
      ...config,
    };
  }

  /**
   * Initialize the registry with all available tools
   */
  async initialize(): Promise<void> {
    if (this.initialized) return;

    // Register all primary tools
    await this.registerTool(new CeltxTool());
    await this.registerTool(new StudioBinderTool());
    await this.registerTool(new Veo2Tool());
    await this.registerTool(new YamduTool());
    await this.registerTool(new ElevenLabsTool());
    await this.registerTool(new InVideoTool());
    await this.registerTool(new MidjourneyTool());

    // Secondary tools
    await this.registerTool(new RunwayTool());
    // await this.registerTool(new SunoTool());
    // await this.registerTool(new DallETool());
    // await this.registerTool(new FfmpegTool());

    // Build department and category indexes
    this.buildIndexes();

    this.initialized = true;
    console.log(`MovieToolRegistry initialized with ${this.tools.size} tools`);
  }

  /**
   * Register a tool with the registry
   */
  async registerTool(tool: IMovieTool): Promise<void> {
    if (this.tools.has(tool.id)) {
      console.warn(`Tool ${tool.id} already registered, skipping`);
      return;
    }

    // Initialize tool if auto-initialize is enabled
    if (this.config.autoInitialize) {
      try {
        await tool.initialize();
      } catch (error) {
        console.error(`Failed to initialize tool ${tool.id}:`, error);
      }
    }

    this.tools.set(tool.id, tool);
  }

  /**
   * Unregister a tool from the registry
   */
  async unregisterTool(toolId: string): Promise<void> {
    const tool = this.tools.get(toolId);
    if (tool) {
      await tool.shutdown();
      this.tools.delete(toolId);
      this.buildIndexes();
    }
  }

  /**
   * Get a tool by ID
   */
  getTool(toolId: string): IMovieTool | undefined {
    return this.tools.get(toolId);
  }

  /**
   * Get all registered tools
   */
  getAllTools(): IMovieTool[] {
    return Array.from(this.tools.values());
  }

  /**
   * Get tools by department
   */
  getToolsForDepartment(department: FilmDepartment): IMovieTool[] {
    return this.toolsByDepartment.get(department) || [];
  }

  /**
   * Get tools by category
   */
  getToolsByCategory(category: ToolCategory): IMovieTool[] {
    return this.toolsByCategory.get(category) || [];
  }

  /**
   * Select optimal tool based on criteria
   */
  selectTool(criteria: ToolSelectionCriteria): IMovieTool | null {
    let candidates = Array.from(this.tools.values());

    // Filter by department
    if (criteria.department) {
      candidates = candidates.filter(t => t.supportedDepartments.includes(criteria.department!));
    }

    // Filter by category
    if (criteria.category) {
      candidates = candidates.filter(t => t.category === criteria.category);
    }

    // Filter by priority
    if (criteria.priority) {
      candidates = candidates.filter(t => t.priority === criteria.priority);
    }

    // Filter by action capability
    if (criteria.action) {
      candidates = candidates.filter(t => 
        t.capabilities.some(c => c.action === criteria.action)
      );
    }

    // Filter by required capabilities
    if (criteria.capabilities && criteria.capabilities.length > 0) {
      candidates = candidates.filter(t => 
        criteria.capabilities!.every(cap => 
          t.capabilities.some(c => c.action === cap)
        )
      );
    }

    // Sort by priority (primary first)
    candidates.sort((a, b) => {
      const priorityOrder: Record<ToolPriority, number> = {
        primary: 0,
        secondary: 1,
        tertiary: 2,
      };
      return priorityOrder[a.priority] - priorityOrder[b.priority];
    });

    return candidates[0] || null;
  }

  /**
   * Select multiple tools based on criteria
   */
  selectTools(criteria: ToolSelectionCriteria, limit?: number): IMovieTool[] {
    let candidates = Array.from(this.tools.values());

    // Apply filters (same as selectTool)
    if (criteria.department) {
      candidates = candidates.filter(t => t.supportedDepartments.includes(criteria.department!));
    }
    if (criteria.category) {
      candidates = candidates.filter(t => t.category === criteria.category);
    }
    if (criteria.priority) {
      candidates = candidates.filter(t => t.priority === criteria.priority);
    }
    if (criteria.action) {
      candidates = candidates.filter(t => 
        t.capabilities.some(c => c.action === criteria.action)
      );
    }

    // Sort by priority
    candidates.sort((a, b) => {
      const priorityOrder: Record<ToolPriority, number> = {
        primary: 0,
        secondary: 1,
        tertiary: 2,
      };
      return priorityOrder[a.priority] - priorityOrder[b.priority];
    });

    return limit ? candidates.slice(0, limit) : candidates;
  }

  /**
   * Get the primary tool for a department
   */
  getPrimaryToolForDepartment(department: FilmDepartment): IMovieTool | null {
    return this.selectTool({
      department,
      priority: 'primary',
    });
  }

  /**
   * Execute an action on the most appropriate tool
   */
  async executeWithAutoSelect(
    criteria: ToolSelectionCriteria,
    params: Omit<ToolExecutionParams, 'action'> & { action: string }
  ): Promise<ToolExecutionResult> {
    const tool = this.selectTool({ ...criteria, action: params.action });
    
    if (!tool) {
      return {
        success: false,
        data: null,
        error: `No tool found matching criteria for action: ${params.action}`,
        metadata: { executionTime: 0 },
      };
    }

    return tool.execute(params);
  }

  /**
   * Execute with fallback - try primary tool, fall back to secondary if failed
   */
  async executeWithFallback(
    department: FilmDepartment,
    params: ToolExecutionParams
  ): Promise<ToolExecutionResult & { toolUsed: string }> {
    const tools = this.selectTools({ department, action: params.action });

    for (const tool of tools) {
      try {
        const result = await tool.execute(params);
        if (result.success) {
          return { ...result, toolUsed: tool.id };
        }
      } catch (error) {
        console.warn(`Tool ${tool.id} failed, trying next...`);
      }
    }

    return {
      success: false,
      data: null,
      error: 'All tools failed to execute the action',
      metadata: { executionTime: 0 },
      toolUsed: 'none',
    };
  }

  /**
   * Get status of all tools
   */
  async getToolsStatus(): Promise<Record<string, ToolStatus>> {
    const status: Record<string, ToolStatus> = {};
    
    for (const [id, tool] of this.tools) {
      status[id] = await tool.getStatus();
    }
    
    return status;
  }

  /**
   * Get department tool mapping summary
   */
  getDepartmentToolMappings(): DepartmentToolMapping[] {
    return MovieToolRegistry.DEFAULT_DEPARTMENT_MAPPINGS.map(mapping => {
      const availablePrimary = mapping.primaryTools.filter(id => this.tools.has(id));
      const availableSecondary = mapping.secondaryTools.filter(id => this.tools.has(id));
      const availableTertiary = mapping.tertiaryTools.filter(id => this.tools.has(id));
      
      return {
        ...mapping,
        primaryTools: availablePrimary,
        secondaryTools: availableSecondary,
        tertiaryTools: availableTertiary,
      };
    });
  }

  /**
   * Find tools that can perform a specific action
   */
  findToolsForAction(action: string): IMovieTool[] {
    return Array.from(this.tools.values()).filter(tool =>
      tool.capabilities.some(cap => cap.action === action)
    );
  }

  /**
   * Get all available actions across all tools
   */
  getAvailableActions(): { action: string; tools: string[]; description: string }[] {
    const actionMap = new Map<string, { tools: string[]; description: string }>();

    for (const tool of this.tools.values()) {
      for (const cap of tool.capabilities) {
        if (!actionMap.has(cap.action)) {
          actionMap.set(cap.action, { tools: [], description: cap.description });
        }
        actionMap.get(cap.action)!.tools.push(tool.id);
      }
    }

    return Array.from(actionMap.entries()).map(([action, data]) => ({
      action,
      ...data,
    }));
  }

  /**
   * Build internal indexes for fast lookups
   */
  private buildIndexes(): void {
    this.toolsByDepartment.clear();
    this.toolsByCategory.clear();

    for (const tool of this.tools.values()) {
      // Index by department
      for (const dept of tool.supportedDepartments) {
        if (!this.toolsByDepartment.has(dept)) {
          this.toolsByDepartment.set(dept, []);
        }
        this.toolsByDepartment.get(dept)!.push(tool);
      }

      // Index by category
      if (!this.toolsByCategory.has(tool.category)) {
        this.toolsByCategory.set(tool.category, []);
      }
      this.toolsByCategory.get(tool.category)!.push(tool);
    }
  }

  /**
   * Shutdown all tools and clean up
   */
  async shutdown(): Promise<void> {
    for (const tool of this.tools.values()) {
      try {
        await tool.shutdown();
      } catch (error) {
        console.error(`Error shutting down tool ${tool.id}:`, error);
      }
    }
    this.tools.clear();
    this.toolsByDepartment.clear();
    this.toolsByCategory.clear();
    this.initialized = false;
  }
}

// Singleton instance
let registryInstance: MovieToolRegistry | null = null;

/**
 * Get the global tool registry instance
 */
export function getToolRegistry(): MovieToolRegistry {
  if (!registryInstance) {
    registryInstance = new MovieToolRegistry();
  }
  return registryInstance;
}

/**
 * Initialize the global tool registry
 */
export async function initializeToolRegistry(): Promise<MovieToolRegistry> {
  const registry = getToolRegistry();
  await registry.initialize();
  return registry;
}
