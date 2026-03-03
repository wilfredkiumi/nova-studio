// PromptConverter.ts
// Converts natural language prompts to structured JSON format for better AI model results.
// Runs transparently in the background before sending to image/video/music models.
//
// Research basis: Image models like Flux, Nano Banana, Kling, and video models like Veo/Runway
// interpret structured prompts (explicit subject, lighting, camera, style fields) with
// significantly higher consistency than freeform natural language.

// ============================================================================
// TYPES
// ============================================================================

// Kie.ai image models
export type KieImageModel = '4o-image' | 'flux-kontext' | 'nano-banana' | 'nano-banana-2' | 'nano-banana-pro' | 'kling-image' | 'midjourney';
// Kie.ai video models
export type KieVideoModel = 'veo-3.1' | 'veo-3.1-fast' | 'runway-aleph' | 'kling-video';
// Kie.ai music models
export type MusicModel = 'suno-v3.5' | 'suno-v4' | 'suno-v4.5' | 'suno-v4.5-plus';

// Replicate image models
export type ReplicateImageModel =
  | 'flux-dev'
  | 'flux-schnell'
  | 'flux-pro'
  | 'flux-1.1-pro'
  | 'sdxl'
  | 'stable-diffusion-3'
  | 'ideogram-v2';

// Replicate video models
export type ReplicateVideoModel =
  | 'kling-v1'
  | 'kling-v1.5'
  | 'kling-v2'
  | 'stable-video-diffusion'
  | 'cogvideo';

// Higgsfield VFX models (post-production effects)
export type HiggsfieldModel =
  | 'higgsfield-vfx'
  | 'higgsfield-fire'
  | 'higgsfield-explosion'
  | 'higgsfield-smoke'
  | 'higgsfield-weather'
  | 'higgsfield-crowd';

export type ImageModel = KieImageModel | ReplicateImageModel;
export type VideoModel = KieVideoModel | ReplicateVideoModel;
export type SupportedModel = ImageModel | VideoModel | MusicModel | HiggsfieldModel;

export interface ImagePromptSchema {
  subject: string;
  action?: string;
  environment?: string;
  lighting?: string;
  camera?: string;
  style?: string;
  mood?: string;
  color_palette?: string;
  quality_tags: string[];
  negative_prompt: string;
}

export interface VideoPromptSchema {
  subject: string;
  action?: string;
  environment?: string;
  camera_movement?: string;
  lighting?: string;
  style?: string;
  mood?: string;
  pacing?: string;
  quality_tags: string[];
}

export interface MusicPromptSchema {
  genre?: string;
  mood?: string;
  tempo?: string;
  instruments?: string[];
  energy?: string;
  theme?: string;
  era?: string;
  quality_tags: string[];
}

// Higgsfield VFX effects prompt schema
export interface VFXPromptSchema {
  effect_type: string;       // fire, explosion, smoke, rain, snow, crowd, etc.
  intensity?: string;        // subtle, moderate, intense, massive
  scale?: string;            // small, medium, large, epic
  integration?: string;      // foreground, background, full-scene
  color_grading?: string;
  physics?: string;          // realistic, stylized, cinematic
  quality_tags: string[];
}

export interface ConversionResult {
  originalPrompt: string;
  structuredData: ImagePromptSchema | VideoPromptSchema | MusicPromptSchema | VFXPromptSchema;
  optimizedPrompt: string;
  model: SupportedModel;
  autoAdded: string[]; // quality tags injected automatically
}

// ============================================================================
// KEYWORD MAPS — used to parse natural language fields
// ============================================================================

const LIGHTING_KEYWORDS: Record<string, string> = {
  'golden hour': 'golden hour lighting, warm sunlight, long shadows',
  'blue hour': 'blue hour, twilight lighting, cool tones',
  'sunset': 'sunset lighting, warm orange glow',
  'sunrise': 'sunrise lighting, soft warm light',
  'neon': 'neon lighting, cyberpunk glow, colored neon reflections',
  'dramatic': 'dramatic lighting, high contrast, deep shadows',
  'soft': 'soft diffused lighting, gentle shadows',
  'studio': 'professional studio lighting, even illumination',
  'candlelight': 'candlelight, warm flickering light, intimate ambiance',
  'moonlight': 'moonlight, cool silver light, night scene',
  'overcast': 'overcast natural light, diffused, soft shadows',
  'backlit': 'backlit, rim lighting, silhouette effect',
  'low key': 'low key lighting, dark shadows, noir atmosphere',
  'high key': 'high key lighting, bright, minimal shadows',
  'cinematic': 'cinematic lighting, professional film lighting',
  'volumetric': 'volumetric lighting, god rays, atmospheric light',
  'fire': 'firelight, warm orange flickering glow',
  'fluorescent': 'fluorescent lighting, cold harsh light',
};

