// src/services/movie-production/tools/primary/YamduTool.ts
import { BaseMovieTool, ToolCapability, ToolStatus, ToolExecutionParams, ToolExecutionResult, ToolPriority, ToolCategory } from '../MovieTool';
import { FilmDepartment } from '../../../types';

/**
 * Yamdu - Film Production Management Platform
 * PRIMARY tool for Production Agent
 */
export class YamduTool extends BaseMovieTool {
  readonly id = 'yamdu';
  readonly name = 'Yamdu';
  readonly provider = 'Yamdu GmbH';
  readonly category: ToolCategory = 'production-management';
  readonly priority: ToolPriority = 'primary';
  readonly supportedDepartments: FilmDepartment[] = ['production', 'direction'];

  readonly capabilities: ToolCapability[] = [
    {
      action: 'create-project',
      description: 'Create a new film production project',
      inputSchema: {
        title: { type: 'string', required: true },
        projectType: { type: 'string', enum: ['feature', 'short', 'series', 'documentary', 'commercial'] },
        startDate: { type: 'string', format: 'date' },
        endDate: { type: 'string', format: 'date' },
        description: { type: 'string' },
        budget: { type: 'number' },
      },
      outputTypes: ['production-schedule'],
      estimatedDuration: 5,
    },
    {
      action: 'import-script',
      description: 'Import and break down screenplay',
      inputSchema: {
        projectId: { type: 'string', required: true },
        scriptFile: { type: 'string', format: 'uri', description: 'URL to FDX or PDF script' },
        scriptContent: { type: 'string', description: 'Raw script content' },
        autoBreakdown: { type: 'boolean', default: true },
      },
      outputTypes: ['script', 'breakdown-sheet'],
      estimatedDuration: 30,
    },
    {
      action: 'generate-schedule',
      description: 'Auto-generate production schedule',
      inputSchema: {
        projectId: { type: 'string', required: true },
        shootingDays: { type: 'number', required: true },
        startDate: { type: 'string', format: 'date', required: true },
        constraints: {
          type: 'object',
          properties: {
            actorAvailability: { type: 'array', items: { actorId: 'string', unavailable: 'array' } },
            locationAvailability: { type: 'array', items: { locationId: 'string', unavailable: 'array' } },
            maxHoursPerDay: { type: 'number', default: 12 },
            daysPerWeek: { type: 'number', default: 5 },
          },
        },
        optimizeFor: { type: 'string', enum: ['location', 'actor', 'continuity', 'budget'] },
      },
      outputTypes: ['production-schedule'],
      estimatedDuration: 60,
    },
    {
      action: 'create-stripboard',
      description: 'Create production stripboard',
      inputSchema: {
        projectId: { type: 'string', required: true },
        scheduleId: { type: 'string' },
        includeScenes: { type: 'array', items: 'string' },
        sortBy: { type: 'string', enum: ['scene', 'location', 'day', 'actor'] },
      },
      outputTypes: ['production-schedule'],
      estimatedDuration: 15,
    },
    {
      action: 'manage-crew',
      description: 'Manage crew assignments and contacts',
      inputSchema: {
        projectId: { type: 'string', required: true },
        action: { type: 'string', enum: ['add', 'update', 'remove', 'list'], required: true },
        crewMember: {
          type: 'object',
          properties: {
            name: { type: 'string', required: true },
            role: { type: 'string', required: true },
            department: { type: 'string' },
            email: { type: 'string', format: 'email' },
            phone: { type: 'string' },
            rate: { type: 'number' },
            startDate: { type: 'string', format: 'date' },
            endDate: { type: 'string', format: 'date' },
          },
        },
      },
      outputTypes: ['cast-list'],
      estimatedDuration: 5,
    },
    {
      action: 'manage-cast',
      description: 'Manage cast members and characters',
      inputSchema: {
        projectId: { type: 'string', required: true },
        action: { type: 'string', enum: ['add', 'update', 'remove', 'list'] },
        castMember: {
          type: 'object',
          properties: {
            actorName: { type: 'string' },
            characterName: { type: 'string' },
            role: { type: 'string', enum: ['lead', 'supporting', 'day-player', 'extra'] },
            scenes: { type: 'array', items: 'string' },
            rate: { type: 'number' },
          },
        },
      },
      outputTypes: ['cast-list'],
      estimatedDuration: 5,
    },
    {
      action: 'manage-locations',
      description: 'Manage filming locations',
      inputSchema: {
        projectId: { type: 'string', required: true },
        action: { type: 'string', enum: ['add', 'update', 'remove', 'list', 'scout'] },
        location: {
          type: 'object',
          properties: {
            name: { type: 'string' },
            address: { type: 'string' },
            type: { type: 'string', enum: ['studio', 'practical', 'exterior', 'backlot'] },
            scenes: { type: 'array', items: 'string' },
            cost: { type: 'number' },
            permitRequired: { type: 'boolean' },
            contacts: { type: 'array', items: { name: 'string', phone: 'string', email: 'string' } },
          },
        },
      },
      outputTypes: ['location-list'],
      estimatedDuration: 5,
    },
    {
      action: 'generate-call-sheet',
      description: 'Generate daily call sheet',
      inputSchema: {
        projectId: { type: 'string', required: true },
        date: { type: 'string', format: 'date', required: true },
        scenes: { type: 'array', items: 'string' },
        callTime: { type: 'string', format: 'time', default: '06:00' },
        notes: { type: 'string' },
        weatherForecast: { type: 'boolean', default: true },
      },
      outputTypes: ['call-sheet'],
      estimatedDuration: 10,
    },
    {
      action: 'generate-dood',
      description: 'Generate Day Out of Days report',
      inputSchema: {
        projectId: { type: 'string', required: true },
        type: { type: 'string', enum: ['cast', 'crew', 'equipment', 'locations'] },
        dateRange: {
          type: 'object',
          properties: {
            start: { type: 'string', format: 'date' },
            end: { type: 'string', format: 'date' },
          },
        },
      },
      outputTypes: ['production-schedule'],
      estimatedDuration: 20,
    },
    {
      action: 'track-budget',
      description: 'Track production budget and expenses',
      inputSchema: {
        projectId: { type: 'string', required: true },
        action: { type: 'string', enum: ['summary', 'add-expense', 'update-forecast', 'generate-report'] },
        expense: {
          type: 'object',
          properties: {
            category: { type: 'string' },
            description: { type: 'string' },
            amount: { type: 'number' },
            vendor: { type: 'string' },
            date: { type: 'string', format: 'date' },
            receipts: { type: 'array', items: 'string' },
          },
        },
      },
      outputTypes: ['budget'],
      estimatedDuration: 10,
    },
  ];

