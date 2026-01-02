// src/services/movie-production/examples/MovieProductionExample.ts
/**
 * Example: Creating a Movie with Agent Nova Sub-Agent System
 * 
 * This demonstrates the complete movie production workflow using the 7 film
 * department sub-agents working collaboratively.
 */

import { createMovie } from '../MovieProductionWorkflow';
import { MovieProductionRequest, MovieProductionResult } from '../../types';

/**
 * Example 1: Sci-Fi Short Film Production
 */
export async function createSciFiShortFilm(): Promise<MovieProductionResult> {
  const request: MovieProductionRequest = {
    concept: `
      "Divergence" - A sci-fi short exploring identity and choice.
      A character discovers a parallel version of themselves making different 
      life choices and must decide which timeline truly belongs to them.
    `,
    genre: ['Science Fiction', 'Drama', 'Psychological Thriller'],
    targetDuration: 15, // minutes
    style: {
      visualTone: 'sleek cyberpunk with human emotion',
      colorPalette: ['#0a0a0a', '#00ffff', '#ff00ff', '#ffffff'],
      cinematicReferences: ['Blade Runner 2049', 'Arrival', 'Inception'],
      audioStyle: 'Minimalist electronic with organic strings',
      pacing: 'dynamic',
    },
    constraints: {
      budget: 50000,
      maxDuration: 15,
      technicalRequirements: ['4K output', '5.1 surround sound', 'Color graded'],
      contentRating: 'PG-13',
    },
    outputFormats: ['video', 'screenplay', 'storyboard', 'audio'],
  };

  console.log('='.repeat(80));
  console.log('🎬 AGENT NOVA MOVIE PRODUCTION SYSTEM');
  console.log('='.repeat(80));
  console.log('\n📋 PROJECT BRIEF:');
  console.log(`Concept: ${request.concept.trim()}`);
  console.log(`Duration: ${request.targetDuration} minutes`);
  console.log(`Budget: $${request.constraints?.budget?.toLocaleString()}`);
  console.log(`\n🎨 Visual Style: ${request.style?.visualTone}`);
  console.log(`🎵 Audio Style: ${request.style?.audioStyle}`);
  console.log(`\n📹 Initiating production workflow with 7 specialized departments:\n`);

  try {
    const result = await createMovie(request);

    console.log('\n✅ PRODUCTION COMPLETE!\n');
    console.log('📊 Production Report:');
    console.log(`Total Production Time: ${(result.productionReport.totalDuration / 1000 / 60).toFixed(2)} minutes`);
    console.log(`\n📈 Quality Scores by Department:`);
    
    Object.entries(result.productionReport.qualityScores).forEach(([dept, score]) => {
      const stars = '★'.repeat(Math.round(score as number * 5));
      console.log(`  ${dept.padEnd(20)} ${stars.padEnd(5)} ${(score as number).toFixed(2)}/1.0`);
    });

    console.log(`\n👥 Agent Contributions:`);
    Object.entries(result.productionReport.agentContributions).forEach(([agentId, contrib]) => {
      console.log(`  ${agentId}:`);
      console.log(`    - Tasks Completed: ${contrib.tasksCompleted}`);
      console.log(`    - Artifacts Produced: ${contrib.artifactsProduced}`);
      console.log(`    - Average Quality: ${(contrib.averageQuality * 100).toFixed(1)}%`);
      console.log(`    - Collaborations: ${contrib.collaborations}`);
    });

    console.log(`\n📁 Final Deliverables:`);
    console.log(`  Video: ${result.finalOutputs.video}`);
    console.log(`  Screenplay: ${result.finalOutputs.screenplay}`);
    console.log(`  Storyboard: ${result.finalOutputs.storyboard?.[0]}`);
    console.log(`  Soundtrack: ${result.finalOutputs.soundtrack}`);

    console.log('\n' + '='.repeat(80) + '\n');

    return result;

  } catch (error) {
    console.error('❌ Production failed:', error);
    throw error;
  }
}

/**
 * Example 2: Drama Feature Film Production
 */