const CAMERA_KEYWORDS: Record<string, string> = {
  'close-up': 'extreme close-up shot, tight framing',
  'closeup': 'close-up shot, tight framing',
  'close up': 'close-up shot, tight framing',
  'wide shot': 'wide shot, establishing shot, expansive framing',
  'wide angle': 'wide angle lens, expansive view',
  'aerial': 'aerial shot, bird\'s eye view, drone perspective',
  'bird\'s eye': 'bird\'s eye view, overhead shot',
  'eye level': 'eye level shot, neutral perspective',
  'low angle': 'low angle shot, powerful perspective, looking up',
  'high angle': 'high angle shot, looking down',
  'portrait': 'portrait framing, subject centered',
  'medium shot': 'medium shot, waist-up framing',
  'full shot': 'full body shot, head to toe',
  'over the shoulder': 'over the shoulder shot',
  'pov': 'point of view shot, first person perspective',
  'macro': 'macro photography, extreme detail',
  'telephoto': 'telephoto lens, compressed perspective, background blur',
  'fisheye': 'fisheye lens, distorted wide perspective',
};

const STYLE_KEYWORDS: Record<string, string> = {
  'photorealistic': 'photorealistic, hyperrealistic, photo quality',
  'cinematic': 'cinematic, film quality, professional cinematography',
  'film noir': 'film noir, black and white, high contrast, moody shadows',
  'anime': 'anime style, Japanese animation, illustrated',
  'oil painting': 'oil painting, classical art style, painterly',
  'watercolor': 'watercolor painting, soft washes, artistic',
  'sketch': 'pencil sketch, hand-drawn, artistic',
  'digital art': 'digital art, concept art, professional illustration',
  'fantasy': 'fantasy art style, magical, ethereal',
  'sci-fi': 'science fiction, futuristic, technological',
  'vintage': 'vintage aesthetic, retro, aged look',
  'retro': 'retro style, nostalgic, vintage aesthetic',
  'minimalist': 'minimalist, clean, simple composition',
  'surreal': 'surrealism, dreamlike, abstract',
  'documentary': 'documentary style, realistic, natural',
  'commercial': 'commercial photography, product quality, polished',
  'editorial': 'editorial photography, magazine quality',
};

const MOOD_KEYWORDS: Record<string, string> = {
  'dramatic': 'dramatic, intense, powerful',
  'mysterious': 'mysterious, enigmatic, atmospheric',
  'romantic': 'romantic, intimate, warm',
  'melancholic': 'melancholic, somber, introspective',
  'tense': 'tense, suspenseful, thriller atmosphere',
  'peaceful': 'peaceful, serene, tranquil',
  'epic': 'epic scale, grand, magnificent',
  'horror': 'horror atmosphere, unsettling, dark',
  'joyful': 'joyful, vibrant, uplifting',
  'dark': 'dark mood, ominous, brooding',
  'ethereal': 'ethereal, otherworldly, dreamlike',
  'gritty': 'gritty, raw, realistic edge',
  'noir': 'noir atmosphere, shadowy, cynical',
};

const CAMERA_MOVEMENT_KEYWORDS: Record<string, string> = {
  'dolly': 'smooth dolly movement',
  'dolly in': 'dolly push in, moving closer',
  'dolly out': 'dolly pull out, moving away',
  'pan': 'camera pan, horizontal sweep',
  'tilt': 'camera tilt, vertical movement',
  'crane': 'crane shot, sweeping vertical arc',
  'tracking': 'tracking shot, follows subject',
  'handheld': 'handheld camera, natural movement',
  'steadicam': 'steadicam, smooth handheld movement',
  'zoom': 'zoom in, lens movement',
  'static': 'static camera, locked off',
  'orbit': 'orbit shot, camera circles subject',
};

