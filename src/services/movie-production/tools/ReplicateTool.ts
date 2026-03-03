// ReplicateTool.ts
// Replicate AI Gateway for Nova Studio Film Production
// Unified access to Flux, Kling, Veo, Seedance, Ideogram and other models
// via the Replicate API — all prompts auto-converted through PromptConverter.
//
// API Docs: https://replicate.com/docs
// Endpoint: POST https://api.replicate.com/v1/models/{owner}/{name}/predictions

import { promptConverter, type SupportedModel } from './PromptConverter';

// ============================================================================
// TYPES
// ============================================================================

export interface ReplicateConfig {
  apiKey: string;
  baseUrl?: string;
  webhookUrl?: string;
  defaultTimeout?: number; // ms, default 300000
}

export interface ModelConfig {
  id: string;          // Replicate model ID: "owner/name"
  name: string;
  description: string;
  department: string[];
  capabilities: string[];
  averageTime?: number; // seconds
  pricePerRun?: string;
}

export interface PredictionInput {
  model: string;       // "owner/name"
  input: Record<string, any>;
  webhook?: string;
}

export interface PredictionOutput {
  id: string;
  status: 'starting' | 'processing' | 'succeeded' | 'failed' | 'canceled';
  output?: any;
  error?: string;
  urls?: { get: string; cancel: string };
  metrics?: { predict_time?: number };
}

export interface ToolResult {
  success: boolean;
  output?: any;
  error?: string;
  metadata?: Record<string, any>;
}

type FilmDepartment =
  | 'writing' | 'direction' | 'cinematography'
  | 'audio' | 'editing' | 'production_design' | 'production';

// ============================================================================
// MODEL REGISTRY
// ============================================================================

