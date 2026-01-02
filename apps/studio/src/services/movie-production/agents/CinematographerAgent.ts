// src/services/movie-production/agents/CinematographerAgent.ts
import { BaseSubAgent } from '../SubAgent';
import { Skill, SkillInput, SkillOutput, ProductionArtifact, CollaborationRequest, CollaborationResponse } from '../../types';

// Composition and Framing Skill
class CompositionSkill implements Skill {
  readonly id = 'frame-composition';
  readonly name = 'Frame Composition';
  readonly description = 'Design visual composition and frame layouts';
  readonly department = 'cinematography' as const;
  readonly requiredInputs = ['shot-list', 'creative-brief'];
  readonly outputs = ['frame-composition'];

  async execute(input: SkillInput): Promise<SkillOutput> {
    const { data, context } = input;

    const compositions = {
      principles: ['Rule of thirds', 'Leading lines', 'Depth of field', 'Color harmony'],
      scenes: [
        {
          sceneNumber: 1,
          compositionStrategy: 'Symmetrical composition for formality, asymmetrical for tension',
          framingRatios: ['16:9 for wide establishing', '4:3 for intimate close-ups'],
          depthLayers: ['Foreground element', 'Subject', 'Background action'],
          colorRole: context.project.style.colorPalette[0] || 'Warm tones for intimacy',
          visualBalance: 'Dynamic balance reflecting emotional beats',
        },
      ],
      techniqueNotes: 'Composition supports narrative focus and emotional journey',
    };

    return {
      success: true,
      artifacts: [{
        id: `composition-${Date.now()}`,
        type: 'frame-composition',
        name: 'Composition & Framing Guide',
        department: 'cinematography',
        data: compositions,
        version: 1,
        createdAt: new Date(),
        createdBy: 'cinematographer-agent',
        dependencies: data.shotList ? [data.shotList] : [],
      }],
      quality: 0.9,
      notes: ['Composition supports visual storytelling', 'Cohesive with creative direction'],
      metadata: { principles: compositions.principles.length },
    };
  }
}

// Lighting Design Skill
class LightingDesignSkill implements Skill {
  readonly id = 'lighting-design';
  readonly name = 'Lighting Design';
  readonly description = 'Create comprehensive lighting plans and schemes';
  readonly department = 'cinematography' as const;
  readonly requiredInputs = ['shot-list', 'creative-brief'];
  readonly outputs = ['lighting-plan'];

  async execute(input: SkillInput): Promise<SkillOutput> {
    const { data, context } = input;

    const lightingPlan = {
      lightingApproach: `${context.project.style.visualTone} aesthetic with motivated light sources`,
      colorTemperature: context.project.style.colorPalette.join(', '),
      schemes: [
        {
          sceneNumber: 1,
          mood: 'Introspective and tense',
          keyLight: 'Motivated by window, hard directional light',
          fillLight: 'Soft fill at 1:3 ratio for dimensionality',
          backLight: 'Separation light creates depth',
          practicals: ['Desk lamp', 'Window light', 'Exit sign'],
          colorCorrection: 'Warm undertones with cool shadows for conflict',
        },
        {
          sceneNumber: 2,
          mood: 'Hopeful and dynamic',
          keyLight: 'Multi-directional for energy and movement',
          fillLight: 'Balanced fill supporting key light ratio',
          backLight: 'Strong separation lighting',
          practicals: ['Street lamps', 'Neon signs', 'Natural moonlight'],
          colorCorrection: 'Balanced daylight with artistic color grading',
        },
      ],
      equipmentNeeds: ['LED panels for controllable color', 'Fresnel for hard light', 'Soft boxes for wrapping light'],
      specialEffects: ['Practical lighting integration', 'Atmospheric effects', 'Practical lens flares'],
    };

    return {
      success: true,
      artifacts: [{
        id: `lighting-${Date.now()}`,
        type: 'lighting-plan',
        name: 'Comprehensive Lighting Design',
        department: 'cinematography',
        data: lightingPlan,
        version: 1,
        createdAt: new Date(),
        createdBy: 'cinematographer-agent',
        dependencies: data.shotList ? [data.shotList] : [],
      }],
      quality: 0.92,
      notes: ['Lighting scheme supports emotional tone', 'Practical and achievable on set'],
      metadata: { sceneCount: lightingPlan.schemes.length },
    };
  }
}