const MUSIC_GENRE_KEYWORDS: string[] = [
  'jazz', 'blues', 'rock', 'pop', 'classical', 'orchestral', 'electronic',
  'ambient', 'hip hop', 'folk', 'country', 'r&b', 'soul', 'metal', 'punk',
  'reggae', 'latin', 'cinematic', 'soundtrack', 'indie', 'synth', 'lo-fi',
];

const MUSIC_TEMPO_KEYWORDS: Record<string, string> = {
  'slow': 'slow tempo, 60-80 BPM',
  'moderate': 'moderate tempo, 90-110 BPM',
  'fast': 'fast tempo, 130-160 BPM',
  'upbeat': 'upbeat, energetic tempo',
  'relaxed': 'relaxed, laid-back tempo',
  'frenetic': 'frenetic, very fast, intense',
};

// ============================================================================
// MODEL-SPECIFIC QUALITY TAGS
// Auto-injected for best results with each model
// ============================================================================

const MODEL_QUALITY_TAGS: Record<SupportedModel, string[]> = {
  // === KIE.AI IMAGE MODELS (Nano Banana = Google Gemini image models) ===
  'nano-banana': [
    // Gemini 2.5 Flash Image
    'physically accurate', 'sharp focus', 'high resolution', 'photorealistic',
    'professional quality', 'detailed textures',
  ],
  'nano-banana-2': [
    // Gemini 3.1 Flash Image — stronger, 4K capable
    'physically accurate', 'sharp focus', '4K resolution', 'photorealistic',
    'professional quality', 'detailed textures', 'character consistency',
  ],
  'nano-banana-pro': [
    // Gemini 3 Pro Image — max fidelity
    'maximum fidelity', 'ultra sharp', '4K', 'photorealistic masterpiece',
    'professional studio quality', 'exceptional detail', 'precise rendering',
  ],
  'flux-kontext': [
    'cinematic composition', 'vivid colors', 'coherent scene', 'professional photography',
    'sharp details', 'high quality render',
  ],
  '4o-image': [
    'high fidelity', 'detailed', 'professional', 'accurate rendering', 'clean composition',
  ],
  'kling-image': [
    'ultra HD', 'cinematic', 'professional photography', 'sharp details', 'film quality',
  ],
  'midjourney': [
    'highly detailed', 'trending on artstation', 'professional', 'masterpiece',
  ],

  // === REPLICATE IMAGE MODELS ===
  'flux-dev': [
    'high quality', 'detailed', 'sharp focus', 'professional', '4K resolution',
  ],
  'flux-schnell': [
    'sharp details', 'clean composition', 'high quality',
  ],
  'flux-pro': [
    'ultra high quality', 'photorealistic', 'sharp details', '8K', 'professional photography',
    'masterpiece quality',
  ],
  'flux-1.1-pro': [
    'ultra high quality', 'photorealistic', 'sharp focus', '8K', 'professional photography',
    'exceptional detail', 'masterpiece',
  ],
  'sdxl': [
    'highly detailed', '8K', 'professional', 'masterpiece', 'best quality',
    'ultra detailed', 'sharp focus',
  ],
  'stable-diffusion-3': [
    'best quality', 'masterpiece', 'ultra detailed', 'sharp focus', 'professional',
    'high resolution',
  ],
  'ideogram-v2': [
    'high quality', 'professional', 'clean design', 'sharp text rendering', 'detailed',
  ],

  // === KIE.AI VIDEO MODELS ===
  'veo-3.1': [
    'cinematic motion', 'smooth movement', '1080p', 'professional cinematography',
    'film quality', 'natural physics',
  ],
  'veo-3.1-fast': [
    'cinematic', 'smooth motion', 'professional quality',
  ],
  'runway-aleph': [
    'precise camera control', 'cinematic composition', 'professional VFX', 'smooth transitions',
  ],
  'kling-video': [
    'ultra HD video', 'cinematic motion', 'smooth camera', 'film quality', 'professional',
  ],

  // === REPLICATE VIDEO MODELS ===
  'kling-v1': [
    'cinematic video', 'smooth motion', 'professional quality', 'coherent movement',
  ],
  'kling-v1.5': [
    'cinematic video', 'smooth motion', 'high quality', 'professional cinematography',
    'natural movement',
  ],
  'kling-v2': [
    'ultra HD video', 'cinematic motion', 'professional quality', 'smooth camera work',
    'film quality', 'natural physics simulation',
  ],
  'stable-video-diffusion': [
    'smooth motion', 'coherent video', 'high quality frames', 'stable movement',
  ],
  'cogvideo': [
    'coherent video', 'smooth motion', 'professional quality',
  ],

  // === HIGGSFIELD VFX MODELS ===
  'higgsfield-vfx': [
    'Hollywood-grade VFX', 'photorealistic effects', 'seamless compositing',
    'professional post-production',
  ],
  'higgsfield-fire': [
    'realistic fire simulation', 'volumetric flames', 'natural ember distribution',
    'physically accurate heat distortion',
  ],
  'higgsfield-explosion': [
    'cinematic explosion', 'realistic shockwave', 'volumetric debris', 'Hollywood-grade blast',
    'physically accurate pressure wave',
  ],
  'higgsfield-smoke': [
    'volumetric smoke simulation', 'physically accurate turbulence', 'realistic smoke dispersion',
    'professional VFX compositing',
  ],
  'higgsfield-weather': [
    'realistic weather simulation', 'natural precipitation', 'atmospheric scattering',
    'physically accurate weather patterns',
  ],
  'higgsfield-crowd': [
    'realistic crowd simulation', 'natural crowd behavior', 'diverse character motion',
    'professional crowd VFX',
  ],

  // === MUSIC MODELS ===
  'suno-v3.5': ['high quality audio', 'professional mix', 'clear production'],
  'suno-v4': ['high quality audio', 'professional mix', 'radio quality'],
  'suno-v4.5': ['high quality audio', 'studio quality', 'professional production'],
  'suno-v4.5-plus': ['studio quality audio', 'professional mastering', 'broadcast ready'],
};