export async function createDramaFeature(): Promise<MovieProductionResult> {
  const request: MovieProductionRequest = {
    concept: `
      "The Last Conversation" - A intimate two-character drama exploring
      love, loss, and the unspoken words between two lifelong friends
      meeting one final time.
    `,
    genre: ['Drama', 'Romance'],
    targetDuration: 90,
    style: {
      visualTone: 'warm, intimate realism with golden hour aesthetics',
      colorPalette: ['#d4a574', '#8b4513', '#f5deb3', '#2f1f0f'],
      cinematicReferences: ['Before Trilogy', 'Manchester by the Sea'],
      audioStyle: 'Diegetic and minimalist score',
      pacing: 'slow',
    },
    constraints: {
      budget: 250000,
      maxDuration: 90,
      technicalRequirements: ['2K minimum', 'Stereo or 5.1 mix'],
      contentRating: 'PG',
    },
    outputFormats: ['video', 'screenplay'],
  };

  console.log('🎬 Creating Drama Feature...\n');
  return await createMovie(request);
}

/**
 * Example 3: Animation Short Production
 * (Using existing text-based approach with visual direction)
 */
export async function createAnimationShort(): Promise<MovieProductionResult> {
  const request: MovieProductionRequest = {
    concept: `
      "Metamorphosis" - An animated journey showing transformation and growth
      through abstract visual storytelling.
    `,
    genre: ['Animation', 'Experimental', 'Educational'],
    targetDuration: 5,
    style: {
      visualTone: 'vibrant, abstract, deliberately stylized',
      colorPalette: ['#ff6b6b', '#4ecdc4', '#45b7d1', '#ffa502'],
      cinematicReferences: ['Studio Ghibli', 'Fantastic Mr. Fox'],
      audioStyle: 'Orchestral with electronic elements',
      pacing: 'moderate',
    },
    constraints: {
      budget: 75000,
      technicalRequirements: ['2K animation', 'High color precision'],
    },
  };

  console.log('🎬 Creating Animation Short...\n');
  return await createMovie(request);
}

/**
 * WORKFLOW OVERVIEW:
 * 
 * 1. DEVELOPMENT PHASE (Writing Agent)
 *    - Screenplay generation from concept
 *    - Character development
 *    - Scene breakdowns
 * 
 * 2. PRE-PRODUCTION PHASE
 *    Director Agent:
 *    - Creative direction and visual language
 *    - Shot planning and storyboarding
 *    
 *    Cinematographer Agent:
 *    - Camera composition and framing
 *    - Lighting design
 *    - Camera movement planning
 *    
 *    Production Designer Agent:
 *    - Set design
 *    - Costume design
 *    - Color palette and visual branding
 *    
 *    Production Agent:
 *    - Production scheduling
 *    - Budget planning
 *    - Logistics and resource coordination
 *    
 *    Audio Agent:
 *    - Sound design strategy
 *    - Music composition planning
 *    - Dialogue recording preparation
 * 
 * 3. PRODUCTION PHASE
 *    - All departments execute their plans
 *    - Footage and recordings captured
 *    - Real-time collaboration and adjustments
 * 
 * 4. POST-PRODUCTION PHASE
 *    Editor Agent:
 *    - Rough cut assembly
 *    - Color grading
 *    - Final cut mastering
 *    
 *    Audio Agent:
 *    - Sound design finalization
 *    - Music composition
 *    
 * 5. DELIVERY PHASE
 *    - Final deliverables in all formats
 *    - Quality assurance
 *    - Distribution preparation
 * 
 * INTER-AGENT COLLABORATION:
 * - Director coordinates overall vision with all departments
 * - Cinematographer collaborates with Production Designer on visual language
 * - Editor works with Director and Audio on final cut
 * - All agents provide feedback and request revisions as needed
 * - Shared production context ensures consistency across departments
 */

// Export examples for testing
export const movieProductionExamples = {
  sciFiShort: createSciFiShortFilm,
  dramaFeature: createDramaFeature,
  animationShort: createAnimationShort,
};
