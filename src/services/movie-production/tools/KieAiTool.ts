// KieAiTool.ts
// Kie.ai API Integration for Nova Studio Film Production
// Unified access to AI models with credit-based pricing

import { MovieTool, ToolResult, FilmDepartment } from '../types';
import { promptConverter, type SupportedModel } from './PromptConverter';

// ============================================================================
// TYPES
// ============================================================================

export interface KieAiConfig {
  apiKey: string;
  baseUrl?: string;
  webhookUrl?: string;
  defaultTimeout?: number;
}

export interface ModelConfig {
  id: string;
  name: string;
  description: string;
  department: FilmDepartment[];
  capabilities: string[];
  creditsPerRun?: number;
  averageTime?: number; // seconds
}

export interface GenerationInput {
  model: string;
  input: Record<string, any>;
  webhook?: string;
}

export interface GenerationOutput {
  id: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  output?: any;
  error?: string;
  creditsUsed?: number;
  processingTime?: number;
  urls?: {
    result?: string;
    status?: string;
  };
}

// ============================================================================
// MODEL REGISTRY - Kie.ai supported models
// ============================================================================

export const KIE_AI_MODELS: Record<string, ModelConfig> = {
  // === VIDEO GENERATION ===
  'veo-3.1': {
    id: 'veo-3.1',
    name: 'Google Veo 3.1',
    description: 'Cinematic motion with synchronized audio output in native 1080p',
    department: ['cinematography', 'direction'],
    capabilities: ['text-to-video', 'image-to-video', 'audio-generation'],
    averageTime: 120,
  },
  'veo-3.1-fast': {
    id: 'veo-3.1-fast',
    name: 'Google Veo 3.1 Fast',
    description: 'Faster, lower-cost rendering with Veo 3.1 quality',
    department: ['cinematography', 'direction'],
    capabilities: ['text-to-video', 'image-to-video'],
    averageTime: 60,
  },
  'runway-aleph': {
    id: 'runway-aleph',
    name: 'Runway Aleph',
    description: 'Advanced scene reasoning with precise camera control and multi-task editing',
    department: ['cinematography', 'editing'],
    capabilities: ['text-to-video', 'video-editing', 'scene-modification'],
    averageTime: 90,
  },

  // === IMAGE GENERATION ===
  '4o-image': {
    id: '4o-image',
    name: '4o Image API',
    description: 'OpenAI GPT-4o image model for high-fidelity visuals with accurate text rendering',
    department: ['production_design', 'direction'],
    capabilities: ['text-to-image', 'high-resolution', 'text-rendering'],
    averageTime: 15,
  },
  'flux-kontext': {
    id: 'flux-kontext',
    name: 'Flux.1 Kontext',
    description: 'Black Forest Labs image model for vivid, coherent scenes with strong subject consistency',
    department: ['production_design', 'direction'],
    capabilities: ['text-to-image', 'character-consistency', 'scene-generation'],
    averageTime: 18,
  },
  // Nano Banana = Kie.ai branding for Google Gemini image models
  'nano-banana': {
    id: 'nano-banana',
    name: 'Nano Banana (Gemini 2.5 Flash)',
    description: 'Gemini 2.5 Flash Image — fast generation, image editing, up to 4K. Endpoint: /generate',
    department: ['production_design'],
    capabilities: ['text-to-image', 'image-editing', 'image-to-image'],
    averageTime: 12,
  },
  'nano-banana-2': {
    id: 'nano-banana-2',
    name: 'Nano Banana 2 (Gemini 3.1 Flash)',
    description: 'Gemini 3.1 Flash Image — 4K output, stronger reasoning, better character consistency. Endpoint: /generate',
    department: ['production_design', 'direction'],
    capabilities: ['text-to-image', 'image-editing', 'image-to-image', '4k'],
    averageTime: 15,
  },
  'nano-banana-pro': {
    id: 'nano-banana-pro',
    name: 'Nano Banana Pro (Gemini 3 Pro)',
    description: 'Gemini 3 Pro Image — maximum fidelity, advanced control, deep reasoning. Endpoint: /api/v1/jobs/createTask',
    department: ['production_design', 'direction'],
    capabilities: ['text-to-image', 'image-editing', 'image-to-image', '4k', 'advanced-control'],
    averageTime: 25,
  },

  // === MUSIC GENERATION ===
  'suno-v3.5': {
    id: 'suno-v3.5',
    name: 'Suno V3.5',
    description: 'High-quality music generation with rich sound',
    department: ['audio'],
    capabilities: ['music-generation', 'soundtrack'],
    averageTime: 30,
  },
  'suno-v4': {
    id: 'suno-v4',
    name: 'Suno V4',
    description: 'Enhanced vocals and better song structure',
    department: ['audio'],
    capabilities: ['music-generation', 'vocals', 'soundtrack'],
    averageTime: 35,
  },
  'suno-v4.5': {
    id: 'suno-v4.5',
    name: 'Suno V4.5',
    description: 'Advanced music generation with smart prompts',
    department: ['audio'],
    capabilities: ['music-generation', 'vocals', 'smart-prompts'],
    averageTime: 40,
  },
  'suno-v4.5-plus': {
    id: 'suno-v4.5-plus',
    name: 'Suno V4.5 Plus',
    description: 'Premium music generation up to 8 minutes long',
    department: ['audio'],
    capabilities: ['music-generation', 'long-form', 'vocals'],
    averageTime: 50,
  },

  // === LLM & CHAT ===
  'gpt-4o': {
    id: 'gpt-4o',
    name: 'GPT-4o',
    description: 'Advanced LLM for natural conversations and knowledge responses',
    department: ['writing', 'direction', 'production'],
    capabilities: ['text-generation', 'reasoning', 'multimodal'],
    averageTime: 5,
  },
  'claude-3-opus': {
    id: 'claude-3-opus',
    name: 'Claude 3 Opus',
    description: 'High-quality text generation for dialogue and creative writing',
    department: ['writing'],
    capabilities: ['text-generation', 'creative-writing'],
    averageTime: 6,
  },
  'gemini-pro': {
    id: 'gemini-pro',
    name: 'Gemini Pro',
    description: 'Multimodal AI for script analysis and scene breakdown',
    department: ['writing', 'direction'],
    capabilities: ['text-generation', 'vision', 'reasoning'],
    averageTime: 4,
  },
};

