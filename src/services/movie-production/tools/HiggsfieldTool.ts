// HiggsfieldTool.ts
// Higgsfield AI Integration for Nova Studio Film Production
// Hollywood-grade VFX, cinematic video generation, and Soul image generation.
//
// API: https://api.higgsfield.ai  (Bearer auth via api.higgsfield.ai)
// SDK: https://github.com/higgsfield-ai/higgsfield-client
//
// Auth: set HF_API_KEY + HF_API_SECRET (or combined as "key:secret")
// Prompts are auto-converted through PromptConverter before dispatch.

import { promptConverter, type SupportedModel } from './PromptConverter';

// ============================================================================
// TYPES
// ============================================================================

export interface HiggsfieldConfig {
  apiKey: string;
  apiSecret: string;
  baseUrl?: string;
  webhookUrl?: string;
  defaultTimeout?: number; // ms, default 300000
}

export type EffectCategory =
  | 'fire-pyrotechnics'
  | 'explosions-destruction'
  | 'smoke-atmosphere'
  | 'weather-environment'
  | 'crowd-simulation'
  | 'water-fluid'
  | 'lightning-energy'
  | 'vfx-general'
  | 'video-generation'
  | 'image-generation';

export interface HiggsfieldEffect {
  id: string;
  name: string;
  description: string;
  category: EffectCategory;
  promptModel: SupportedModel;
  parameters: Record<string, EffectParameter>;
}

export interface EffectParameter {
  type: 'string' | 'number' | 'boolean' | 'enum';
  required?: boolean;
  default?: any;
  options?: string[];    // for enum
  min?: number;
  max?: number;
  description?: string;
}

export interface ProcessingJob {
  id: string;
  status: 'Queued' | 'InProgress' | 'Completed' | 'Failed' | 'NSFW' | 'Cancelled';
  output?: any;
  error?: string;
  requestId?: string;
}

export interface ToolResult {
  success: boolean;
  output?: any;
  error?: string;
  metadata?: Record<string, any>;
}

// ============================================================================
// EFFECTS REGISTRY
// ============================================================================