  protected baseUrl = 'https://api.yamdu.com/v2';

  protected async onInitialize(): Promise<void> {
    // Initialize Yamdu API connection
  }

  async getStatus(): Promise<ToolStatus> {
    return {
      available: this._isAvailable,
      authenticated: !!this.auth,
      rateLimit: {
        remaining: 1000,
        resetAt: new Date(Date.now() + 60 * 60 * 1000),
      },
    };
  }

  protected async executeAction(params: ToolExecutionParams): Promise<ToolExecutionResult> {
    switch (params.action) {
      case 'create-project':
        return this.createProject(params.input);
      case 'import-script':
        return this.importScript(params.input);
      case 'generate-schedule':
        return this.generateSchedule(params.input);
      case 'create-stripboard':
        return this.createStripboard(params.input);
      case 'manage-crew':
        return this.manageCrew(params.input);
      case 'manage-cast':
        return this.manageCast(params.input);
      case 'manage-locations':
        return this.manageLocations(params.input);
      case 'generate-call-sheet':
        return this.generateCallSheet(params.input);
      case 'generate-dood':
        return this.generateDOOD(params.input);
      case 'track-budget':
        return this.trackBudget(params.input);
      default:
        return {
          success: false,
          data: null,
          error: `Unknown action: ${params.action}`,
          metadata: { executionTime: 0 },
        };
    }
  }