// Camera Movement and Technique Skill
class CameraMovementSkill implements Skill {
  readonly id = 'camera-movement';
  readonly name = 'Camera Movement';
  readonly description = 'Plan dynamic camera movements and techniques';
  readonly department = 'cinematography' as const;
  readonly requiredInputs = ['shot-list', 'creative-brief'];
  readonly outputs = ['camera-movement'];

  async execute(input: SkillInput): Promise<SkillOutput> {
    const { data } = input;

    const cameraMovement = {
      philosophy: 'Motivated movement that reveals character and advances story',
      techniques: [
        {
          type: 'Pan',
          purpose: 'Follow action, reveal new information',
          examples: ['Following character eye line', 'Revealing second character'],
        },
        {
          type: 'Dolly',
          purpose: 'Create emphasis and emotional intensity through push/pull',
          examples: ['Slow push into emotional moment', 'Pull back to reveal context'],
        },
        {
          type: 'Crane/Overhead',
          purpose: 'Establish scope and provide visual metaphor',
          examples: ['Rising crane for hope', 'God\\'s eye view for perspective'],
        },
        {
          type: 'Handheld',
          purpose: 'Intimacy or chaos depending on execution',
          examples: ['Gentle handheld for vulnerability', 'Shaky cam for tension'],
        },
      ],
      lensSelection: {
        wideAngle: '24-35mm for environmental storytelling',
        standard: '50mm for natural perspective and character close-ups',
        telephoto: '85-135mm for intimate framing and compression',
      },
      specialTechniques: ['Rack focus for emotional beats', 'Slow motion for impact', 'Speed ramping for dynamic effect'],
    };

    return {
      success: true,
      artifacts: [{
        id: `camera-movement-${Date.now()}`,
        type: 'camera-movement',
        name: 'Camera Techniques & Movement',
        department: 'cinematography',
        data: cameraMovement,
        version: 1,
        createdAt: new Date(),
        createdBy: 'cinematographer-agent',
      }],
      quality: 0.88,
      notes: ['Camera movement integrated with narrative', 'Practical lens selections for production'],
      metadata: { techniqueCount: cameraMovement.techniques.length },
    };
  }
}

/**
 * Cinematographer Agent - Visual language, camera work, and composition
 */
export class CinematographerAgent extends BaseSubAgent {
  constructor() {
    super({
      id: 'cinematographer-agent',
      name: 'Cinematographer Agent',
      department: 'cinematography',
      role: 'Director of Photography',
      description: 'Responsible for visual storytelling through cinematography. Manages composition, lighting, camera movement, and the overall visual aesthetic.',
    });
  }

  protected async onInitialize(): Promise<void> {
    this.registerSkill(new CompositionSkill());
    this.registerSkill(new LightingDesignSkill());
    this.registerSkill(new CameraMovementSkill());
  }

  protected async reviewCollaboration(
    request: CollaborationRequest,
    artifacts: ProductionArtifact[]
  ): Promise<CollaborationResponse> {
    // Cinematographer provides technical and artistic feedback
    if (request.type === 'feedback') {
      return {
        approved: true,
        feedback: 'Visual approach confirmed - ready for technical implementation',
        artifacts: [],
      };
    }

    if (request.type === 'resource') {
      return {
        approved: true,
        feedback: 'Camera, lighting, and grip resources coordinated',
        artifacts: [],
      };
    }

    return {
      approved: true,
      feedback: 'Cinematography department ready',
    };
  }
}