export const HIGGSFIELD_EFFECTS: Record<string, HiggsfieldEffect> = {

  // ── Video Generation ─────────────────────────────────────────────────────
  'image-to-video': {
    id: 'image-to-video',
    name: 'Image to Video',
    description: 'Animate a still image into a 5-second cinematic video using motion presets',
    category: 'video-generation',
    promptModel: 'higgsfield-vfx',
    parameters: {
      image_url:  { type: 'string',  required: true,  description: 'Source image (public HTTPS URL)' },
      motion_id:  { type: 'string',  required: true,  description: 'Motion preset ID from Higgsfield library' },
      prompt:     { type: 'string',  required: false, description: 'Scene description to guide motion' },
      quality:    { type: 'enum',    required: false, options: ['lite', 'turbo', 'standard'], default: 'standard' },
    },
  },
  'text-to-video': {
    id: 'text-to-video',
    name: 'Text to Video',
    description: 'Generate a cinematic video from a text description',
    category: 'video-generation',
    promptModel: 'higgsfield-vfx',
    parameters: {
      prompt:      { type: 'string', required: true,  description: 'Scene description' },
      quality:     { type: 'enum',   required: false, options: ['lite', 'turbo', 'standard'], default: 'standard' },
      aspect_ratio:{ type: 'enum',   required: false, options: ['16:9', '9:16', '1:1'], default: '16:9' },
    },
  },

  // ── Image Generation ─────────────────────────────────────────────────────
  'soul-image': {
    id: 'soul-image',
    name: 'Soul Image',
    description: 'Higgsfield Soul — hyper-realistic image generation with smartphone photography feel',
    category: 'image-generation',
    promptModel: 'higgsfield-vfx',
    parameters: {
      prompt:      { type: 'string', required: true },
      resolution:  { type: 'enum',   required: false, options: ['1K', '2K', '4K'], default: '2K' },
      aspect_ratio:{ type: 'enum',   required: false, options: ['1:1', '16:9', '9:16', '4:3', '3:4'], default: '1:1' },
    },
  },

  // ── Fire & Pyrotechnics ──────────────────────────────────────────────────
  'fire-overlay': {
    id: 'fire-overlay',
    name: 'Fire Overlay',
    description: 'Add realistic fire and flames to existing footage',
    category: 'fire-pyrotechnics',
    promptModel: 'higgsfield-fire',
    parameters: {
      intensity:    { type: 'enum',   required: false, options: ['subtle', 'moderate', 'intense', 'massive'], default: 'moderate' },
      fire_color:   { type: 'enum',   required: false, options: ['natural', 'blue', 'green', 'white'], default: 'natural' },
      spread_speed: { type: 'number', required: false, min: 0.1, max: 2.0, default: 1.0 },
    },
  },
  'fire-environment': {
    id: 'fire-environment',
    name: 'Fire Environment',
    description: 'Transform scene into a burning environment with volumetric fire',
    category: 'fire-pyrotechnics',
    promptModel: 'higgsfield-fire',
    parameters: {
      coverage:      { type: 'enum',    required: false, options: ['partial', 'majority', 'full'], default: 'majority' },
      ember_density: { type: 'number',  required: false, min: 0, max: 1, default: 0.5 },
      heat_distortion:{ type: 'boolean',required: false, default: true },
    },
  },

  // ── Explosions & Destruction ─────────────────────────────────────────────
  'explosion': {
    id: 'explosion',
    name: 'Explosion',
    description: 'Hollywood-grade explosion VFX with shockwave, debris and fire',
    category: 'explosions-destruction',
    promptModel: 'higgsfield-explosion',
    parameters: {
      scale:        { type: 'enum',    required: false, options: ['small', 'medium', 'large', 'epic'], default: 'medium' },
      type:         { type: 'enum',    required: false, options: ['ground', 'aerial', 'underwater', 'contained'], default: 'ground' },
      debris:       { type: 'boolean', required: false, default: true },
      shockwave:    { type: 'boolean', required: false, default: true },
    },
  },
  'building-collapse': {
    id: 'building-collapse',
    name: 'Building Collapse',
    description: 'Structural collapse with dust, debris and realistic physics',
    category: 'explosions-destruction',
    promptModel: 'higgsfield-explosion',
    parameters: {
      collapse_type: { type: 'enum',   required: false, options: ['implosion', 'topple', 'crumble', 'blast'], default: 'crumble' },
      dust_density:  { type: 'number', required: false, min: 0, max: 1, default: 0.7 },
    },
  },

  // ── Smoke & Atmosphere ───────────────────────────────────────────────────
  'smoke-atmosphere': {
    id: 'smoke-atmosphere',
    name: 'Smoke & Atmosphere',
    description: 'Volumetric smoke, fog, and atmospheric haze',
    category: 'smoke-atmosphere',
    promptModel: 'higgsfield-smoke',
    parameters: {
      smoke_type:  { type: 'enum',   required: false, options: ['thin-fog', 'thick-smoke', 'haze', 'steam', 'toxic'], default: 'thin-fog' },
      density:     { type: 'number', required: false, min: 0.1, max: 1.0, default: 0.5 },
      color:       { type: 'enum',   required: false, options: ['white', 'grey', 'black', 'yellow', 'green'], default: 'grey' },
      wind_speed:  { type: 'number', required: false, min: 0, max: 10, default: 2 },
    },
  },
  'battlefield-smoke': {
    id: 'battlefield-smoke',
    name: 'Battlefield Smoke',
    description: 'Dense combat smoke with directional drift and color variation',
    category: 'smoke-atmosphere',
    promptModel: 'higgsfield-smoke',
    parameters: {
      density:    { type: 'number', required: false, min: 0.5, max: 1.0, default: 0.8 },
      color_mix:  { type: 'enum',   required: false, options: ['grey-black', 'white-grey', 'orange-grey'], default: 'grey-black' },
    },
  },

  // ── Weather & Environment ────────────────────────────────────────────────
  'rain': {
    id: 'rain',
    name: 'Rain',
    description: 'Realistic rainfall with puddles, splashes and wet surface reflections',
    category: 'weather-environment',
    promptModel: 'higgsfield-weather',
    parameters: {
      intensity:   { type: 'enum',   required: false, options: ['drizzle', 'light', 'heavy', 'storm'], default: 'heavy' },
      angle:       { type: 'number', required: false, min: -45, max: 45, default: 0, description: 'Rain angle in degrees' },
      puddles:     { type: 'boolean',required: false, default: true },
      lightning:   { type: 'boolean',required: false, default: false },
    },
  },
  'snow': {
    id: 'snow',
    name: 'Snow',
    description: 'Snowfall with accumulation and blizzard options',
    category: 'weather-environment',
    promptModel: 'higgsfield-weather',
    parameters: {
      intensity:    { type: 'enum',   required: false, options: ['light', 'moderate', 'heavy', 'blizzard'], default: 'moderate' },
      accumulation: { type: 'boolean',required: false, default: true },
      wind:         { type: 'number', required: false, min: 0, max: 10, default: 3 },
    },
  },
  'storm': {
    id: 'storm',
    name: 'Storm',
    description: 'Full storm system — dark clouds, wind, rain, and lightning',
    category: 'weather-environment',
    promptModel: 'higgsfield-weather',
    parameters: {
      severity:     { type: 'enum',   required: false, options: ['overcast', 'storm', 'severe', 'hurricane'], default: 'storm' },
      lightning_frequency: { type: 'number', required: false, min: 0, max: 1, default: 0.3 },
    },
  },

  // ── Crowd Simulation ─────────────────────────────────────────────────────
  'crowd-fill': {
    id: 'crowd-fill',
    name: 'Crowd Fill',
    description: 'Populate scenes with realistic crowds of varying density',
    category: 'crowd-simulation',
    promptModel: 'higgsfield-crowd',
    parameters: {
      density:    { type: 'enum',   required: false, options: ['sparse', 'moderate', 'dense', 'packed'], default: 'moderate' },
      behaviour:  { type: 'enum',   required: false, options: ['idle', 'walking', 'running', 'panicking', 'cheering'], default: 'walking' },
      diversity:  { type: 'number', required: false, min: 0.1, max: 1.0, default: 0.7, description: 'Character appearance variation' },
    },
  },
  'crowd-reaction': {
    id: 'crowd-reaction',
    name: 'Crowd Reaction',
    description: 'Crowd reacting to an event — cheer, flee, or scatter',
    category: 'crowd-simulation',
    promptModel: 'higgsfield-crowd',
    parameters: {
      reaction:   { type: 'enum',   required: false, options: ['cheer', 'flee', 'scatter', 'freeze', 'protest'], default: 'cheer' },
      trigger_point: { type: 'string', required: false, description: 'Where in frame the reaction originates' },
    },
  },

  // ── Water & Fluid ────────────────────────────────────────────────────────
  'flood': {
    id: 'flood',
    name: 'Flood',
    description: 'Rising water, flooding and submerging environment elements',
    category: 'water-fluid',
    promptModel: 'higgsfield-vfx',
    parameters: {
      water_level:  { type: 'enum',   required: false, options: ['ankle', 'knee', 'waist', 'full'], default: 'knee' },
      current_speed:{ type: 'number', required: false, min: 0, max: 5, default: 1.5 },
      turbidity:    { type: 'enum',   required: false, options: ['clear', 'murky', 'debris-filled'], default: 'murky' },
    },
  },

  // ── Lightning & Energy ───────────────────────────────────────────────────
  'lightning': {
    id: 'lightning',
    name: 'Lightning',
    description: 'Cinematic lightning strikes with electric arcs and illumination',
    category: 'lightning-energy',
    promptModel: 'higgsfield-vfx',
    parameters: {
      frequency:  { type: 'number', required: false, min: 0.1, max: 2.0, default: 0.5, description: 'Strikes per second' },
      type:       { type: 'enum',   required: false, options: ['cloud-to-ground', 'cloud-to-cloud', 'chain', 'ball'], default: 'cloud-to-ground' },
      color:      { type: 'enum',   required: false, options: ['white', 'blue', 'purple', 'red'], default: 'white' },
    },
  },
};