const DEFAULT_NEGATIVE_PROMPT =
  'blurry, low quality, distorted, deformed, ugly, bad anatomy, watermark, text, logo, out of frame, cropped, overexposed, underexposed, noise, grain';

// ============================================================================
// PARSER UTILITIES
// ============================================================================

function matchKeywords<T>(
  text: string,
  keywordMap: Record<string, T>,
  caseSensitive = false,
): T | undefined {
  const normalized = caseSensitive ? text : text.toLowerCase();
  for (const [keyword, value] of Object.entries(keywordMap)) {
    const key = caseSensitive ? keyword : keyword.toLowerCase();
    if (normalized.includes(key)) {
      return value;
    }
  }
  return undefined;
}

function matchAllKeywords(text: string, keywordMap: Record<string, string>): string[] {
  const normalized = text.toLowerCase();
  const matches: string[] = [];
  for (const [keyword, value] of Object.entries(keywordMap)) {
    if (normalized.includes(keyword.toLowerCase())) {
      matches.push(value);
    }
  }
  return matches;
}

function extractSubject(text: string): string {
  // Remove common filler phrases and return the core subject
  const cleaned = text
    .replace(/\b(create|generate|make|draw|render|show|depict|illustrate)\b/gi, '')
    .replace(/\b(a|an|the)\s+photo of\b/gi, '')
    .replace(/\b(a|an|the)\s+image of\b/gi, '')
    .replace(/\b(a|an|the)\s+picture of\b/gi, '')
    .replace(/\b(a|an|the)\s+video of\b/gi, '')
    .trim();

  // Take first meaningful clause (up to first comma or 60 chars)
  const firstClause = cleaned.split(',')[0].trim();
  return firstClause.length > 5 ? firstClause : cleaned.substring(0, 80);
}

function extractEnvironment(text: string): string | undefined {
  const envPatterns = [
    /\bin (a|an|the)\s+([^,\.]+)/i,
    /\bat (a|an|the)\s+([^,\.]+)/i,
    /\bon (a|an|the)\s+([^,\.]+)/i,
    /\bset in\s+([^,\.]+)/i,
    /\b(inside|outside|exterior|interior|indoor|outdoor)\s+([^,\.]+)/i,
    /\b(forest|city|urban|street|alley|desert|ocean|mountain|space|studio|room|building|warehouse|rooftop|beach|field|jungle|cave|castle)\b/i,
  ];

  for (const pattern of envPatterns) {
    const match = text.match(pattern);
    if (match) {
      return match[0].replace(/^(in|at|on|set in)\s+(a|an|the)\s+/i, '').trim();
    }
  }
  return undefined;
}

