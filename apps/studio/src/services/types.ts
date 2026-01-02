
export interface Tool {
  id: string;
  name: string;
  description: string;
  schema: Schema;
  execute(params: Record<string, any>): Promise<ToolResult>;
  getValidationSchema(): Schema;
  getErrorHandler(): ErrorHandler;
}

export interface ToolResult {
  success: boolean;
  data: any;
  error?: string;
  quality: number;
  metadata: Record<string, any>;
  metrics: Record<string, any>;
}

export interface Schema {
  validate(data: any): { valid: boolean; errors?: string[] };
  getProperties(): Record<string, any>;
}

export interface ErrorHandler {
  handle(error: Error): ToolResult;
}

export interface AgentNovaConfig {
  memory?: any;
  decisions?: any;
  tools?: any;
  triggers?: any;
  errors?: any;
  agents?: any;
}

export interface EnhancedMemoryConfig {
  contextRetention: number;
  [key: string]: any;
}

export interface MemoryRecord {
  id: string;
  context: string;
  metadata: Record<string, any>;
  [key: string]: any;
}

export interface VectorEntry {
  id: string;
  vector: number[];
  metadata: Record<string, any>;
}

export interface Task {
  id: string;
  type: string;
  status: string;
  createdAt: string;
  created_at?: string; // Added for compatibility
  [key: string]: any;
}

export interface TriggerMessage {
  source: string;
  content: string;
  userId: string;
  metadata: Record<string, any>;
  timestamp: Date;
}

export interface TriggerConfig {
  [key: string]: any;
}

export interface WorkflowRequest {
  priority?: any;
  parameters?: any;
  context?: any;
  domain?: any;
}

export interface WorkflowResult {
  success: boolean;
  quality: number;
  metadata: Record<string, any>;
  metrics: Record<string, any>;
}

// ============================================
// MOVIE PRODUCTION SUB-AGENT SYSTEM
// ============================================

// Film Production Departments
export type FilmDepartment = 
  | 'production'
  | 'direction'
  | 'writing'
  | 'cinematography'
  | 'sound'
  | 'editing'
  | 'production-design';

// Skill Definition - Composable capabilities
export interface Skill {
  id: string;
  name: string;
  description: string;
  department: FilmDepartment;
  requiredInputs: string[];
  outputs: string[];
  execute(input: SkillInput): Promise<SkillOutput>;
}

export interface SkillInput {
  data: Record<string, any>;
  context: ProductionContext;
  dependencies?: Record<string, SkillOutput>;
}

export interface SkillOutput {
  success: boolean;
  artifacts: ProductionArtifact[];
  quality: number;
  notes: string[];
  metadata: Record<string, any>;
}

// Production Artifacts - Outputs from each department
export interface ProductionArtifact {
  id: string;
  type: ArtifactType;
  name: string;
  department: FilmDepartment;
  data: any;
  version: number;
  createdAt: Date;
  createdBy: string;
  dependencies?: string[];
}

export type ArtifactType =
  // Writing
  | 'screenplay'
  | 'scene-breakdown'
  | 'dialogue'
  | 'treatment'
  | 'character-bible'
  // Production
  | 'schedule'
  | 'budget'
  | 'call-sheet'
  | 'shooting-script'
  // Direction
  | 'shot-list'
  | 'storyboard'
  | 'blocking-diagram'
  | 'creative-brief'
  // Cinematography
  | 'frame-composition'
  | 'lighting-plan'
  | 'camera-movement'
  | 'visual-reference'
  | 'generated-frame'
  // Sound
  | 'dialogue-recording'
  | 'sound-design'
  | 'music-score'
  | 'foley'
  | 'ambient-sound'
  // Editing
  | 'rough-cut'
  | 'assembly'
  | 'final-cut'
  | 'color-grade'
  // Production Design
  | 'set-design'
  | 'prop-list'
  | 'costume-design'
  | 'color-palette'
  | 'mood-board';

// Sub-Agent Definition
export interface SubAgent {
  id: string;
  name: string;
  department: FilmDepartment;
  role: string;
  description: string;
  skills: Skill[];
  status: SubAgentStatus;
  
  // Core methods
  initialize(context: ProductionContext): Promise<void>;
  executeTask(task: DepartmentTask): Promise<DepartmentTaskResult>;
  collaborate(request: CollaborationRequest): Promise<CollaborationResponse>;
  getCapabilities(): SubAgentCapability[];
  shutdown(): Promise<void>;
}