// ============================================================================
// HIGGSFIELD TOOL CLASS
// ============================================================================

export class HiggsfieldTool {
  id = 'higgsfield';
  name = 'Higgsfield AI';
  description = 'Hollywood-grade VFX, cinematic video generation, and Soul image generation';

  private config: HiggsfieldConfig;
  private baseUrl: string;

  constructor(config: HiggsfieldConfig) {
    this.config = config;
    this.baseUrl = config.baseUrl || 'https://api.higgsfield.ai';
  }

  // -------------------------------------------------------------------------
  // Core API
  // -------------------------------------------------------------------------

  private get authHeader(): string {
    return `Bearer ${this.config.apiKey}:${this.config.apiSecret}`;
  }

  private async request(endpoint: string, options: RequestInit = {}): Promise<any> {
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      ...options,
      headers: {
        'Authorization': this.authHeader,
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(`Higgsfield API error: ${response.status} — ${(error as any).message || response.statusText}`);
    }

    return response.json();
  }

  private async submitJob(model: string, args: Record<string, any>): Promise<ProcessingJob> {
    return this.request('/v1/jobs/submit', {
      method: 'POST',
      body: JSON.stringify({
        model,
        arguments: args,
        callBackUrl: this.config.webhookUrl,
      }),
    });
  }