function extractAction(text: string): string | undefined {
  const actionPatterns = [
    /\b(walking|running|sitting|standing|jumping|flying|fighting|dancing|looking|staring|holding|carrying|wearing|driving|riding)\b/gi,
    /\b(surrounded by|covered in|bathed in|lit by|facing|reaching|pointing|moving|floating|falling)\b/gi,
  ];

  const actions: string[] = [];
  for (const pattern of actionPatterns) {
    const match = text.match(pattern);
    if (match) {
      actions.push(...match);
    }
  }
  return actions.length > 0 ? actions.slice(0, 2).join(', ') : undefined;
}

function extractColorPalette(text: string): string | undefined {
  const colorPatterns = [
    /\b(red|blue|green|yellow|orange|purple|pink|cyan|magenta|gold|silver|black|white|grey|gray|teal|violet|indigo)\b/gi,
    /\b(warm tones|cool tones|monochromatic|earth tones|pastel|vibrant|muted|desaturated|saturated)\b/gi,
    /\b(golden|azure|crimson|emerald|sapphire|amber|ivory|obsidian)\b/gi,
  ];

  const colors: string[] = [];
  for (const pattern of colorPatterns) {
    const match = text.match(pattern);
    if (match) {
      colors.push(...match.map(c => c.toLowerCase()));
    }
  }

  if (colors.length === 0) return undefined;
  const unique = [...new Set(colors)];
  return unique.slice(0, 3).join(', ') + ' color palette';
}

function extractMusicInstruments(text: string): string[] {
  const instruments = [
    'piano', 'guitar', 'violin', 'cello', 'drums', 'bass', 'trumpet', 'saxophone',
    'flute', 'synthesizer', 'synth', 'strings', 'orchestra', 'choir', 'vocals',
    'electric guitar', 'acoustic guitar', 'keyboard', 'harp', 'ukulele', 'banjo',
  ];

  const normalized = text.toLowerCase();
  return instruments.filter(inst => normalized.includes(inst));
}

// ============================================================================
// PROMPT SERIALIZERS — convert structured JSON to optimized prompt strings
// ============================================================================

function serializeImagePrompt(schema: ImagePromptSchema): string {
  const parts: string[] = [];

  parts.push(schema.subject);

  if (schema.action) parts.push(schema.action);
  if (schema.environment) parts.push(schema.environment);
  if (schema.lighting) parts.push(schema.lighting);
  if (schema.camera) parts.push(schema.camera);
  if (schema.style) parts.push(schema.style);
  if (schema.mood) parts.push(schema.mood);
  if (schema.color_palette) parts.push(schema.color_palette);

  // Quality tags always go last for maximum model attention
  if (schema.quality_tags.length > 0) {
    parts.push(schema.quality_tags.join(', '));
  }

  return parts.filter(Boolean).join(', ');
}

function serializeVideoPrompt(schema: VideoPromptSchema): string {
  const parts: string[] = [];

  parts.push(schema.subject);

  if (schema.action) parts.push(schema.action);
  if (schema.environment) parts.push(schema.environment);
  if (schema.camera_movement) parts.push(schema.camera_movement);
  if (schema.lighting) parts.push(schema.lighting);
  if (schema.style) parts.push(schema.style);
  if (schema.mood) parts.push(schema.mood);
  if (schema.pacing) parts.push(schema.pacing);

  if (schema.quality_tags.length > 0) {
    parts.push(schema.quality_tags.join(', '));
  }

  return parts.filter(Boolean).join(', ');
}

function serializeVFXPrompt(schema: VFXPromptSchema): string {
  const parts: string[] = [];

  parts.push(schema.effect_type);

  if (schema.intensity) parts.push(`${schema.intensity} intensity`);
  if (schema.scale) parts.push(`${schema.scale} scale`);
  if (schema.integration) parts.push(`${schema.integration} integration`);
  if (schema.physics) parts.push(`${schema.physics} physics`);
  if (schema.color_grading) parts.push(schema.color_grading);

  if (schema.quality_tags.length > 0) {
    parts.push(schema.quality_tags.join(', '));
  }

  return parts.filter(Boolean).join(', ');
}