  private async createProject(input: Record<string, any>): Promise<ToolExecutionResult> {
    const projectId = `yamdu-proj-${Date.now()}`;

    const project = {
      id: projectId,
      title: input.title,
      projectType: input.projectType || 'feature',
      startDate: input.startDate,
      endDate: input.endDate,
      description: input.description,
      budget: input.budget,
      status: 'pre-production',
      createdAt: new Date().toISOString(),
      settings: {
        currency: 'USD',
        timezone: 'America/Los_Angeles',
        defaultCallTime: '06:00',
      },
    };

    return {
      success: true,
      data: project,
      artifacts: [
        this.createArtifact('production-schedule', `Project: ${input.title}`, project, 'production'),
      ],
      metadata: {
        executionTime: 5000,
        apiCalls: 1,
      },
    };
  }

  private async importScript(input: Record<string, any>): Promise<ToolExecutionResult> {
    const breakdown = {
      projectId: input.projectId,
      scriptId: `script-${Date.now()}`,
      totalScenes: 95,
      totalPages: 110,
      estimatedRuntime: 120,
      breakdown: {
        scenes: [
          { number: '1', setting: 'INT', location: 'APARTMENT', timeOfDay: 'DAY', pages: 2.5 },
          { number: '2', setting: 'EXT', location: 'STREET', timeOfDay: 'NIGHT', pages: 1.0 },
          // Auto-generated breakdown...
        ],
        characters: [
          { name: 'JOHN', sceneCount: 45, category: 'lead' },
          { name: 'SARAH', sceneCount: 38, category: 'lead' },
          { name: 'DETECTIVE', sceneCount: 12, category: 'supporting' },
        ],
        locations: [
          { name: 'APARTMENT', sceneCount: 15, setting: 'INT' },
          { name: 'STREET', sceneCount: 8, setting: 'EXT' },
          { name: 'OFFICE', sceneCount: 12, setting: 'INT' },
        ],
        elements: {
          props: 45,
          vehicles: 8,
          sfx: 12,
          vfx: 25,
          stunts: 3,
          animals: 0,
          wardrobe: 67,
        },
      },
    };

    return {
      success: true,
      data: breakdown,
      artifacts: [
        this.createArtifact('script', 'Imported Script', { scriptId: breakdown.scriptId }, 'production'),
        this.createArtifact('breakdown-sheet', 'Script Breakdown', breakdown.breakdown, 'production'),
      ],
      metadata: {
        executionTime: 30000,
        apiCalls: 2,
      },
    };
  }

  private async generateSchedule(input: Record<string, any>): Promise<ToolExecutionResult> {
    const scheduleId = `schedule-${Date.now()}`;

    const schedule = {
      id: scheduleId,
      projectId: input.projectId,
      shootingDays: input.shootingDays,
      startDate: input.startDate,
      endDate: this.calculateEndDate(input.startDate, input.shootingDays, input.constraints?.daysPerWeek || 5),
      optimizedFor: input.optimizeFor || 'location',
      days: this.generateShootingDays(input.shootingDays),
      stats: {
        totalScenes: 95,
        averageScenesPerDay: Math.round(95 / input.shootingDays * 10) / 10,
        totalPages: 110,
        averagePagesPerDay: Math.round(110 / input.shootingDays * 10) / 10,
        locationMoves: 12,
        companyMoves: 4,
      },
    };

    return {
      success: true,
      data: schedule,
      artifacts: [
        this.createArtifact('production-schedule', 'Generated Schedule', schedule, 'production'),
      ],
      metadata: {
        executionTime: 60000,
        apiCalls: 3,
      },
    };
  }

