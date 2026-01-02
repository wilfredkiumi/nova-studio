// src/services/movie-production/tools/primary/StudioBinderTool.ts
import { BaseMovieTool, ToolCapability, ToolStatus, ToolExecutionParams, ToolExecutionResult, ToolPriority, ToolCategory } from '../MovieTool';
import { FilmDepartment } from '../../../types';

/**
 * StudioBinder - Professional pre-production and production management
 * PRIMARY tool for Director Agent
 */
export class StudioBinderTool extends BaseMovieTool {
  readonly id = 'studiobinder';
  readonly name = 'StudioBinder';
  readonly provider = 'StudioBinder Inc';
  readonly category: ToolCategory = 'production-management';
  readonly priority: ToolPriority = 'primary';
  readonly supportedDepartments: FilmDepartment[] = ['direction', 'production'];

  readonly capabilities: ToolCapability[] = [
    {
      action: 'create-shot-list',
      description: 'Create professional shot list for scenes',
      inputSchema: {
        projectId: { type: 'string', required: true },
        sceneNumber: { type: 'number', required: true },
        shots: { type: 'array', required: true, items: {
          shotNumber: 'string',
          type: 'string',
          description: 'string',
          camera: 'string',
          lens: 'string',
        }},
      },
      outputTypes: ['shot-list'],
      estimatedDuration: 30,
    },
    {
      action: 'create-storyboard',
      description: 'Create storyboard from shot list with frame positions',
      inputSchema: {
        shotListId: { type: 'string', required: true },
        frameImages: { type: 'array', items: 'string', description: 'URLs to storyboard frame images' },
        annotations: { type: 'boolean', default: true },
      },
      outputTypes: ['storyboard'],
      estimatedDuration: 60,
    },
    {
      action: 'create-call-sheet',
      description: 'Generate production call sheet',
      inputSchema: {
        projectId: { type: 'string', required: true },
        date: { type: 'string', required: true, format: 'date' },
        location: { type: 'string', required: true },
        scenes: { type: 'array', items: 'number', required: true },
        callTime: { type: 'string', required: true },
        crew: { type: 'array', items: { name: 'string', role: 'string', callTime: 'string' }},
        cast: { type: 'array', items: { name: 'string', character: 'string', callTime: 'string' }},
      },
      outputTypes: ['call-sheet'],
      estimatedDuration: 45,
    },
    {
      action: 'create-shooting-schedule',
      description: 'Generate complete shooting schedule',
      inputSchema: {
        projectId: { type: 'string', required: true },
        startDate: { type: 'string', required: true, format: 'date' },
        scenes: { type: 'array', required: true },
        constraints: { type: 'object', properties: {
          maxHoursPerDay: 'number',
          dayOff: 'string',
          locationGrouping: 'boolean',
        }},
      },
      outputTypes: ['schedule'],
      estimatedDuration: 120,
    },
    {
      action: 'create-breakdown-sheet',
      description: 'Create scene breakdown sheet',
      inputSchema: {
        projectId: { type: 'string', required: true },
        sceneNumber: { type: 'number', required: true },
        elements: { type: 'object', properties: {
          cast: 'array',
          extras: 'array',
          props: 'array',
          wardrobe: 'array',
          makeup: 'array',
          vehicles: 'array',
          specialEquipment: 'array',
        }},
      },
      outputTypes: ['scene-breakdown'],
      estimatedDuration: 30,
    },
  ];

  protected baseUrl = 'https://api.studiobinder.com/v2';

  protected async onInitialize(): Promise<void> {
    // Validate StudioBinder API connection
  }

  async getStatus(): Promise<ToolStatus> {
    return {
      available: this._isAvailable,
      authenticated: !!this.auth,
      credits: {
        remaining: 500,
        total: 500,
      },
    };
  }

  protected async executeAction(params: ToolExecutionParams): Promise<ToolExecutionResult> {
    switch (params.action) {
      case 'create-shot-list':
        return this.createShotList(params.input);
      case 'create-storyboard':
        return this.createStoryboard(params.input);
      case 'create-call-sheet':
        return this.createCallSheet(params.input);
      case 'create-shooting-schedule':
        return this.createShootingSchedule(params.input);
      case 'create-breakdown-sheet':
        return this.createBreakdownSheet(params.input);
      default:
        return {
          success: false,
          data: null,
          error: `Unknown action: ${params.action}`,
          metadata: { executionTime: 0 },
        };
    }
  }

  private async createShotList(input: Record<string, any>): Promise<ToolExecutionResult> {
    const shotList = {
      id: `shotlist-${Date.now()}`,
      projectId: input.projectId,
      sceneNumber: input.sceneNumber,
      shots: (input.shots || []).map((shot: any, index: number) => ({
        id: `shot-${index + 1}`,
        shotNumber: shot.shotNumber || `${input.sceneNumber}.${index + 1}`,
        type: shot.type || 'MS',
        description: shot.description || '',
        camera: shot.camera || 'A',
        lens: shot.lens || '50mm',
        movement: shot.movement || 'Static',
        duration: shot.duration || '5s',
        notes: shot.notes || '',
      })),
      totalShots: input.shots?.length || 0,
      createdAt: new Date().toISOString(),
    };

    return {
      success: true,
      data: shotList,
      artifacts: [
        this.createArtifact('shot-list', `Scene ${input.sceneNumber} Shot List`, shotList, 'direction'),
      ],
      metadata: { executionTime: 0, apiCalls: 1 },
    };
  }