function serializeMusicPrompt(schema: MusicPromptSchema): string {
  const parts: string[] = [];

  if (schema.genre) parts.push(schema.genre);
  if (schema.mood) parts.push(schema.mood);
  if (schema.tempo) parts.push(schema.tempo);
  if (schema.energy) parts.push(schema.energy);
  if (schema.era) parts.push(schema.era);
  if (schema.theme) parts.push(schema.theme);
  if (schema.instruments && schema.instruments.length > 0) {
    parts.push(`featuring ${schema.instruments.join(', ')}`);
  }

  if (schema.quality_tags.length > 0) {
    parts.push(schema.quality_tags.join(', '));
  }

  return parts.filter(Boolean).join(', ');
}

// ============================================================================
// MAIN CONVERTER CLASS
// ============================================================================

export class PromptConverter {

  // ---------------------------------------------------------------------------
  // Public API
  // ---------------------------------------------------------------------------

  /**
   * Convert a natural language prompt to an optimized structured prompt
   * for the given model. Runs transparently — input NL, output better prompt.
   */
  convert(naturalLanguage: string, model: SupportedModel): ConversionResult {
    const type = this.getModelType(model);

    if (type === 'image') {
      return this.convertImagePrompt(naturalLanguage, model as ImageModel);
    } else if (type === 'video') {
      return this.convertVideoPrompt(naturalLanguage, model as VideoModel);
    } else if (type === 'vfx') {
      return this.convertVFXPrompt(naturalLanguage, model as HiggsfieldModel);
    } else {
      return this.convertMusicPrompt(naturalLanguage, model as MusicModel);
    }
  }

  /**
   * Just return the optimized prompt string (convenience wrapper)
   */
  optimize(naturalLanguage: string, model: SupportedModel): string {
    return this.convert(naturalLanguage, model).optimizedPrompt;
  }

  // ---------------------------------------------------------------------------
  // Image Prompt Conversion
  // ---------------------------------------------------------------------------

  private convertImagePrompt(text: string, model: ImageModel): ConversionResult {
    const qualityTags = [...MODEL_QUALITY_TAGS[model]];
    const autoAdded: string[] = [];

    const schema: ImagePromptSchema = {
      subject: extractSubject(text),
      action: extractAction(text),
      environment: extractEnvironment(text),
      lighting: matchKeywords(text, LIGHTING_KEYWORDS),
      camera: matchKeywords(text, CAMERA_KEYWORDS),
      style: matchKeywords(text, STYLE_KEYWORDS),
      mood: matchKeywords(text, MOOD_KEYWORDS),
      color_palette: extractColorPalette(text),
      quality_tags: qualityTags,
      negative_prompt: DEFAULT_NEGATIVE_PROMPT,
    };

    // Track auto-added quality tags
    autoAdded.push(...qualityTags);

    // Model-specific adjustments
    if (model === 'flux-kontext' && !schema.style) {
      schema.style = 'professional photography, vivid realism';
      autoAdded.push('vivid realism (auto)');
    }

    if ((model === 'nano-banana' || model === 'nano-banana-2') && !schema.lighting) {
      schema.lighting = 'natural lighting, physically accurate';
      autoAdded.push('physically accurate lighting (auto)');
    }

    if (model === 'nano-banana-pro' && !schema.lighting) {
      schema.lighting = 'professional studio lighting, precise illumination';
      autoAdded.push('professional studio lighting (auto)');
    }

    if (model === '4o-image' && !schema.style) {
      schema.style = 'high fidelity, accurate';
      autoAdded.push('high fidelity style (auto)');
    }

    // Replicate model-specific adjustments
    if ((model === 'sdxl' || model === 'stable-diffusion-3') && !schema.style) {
      schema.style = 'best quality, ultra detailed';
      autoAdded.push('best quality (auto)');
    }

    if ((model === 'flux-pro' || model === 'flux-1.1-pro') && !schema.lighting) {
      schema.lighting = 'professional studio lighting';
      autoAdded.push('professional lighting (auto)');
    }

    if (model === 'ideogram-v2' && !schema.style) {
      schema.style = 'clean design, professional';
      autoAdded.push('clean design (auto)');
    }

    return {
      originalPrompt: text,
      structuredData: schema,
      optimizedPrompt: serializeImagePrompt(schema),
      model,
      autoAdded,
    };
  }

  // ---------------------------------------------------------------------------
  // Video Prompt Conversion
  // ---------------------------------------------------------------------------

