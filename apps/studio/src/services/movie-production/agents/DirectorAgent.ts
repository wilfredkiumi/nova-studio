// src/services/movie-production/agents/DirectorAgent.ts
import { BaseSubAgent } from '../SubAgent';
import { Skill, SkillInput, SkillOutput, ProductionArtifact, CollaborationRequest, CollaborationResponse } from '../../types';

// Creative Direction Skill
class CreativeDirectionSkill implements Skill {
  readonly id = 'creative-direction';
  readonly name = 'Creative Direction';
  readonly description = 'Establish creative vision and directorial decisions';
  readonly department = 'direction' as const;
  readonly requiredInputs = ['screenplay', 'style'];
  readonly outputs = ['creative-brief', 'storyboard'];

  async execute(input: SkillInput): Promise<SkillOutput> {
    const { data, context } = input;

    const creativeBrief = {
      vision: `${context.project.title} will be executed with ${context.project.style.visualTone} aesthetic`,
      colorPalette: context.project.style.colorPalette,
      cinematicReferences: context.project.style.cinematicReferences,
      pacing: context.project.style.pacing,
      cameraStrategy: 'Dynamic, character-driven cinematography',
      performanceDirection: 'Naturalistic with emotional authenticity',
      themes: 'Will emphasize narrative core and character relationships',
      technicalApproach: 'Carefully planned production design and visual effects',
    };

    return {
      success: true,
      artifacts: [{
        id: `creative-brief-${Date.now()}`,
        type: 'creative-brief',
        name: 'Creative Direction Brief',
        department: 'direction',
        data: creativeBrief,
        version: 1,
        createdAt: new Date(),
        createdBy: 'director-agent',
        dependencies: data.screenplay ? [data.screenplay] : [],
      }],
      quality: 0.9,
      notes: ['Creative vision established', 'Visual language defined', 'Ready for cinematography planning'],
      metadata: { colorCount: context.project.style.colorPalette.length },
    };
  }
}

// Shot Planning Skill
class ShotPlanningSkill implements Skill {
  readonly id = 'shot-planning';
  readonly name = 'Shot Planning';
  readonly description = 'Create detailed shot lists and storyboards';
  readonly department = 'direction' as const;
  readonly requiredInputs = ['screenplay', 'creative-brief'];
  readonly outputs = ['shot-list', 'storyboard'];

  async execute(input: SkillInput): Promise<SkillOutput> {
    const { data } = input;

    const shotList = {
      totalShots: 150,
      shotBreakdown: {
        wideShots: 45,
        mediumShots: 60,
        closeUps: 35,
        specialShots: 10,
      },
      scenes: [
        {
          sceneNumber: 1,
          shots: [
            {
              number: '1A',
              type: 'Wide Shot',
              description: 'Establishing shot of location',
              duration: '5 seconds',
              camera: 'Static camera on sticks',
              lighting: 'Natural light with fill',
            },
            {
              number: '1B',
              type: 'Medium Shot',
              description: 'Character enters frame',
              duration: '10 seconds',
              camera: 'Slow push in',
              lighting: 'Motivated by location light',
            },
          ],
        },
      ],
    };

    const storyboard = {
      totalFrames: 150,
      frames: [
        {
          frameNumber: 1,
          sceneNumber: 1,
          shotNumber: '1A',
          description: 'Wide establishing shot',
          visualNotes: 'Golden hour lighting, cinematic composition',
          composition: 'Rule of thirds, leading lines guide eye',
        },
      ],
      illustrationStyle: 'Detailed cinematic panels',
    };

    return {
      success: true,
      artifacts: [
        {
          id: `shot-list-${Date.now()}`,
          type: 'shot-list',
          name: 'Production Shot List',
          department: 'direction',
          data: shotList,
          version: 1,
          createdAt: new Date(),
          createdBy: 'director-agent',
          dependencies: data.screenplay ? [data.screenplay] : [],
        },
        {
          id: `storyboard-${Date.now()}`,
          type: 'storyboard',
          name: 'Visual Storyboard',
          department: 'direction',
          data: storyboard,
          version: 1,
          createdAt: new Date(),
          createdBy: 'director-agent',
          dependencies: data.screenplay ? [data.screenplay] : [],
        },
      ],
      quality: 0.88,
      notes: ['Shot list comprehensive and shooting-ready', 'Storyboard provides clear visual roadmap'],
      metadata: { totalShots: shotList.totalShots },
    };
  }
}

// Blocking and Staging Skill
class BlockingSkill implements Skill {
  readonly id = 'blocking-staging';
  readonly name = 'Blocking & Staging';
  readonly description = 'Plan actor movement and scene staging';
  readonly department = 'direction' as const;
  readonly requiredInputs = ['screenplay', 'shot-list'];
  readonly outputs = ['blocking-diagram'];

  async execute(input: SkillInput): Promise<SkillOutput> {
    const blockingDiagrams = {
      scenes: [
        {
          sceneNumber: 1,
          title: 'Opening Scene',
          setup: 'Two characters in conversation',
          movements: [
            { character: 'Protagonist', action: 'Enters from stage left', timing: '0:00' },
            { character: 'Supporting', action: 'Stands near window', timing: '0:00' },
            { character: 'Protagonist', action: 'Moves to center stage', timing: '0:15' },
          ],
          emotionalBeat: 'Building tension through physical distance narrowing',
          stagingNotes: 'Movement reveals emotional relationship, use depth to show hierarchy',
        },
      ],
    };

    return {
      success: true,
      artifacts: [{
        id: `blocking-${Date.now()}`,
        type: 'blocking-diagram',
        name: 'Scene Blocking Diagrams',
        department: 'direction',
        data: blockingDiagrams,
        version: 1,
        createdAt: new Date(),
        createdBy: 'director-agent',
      }],
      quality: 0.85,
      notes: ['Blocking supports emotional narrative', 'Camera movement integrated with actor movement'],
      metadata: { sceneCount: blockingDiagrams.scenes.length },
    };
  }
}

/**
 * Director Agent - Orchestrates creative vision and coordinates all departments
 */
export class DirectorAgent extends BaseSubAgent {
  constructor() {
    super({
      id: 'director-agent',
      name: 'Director Agent',
      department: 'direction',
      role: 'Film Director',
      description: 'Orchestrates the creative vision, directs cinematography, manages performances, and ensures cohesive storytelling across all departments.',
    });
  }

  protected async onInitialize(): Promise<void> {
    this.registerSkill(new CreativeDirectionSkill());
    this.registerSkill(new ShotPlanningSkill());
    this.registerSkill(new BlockingSkill());
  }

  protected async reviewCollaboration(
    request: CollaborationRequest,
    artifacts: ProductionArtifact[]
  ): Promise<CollaborationResponse> {
    // Director provides high-level feedback and creative direction
    if (request.type === 'feedback') {
      return {
        approved: true,
        feedback: 'Creative feedback provided - maintain visual cohesion with established style',
        artifacts: [],
      };
    }

    if (request.type === 'approval') {
      return {
        approved: true,
        feedback: 'Approved. Ready to move forward with production planning.',
        artifacts: [],
      };
    }

    return {
      approved: true,
      feedback: 'Director approval granted',
    };
  }
}