// ============================================================================
// DEPARTMENT MODEL MAPPING
// ============================================================================

export const KIE_DEPARTMENT_MODELS: Record<FilmDepartment, string[]> = {
  writing: ['gpt-4o', 'claude-3-opus', 'gemini-pro'],
  direction: ['veo-3.1', 'veo-3.1-fast', 'runway-aleph', '4o-image', 'flux-kontext'],
  cinematography: ['veo-3.1', 'veo-3.1-fast', 'runway-aleph'],
  audio: ['suno-v3.5', 'suno-v4', 'suno-v4.5', 'suno-v4.5-plus'],
  editing: ['runway-aleph'],
  production_design: ['4o-image', 'flux-kontext', 'nano-banana', 'nano-banana-2', 'nano-banana-pro'],
  production: ['gpt-4o', 'gemini-pro'],
};

// ============================================================================
// KIE.AI TOOL CLASS
// ============================================================================

export class KieAiTool implements MovieTool {
  id = 'kie-ai';
  name = 'Kie.ai API Gateway';
  description = 'Affordable access to top AI models with credit-based pricing';
  category = 'ai-gateway' as const;
  departments: FilmDepartment[] = [
    'writing', 'direction', 'cinematography', 'audio', 'editing', 'production_design', 'production'
  ];

  private config: KieAiConfig;
  private baseUrl: string;

  constructor(config: KieAiConfig) {
    this.config = config;
    this.baseUrl = config.baseUrl || 'https://api.kie.ai/v1';
  }

  // -------------------------------------------------------------------------
  // Core API Methods
  // -------------------------------------------------------------------------

  private async request(endpoint: string, options: RequestInit = {}): Promise<any> {
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      ...options,
      headers: {
        'Authorization': `Bearer ${this.config.apiKey}`,
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(`Kie.ai API error: ${response.status} - ${error.message || response.statusText}`);
    }

    return response.json();
  }