  private async createStoryboard(input: Record<string, any>): Promise<ToolExecutionResult> {
    const storyboard = {
      id: `storyboard-${Date.now()}`,
      shotListId: input.shotListId,
      frames: (input.frameImages || []).map((url: string, index: number) => ({
        frameNumber: index + 1,
        imageUrl: url,
        annotations: input.annotations ? [] : undefined,
      })),
      totalFrames: input.frameImages?.length || 0,
      format: 'landscape',
      createdAt: new Date().toISOString(),
    };

    return {
      success: true,
      data: storyboard,
      artifacts: [
        this.createArtifact('storyboard', 'Visual Storyboard', storyboard, 'direction'),
      ],
      metadata: { executionTime: 0, apiCalls: 1 },
    };
  }

  private async createCallSheet(input: Record<string, any>): Promise<ToolExecutionResult> {
    const callSheet = {
      id: `callsheet-${Date.now()}`,
      projectId: input.projectId,
      date: input.date,
      dayNumber: 1,
      location: {
        name: input.location,
        address: input.address || 'TBD',
        parking: input.parking || 'On-site',
      },
      weather: input.weather || 'Clear, 72°F',
      generalCall: input.callTime,
      scenes: input.scenes,
      schedule: [
        { time: input.callTime, activity: 'Crew Call' },
        { time: this.addMinutes(input.callTime, 30), activity: 'Breakfast' },
        { time: this.addMinutes(input.callTime, 60), activity: 'First Shot' },
      ],
      cast: (input.cast || []).map((person: any) => ({
        name: person.name,
        character: person.character,
        callTime: person.callTime,
        status: 'Confirmed',
      })),
      crew: (input.crew || []).map((person: any) => ({
        name: person.name,
        role: person.role,
        callTime: person.callTime,
      })),
      notes: input.notes || '',
      createdAt: new Date().toISOString(),
    };

    return {
      success: true,
      data: callSheet,
      artifacts: [
        this.createArtifact('call-sheet', `Call Sheet - ${input.date}`, callSheet, 'production'),
      ],
      metadata: { executionTime: 0, apiCalls: 1 },
    };
  }

  private async createShootingSchedule(input: Record<string, any>): Promise<ToolExecutionResult> {
    const scenes = input.scenes || [];
    const startDate = new Date(input.startDate);
    const daysNeeded = Math.ceil(scenes.length / 3); // ~3 scenes per day

    const schedule = {
      id: `schedule-${Date.now()}`,
      projectId: input.projectId,
      startDate: input.startDate,
      endDate: new Date(startDate.getTime() + daysNeeded * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      totalDays: daysNeeded,
      days: Array.from({ length: daysNeeded }, (_, i) => ({
        dayNumber: i + 1,
        date: new Date(startDate.getTime() + i * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        scenes: scenes.slice(i * 3, (i + 1) * 3),
        location: 'TBD',
        estimatedHours: input.constraints?.maxHoursPerDay || 12,
      })),
      constraints: input.constraints || {},
      createdAt: new Date().toISOString(),
    };

    return {
      success: true,
      data: schedule,
      artifacts: [
        this.createArtifact('schedule', 'Production Schedule', schedule, 'production'),
      ],
      metadata: { executionTime: 0, apiCalls: 1 },
    };
  }

  private async createBreakdownSheet(input: Record<string, any>): Promise<ToolExecutionResult> {
    const breakdown = {
      id: `breakdown-${Date.now()}`,
      projectId: input.projectId,
      sceneNumber: input.sceneNumber,
      elements: {
        cast: input.elements?.cast || [],
        extras: input.elements?.extras || [],
        props: input.elements?.props || [],
        wardrobe: input.elements?.wardrobe || [],
        makeup: input.elements?.makeup || [],
        vehicles: input.elements?.vehicles || [],
        specialEquipment: input.elements?.specialEquipment || [],
      },
      pageCount: 1,
      estimatedTime: '4 hours',
      createdAt: new Date().toISOString(),
    };

    return {
      success: true,
      data: breakdown,
      artifacts: [
        this.createArtifact('scene-breakdown', `Scene ${input.sceneNumber} Breakdown`, breakdown, 'production'),
      ],
      metadata: { executionTime: 0, apiCalls: 1 },
    };
  }

  private addMinutes(time: string, minutes: number): string {
    const [hours, mins] = time.split(':').map(Number);
    const totalMins = hours * 60 + mins + minutes;
    const newHours = Math.floor(totalMins / 60) % 24;
    const newMins = totalMins % 60;
    return `${newHours.toString().padStart(2, '0')}:${newMins.toString().padStart(2, '0')}`;
  }
}
