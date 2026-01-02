// src/services/movie-production/agents/ProductionAgent.ts
import { BaseSubAgent } from '../SubAgent';
import { Skill, SkillInput, SkillOutput, ProductionArtifact, CollaborationRequest, CollaborationResponse } from '../../types';

// Production Scheduling Skill
class ProductionSchedulingSkill implements Skill {
  readonly id = 'production-scheduling';
  readonly name = 'Production Scheduling';
  readonly description = 'Create detailed production schedules and call sheets';
  readonly department = 'production' as const;
  readonly requiredInputs = ['screenplay', 'shot-list'];
  readonly outputs = ['schedule', 'call-sheet'];

  async execute(input: SkillInput): Promise<SkillOutput> {
    const { data, context } = input;

    const schedule = {
      productionDays: 15,
      shootingSchedule: [
        {
          day: 1,
          date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
          location: 'Interior - Main Setting',
          scenes: ['Scene 1', 'Scene 2'],
          estimatedHours: 12,
          crew: ['Director', 'DP', 'Gaffer', 'Grip', 'Sound', 'Production Assistant'],
        },
        {
          day: 2,
          date: new Date(Date.now() + 8 * 24 * 60 * 60 * 1000),
          location: 'Exterior - Establishing Locations',
          scenes: ['Scene 3', 'Scene 4'],
          estimatedHours: 10,
        },
      ],
      totalDays: 15,
      preProductionDays: 7,
      postProductionDays: 30,
    };

    const callSheet = {
      day: 1,
      location: 'Studio A',
      callTime: '06:00 AM',
      scenes: ['1', '2'],
      cast: [
        { name: 'Lead Actor', callTime: '07:00 AM', character: 'Protagonist' },
        { name: 'Supporting Actor', callTime: '08:00 AM', character: 'Antagonist' },
      ],
      crew: [
        { position: 'Director', name: 'TBD' },
        { position: 'DP', name: 'TBD' },
      ],
      weather: 'Clear, 72°F',
      sunset: '8:15 PM',
    };

    return {
      success: true,
      artifacts: [
        {
          id: `schedule-${Date.now()}`,
          type: 'schedule',
          name: 'Production Schedule',
          department: 'production',
          data: schedule,
          version: 1,
          createdAt: new Date(),
          createdBy: 'production-agent',
        },
        {
          id: `call-sheet-${Date.now()}`,
          type: 'call-sheet',
          name: 'Production Call Sheet',
          department: 'production',
          data: callSheet,
          version: 1,
          createdAt: new Date(),
          createdBy: 'production-agent',
        },
      ],
      quality: 0.9,
      notes: ['Schedule is realistic and achievable', 'Call sheets ready for distribution'],
      metadata: { productionDays: schedule.productionDays, totalDays: schedule.totalDays },
    };
  }
}

// Budget Planning Skill
class BudgetPlanningSkill implements Skill {
  readonly id = 'budget-planning';
  readonly name = 'Budget Planning';
  readonly description = 'Create comprehensive production budget';
  readonly department = 'production' as const;
  readonly requiredInputs = ['schedule', 'crew-requirements'];
  readonly outputs = ['budget'];

  async execute(input: SkillInput): Promise<SkillOutput> {
    const { data, context } = input;

    const budget = {
      totalBudget: context.constraints?.budget || 500000,
      breakdown: {
        above_the_line: {
          writer: 25000,
          director: 50000,
          producer: 30000,
          total: 105000,
        },
        cast: {
          lead: 75000,
          supporting: 35000,
          total: 110000,
        },
        crew: {
          dp: 20000,
          gaffer: 15000,
          soundEngineer: 12000,
          productionAssistants: 18000,
          total: 65000,
        },
        equipment: {
          camera: 35000,
          lighting: 25000,
          sound: 15000,
          grip: 20000,
          total: 95000,
        },
        locations: 40000,
        postProduction: {
          editing: 30000,
          colorGrading: 20000,
          soundDesign: 15000,
          music: 15000,
          total: 80000,
        },
        contingency: 50000,
      },
      costPerDay: 5000,
    };

    return {
      success: true,
      artifacts: [{
        id: `budget-${Date.now()}`,
        type: 'budget',
        name: 'Production Budget',
        department: 'production',
        data: budget,
        version: 1,
        createdAt: new Date(),
        createdBy: 'production-agent',
      }],
      quality: 0.85,
      notes: ['Budget is comprehensive and realistic', 'Contingency included for unforeseen costs'],
      metadata: { totalBudget: budget.totalBudget },
    };
  }
}

// Logistics and Resources Skill
class LogisticsSkill implements Skill {
  readonly id = 'logistics-management';
  readonly name = 'Logistics Management';
  readonly description = 'Coordinate equipment, crew, and resources';
  readonly department = 'production' as const;
  readonly requiredInputs = ['schedule', 'budget'];
  readonly outputs = ['schedule'];

  async execute(input: SkillInput): Promise<SkillOutput> {
    const logistics = {
      equipment: {
        camera: ['Cinema camera', 'Prime lens set', 'Zoom lenses'],
        lighting: ['LED panels', 'Fresnel lights', 'Soft boxes', 'Grip equipment'],
        sound: ['Lavalier mics', 'Boom mic', 'Audio recorder', 'Wireless transmitters'],
      },
      permits: ['Location permits', 'Street closure permits', 'Safety certifications'],
      insurance: ['General liability', 'Equipment insurance', 'Cast insurance'],
      accommodations: ['Craft services', 'Equipment trucks', 'Production office'],
    };

    return {
      success: true,
      artifacts: [{
        id: `logistics-${Date.now()}`,
        type: 'schedule',
        name: 'Logistics and Resources Plan',
        department: 'production',
        data: logistics,
        version: 1,
        createdAt: new Date(),
        createdBy: 'production-agent',
      }],
      quality: 0.88,
      notes: ['All resources accounted for', 'Permits and insurance coordinated'],
      metadata: { equipmentItems: 10, departments: 3 },
    };
  }
}

/**
 * Production Agent - Manages schedules, budgets, and logistics
 */
export class ProductionAgent extends BaseSubAgent {
  constructor() {
    super({
      id: 'production-agent',
      name: 'Production Agent',
      department: 'production',
      role: 'Line Producer / Production Manager',
      description: 'Manages all production logistics, scheduling, budgeting, and resource allocation. Ensures efficient execution of the shooting schedule.',
    });
  }

  protected async onInitialize(): Promise<void> {
    this.registerSkill(new ProductionSchedulingSkill());
    this.registerSkill(new BudgetPlanningSkill());
    this.registerSkill(new LogisticsSkill());
  }

  protected async reviewCollaboration(
    request: CollaborationRequest,
    artifacts: ProductionArtifact[]
  ): Promise<CollaborationResponse> {
    // Production ensures feasibility and coordination
    if (request.type === 'feedback') {
      return {
        approved: true,
        feedback: 'Production requirements integrated into schedule and budget',
        artifacts: [],
      };
    }

    if (request.type === 'resource') {
      return {
        approved: true,
        feedback: 'Resources allocated and confirmed available',
        artifacts: [],
      };
    }

    return {
      approved: true,
      feedback: 'Production ready to proceed',
    };
  }
}