  private async createStripboard(input: Record<string, any>): Promise<ToolExecutionResult> {
    const stripboard = {
      projectId: input.projectId,
      scheduleId: input.scheduleId,
      sortedBy: input.sortBy || 'day',
      strips: [
        { sceneNumber: '1', color: '#FFFFFF', dayNumber: 1, cast: ['1', '2'], location: 'APARTMENT', pages: 2.5 },
        { sceneNumber: '5', color: '#FFFFFF', dayNumber: 1, cast: ['1', '3'], location: 'APARTMENT', pages: 1.0 },
        { sceneNumber: '2', color: '#000000', dayNumber: 2, cast: ['1', '2'], location: 'STREET', pages: 1.0 },
        // More strips...
      ],
      banners: [
        { type: 'day', text: 'DAY 1 - Monday, January 15', position: 0 },
        { type: 'day', text: 'DAY 2 - Tuesday, January 16', position: 3 },
      ],
    };

    return {
      success: true,
      data: stripboard,
      artifacts: [
        this.createArtifact('production-schedule', 'Stripboard', stripboard, 'production'),
      ],
      metadata: {
        executionTime: 15000,
        apiCalls: 1,
      },
    };
  }

  private async manageCrew(input: Record<string, any>): Promise<ToolExecutionResult> {
    const result = {
      projectId: input.projectId,
      action: input.action,
      crew: input.action === 'list' ? this.generateSampleCrew() : input.crewMember,
    };

    return {
      success: true,
      data: result,
      artifacts: [
        this.createArtifact('cast-list', 'Crew List', result, 'production'),
      ],
      metadata: {
        executionTime: 5000,
        apiCalls: 1,
      },
    };
  }

  private async manageCast(input: Record<string, any>): Promise<ToolExecutionResult> {
    const result = {
      projectId: input.projectId,
      action: input.action,
      cast: input.action === 'list' ? this.generateSampleCast() : input.castMember,
    };

    return {
      success: true,
      data: result,
      artifacts: [
        this.createArtifact('cast-list', 'Cast List', result, 'production'),
      ],
      metadata: {
        executionTime: 5000,
        apiCalls: 1,
      },
    };
  }

  private async manageLocations(input: Record<string, any>): Promise<ToolExecutionResult> {
    const result = {
      projectId: input.projectId,
      action: input.action,
      locations: input.action === 'list' ? this.generateSampleLocations() : input.location,
    };

    return {
      success: true,
      data: result,
      artifacts: [
        this.createArtifact('location-list', 'Location List', result, 'production'),
      ],
      metadata: {
        executionTime: 5000,
        apiCalls: 1,
      },
    };
  }

  private async generateCallSheet(input: Record<string, any>): Promise<ToolExecutionResult> {
    const callSheet = {
      projectId: input.projectId,
      date: input.date,
      dayNumber: 1,
      generalCall: input.callTime || '06:00',
      firstShot: '07:30',
      estimatedWrap: '19:00',
      location: {
        name: 'Main Street Studio',
        address: '123 Main St, Los Angeles, CA 90001',
        parking: 'Lot A - East side',
      },
      weather: input.weatherForecast ? {
        condition: 'Partly Cloudy',
        high: 72,
        low: 58,
        sunrise: '06:45',
        sunset: '17:30',
      } : null,
      scenes: [
        { number: '1', setting: 'INT', location: 'APARTMENT', timeOfDay: 'DAY', pages: 2.5, cast: ['1', '2'] },
        { number: '5', setting: 'INT', location: 'APARTMENT', timeOfDay: 'NIGHT', pages: 1.0, cast: ['1', '3'] },
      ],
      cast: [
        { number: 1, name: 'Actor Name', character: 'JOHN', callTime: '06:00', onSet: '07:00', status: 'SW' },
        { number: 2, name: 'Actor Name', character: 'SARAH', callTime: '06:30', onSet: '07:30', status: 'SW' },
      ],
      crew: [
        { department: 'Camera', position: 'DP', name: 'Crew Name', callTime: '06:00' },
        { department: 'Sound', position: 'Mixer', name: 'Crew Name', callTime: '06:00' },
      ],
      notes: input.notes || '',
    };

    return {
      success: true,
      data: callSheet,
      artifacts: [
        this.createArtifact('call-sheet', `Call Sheet - ${input.date}`, callSheet, 'production'),
      ],
      metadata: {
        executionTime: 10000,
        apiCalls: 2,
      },
    };
  }

