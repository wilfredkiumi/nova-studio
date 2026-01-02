// src/services/movie-production/index.ts

// Main entry point - the Film Production System
export { 
  FilmProductionSystem, 
  createFilmProduction, 
  makeFilm 
} from './FilmProductionSystem';

// Core hierarchy
export { ProductionManager } from './ProductionManager';
export { DirectorOrchestrator } from './DirectorOrchestrator';
export { BaseSubAgent } from './SubAgent';

// Legacy orchestrator (deprecated - use DirectorOrchestrator)
export { SubAgentOrchestrator } from './SubAgentOrchestrator';
export { MovieProductionWorkflow, createMovie } from './MovieProductionWorkflow';

// Export all sub-agents (assist the Director)
export { WriterAgent } from './agents/WriterAgent';
export { DirectorAgent } from './agents/DirectorAgent';
export { CinematographerAgent } from './agents/CinematographerAgent';
export { ProductionAgent } from './agents/ProductionAgent';
export { AudioAgent } from './agents/AudioAgent';
export { EditorAgent } from './agents/EditorAgent';
export { ProductionDesignerAgent } from './agents/ProductionDesignerAgent';

// Export tools
export * from './tools';
