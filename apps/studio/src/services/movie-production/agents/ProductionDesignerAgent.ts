// src/services/movie-production/agents/ProductionDesignerAgent.ts
import { BaseSubAgent } from '../SubAgent';
import { Skill, SkillInput, SkillOutput, ProductionArtifact, CollaborationRequest, CollaborationResponse } from '../../types';

// Set Design Skill
class SetDesignSkill implements Skill {
  readonly id = 'set-design';
  readonly name = 'Set Design';
  readonly description = 'Design physical sets and environments';
  readonly department = 'production-design' as const;
  readonly requiredInputs = ['screenplay', 'creative-brief'];
  readonly outputs = ['set-design', 'mood-board'];

  async execute(input: SkillInput): Promise<SkillOutput> {
    const { data, context } = input;

    const setDesign = {
      locations: [
        {
          locationName: 'Interior - Main Setting',
          description: 'Character\'s primary environment establishing personality and status',
          designApproach: `Reflects ${context.project.style.visualTone} aesthetic with purposeful detail`,
          colorPalette: context.project.style.colorPalette,
          architecture: 'Clean lines with period-appropriate or contemporary elements',
          furniture: 'Curated pieces reflecting character taste and narrative function',
          dressing: 'Meaningful props supporting character background and story beats',
          lighting: 'Allows for cinematic lighting while maintaining natural-looking spaces',
          budgetConsideration: 'Practical to construct and light for efficiency',
        },
        {
          locationName: 'Exterior - Establishing Location',
          description: 'Outdoor environment for action and scope',
          designApproach: 'Natural environment enhanced with strategic dressing',
          natureLandscape: 'Terrain selected for visual interest and practical filming',
          constructed: 'Minimal set construction, focus on natural features',
          accessories: 'Period and location-appropriate dressing elements',
        },
      ],
      materialSelection: ['Natural materials for authenticity', 'Practical durability for repeated takes', 'Photogenic qualities for cinematography'],
      constructionSchedule: 'Build out coordinated with shooting schedule',
    };

    const moodBoard = {
      inspiration: 'Visual references establishing design language',
      references: [
        { type: 'Film still', source: 'Related film', description: 'Visual tone and aesthetic' },
        { type: 'Photography', source: 'Interior design', description: 'Color palette and styling' },
        { type: 'Architecture', source: 'Design movement', description: 'Spatial planning and materials' },
      ],
      colorPalette: context.project.style.colorPalette,
      materials: ['Wood finishes', 'Metallic accents', 'Fabric textures'],
      aesthetic: context.project.style.visualTone,
    };

    return {
      success: true,
      artifacts: [
        {
          id: `set-design-${Date.now()}`,
          type: 'set-design',
          name: 'Set Design Plan',
          department: 'production-design',
          data: setDesign,
          version: 1,
          createdAt: new Date(),
          createdBy: 'production-designer-agent',
        },
        {
          id: `mood-board-${Date.now()}`,
          type: 'mood-board',
          name: 'Design Mood Board',
          department: 'production-design',
          data: moodBoard,
          version: 1,
          createdAt: new Date(),
          createdBy: 'production-designer-agent',
        },
      ],
      quality: 0.9,
      notes: ['Set design supports visual storytelling', 'Designs are achievable within budget'],
      metadata: { locations: setDesign.locations.length },
    };
  }
}

// Costume Design Skill
class CostumeDesignSkill implements Skill {
  readonly id = 'costume-design';
  readonly name = 'Costume Design';
  readonly description = 'Design costumes reflecting character and narrative';
  readonly department = 'production-design' as const;
  readonly requiredInputs = ['character-bible', 'creative-brief'];
  readonly outputs = ['costume-design'];