  private async getJobStatus(requestId: string): Promise<ProcessingJob> {
    return this.request(`/v1/jobs/status/${requestId}`);
  }

  private async waitForJob(
    requestId: string,
    timeout = this.config.defaultTimeout ?? 300000,
  ): Promise<ProcessingJob> {
    const start = Date.now();
    while (Date.now() - start < timeout) {
      const job = await this.getJobStatus(requestId);
      if (job.status === 'Completed' || job.status === 'Failed' || job.status === 'NSFW' || job.status === 'Cancelled') {
        return job;
      }
      await new Promise(r => setTimeout(r, 3000));
    }
    throw new Error(`Higgsfield job ${requestId} timed out after ${timeout}ms`);
  }

  // -------------------------------------------------------------------------
  // Video Generation
  // -------------------------------------------------------------------------

  /**
   * Animate a still image into a 5-second cinematic video using motion presets.
   * Prompt is auto-converted to structured JSON format before dispatch.
   */
  async imageToVideo(options: {
    imageUrl: string;
    motionId: string;
    prompt?: string;
    quality?: 'lite' | 'turbo' | 'standard';
    useStructuredPrompt?: boolean;
  }): Promise<ToolResult> {
    const useStructured = options.useStructuredPrompt !== false;
    const finalPrompt = options.prompt && useStructured
      ? promptConverter.optimize(options.prompt, 'higgsfield-vfx')
      : options.prompt;

    try {
      const job = await this.submitJob('image-to-video', {
        image_url:  options.imageUrl,
        motion_id:  options.motionId,
        prompt:     finalPrompt,
        quality:    options.quality || 'standard',
      });

      const result = await this.waitForJob(job.requestId || job.id);
      return {
        success: result.status === 'Completed',
        output: result.output,
        error: result.error,
        metadata: { model: 'image-to-video', jobId: result.requestId || result.id },
      };
    } catch (error) {
      return { success: false, error: error instanceof Error ? error.message : 'Image-to-video failed' };
    }
  }

  /**
   * Generate a cinematic video from a text description.
   */
  async textToVideo(options: {
    prompt: string;
    quality?: 'lite' | 'turbo' | 'standard';
    aspectRatio?: '16:9' | '9:16' | '1:1';
    useStructuredPrompt?: boolean;
  }): Promise<ToolResult> {
    const useStructured = options.useStructuredPrompt !== false;
    const finalPrompt = useStructured
      ? promptConverter.optimize(options.prompt, 'higgsfield-vfx')
      : options.prompt;

    try {
      const job = await this.submitJob('text-to-video', {
        prompt:       finalPrompt,
        quality:      options.quality || 'standard',
        aspect_ratio: options.aspectRatio || '16:9',
      });

      const result = await this.waitForJob(job.requestId || job.id);
      return {
        success: result.status === 'Completed',
        output: result.output,
        error: result.error,
        metadata: { model: 'text-to-video', jobId: result.requestId || result.id },
      };
    } catch (error) {
      return { success: false, error: error instanceof Error ? error.message : 'Text-to-video failed' };
    }
  }