  private async generateDOOD(input: Record<string, any>): Promise<ToolExecutionResult> {
    const dood = {
      projectId: input.projectId,
      type: input.type || 'cast',
      dateRange: input.dateRange,
      report: {
        header: ['Character', 'Actor', 'D1', 'D2', 'D3', 'D4', 'D5', 'D6', 'D7', 'D8', 'D9', 'D10'],
        rows: [
          { character: 'JOHN', actor: 'Actor 1', days: ['SW', 'W', 'W', 'H', 'W', 'H', 'W', 'WF', '', ''] },
          { character: 'SARAH', actor: 'Actor 2', days: ['', 'SW', 'W', 'W', 'H', 'W', 'W', 'W', 'WF', ''] },
        ],
        legend: {
          SW: 'Start Work',
          W: 'Work',
          WF: 'Work Finish',
          H: 'Hold',
          T: 'Travel',
          R: 'Rehearsal',
        },
      },
    };

    return {
      success: true,
      data: dood,
      artifacts: [
        this.createArtifact('production-schedule', 'Day Out of Days Report', dood, 'production'),
      ],
      metadata: {
        executionTime: 20000,
        apiCalls: 2,
      },
    };
  }

  private async trackBudget(input: Record<string, any>): Promise<ToolExecutionResult> {
    const budget = {
      projectId: input.projectId,
      action: input.action,
      summary: {
        totalBudget: 5000000,
        spent: 1250000,
        remaining: 3750000,
        percentUsed: 25,
        forecast: {
          onTrack: true,
          projectedOverage: 0,
        },
      },
      byDepartment: [
        { department: 'Production', budget: 500000, spent: 125000, remaining: 375000 },
        { department: 'Camera', budget: 300000, spent: 75000, remaining: 225000 },
        { department: 'Sound', budget: 150000, spent: 37500, remaining: 112500 },
        { department: 'Art', budget: 400000, spent: 100000, remaining: 300000 },
        { department: 'Talent', budget: 1500000, spent: 375000, remaining: 1125000 },
      ],
      recentExpenses: input.expense ? [input.expense] : [],
    };

    return {
      success: true,
      data: budget,
      artifacts: [
        this.createArtifact('budget', 'Budget Report', budget, 'production'),
      ],
      metadata: {
        executionTime: 10000,
        apiCalls: 1,
      },
    };
  }

  // Helper methods
  private calculateEndDate(startDate: string, shootingDays: number, daysPerWeek: number): string {
    const start = new Date(startDate);
    const totalDays = Math.ceil(shootingDays / daysPerWeek) * 7;
    const end = new Date(start.getTime() + totalDays * 24 * 60 * 60 * 1000);
    return end.toISOString().split('T')[0];
  }

  private generateShootingDays(count: number): any[] {
    const days = [];
    for (let i = 1; i <= count; i++) {
      days.push({
        dayNumber: i,
        scenes: [`Scene ${i * 3}`, `Scene ${i * 3 + 1}`, `Scene ${i * 3 + 2}`],
        location: `Location ${(i % 5) + 1}`,
        estimatedPages: 3.5,
      });
    }
    return days;
  }

  private generateSampleCrew(): any[] {
    return [
      { name: 'Jane Director', role: 'Director', department: 'Direction' },
      { name: 'John DP', role: 'Director of Photography', department: 'Camera' },
      { name: 'Mike Sound', role: 'Sound Mixer', department: 'Sound' },
    ];
  }

  private generateSampleCast(): any[] {
    return [
      { actorName: 'Lead Actor', characterName: 'JOHN', role: 'lead', scenes: ['1', '2', '5', '10'] },
      { actorName: 'Supporting Actor', characterName: 'SARAH', role: 'lead', scenes: ['1', '3', '8', '12'] },
    ];
  }

  private generateSampleLocations(): any[] {
    return [
      { name: 'Downtown Apartment', type: 'practical', scenes: ['1', '5', '10'], permitRequired: true },
      { name: 'Main Street', type: 'exterior', scenes: ['2', '8'], permitRequired: true },
    ];
  }
}