export const FILM_MODELS: Record<string, ModelConfig> = {

  // ── IMAGE: Flux family ──────────────────────────────────────────────────
  'flux-schnell': {
    id: 'black-forest-labs/flux-schnell',
    name: 'FLUX.1 Schnell',
    description: 'Fastest Flux model — 4-step generation, ideal for iteration',
    department: ['production_design', 'direction'],
    capabilities: ['text-to-image'],
    averageTime: 5,
    pricePerRun: '$0.003',
  },
  'flux-dev': {
    id: 'black-forest-labs/flux-dev',
    name: 'FLUX.1 Dev',
    description: 'Open-weight Flux model — strong quality with guidance',
    department: ['production_design', 'direction'],
    capabilities: ['text-to-image'],
    averageTime: 15,
    pricePerRun: '$0.025',
  },
  'flux-pro': {
    id: 'black-forest-labs/flux-pro',
    name: 'FLUX.1 Pro',
    description: 'Professional Flux — best quality for production assets',
    department: ['production_design', 'direction'],
    capabilities: ['text-to-image'],
    averageTime: 20,
    pricePerRun: '$0.055',
  },
  'flux-1.1-pro': {
    id: 'black-forest-labs/flux-1.1-pro',
    name: 'FLUX 1.1 Pro',
    description: 'Latest flagship Flux — superior prompt adherence and diversity',
    department: ['production_design', 'direction'],
    capabilities: ['text-to-image'],
    averageTime: 18,
    pricePerRun: '$0.04',
  },
  'flux-1.1-pro-ultra': {
    id: 'black-forest-labs/flux-1.1-pro-ultra',
    name: 'FLUX 1.1 Pro Ultra',
    description: 'Ultra high resolution Flux — up to 4 megapixels, raw mode',
    department: ['production_design', 'direction'],
    capabilities: ['text-to-image', '4k', 'raw-mode'],
    averageTime: 25,
    pricePerRun: '$0.06',
  },

  // ── IMAGE: Flux editing variants ────────────────────────────────────────
  'flux-kontext-pro': {
    id: 'black-forest-labs/flux-kontext-pro',
    name: 'FLUX Kontext Pro',
    description: 'Context-aware image editing — precise prompt-based modifications',
    department: ['production_design', 'editing'],
    capabilities: ['image-editing', 'text-to-image'],
    averageTime: 20,
    pricePerRun: '$0.04',
  },
  'flux-kontext-max': {
    id: 'black-forest-labs/flux-kontext-max',
    name: 'FLUX Kontext Max',
    description: 'Maximum-quality context editing — complex scene modifications',
    department: ['production_design', 'editing'],
    capabilities: ['image-editing', 'text-to-image'],
    averageTime: 25,
    pricePerRun: '$0.08',
  },
  'flux-fill-pro': {
    id: 'black-forest-labs/flux-fill-pro',
    name: 'FLUX Fill Pro',
    description: 'Professional inpainting — fill masked regions with generated content',
    department: ['production_design', 'editing'],
    capabilities: ['inpainting', 'image-editing'],
    averageTime: 20,
    pricePerRun: '$0.05',
  },
  'flux-depth-pro': {
    id: 'black-forest-labs/flux-depth-pro',
    name: 'FLUX Depth Pro',
    description: 'Depth-conditioned generation — structure-preserving style transfer',
    department: ['production_design', 'cinematography'],
    capabilities: ['image-editing', 'depth-conditioning'],
    averageTime: 22,
    pricePerRun: '$0.05',
  },

  // ── IMAGE: Other ────────────────────────────────────────────────────────
  'ideogram-v3-turbo': {
    id: 'ideogram-ai/ideogram-v3-turbo',
    name: 'Ideogram V3 Turbo',
    description: 'Fast Ideogram — excellent text rendering inside images',
    department: ['production_design', 'direction'],
    capabilities: ['text-to-image', 'text-rendering'],
    averageTime: 10,
    pricePerRun: '$0.02',
  },
  'recraft-v3': {
    id: 'recraft-ai/recraft-v3',
    name: 'Recraft V3',
    description: 'Professional design-focused image generation and vector output',
    department: ['production_design'],
    capabilities: ['text-to-image', 'vector', 'design'],
    averageTime: 12,
    pricePerRun: '$0.04',
  },
  'imagen-4-ultra': {
    id: 'google/imagen-4-ultra',
    name: 'Google Imagen 4 Ultra',
    description: 'Google's highest-quality image model — photorealism and detail',
    department: ['production_design', 'direction'],
    capabilities: ['text-to-image', 'photorealistic'],
    averageTime: 20,
    pricePerRun: '$0.06',
  },

  // ── VIDEO: Kling ────────────────────────────────────────────────────────
  'kling-v2.1': {
    id: 'kwaivgi/kling-v2.1',
    name: 'Kling V2.1',
    description: 'High-quality 5s/10s video generation — text-to-video and image-to-video',
    department: ['cinematography', 'direction'],
    capabilities: ['text-to-video', 'image-to-video'],
    averageTime: 120,
    pricePerRun: '$0.14',
  },

  // ── VIDEO: Google Veo ───────────────────────────────────────────────────
  'veo-3': {
    id: 'google/veo-3',
    name: 'Google Veo 3',
    description: 'Google's flagship video model — cinematic 1080p with synchronized audio',
    department: ['cinematography', 'direction'],
    capabilities: ['text-to-video', 'audio-generation'],
    averageTime: 180,
    pricePerRun: '$0.75',
  },

  // ── VIDEO: ByteDance Seedance ───────────────────────────────────────────
  'seedance-1-pro': {
    id: 'bytedance/seedance-1-pro',
    name: 'Seedance 1 Pro',
    description: 'ByteDance pro video model — strong motion quality and adherence',
    department: ['cinematography', 'direction'],
    capabilities: ['text-to-video', 'image-to-video'],
    averageTime: 150,
    pricePerRun: '$0.50',
  },
  'seedance-1-lite': {
    id: 'bytedance/seedance-1-lite',
    name: 'Seedance 1 Lite',
    description: 'Faster, lower-cost ByteDance video generation',
    department: ['cinematography', 'direction'],
    capabilities: ['text-to-video', 'image-to-video'],
    averageTime: 90,
    pricePerRun: '$0.20',
  },

  // ── VIDEO: MiniMax ──────────────────────────────────────────────────────
  'minimax-video-01': {
    id: 'minimax/video-01',
    name: 'MiniMax Video-01',
    description: 'Strong image-to-video with first-frame anchoring',
    department: ['cinematography', 'direction'],
    capabilities: ['text-to-video', 'image-to-video'],
    averageTime: 100,
    pricePerRun: '$0.30',
  },
};

// ============================================================================
// DEPARTMENT MODEL MAPPING
// ============================================================================

export const DEPARTMENT_MODELS: Record<FilmDepartment, string[]> = {
  writing:          [],
  direction:        ['flux-1.1-pro', 'flux-1.1-pro-ultra', 'imagen-4-ultra', 'kling-v2.1', 'veo-3'],
  cinematography:   ['kling-v2.1', 'veo-3', 'seedance-1-pro', 'seedance-1-lite', 'minimax-video-01'],
  audio:            [],
  editing:          ['flux-fill-pro', 'flux-kontext-pro', 'flux-kontext-max', 'flux-depth-pro'],
  production_design:['flux-schnell', 'flux-dev', 'flux-pro', 'flux-1.1-pro', 'flux-1.1-pro-ultra',
                     'flux-kontext-pro', 'flux-kontext-max', 'ideogram-v3-turbo', 'recraft-v3', 'imagen-4-ultra'],
  production:       [],
};

