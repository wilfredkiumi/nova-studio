// src/services/movie-production/tools/primary/CeltxTool.ts
import { BaseMovieTool, ToolCapability, ToolStatus, ToolExecutionParams, ToolExecutionResult, ToolPriority, ToolCategory } from '../MovieTool';
import { FilmDepartment } from '../../../types';

/**
 * Celtx - Industry-standard screenwriting and pre-production software
 * PRIMARY tool for Writer Agent
 */
export class CeltxTool extends BaseMovieTool {
  readonly id = 'celtx';
  readonly name = 'Celtx';
  readonly provider = 'Celtx Inc';
  readonly category: ToolCategory = 'screenwriting';
  readonly priority: ToolPriority = 'primary';
  readonly supportedDepartments: FilmDepartment[] = ['writing', 'production'];

  readonly capabilities: ToolCapability[] = [
    {
      action: 'create-screenplay',
      description: 'Create a new screenplay document with industry-standard formatting',
      inputSchema: {
        title: { type: 'string', required: true },
        author: { type: 'string', required: false },
        content: { type: 'string', required: true, description: 'Raw screenplay text to format' },
        format: { type: 'string', enum: ['film', 'tv', 'stage'], default: 'film' },
      },
      outputTypes: ['screenplay'],
      estimatedDuration: 30,
    },
    {
      action: 'format-screenplay',
      description: 'Format raw text into proper screenplay format',
      inputSchema: {
        content: { type: 'string', required: true },
        detectSceneHeadings: { type: 'boolean', default: true },
        detectDialogue: { type: 'boolean', default: true },
      },
      outputTypes: ['screenplay'],
      estimatedDuration: 15,
    },
    {
      action: 'breakdown-screenplay',
      description: 'Generate production breakdown from screenplay',
      inputSchema: {
        screenplayId: { type: 'string', required: true },
        categories: { type: 'array', items: 'string', default: ['cast', 'props', 'costumes', 'locations'] },
      },
      outputTypes: ['scene-breakdown'],
      estimatedDuration: 60,
    },
    {
      action: 'create-budget',
      description: 'Generate budget estimate from screenplay breakdown',
      inputSchema: {
        breakdownId: { type: 'string', required: true },
        currency: { type: 'string', default: 'USD' },
        budgetLevel: { type: 'string', enum: ['low', 'medium', 'high'], default: 'medium' },
      },
      outputTypes: ['budget'],
      estimatedDuration: 120,
    },
    {
      action: 'export',
      description: 'Export screenplay to various formats',
      inputSchema: {
        screenplayId: { type: 'string', required: true },
        format: { type: 'string', enum: ['fdx', 'pdf', 'fountain', 'html'], required: true },
      },
      outputTypes: ['screenplay'],
      estimatedDuration: 10,
    },
  ];

  protected baseUrl = 'https://api.celtx.com/v1';

  protected async onInitialize(): Promise<void> {
    // Validate API connection
    // In production, this would verify the API key
  }

  async getStatus(): Promise<ToolStatus> {
    return {
      available: this._isAvailable,
      authenticated: !!this.auth,
      credits: {
        remaining: 1000,
        total: 1000,
      },
    };
  }

  protected async executeAction(params: ToolExecutionParams): Promise<ToolExecutionResult> {
    switch (params.action) {
      case 'create-screenplay':
        return this.createScreenplay(params.input);
      case 'format-screenplay':
        return this.formatScreenplay(params.input);
      case 'breakdown-screenplay':
        return this.breakdownScreenplay(params.input);
      case 'create-budget':
        return this.createBudget(params.input);
      case 'export':
        return this.exportScreenplay(params.input);
      default:
        return {
          success: false,
          data: null,
          error: `Unknown action: ${params.action}`,
          metadata: { executionTime: 0 },
        };
    }
  }

  private async createScreenplay(input: Record<string, any>): Promise<ToolExecutionResult> {
    // Simulate Celtx API call
    const screenplay = {
      id: `screenplay-${Date.now()}`,
      title: input.title,
      author: input.author || 'Unknown',
      format: input.format || 'film',
      content: this.parseScreenplayContent(input.content),
      metadata: {
        pageCount: Math.ceil(input.content.length / 3000),
        scenes: this.countScenes(input.content),
        characters: this.extractCharacters(input.content),
        createdAt: new Date().toISOString(),
      },
    };

    return {
      success: true,
      data: screenplay,
      artifacts: [
        this.createArtifact('screenplay', input.title, screenplay, 'writing'),
      ],
      metadata: {
        executionTime: 0,
        apiCalls: 1,
      },
    };
  }

