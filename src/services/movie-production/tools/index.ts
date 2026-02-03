// src/services/movie-production/tools/index.ts

// Base tool interface and abstract class
export { 
  IMovieTool, 
  BaseMovieTool, 
  ToolCapability, 
  ToolExecutionParams, 
  ToolExecutionResult, 
  ToolStatus,
  ToolCategory,
  ToolPriority,
  ToolAuth,
} from './MovieTool';

// Tool Registry
export { 
  MovieToolRegistry, 
  getToolRegistry, 
  initializeToolRegistry 
} from './MovieToolRegistry';

// Primary Tools
export { CeltxTool } from './primary/CeltxTool';
export { StudioBinderTool } from './primary/StudioBinderTool';
export { Veo2Tool } from './primary/Veo2Tool';
export { YamduTool } from './primary/YamduTool';
export { ElevenLabsTool } from './primary/ElevenLabsTool';
export { InVideoTool } from './primary/InVideoTool';
export { MidjourneyTool } from './primary/MidjourneyTool';

// Secondary Tools
export { RunwayTool } from './secondary/RunwayTool';
// export { SunoTool } from './secondary/SunoTool';
// export { UdioTool } from './secondary/UdioTool';
// export { DallETool } from './secondary/DallETool';
// export { KlingTool } from './secondary/KlingTool';
// export { PikaLabsTool } from './secondary/PikaLabsTool';
// export { FfmpegTool } from './secondary/FfmpegTool';
// export { AdobePremiereTool } from './secondary/AdobePremiereTool';
// export { DaVinciResolveTool } from './secondary/DaVinciResolveTool';

// Replicate AI Gateway (Unified Model Access)
export { 
  ReplicateTool, 
  createReplicateTool,
  FILM_MODELS,
  DEPARTMENT_MODELS,
  type ReplicateConfig,
  type ModelConfig,
  type PredictionInput,
  type PredictionOutput,
} from './ReplicateTool';

// Kie.ai API Gateway (Affordable Alternative with Credit-based Pricing)
export {
  KieAiTool,
  createKieAiTool,
  KIE_AI_MODELS,
  KIE_DEPARTMENT_MODELS,
  type KieAiConfig,
  type GenerationInput,
  type GenerationOutput,
} from './KieAiTool';

// Department Model Services (High-level Department APIs)
export { 
  DepartmentModelService,
  createDepartmentModelService,
  WritingDepartmentService,
  DirectionDepartmentService,
  CinematographyDepartmentService,
  AudioDepartmentService,
  EditingDepartmentService,
  ProductionDesignDepartmentService,
  type SceneBreakdown,
  type StoryboardPanel,
  type DailyOutput,
} from './DepartmentModelService';

// Gemini Multimodal Service (Video Understanding, Visual Analysis)
export {
  GeminiMultimodalService,
  createGeminiService,
  type VideoAnalysis,
  type SceneAnalysis,
  type TechnicalNotes,
  type ScriptToShotPlan,
  type ShotPlan,
} from './GeminiMultimodalService';

// Higgsfield (Hollywood-grade Post-Production VFX)
export {
  HiggsfieldTool,
  createHiggsfieldTool,
  HIGGSFIELD_EFFECTS,
  type HiggsfieldConfig,
  type HiggsfieldEffect,
  type EffectCategory,
  type ProcessingJob,
} from './HiggsfieldTool';

// External Tool Registry (All AI Tools Catalog)
export {
  EXTERNAL_TOOLS,
  getToolsByDepartment,
  getToolsByCategory,
  getToolsWithAPI,
  getFreeTools,
  getToolsForPhase,
  searchToolsByCapability,
  INTEGRATION_CONFIGS,
  type ExternalTool,
  type ToolCategory as ExternalToolCategory,
  type ToolIntegrationConfig,
} from './ExternalToolRegistry';