  async execute(input: SkillInput): Promise<SkillOutput> {
    const { data, context } = input;

    const costumeDesign = {
      designPhilosophy: `Costumes reflect character psychology and support ${context.project.style.visualTone} visual palette`,
      characters: [
        {
          characterName: 'Protagonist',
          role: 'Lead',
          costumes: [
            {
              scene: 'Opening',
              outfit: 'Contemporary casual wear suggesting normalcy',
              colors: 'Neutral foundation with accent color',
              silhouette: 'Unfitted reflecting comfort in current life',
              symbolicMeaning: 'Before the journey begins',
            },
            {
              scene: 'Climax',
              outfit: 'Refined or transformed wardrobe',
              colors: 'Reflects character evolution',
              silhouette: 'More defined, showing confidence or change',
              symbolicMeaning: 'Character transformation complete',
            },
          ],
          colorPalette: context.project.style.colorPalette,
        },
        {
          characterName: 'Supporting Character',
          role: 'Antagonist',
          costumes: [
            {
              scene: 'All scenes',
              outfit: 'Distinctive silhouette establishing visual identity',
              colors: 'Contrasting to protagonist, asserting dominance',
              silhouette: 'Sharp and commanding',
              symbolicMeaning: 'Opposition and conflict',
            },
          ],
        },
      ],
      fabricSelection: ['Quality naturals for comfort and movement', 'Durability for repeated takes', 'Photogenic qualities for cinematography'],
      budgetConsideration: 'Period or contemporary, complex or simple',
    };

    return {
      success: true,
      artifacts: [{
        id: `costume-design-${Date.now()}`,
        type: 'costume-design',
        name: 'Costume Design Plan',
        department: 'production-design',
        data: costumeDesign,
        version: 1,
        createdAt: new Date(),
        createdBy: 'production-designer-agent',
      }],
      quality: 0.88,
      notes: ['Costumes support character arcs and visual palette', 'Practical for actor movement and cinematography'],
      metadata: { characters: costumeDesign.characters.length },
    };
  }
}

// Color Palette and Branding Skill
class ColorPaletteSkill implements Skill {
  readonly id = 'color-palette-branding';
  readonly name = 'Color Palette & Visual Branding';
  readonly description = 'Define comprehensive color strategy and visual language';
  readonly department = 'production-design' as const;
  readonly requiredInputs = ['creative-brief'];
  readonly outputs = ['color-palette'];

  async execute(input: SkillInput): Promise<SkillOutput> {
    const { data, context } = input;

    const colorPalette = {
      primaryPalette: context.project.style.colorPalette,
      strategy: `Cohesive color language supporting ${context.project.style.visualTone} and narrative themes`,
      colorTheory: {
        primary: {
          color: context.project.style.colorPalette[0] || '#000000',
          meaning: 'Dominant emotional tone',
          usage: 'Costume, set dressing, environmental framing',
        },
        secondary: {
          color: context.project.style.colorPalette[1] || '#FFFFFF',
          meaning: 'Contrast and support',
          usage: 'Accent elements, character distinction',
        },
        tertiary: {
          color: context.project.style.colorPalette[2] || '#888888',
          meaning: 'Moderation and balance',
          usage: 'Background and supporting elements',
        },
      },
      sceneBasedApplication: [
        {
          sceneNumber: 1,
          colorChoice: 'Cool palette for introspection',
          effectOnViewer: 'Creates emotional distance and isolation',
        },
        {
          sceneNumber: 2,
          colorChoice: 'Warm palette for connection',
          effectOnViewer: 'Draws viewer in emotionally',
        },
      ],
      consistencyGuidelines: 'Unified approach across sets, costumes, props, and lighting',
      cinematographyAlignment: 'Colors support composition and depth perception',
    };

    return {
      success: true,
      artifacts: [{
        id: `color-palette-${Date.now()}`,
        type: 'color-palette',
        name: 'Visual Color Strategy',
        department: 'production-design',
        data: colorPalette,
        version: 1,
        createdAt: new Date(),
        createdBy: 'production-designer-agent',
      }],
      quality: 0.92,
      notes: ['Color strategy unified across all departments', 'Supports visual and narrative objectives'],
      metadata: { primaryColors: context.project.style.colorPalette.length },
    };
  }
}

/**
 * Production Designer Agent - Set design, costumes, and visual aesthetics
 */
export class ProductionDesignerAgent extends BaseSubAgent {
  constructor() {
    super({
      id: 'production-designer-agent',
      name: 'Production Designer Agent',
      department: 'production-design',
      role: 'Production Designer / Art Director',
      description: 'Creates the visual world through production design, set design, costumes, and color. Establishes the aesthetic language and ensures visual cohesion.',
    });
  }

  protected async onInitialize(): Promise<void> {
    this.registerSkill(new SetDesignSkill());
    this.registerSkill(new CostumeDesignSkill());
    this.registerSkill(new ColorPaletteSkill());
  }

  protected async reviewCollaboration(
    request: CollaborationRequest,
    artifacts: ProductionArtifact[]
  ): Promise<CollaborationResponse> {
    // Production designer ensures visual consistency
    if (request.type === 'feedback') {
      return {
        approved: true,
        feedback: 'Design feedback provided - maintaining visual consistency with established palette',
        artifacts: [],
      };
    }

    if (request.type === 'approval') {
      return {
        approved: true,
        feedback: 'Design approved. Ready for construction and fabrication.',
        artifacts: [],
      };
    }

    return {
      approved: true,
      feedback: 'Production design ready for implementation',
    };
  }
}