  private async formatScreenplay(input: Record<string, any>): Promise<ToolExecutionResult> {
    const formatted = {
      content: this.parseScreenplayContent(input.content),
      formatting: {
        sceneHeadingsDetected: input.detectSceneHeadings ?? true,
        dialogueDetected: input.detectDialogue ?? true,
      },
    };

    return {
      success: true,
      data: formatted,
      metadata: { executionTime: 0, apiCalls: 1 },
    };
  }

  private async breakdownScreenplay(input: Record<string, any>): Promise<ToolExecutionResult> {
    const breakdown = {
      id: `breakdown-${Date.now()}`,
      screenplayId: input.screenplayId,
      categories: input.categories || ['cast', 'props', 'costumes', 'locations'],
      elements: {
        cast: [
          { name: 'Protagonist', scenes: [1, 2, 3, 5, 7, 8, 10], type: 'lead' },
          { name: 'Antagonist', scenes: [3, 6, 8, 10], type: 'supporting' },
        ],
        props: [
          { name: 'Phone', scenes: [1, 4, 7] },
          { name: 'Briefcase', scenes: [2, 5, 9] },
        ],
        costumes: [
          { character: 'Protagonist', changes: 3 },
          { character: 'Antagonist', changes: 2 },
        ],
        locations: [
          { name: 'Office Interior', scenes: [1, 2, 5], type: 'interior' },
          { name: 'City Street', scenes: [3, 4], type: 'exterior' },
        ],
      },
    };

    return {
      success: true,
      data: breakdown,
      artifacts: [
        this.createArtifact('scene-breakdown', 'Screenplay Breakdown', breakdown, 'writing'),
      ],
      metadata: { executionTime: 0, apiCalls: 1 },
    };
  }

  private async createBudget(input: Record<string, any>): Promise<ToolExecutionResult> {
    const multiplier = input.budgetLevel === 'high' ? 2 : input.budgetLevel === 'low' ? 0.5 : 1;
    
    const budget = {
      id: `budget-${Date.now()}`,
      breakdownId: input.breakdownId,
      currency: input.currency || 'USD',
      total: 500000 * multiplier,
      breakdown: {
        aboveTheLine: 100000 * multiplier,
        belowTheLine: 250000 * multiplier,
        postProduction: 100000 * multiplier,
        contingency: 50000 * multiplier,
      },
    };

    return {
      success: true,
      data: budget,
      artifacts: [
        this.createArtifact('budget', 'Production Budget', budget, 'production'),
      ],
      metadata: { executionTime: 0, apiCalls: 1 },
    };
  }

  private async exportScreenplay(input: Record<string, any>): Promise<ToolExecutionResult> {
    const exportData = {
      screenplayId: input.screenplayId,
      format: input.format,
      url: `https://storage.celtx.com/exports/${input.screenplayId}.${input.format}`,
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
    };

    return {
      success: true,
      data: exportData,
      metadata: { executionTime: 0, apiCalls: 1 },
    };
  }

  // Helper methods
  private parseScreenplayContent(content: string): any {
    // Parse raw content into structured screenplay format
    const lines = content.split('\n');
    const scenes: any[] = [];
    let currentScene: any = null;

    for (const line of lines) {
      const trimmed = line.trim();
      if (trimmed.match(/^(INT\.|EXT\.|INT\/EXT\.)/i)) {
        if (currentScene) scenes.push(currentScene);
        currentScene = { heading: trimmed, elements: [] };
      } else if (currentScene && trimmed) {
        currentScene.elements.push(trimmed);
      }
    }
    if (currentScene) scenes.push(currentScene);

    return { scenes };
  }

  private countScenes(content: string): number {
    const matches = content.match(/(INT\.|EXT\.|INT\/EXT\.)/gi);
    return matches ? matches.length : 0;
  }

  private extractCharacters(content: string): string[] {
    // Simple character extraction (dialogue labels)
    const matches = content.match(/^[A-Z][A-Z\s]+$/gm);
    return [...new Set(matches || [])].slice(0, 10);
  }
}