export type SubAgentStatus = 'idle' | 'working' | 'waiting' | 'blocked' | 'error';

export interface SubAgentCapability {
  skillId: string;
  proficiency: number; // 0-1
  specializations: string[];
}

// Department Task
export interface DepartmentTask {
  id: string;
  department: FilmDepartment;
  type: string;
  priority: 'critical' | 'high' | 'medium' | 'low';
  inputs: Record<string, any>;
  requiredArtifacts?: string[];
  deadline?: Date;
  dependencies?: string[];
}

export interface DepartmentTaskResult {
  taskId: string;
  success: boolean;
  artifacts: ProductionArtifact[];
  quality: number;
  duration: number;
  feedback?: string;
  blockers?: string[];
}

// Inter-Agent Collaboration
export interface CollaborationRequest {
  fromAgent: string;
  toAgent: string;
  type: 'feedback' | 'approval' | 'resource' | 'revision' | 'handoff';
  artifactIds: string[];
  message: string;
  urgency: 'immediate' | 'soon' | 'when-available';
}

export interface CollaborationResponse {
  approved: boolean;
  feedback: string;
  revisionRequests?: RevisionRequest[];
  artifacts?: ProductionArtifact[];
}

export interface RevisionRequest {
  artifactId: string;
  type: 'minor' | 'major' | 'complete-redo';
  notes: string;
  specificChanges: string[];
}

// Movie Production Project
export interface MovieProject {
  id: string;
  title: string;
  logline: string;        // One sentence hook
  synopsis?: string;      // 2-4 sentence summary
  genre: string[];
  targetDuration: number; // minutes
  style: MovieStyle;
  status: ProductionPhase;
  createdAt: Date;
  updatedAt: Date;
}

export interface MovieStyle {
  visualTone: string;
  colorPalette: string[];
  cinematicReferences: string[];
  audioStyle: string;
  pacing: 'slow' | 'moderate' | 'fast' | 'dynamic';
}

export type ProductionPhase = 
  | 'development'
  | 'pre-production'
  | 'production'
  | 'post-production'
  | 'delivery';

// Production Context - Shared state across all agents
export interface ProductionContext {
  project: MovieProject;
  currentPhase: ProductionPhase;
  artifacts: Map<string, ProductionArtifact>;
  agentStates: Map<string, SubAgentStatus>;
  timeline: ProductionTimeline;
  constraints: ProductionConstraints;
}

export interface ProductionTimeline {
  phases: {
    phase: ProductionPhase;
    startDate: Date;
    endDate: Date;
    milestones: Milestone[];
  }[];
}

export interface Milestone {
  id: string;
  name: string;
  phase: ProductionPhase;
  dueDate: Date;
  requiredArtifacts: ArtifactType[];
  completed: boolean;
}

export interface ProductionConstraints {
  budget?: number;
  maxDuration?: number;
  styleGuidelines?: string[];
  technicalRequirements?: string[];
  contentRating?: string;
}

// Agent Capability Interfaces (for decision engine)
export interface AgentCapability {
  id: string;
  name: string;
  performanceScore: number;
  costPerUnit: number;
  availableResources: number;
  specializations: string[];
}

export interface TaskRequirements {
  complexity: number;
  domain: string;
  urgency: number;
  qualityThreshold: number;
}

// Movie Production Request/Result
export interface MovieProductionRequest {
  concept: string;
  genre: string[];
  targetDuration: number;
  style?: Partial<MovieStyle>;
  constraints?: ProductionConstraints;
  outputFormats?: ('video' | 'screenplay' | 'storyboard' | 'audio')[];
}

export interface MovieProductionResult {
  success: boolean;
  project: MovieProject;
  artifacts: ProductionArtifact[];
  finalOutputs: {
    video?: string; // URL or path
    screenplay?: string;
    storyboard?: string[];
    soundtrack?: string;
  };
  productionReport: ProductionReport;
}

export interface ProductionReport {
  totalDuration: number;
  phaseBreakdown: Record<ProductionPhase, number>;
  qualityScores: Record<FilmDepartment, number>;
  agentContributions: Record<string, AgentContribution>;
  issues: ProductionIssue[];
}

export interface AgentContribution {
  agentId: string;
  tasksCompleted: number;
  artifactsProduced: number;
  averageQuality: number;
  collaborations: number;
}

export interface ProductionIssue {
  severity: 'critical' | 'warning' | 'info';
  phase: ProductionPhase;
  department: FilmDepartment;
  description: string;
  resolution?: string;
}