  async createGeneration(input: GenerationInput): Promise<GenerationOutput> {
    return this.request(`/generate`, {
      method: 'POST',
      body: JSON.stringify({
        model: input.model,
        input: input.input,
        webhook: input.webhook || this.config.webhookUrl,
      }),
    });
  }

  async getGeneration(id: string): Promise<GenerationOutput> {
    return this.request(`/generation/${id}`);
  }

  async waitForGeneration(id: string, timeout = 300000): Promise<GenerationOutput> {
    const startTime = Date.now();
    
    while (Date.now() - startTime < timeout) {
      const generation = await this.getGeneration(id);
      
      if (generation.status === 'completed' || generation.status === 'failed') {
        return generation;
      }
      
      // Poll every 2 seconds
      await new Promise(resolve => setTimeout(resolve, 2000));
    }
    
    throw new Error(`Generation ${id} timed out after ${timeout}ms`);
  }

  // -------------------------------------------------------------------------
  // High-Level Department Methods
  // -------------------------------------------------------------------------

  /**
   * Generate video from text or image using Veo or Runway.
   * Prompts are automatically converted from natural language to structured
   * JSON format for better model consistency and quality.
   */
  async generateVideo(options: {
    prompt: string;
    image?: string; // Base64 or URL
    duration?: number;
    aspectRatio?: '16:9' | '9:16' | '1:1';
    model?: 'veo-3.1' | 'veo-3.1-fast' | 'runway-aleph';
    withAudio?: boolean;
    fps?: number;
    useStructuredPrompt?: boolean; // default: true
  }): Promise<ToolResult> {
    const modelKey = options.model || 'veo-3.1';
    const modelConfig = KIE_AI_MODELS[modelKey];

    const useStructured = options.useStructuredPrompt !== false;
    const finalPrompt = useStructured
      ? promptConverter.optimize(options.prompt, modelKey as SupportedModel)
      : options.prompt;

    const input: Record<string, any> = {
      prompt: finalPrompt,
    };

    // Model-specific input mapping
    if (options.image) {
      input.image = options.image;
    }
    if (options.duration) {
      input.duration = options.duration;
    }
    if (options.aspectRatio) {
      input.aspectRatio = options.aspectRatio;
    }
    if (options.withAudio !== undefined) {
      input.withAudio = options.withAudio;
    }
    if (options.fps) {
      input.fps = options.fps;
    }

    try {
      const generation = await this.createGeneration({
        model: modelKey,
        input,
      });

      const result = await this.waitForGeneration(generation.id);

      return {
        success: result.status === 'completed',
        output: result.output,
        metadata: {
          model: modelConfig.name,
          generationId: result.id,
          creditsUsed: result.creditsUsed,
          processingTime: result.processingTime,
        },
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Video generation failed',
      };
    }
  }

  /**
   * Generate image from text using 4o, Flux, or Nano Banana.
   * Prompts are automatically converted from natural language to structured
   * JSON format for better model consistency and quality.
   */
  async generateImage(options: {
    prompt: string;
    negativePrompt?: string;
    width?: number;
    height?: number;
    model?: '4o-image' | 'flux-kontext' | 'nano-banana' | 'nano-banana-2' | 'nano-banana-pro';
    numOutputs?: number;
    style?: string;
    // Nano Banana specific
    aspectRatio?: '1:1' | '9:16' | '16:9' | '3:4' | '4:3' | '4:1' | '1:4';
    resolution?: '1K' | '2K' | '4K';
    imageInputs?: string[]; // image URLs for image-to-image (up to 10)
    useStructuredPrompt?: boolean; // default: true
  }): Promise<ToolResult> {
    const modelKey = options.model || '4o-image';
    const modelConfig = KIE_AI_MODELS[modelKey];

    // Nano Banana Pro uses a different endpoint and input schema
    if (modelKey === 'nano-banana-pro') {
      return this.generateImageNanoBananaPro(options);
    }

    const useStructured = options.useStructuredPrompt !== false;
    const conversion = useStructured
      ? promptConverter.convert(options.prompt, modelKey as SupportedModel)
      : null;

    const finalPrompt = conversion ? conversion.optimizedPrompt : options.prompt;
    // Use converter's negative prompt unless the caller provided their own
    const finalNegativePrompt = options.negativePrompt
      || (conversion ? (conversion.structuredData as any).negative_prompt : undefined);

    const input: Record<string, any> = {
      prompt: finalPrompt,
    };

    if (finalNegativePrompt) {
      input.negativePrompt = finalNegativePrompt;
    }
    if (options.width) {
      input.width = options.width;
    }
    if (options.height) {
      input.height = options.height;
    }
    if (options.numOutputs) {
      input.numOutputs = options.numOutputs;
    }
    if (options.style) {
      input.style = options.style;
    }

    try {
      const generation = await this.createGeneration({
        model: modelKey,
        input,
      });

      const result = await this.waitForGeneration(generation.id);

      return {
        success: result.status === 'completed',
        output: result.output,
        metadata: {
          model: modelConfig.name,
          generationId: result.id,
          creditsUsed: result.creditsUsed,
        },
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Image generation failed',
      };
    }
  }