  private convertVideoPrompt(text: string, model: VideoModel): ConversionResult {
    const qualityTags = [...MODEL_QUALITY_TAGS[model]];
    const autoAdded: string[] = [];

    const schema: VideoPromptSchema = {
      subject: extractSubject(text),
      action: extractAction(text),
      environment: extractEnvironment(text),
      camera_movement: matchKeywords(text, CAMERA_MOVEMENT_KEYWORDS),
      lighting: matchKeywords(text, LIGHTING_KEYWORDS),
      style: matchKeywords(text, STYLE_KEYWORDS),
      mood: matchKeywords(text, MOOD_KEYWORDS),
      pacing: this.extractVideoPacing(text),
      quality_tags: qualityTags,
    };

    autoAdded.push(...qualityTags);

    // Veo 3.1 benefits from explicit audio direction
    if (model === 'veo-3.1' && !text.toLowerCase().includes('silent')) {
      schema.quality_tags.push('synchronized natural audio');
      autoAdded.push('synchronized audio (auto)');
    }

    // Runway Aleph benefits from scene description over motion description
    if (model === 'runway-aleph' && !schema.camera_movement) {
      schema.camera_movement = 'subtle camera movement';
      autoAdded.push('subtle camera movement (auto)');
    }

    return {
      originalPrompt: text,
      structuredData: schema,
      optimizedPrompt: serializeVideoPrompt(schema),
      model,
      autoAdded,
    };
  }

  // ---------------------------------------------------------------------------
  // VFX Prompt Conversion (Higgsfield)
  // ---------------------------------------------------------------------------

  private convertVFXPrompt(text: string, model: HiggsfieldModel): ConversionResult {
    const qualityTags = [...MODEL_QUALITY_TAGS[model]];
    const autoAdded: string[] = [...qualityTags];

    // Extract effect type from model or text
    const effectFromModel = model.replace('higgsfield-', '');
    const effectType = effectFromModel === 'vfx'
      ? this.extractVFXEffectType(text)
      : effectFromModel;

    // Extract intensity
    const intensityMap: Record<string, string> = {
      subtle: 'subtle', small: 'subtle', minor: 'subtle',
      moderate: 'moderate', medium: 'moderate',
      intense: 'intense', heavy: 'intense', strong: 'intense',
      massive: 'massive', epic: 'massive', huge: 'massive', enormous: 'massive',
    };
    const intensity = matchKeywords(text, intensityMap);

    // Extract scale
    const scaleMap: Record<string, string> = {
      'small scale': 'small', 'contained': 'small',
      'medium scale': 'medium',
      'large scale': 'large', 'wide area': 'large',
      'epic scale': 'epic', 'city-wide': 'epic',
    };
    const scale = matchKeywords(text, scaleMap);

    // Extract integration hint
    const integrationMap: Record<string, string> = {
      foreground: 'foreground', 'in front': 'foreground',
      background: 'background', 'behind': 'background',
      'full scene': 'full-scene', 'everywhere': 'full-scene',
    };
    const integration = matchKeywords(text, integrationMap) || 'seamless compositing';

    // Physics style
    const physicsMap: Record<string, string> = {
      realistic: 'realistic', accurate: 'realistic',
      stylized: 'stylized', 'art style': 'stylized',
      cinematic: 'cinematic', 'movie style': 'cinematic',
    };
    const physics = matchKeywords(text, physicsMap) || 'cinematic';

    const colorGrading = extractColorPalette(text);

    const schema: VFXPromptSchema = {
      effect_type: effectType,
      intensity,
      scale,
      integration,
      physics,
      color_grading: colorGrading,
      quality_tags: qualityTags,
    };

    return {
      originalPrompt: text,
      structuredData: schema,
      optimizedPrompt: serializeVFXPrompt(schema),
      model,
      autoAdded,
    };
  }

  private extractVFXEffectType(text: string): string {
    const effects: Record<string, string> = {
      fire: 'fire simulation', flame: 'fire simulation',
      explosion: 'explosion', blast: 'explosion', detonation: 'explosion',
      smoke: 'smoke simulation', fog: 'fog simulation',
      rain: 'rain simulation', rainfall: 'rain simulation',
      snow: 'snow simulation', snowfall: 'snow simulation',
      crowd: 'crowd simulation', people: 'crowd simulation',
      lightning: 'lightning effect', storm: 'storm VFX',
      water: 'water simulation', flood: 'flood simulation',
      dust: 'dust simulation', debris: 'debris simulation',
    };
    return matchKeywords(text, effects) || 'VFX effect';
  }