  // -------------------------------------------------------------------------
  // Image Generation (Soul)
  // -------------------------------------------------------------------------

  /**
   * Generate a hyper-realistic Soul image.
   * Prompt is auto-converted to structured JSON format before dispatch.
   */
  async generateImage(options: {
    prompt: string;
    resolution?: '1K' | '2K' | '4K';
    aspectRatio?: '1:1' | '16:9' | '9:16' | '4:3' | '3:4';
    cameraFixed?: boolean;
    useStructuredPrompt?: boolean;
  }): Promise<ToolResult> {
    const useStructured = options.useStructuredPrompt !== false;
    const finalPrompt = useStructured
      ? promptConverter.optimize(options.prompt, 'higgsfield-vfx')
      : options.prompt;

    try {
      const job = await this.submitJob('bytedance/seedream/v4/text-to-image', {
        prompt:        finalPrompt,
        resolution:    options.resolution || '2K',
        aspect_ratio:  options.aspectRatio || '1:1',
        camera_fixed:  options.cameraFixed ?? false,
      });

      const result = await this.waitForJob(job.requestId || job.id);
      return {
        success: result.status === 'Completed',
        output: result.output,
        error: result.error,
        metadata: { model: 'soul-image', jobId: result.requestId || result.id },
      };
    } catch (error) {
      return { success: false, error: error instanceof Error ? error.message : 'Image generation failed' };
    }
  }

  // -------------------------------------------------------------------------
  // VFX Effects
  // -------------------------------------------------------------------------

  /**
   * Apply a VFX effect to footage using a registered effect preset.
   * Prompt is auto-converted via PromptConverter using the effect's target model.
   */
  async applyEffect(options: {
    effectId: keyof typeof HIGGSFIELD_EFFECTS;
    prompt?: string;
    videoUrl?: string;
    imageUrl?: string;
    parameters?: Record<string, any>;
    useStructuredPrompt?: boolean;
  }): Promise<ToolResult> {
    const effect = HIGGSFIELD_EFFECTS[options.effectId];
    if (!effect) {
      return { success: false, error: `Unknown effect: ${options.effectId}` };
    }

    const useStructured = options.useStructuredPrompt !== false;
    const finalPrompt = options.prompt && useStructured
      ? promptConverter.optimize(options.prompt, effect.promptModel)
      : options.prompt;

    const args: Record<string, any> = {
      effect:    effect.id,
      prompt:    finalPrompt,
      ...options.parameters,
    };

    if (options.videoUrl) args.video_url = options.videoUrl;
    if (options.imageUrl) args.image_url = options.imageUrl;

    try {
      const job = await this.submitJob(`vfx/${effect.id}`, args);
      const result = await this.waitForJob(job.requestId || job.id);
      return {
        success: result.status === 'Completed',
        output: result.output,
        error: result.error,
        metadata: { effect: effect.name, jobId: result.requestId || result.id },
      };
    } catch (error) {
      return { success: false, error: error instanceof Error ? error.message : `Effect ${effect.name} failed` };
    }
  }

  // -------------------------------------------------------------------------
  // Helpers
  // -------------------------------------------------------------------------

  getEffectsByCategory(category: EffectCategory): HiggsfieldEffect[] {
    return Object.values(HIGGSFIELD_EFFECTS).filter(e => e.category === category);
  }

  getAllEffects(): HiggsfieldEffect[] {
    return Object.values(HIGGSFIELD_EFFECTS);
  }
}

// ============================================================================
// FACTORY
// ============================================================================

export function createHiggsfieldTool(apiKey: string, apiSecret: string): HiggsfieldTool {
  return new HiggsfieldTool({ apiKey, apiSecret });
}

export default HiggsfieldTool;