  /**
   * Nano Banana Pro — uses /api/v1/jobs/createTask (different from /generate).
   * Gemini 3 Pro Image: max fidelity, up to 4K, supports up to 10 image inputs.
   */
  private async generateImageNanoBananaPro(options: Parameters<typeof this.generateImage>[0]): Promise<ToolResult> {
    const modelConfig = KIE_AI_MODELS['nano-banana-pro'];

    const useStructured = options.useStructuredPrompt !== false;
    const finalPrompt = useStructured
      ? promptConverter.optimize(options.prompt, 'nano-banana-pro' as SupportedModel)
      : options.prompt;

    const body = {
      model: 'nano-banana-pro',
      callBackUrl: this.config.webhookUrl,
      input: {
        prompt: finalPrompt,
        image_input: options.imageInputs || [],
        aspect_ratio: options.aspectRatio || '1:1',
        resolution: options.resolution || '1K',
        output_format: 'png',
      },
    };

    try {
      const response = await fetch(`${this.baseUrl}/api/v1/jobs/createTask`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.config.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        const error = await response.json().catch(() => ({}));
        throw new Error(`Nano Banana Pro error: ${response.status} - ${(error as any).message || response.statusText}`);
      }

      const generation = await response.json();
      const result = await this.waitForGeneration(generation.id);

      return {
        success: result.status === 'completed',
        output: result.output,
        metadata: {
          model: modelConfig.name,
          generationId: result.id,
          creditsUsed: result.creditsUsed,
        },
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Nano Banana Pro generation failed',
      };
    }
  }

  /**
   * Generate music using Suno API.
   * Prompts are automatically converted from natural language to structured
   * JSON format for better model consistency and quality.
   */
  async generateMusic(options: {
    prompt: string;
    duration?: number;
    model?: 'suno-v3.5' | 'suno-v4' | 'suno-v4.5' | 'suno-v4.5-plus';
    style?: string;
    title?: string;
    makeInstrumental?: boolean;
    customLyrics?: string;
    useStructuredPrompt?: boolean; // default: true
  }): Promise<ToolResult> {
    const modelKey = options.model || 'suno-v4';
    const modelConfig = KIE_AI_MODELS[modelKey];

    const useStructured = options.useStructuredPrompt !== false;
    const finalPrompt = useStructured
      ? promptConverter.optimize(options.prompt, modelKey as SupportedModel)
      : options.prompt;

    const input: Record<string, any> = {
      prompt: finalPrompt,
    };

    if (options.duration) {
      input.duration = options.duration;
    }
    if (options.style) {
      input.style = options.style;
    }
    if (options.title) {
      input.title = options.title;
    }
    if (options.makeInstrumental !== undefined) {
      input.makeInstrumental = options.makeInstrumental;
    }
    if (options.customLyrics) {
      input.customLyrics = options.customLyrics;
    }

    try {
      const generation = await this.createGeneration({
        model: modelKey,
        input,
      });

      const result = await this.waitForGeneration(generation.id);

      return {
        success: result.status === 'completed',
        output: result.output,
        metadata: {
          model: modelConfig.name,
          generationId: result.id,
          creditsUsed: result.creditsUsed,
        },
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Music generation failed',
      };
    }
  }