  // ---------------------------------------------------------------------------
  // Music Prompt Conversion
  // ---------------------------------------------------------------------------

  private convertMusicPrompt(text: string, model: MusicModel): ConversionResult {
    const qualityTags = [...MODEL_QUALITY_TAGS[model]];
    const autoAdded: string[] = [];

    const normalized = text.toLowerCase();
    const genre = MUSIC_GENRE_KEYWORDS.find(g => normalized.includes(g));
    const tempo = matchKeywords(text, MUSIC_TEMPO_KEYWORDS);
    const instruments = extractMusicInstruments(text);
    const mood = matchKeywords(text, MOOD_KEYWORDS);

    // Extract era hints
    const eraPatterns: Record<string, string> = {
      '1920s': '1920s era',
      '1940s': '1940s era',
      '1960s': '1960s era',
      '1980s': '1980s era',
      '1990s': '1990s era',
      '2000s': '2000s era',
      'retro': 'retro era',
      'vintage': 'vintage sound',
      'modern': 'contemporary',
      'futuristic': 'futuristic electronic',
    };
    const era = matchKeywords(text, eraPatterns);

    // Extract energy
    const energyPatterns: Record<string, string> = {
      'energetic': 'high energy',
      'chill': 'chill, relaxed energy',
      'intense': 'intense, powerful energy',
      'calm': 'calm, low energy',
      'aggressive': 'aggressive energy',
      'soothing': 'soothing, gentle energy',
    };
    const energy = matchKeywords(text, energyPatterns);

    const schema: MusicPromptSchema = {
      genre,
      mood: mood || undefined,
      tempo,
      instruments: instruments.length > 0 ? instruments : undefined,
      energy,
      theme: this.extractMusicTheme(text),
      era,
      quality_tags: qualityTags,
    };

    autoAdded.push(...qualityTags);

    // Suno v4.5+ handles explicit style tags well
    if ((model === 'suno-v4.5' || model === 'suno-v4.5-plus') && !schema.genre) {
      schema.genre = 'cinematic';
      autoAdded.push('cinematic genre (auto)');
    }

    return {
      originalPrompt: text,
      structuredData: schema,
      optimizedPrompt: serializeMusicPrompt(schema),
      model,
      autoAdded,
    };
  }

  // ---------------------------------------------------------------------------
  // Helpers
  // ---------------------------------------------------------------------------

  private getModelType(model: SupportedModel): 'image' | 'video' | 'music' | 'vfx' {
    const videoModels: SupportedModel[] = [
      'veo-3.1', 'veo-3.1-fast', 'runway-aleph', 'kling-video',
      'kling-v1', 'kling-v1.5', 'kling-v2', 'stable-video-diffusion', 'cogvideo',
    ];
    const musicModels: SupportedModel[] = [
      'suno-v3.5', 'suno-v4', 'suno-v4.5', 'suno-v4.5-plus',
    ];
    const vfxModels: SupportedModel[] = [
      'higgsfield-vfx', 'higgsfield-fire', 'higgsfield-explosion',
      'higgsfield-smoke', 'higgsfield-weather', 'higgsfield-crowd',
    ];
    if (videoModels.includes(model)) return 'video';
    if (musicModels.includes(model)) return 'music';
    if (vfxModels.includes(model)) return 'vfx';
    return 'image';
  }

  private extractVideoPacing(text: string): string | undefined {
    const pacingMap: Record<string, string> = {
      'slow': 'slow deliberate pacing',
      'fast': 'fast dynamic pacing',
      'quick': 'quick cuts, energetic pacing',
      'smooth': 'smooth flowing motion',
      'frantic': 'frantic, rapid movement',
      'steady': 'steady measured pace',
    };
    return matchKeywords(text, pacingMap);
  }

  private extractMusicTheme(text: string): string | undefined {
    // Look for thematic context beyond genre/mood
    const themePatterns = [
      /\b(love|heartbreak|adventure|battle|triumph|loss|hope|fear|mystery|celebration)\b/gi,
      /\b(film score|end credits|opening title|battle scene|chase sequence|romantic scene)\b/gi,
    ];

    for (const pattern of themePatterns) {
      const match = text.match(pattern);
      if (match) {
        return match[0].toLowerCase();
      }
    }
    return undefined;
  }
}

// ============================================================================
// SINGLETON EXPORT
// ============================================================================

export const promptConverter = new PromptConverter();

export default PromptConverter;
