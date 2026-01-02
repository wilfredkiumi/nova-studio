// src/services/movie-production/tools/MovieTool.ts
import { FilmDepartment, ProductionArtifact } from '../../types';

/**
 * Tool priority levels
 */
export type ToolPriority = 'primary' | 'secondary' | 'tertiary';

/**
 * Tool categories for movie production
 */
export type ToolCategory =
  | 'screenwriting'
  | 'production-management'
  | 'video-generation'
  | 'image-generation'
  | 'audio-generation'
  | 'voice-synthesis'
  | 'video-editing'
  | 'audio-processing'
  | 'color-grading'
  | '3d-modeling'
  | 'scheduling'
  | 'collaboration';

/**
 * API authentication configuration
 */
export interface ToolAuthConfig {
  type: 'api-key' | 'oauth' | 'bearer' | 'basic';
  credentials: {
    apiKey?: string;
    clientId?: string;
    clientSecret?: string;
    accessToken?: string;
    refreshToken?: string;
  };
}

/**
 * Tool execution parameters
 */
export interface ToolExecutionParams {
  action: string;
  input: Record<string, any>;
  options?: {
    timeout?: number;
    retries?: number;
    quality?: 'draft' | 'standard' | 'high' | 'ultra';
    format?: string;
    webhook?: string;
  };
  context?: {
    projectId?: string;
    department?: FilmDepartment;
    artifactDependencies?: string[];
  };
}

/**
 * Tool execution result
 */
export interface ToolExecutionResult {
  success: boolean;
  data: any;
  artifacts?: ProductionArtifact[];
  error?: string;
  metadata: {
    executionTime: number;
    creditsUsed?: number;
    apiCalls?: number;
    cached?: boolean;
  };
}

/**
 * Tool capability descriptor
 */
export interface ToolCapability {
  action: string;
  description: string;
  inputSchema: Record<string, any>;
  outputTypes: string[];
  estimatedDuration?: number; // seconds
  creditsCost?: number;
}

/**
 * Tool status
 */
export interface ToolStatus {
  available: boolean;
  authenticated: boolean;
  rateLimit?: {
    remaining: number;
    resetAt: Date;
  };
  credits?: {
    remaining: number;
    total: number;
  };
}

/**
 * Base interface for all movie production tools
 */
export interface IMovieTool {
  readonly id: string;
  readonly name: string;
  readonly provider: string;
  readonly category: ToolCategory;
  readonly priority: ToolPriority;
  readonly supportedDepartments: FilmDepartment[];
  readonly capabilities: ToolCapability[];

  // Lifecycle
  initialize(auth: ToolAuthConfig): Promise<void>;
  shutdown(): Promise<void>;

  // Status
  getStatus(): Promise<ToolStatus>;
  isAvailable(): boolean;

  // Execution
  execute(params: ToolExecutionParams): Promise<ToolExecutionResult>;
  
  // Validation
  validateInput(action: string, input: Record<string, any>): { valid: boolean; errors?: string[] };
}

/**
 * Abstract base class for movie production tools
 */
export abstract class BaseMovieTool implements IMovieTool {
  abstract readonly id: string;
  abstract readonly name: string;
  abstract readonly provider: string;
  abstract readonly category: ToolCategory;
  abstract readonly priority: ToolPriority;
  abstract readonly supportedDepartments: FilmDepartment[];
  abstract readonly capabilities: ToolCapability[];

  protected auth: ToolAuthConfig | null = null;
  protected _isAvailable: boolean = false;
  protected baseUrl: string = '';

  async initialize(auth: ToolAuthConfig): Promise<void> {
    this.auth = auth;
    await this.onInitialize();
    this._isAvailable = true;
    console.log(`[${this.name}] Initialized successfully`);
  }

  protected abstract onInitialize(): Promise<void>;

  async shutdown(): Promise<void> {
    this._isAvailable = false;
    await this.onShutdown();
    console.log(`[${this.name}] Shutdown complete`);
  }

  protected async onShutdown(): Promise<void> {
    // Override in subclasses if needed
  }

  abstract getStatus(): Promise<ToolStatus>;

  isAvailable(): boolean {
    return this._isAvailable;
  }

  async execute(params: ToolExecutionParams): Promise<ToolExecutionResult> {
    if (!this._isAvailable) {
      return {
        success: false,
        data: null,
        error: `${this.name} is not available`,
        metadata: { executionTime: 0 },
      };
    }

    const validation = this.validateInput(params.action, params.input);
    if (!validation.valid) {
      return {
        success: false,
        data: null,
        error: `Invalid input: ${validation.errors?.join(', ')}`,
        metadata: { executionTime: 0 },
      };
    }

    const startTime = Date.now();

    try {
      const result = await this.executeAction(params);
      return {
        ...result,
        metadata: {
          ...result.metadata,
          executionTime: Date.now() - startTime,
        },
      };
    } catch (error) {
      return {
        success: false,
        data: null,
        error: error instanceof Error ? error.message : 'Unknown error',
        metadata: { executionTime: Date.now() - startTime },
      };
    }
  }

  protected abstract executeAction(params: ToolExecutionParams): Promise<ToolExecutionResult>;

  validateInput(action: string, input: Record<string, any>): { valid: boolean; errors?: string[] } {
    const capability = this.capabilities.find(c => c.action === action);
    if (!capability) {
      return { valid: false, errors: [`Unknown action: ${action}`] };
    }

    // Basic schema validation
    const errors: string[] = [];
    const schema = capability.inputSchema;

    for (const [key, spec] of Object.entries(schema)) {
      const fieldSpec = spec as any;
      if (fieldSpec.required && !(key in input)) {
        errors.push(`Missing required field: ${key}`);
      }
    }

    return errors.length > 0 ? { valid: false, errors } : { valid: true };
  }

  /**
   * Helper method for making API requests
   */
  protected async apiRequest<T>(
    endpoint: string,
    method: 'GET' | 'POST' | 'PUT' | 'DELETE' = 'POST',
    body?: Record<string, any>
  ): Promise<T> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    if (this.auth) {
      switch (this.auth.type) {
        case 'api-key':
          headers['X-API-Key'] = this.auth.credentials.apiKey || '';
          break;
        case 'bearer':
          headers['Authorization'] = `Bearer ${this.auth.credentials.accessToken}`;
          break;
        case 'basic':
          const basic = btoa(`${this.auth.credentials.clientId}:${this.auth.credentials.clientSecret}`);
          headers['Authorization'] = `Basic ${basic}`;
          break;
      }
    }

    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      method,
      headers,
      body: body ? JSON.stringify(body) : undefined,
    });

    if (!response.ok) {
      throw new Error(`API request failed: ${response.status} ${response.statusText}`);
    }

    return response.json();
  }

  /**
   * Create a production artifact from tool output
   */
  protected createArtifact(
    type: ProductionArtifact['type'],
    name: string,
    data: any,
    department: FilmDepartment
  ): ProductionArtifact {
    return {
      id: `${this.id}-${type}-${Date.now()}`,
      type,
      name,
      department,
      data,
      version: 1,
      createdAt: new Date(),
      createdBy: this.id,
    };
  }
}