  /**
   * Generate or edit text using LLM
   */
  async generateText(options: {
    prompt: string;
    systemPrompt?: string;
    images?: string[]; // For multimodal (Gemini, GPT-4o)
    model?: 'gpt-4o' | 'claude-3-opus' | 'gemini-pro';
    maxTokens?: number;
    temperature?: number;
  }): Promise<ToolResult> {
    const modelKey = options.model || 'gpt-4o';
    const modelConfig = KIE_AI_MODELS[modelKey];

    const input: Record<string, any> = {
      prompt: options.prompt,
    };

    if (options.systemPrompt) {
      input.systemPrompt = options.systemPrompt;
    }
    if (options.images && options.images.length > 0) {
      input.images = options.images;
    }
    if (options.maxTokens) {
      input.maxTokens = options.maxTokens;
    }
    if (options.temperature !== undefined) {
      input.temperature = options.temperature;
    }

    try {
      const generation = await this.createGeneration({
        model: modelKey,
        input,
      });

      const result = await this.waitForGeneration(generation.id);

      return {
        success: result.status === 'completed',
        output: result.output,
        metadata: {
          model: modelConfig.name,
          generationId: result.id,
          creditsUsed: result.creditsUsed,
        },
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Text generation failed',
      };
    }
  }

  /**
   * Video editing with Runway Aleph
   */
  async editVideo(options: {
    video: string;
    prompt: string;
    operation?: 'add-object' | 'remove-object' | 'change-style' | 'change-angle' | 'relight';
  }): Promise<ToolResult> {
    const modelConfig = KIE_AI_MODELS['runway-aleph'];

    const input: Record<string, any> = {
      video: options.video,
      prompt: options.prompt,
    };

    if (options.operation) {
      input.operation = options.operation;
    }

    try {
      const generation = await this.createGeneration({
        model: 'runway-aleph',
        input,
      });

      const result = await this.waitForGeneration(generation.id);

      return {
        success: result.status === 'completed',
        output: result.output,
        metadata: {
          model: modelConfig.name,
          generationId: result.id,
          creditsUsed: result.creditsUsed,
        },
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Video editing failed',
      };
    }
  }

  // -------------------------------------------------------------------------
  // MovieTool Interface
  // -------------------------------------------------------------------------

  async execute(params: Record<string, any>): Promise<ToolResult> {
    const { action, ...rest } = params;

    switch (action as string) {
      case 'generateVideo':
        return this.generateVideo(rest as Parameters<typeof this.generateVideo>[0]);
      case 'generateImage':
        return this.generateImage(rest as Parameters<typeof this.generateImage>[0]);
      case 'generateMusic':
        return this.generateMusic(rest as Parameters<typeof this.generateMusic>[0]);
      case 'generateText':
        return this.generateText(rest as Parameters<typeof this.generateText>[0]);
      case 'editVideo':
        return this.editVideo(rest as Parameters<typeof this.editVideo>[0]);
      default:
        return {
          success: false,
          error: `Unknown action: ${action}`,
        };
    }
  }

  /**
   * Get available models for a department
   */
  getModelsForDepartment(department: FilmDepartment): ModelConfig[] {
    const modelKeys = KIE_DEPARTMENT_MODELS[department] || [];
    return modelKeys.map(key => KIE_AI_MODELS[key]).filter(Boolean);
  }

  /**
   * Get all available models
   */
  getAllModels(): ModelConfig[] {
    return Object.values(KIE_AI_MODELS);
  }

  /**
   * Get account balance/credits
   */
  async getBalance(): Promise<{ credits: number; used: number }> {
    try {
      const response = await this.request('/balance');
      return response;
    } catch (error) {
      throw new Error(error instanceof Error ? error.message : 'Failed to get balance');
    }
  }
}

// ============================================================================
// FACTORY
// ============================================================================

export function createKieAiTool(apiKey: string, baseUrl?: string): KieAiTool {
  return new KieAiTool({ apiKey, baseUrl });
}

export default KieAiTool;