// ============================================================================
// REPLICATE TOOL CLASS
// ============================================================================

export class ReplicateTool {
  id = 'replicate';
  name = 'Replicate AI Gateway';
  description = 'Unified access to Flux, Kling, Veo, Seedance, Ideogram and more';

  private config: ReplicateConfig;
  private baseUrl: string;

  constructor(config: ReplicateConfig) {
    this.config = config;
    this.baseUrl = config.baseUrl || 'https://api.replicate.com/v1';
  }

  // -------------------------------------------------------------------------
  // Core API
  // -------------------------------------------------------------------------

  private async request(endpoint: string, options: RequestInit = {}): Promise<any> {
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      ...options,
      headers: {
        'Authorization': `Bearer ${this.config.apiKey}`,
        'Content-Type': 'application/json',
        'Prefer': 'wait',  // ask Replicate to return synchronously when possible
        ...options.headers,
      },
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(`Replicate API error: ${response.status} — ${(error as any).detail || response.statusText}`);
    }

    return response.json();
  }

  /**
   * Create a prediction for an official model (no version needed).
   * POST /v1/models/{owner}/{name}/predictions
   */
  private async createPrediction(input: PredictionInput): Promise<PredictionOutput> {
    const [owner, name] = input.model.split('/');
    return this.request(`/models/${owner}/${name}/predictions`, {
      method: 'POST',
      body: JSON.stringify({
        input: input.input,
        webhook: input.webhook || this.config.webhookUrl,
      }),
    });
  }

  private async getPrediction(id: string): Promise<PredictionOutput> {
    return this.request(`/predictions/${id}`);
  }

  private async waitForPrediction(
    id: string,
    timeout = this.config.defaultTimeout ?? 300000,
  ): Promise<PredictionOutput> {
    const start = Date.now();
    while (Date.now() - start < timeout) {
      const prediction = await this.getPrediction(id);
      if (prediction.status === 'succeeded' || prediction.status === 'failed' || prediction.status === 'canceled') {
        return prediction;
      }
      await new Promise(r => setTimeout(r, 2500));
    }
    throw new Error(`Prediction ${id} timed out after ${timeout}ms`);
  }

  // -------------------------------------------------------------------------
  // Image Generation
  // -------------------------------------------------------------------------

  /**
   * Generate an image using any Flux variant, Ideogram, Recraft or Imagen.
   * Prompt is auto-converted from natural language to structured JSON format.
   */
  async generateImage(options: {
    prompt: string;
    model?: keyof typeof FILM_MODELS;
    aspectRatio?: '1:1' | '16:9' | '9:16' | '4:3' | '3:4' | '21:9';
    width?: number;
    height?: number;
    numOutputs?: number;
    outputFormat?: 'webp' | 'jpg' | 'png';
    outputQuality?: number;         // 1–100
    guidance?: number;              // flux-dev: 0–10, default 3.5
    numInferenceSteps?: number;     // flux-dev: 1–50
    safetyTolerance?: number;       // flux-pro: 1–6
    promptUpsampling?: boolean;     // flux-pro: enhance prompt
    raw?: boolean;                  // flux-ultra: less processed output
    // Editing variants
    inputImage?: string;            // URL — for kontext/fill/depth
    mask?: string;                  // URL — for fill (inpainting)
    useStructuredPrompt?: boolean;  // default: true
  }): Promise<ToolResult> {
    const modelKey = options.model || 'flux-1.1-pro';
    const modelConfig = FILM_MODELS[modelKey];
    if (!modelConfig) {
      return { success: false, error: `Unknown model: ${modelKey}` };
    }

    const useStructured = options.useStructuredPrompt !== false;
    const finalPrompt = useStructured
      ? promptConverter.optimize(options.prompt, modelKey as SupportedModel)
      : options.prompt;

    const input: Record<string, any> = { prompt: finalPrompt };

    // Common params
    if (options.aspectRatio)        input.aspect_ratio       = options.aspectRatio;
    if (options.width)              input.width              = options.width;
    if (options.height)             input.height             = options.height;
    if (options.numOutputs)         input.num_outputs        = options.numOutputs;
    if (options.outputFormat)       input.output_format      = options.outputFormat;
    if (options.outputQuality)      input.output_quality     = options.outputQuality;

    // Model-specific params
    if (options.guidance !== undefined)         input.guidance            = options.guidance;
    if (options.numInferenceSteps !== undefined) input.num_inference_steps = options.numInferenceSteps;
    if (options.safetyTolerance !== undefined)  input.safety_tolerance    = options.safetyTolerance;
    if (options.promptUpsampling !== undefined) input.prompt_upsampling   = options.promptUpsampling;
    if (options.raw !== undefined)              input.raw                 = options.raw;

    // Editing variants
    if (options.inputImage) input.image = options.inputImage;
    if (options.mask)       input.mask  = options.mask;

    try {
      const prediction = await this.createPrediction({ model: modelConfig.id, input });
      const result = prediction.status === 'succeeded'
        ? prediction
        : await this.waitForPrediction(prediction.id);

      return {
        success: result.status === 'succeeded',
        output: result.output,
        error: result.error,
        metadata: {
          model: modelConfig.name,
          replicateId: result.id,
          processingTime: result.metrics?.predict_time,
        },
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Image generation failed',
      };
    }
  }

  // -------------------------------------------------------------------------
  // Video Generation
  // -------------------------------------------------------------------------

  /**
   * Generate video using Kling, Veo 3, Seedance, or MiniMax.
   * Prompt is auto-converted from natural language to structured JSON format.
   */
  async generateVideo(options: {
    prompt: string;
    model?: 'kling-v2.1' | 'veo-3' | 'seedance-1-pro' | 'seedance-1-lite' | 'minimax-video-01';
    image?: string;           // URL — for image-to-video
    duration?: 5 | 10;        // seconds (Kling)
    aspectRatio?: '16:9' | '9:16' | '1:1';
    // Kling-specific
    mode?: 'std' | 'pro';
    negativePrompt?: string;
    cfgScale?: number;        // 0–1, default 0.5
    // Seedance / MiniMax
    resolution?: '720p' | '1080p';
    useStructuredPrompt?: boolean; // default: true
  }): Promise<ToolResult> {
    const modelKey = options.model || 'kling-v2.1';
    const modelConfig = FILM_MODELS[modelKey];
    if (!modelConfig) {
      return { success: false, error: `Unknown model: ${modelKey}` };
    }

    const useStructured = options.useStructuredPrompt !== false;
    const finalPrompt = useStructured
      ? promptConverter.optimize(options.prompt, modelKey as SupportedModel)
      : options.prompt;

    const input: Record<string, any> = { prompt: finalPrompt };

    if (options.image)           input.image          = options.image;
    if (options.duration)        input.duration       = options.duration;
    if (options.aspectRatio)     input.aspect_ratio   = options.aspectRatio;
    if (options.negativePrompt)  input.negative_prompt = options.negativePrompt;
    if (options.cfgScale !== undefined) input.cfg_scale = options.cfgScale;
    if (options.mode)            input.mode           = options.mode;
    if (options.resolution)      input.resolution     = options.resolution;

    // MiniMax uses first_frame_image instead of image
    if (modelKey === 'minimax-video-01' && options.image) {
      delete input.image;
      input.first_frame_image = options.image;
    }

    try {
      const prediction = await this.createPrediction({ model: modelConfig.id, input });
      const result = prediction.status === 'succeeded'
        ? prediction
        : await this.waitForPrediction(prediction.id);

      return {
        success: result.status === 'succeeded',
        output: result.output,
        error: result.error,
        metadata: {
          model: modelConfig.name,
          replicateId: result.id,
          processingTime: result.metrics?.predict_time,
        },
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Video generation failed',
      };
    }
  }

  // -------------------------------------------------------------------------
  // Run any arbitrary Replicate model
  // -------------------------------------------------------------------------

  /**
   * Run any Replicate model by its "owner/name" ID with a raw input object.
   * Use this for models not covered by the typed methods above.
   */
  async run(modelId: string, input: Record<string, any>): Promise<ToolResult> {
    try {
      const prediction = await this.createPrediction({ model: modelId, input });
      const result = prediction.status === 'succeeded'
        ? prediction
        : await this.waitForPrediction(prediction.id);

      return {
        success: result.status === 'succeeded',
        output: result.output,
        error: result.error,
        metadata: { replicateId: result.id, processingTime: result.metrics?.predict_time },
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : `Failed to run ${modelId}`,
      };
    }
  }

  // -------------------------------------------------------------------------
  // Helpers
  // -------------------------------------------------------------------------

  getModelsForDepartment(department: FilmDepartment): ModelConfig[] {
    const keys = DEPARTMENT_MODELS[department] || [];
    return keys.map(k => FILM_MODELS[k]).filter(Boolean);
  }

  getAllModels(): ModelConfig[] {
    return Object.values(FILM_MODELS);
  }
}

// ============================================================================
// FACTORY
// ============================================================================

export function createReplicateTool(apiKey: string, baseUrl?: string): ReplicateTool {
  return new ReplicateTool({ apiKey, baseUrl });
}

export default ReplicateTool;
