// src/components/film-production/studio/NewProductionWizard.tsx
// Create New Production - Guided setup with film industry language
// No AI terminology - uses "Crew", "Department Heads", "Production Brief"

import React, { useState } from 'react';
import {
  Film,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  CheckCircle,
  Clapperboard,
  Users,
  Calendar,
  DollarSign,
  Target,
  Palette,
  Play,
} from 'lucide-react';

interface ProductionBrief {
  title: string;
  logline: string;
  synopsis: string;
  genre: string;
  targetAudience: string;
  tone: string;
  visualStyle: string;
  references: string[];
  budget: number;
  timeline: { start: string; wrap: string };
}

interface NewProductionWizardProps {
  onComplete: (brief: ProductionBrief) => void;
  onCancel: () => void;
}

const STEPS = [
  { id: 'concept', title: 'The Concept', subtitle: 'What\'s your story?' },
  { id: 'vision', title: 'Creative Vision', subtitle: 'How should it look and feel?' },
  { id: 'production', title: 'Production Plan', subtitle: 'Budget and timeline' },
  { id: 'confirm', title: 'Ready to Roll', subtitle: 'Review and start production' },
];

const GENRES = [
  { id: 'action', label: 'Action', emoji: '💥' },
  { id: 'comedy', label: 'Comedy', emoji: '😄' },
  { id: 'drama', label: 'Drama', emoji: '🎭' },
  { id: 'horror', label: 'Horror', emoji: '👻' },
  { id: 'scifi', label: 'Sci-Fi', emoji: '🚀' },
  { id: 'romance', label: 'Romance', emoji: '💕' },
  { id: 'thriller', label: 'Thriller', emoji: '🔪' },
  { id: 'documentary', label: 'Documentary', emoji: '🎥' },
];

const TONES = [
  { id: 'serious', label: 'Serious & Grounded' },
  { id: 'lighthearted', label: 'Light & Fun' },
  { id: 'dark', label: 'Dark & Moody' },
  { id: 'inspirational', label: 'Uplifting & Hopeful' },
  { id: 'suspenseful', label: 'Tense & Suspenseful' },
  { id: 'whimsical', label: 'Whimsical & Quirky' },
];

const STYLES = [
  { id: 'cinematic', label: 'Classic Cinematic' },
  { id: 'documentary', label: 'Documentary Style' },
  { id: 'stylized', label: 'Highly Stylized' },
  { id: 'naturalistic', label: 'Naturalistic' },
  { id: 'noir', label: 'Film Noir' },
  { id: 'retro', label: 'Period/Retro' },
];

export function NewProductionWizard({ onComplete, onCancel }: NewProductionWizardProps) {
  const [step, setStep] = useState(0);
  const [brief, setBrief] = useState<ProductionBrief>({
    title: '',
    logline: '',
    synopsis: '',
    genre: '',
    targetAudience: '',
    tone: '',
    visualStyle: '',
    references: [],
    budget: 50000,
    timeline: { 
      start: new Date().toISOString().split('T')[0], 
      wrap: '' 
    },
  });
  const [referenceInput, setReferenceInput] = useState('');

  const updateBrief = (field: keyof ProductionBrief, value: any) => {
    setBrief(prev => ({ ...prev, [field]: value }));
  };

  const canProceed = () => {
    switch (step) {
      case 0: return brief.title && brief.logline && brief.genre;
      case 1: return true; // Optional creative details
      case 2: return brief.budget > 0 && brief.timeline.wrap;
      case 3: return true;
      default: return false;
    }
  };

  const handleAddReference = () => {
    if (referenceInput.trim()) {
      updateBrief('references', [...brief.references, referenceInput.trim()]);
      setReferenceInput('');
    }
  };

  const handleComplete = () => {
    onComplete(brief);
  };

  return (
    <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-8">
      <div className="w-full max-w-3xl">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-[#d4af37] to-[#c9a227] mb-4">
            <Film className="h-8 w-8 text-[#0a0a0f]" />
          </div>
          <h2 className="text-2xl font-bold mb-2">Start New Production</h2>
          <p className="text-white/50">Your crew is standing by. Let's brief them.</p>
        </div>

        {/* Progress Steps */}
        <div className="flex items-center justify-between mb-8 px-8">
          {STEPS.map((s, index) => (
            <React.Fragment key={s.id}>
              <div className="flex flex-col items-center">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium transition-all ${
                  index < step 
                    ? 'bg-[#d4af37] text-[#0a0a0f]'
                    : index === step
                    ? 'bg-[#d4af37]/20 border-2 border-[#d4af37] text-[#d4af37]'
                    : 'bg-white/5 text-white/30'
                }`}>
                  {index < step ? <CheckCircle className="h-5 w-5" /> : index + 1}
                </div>
                <span className={`text-xs mt-2 ${index <= step ? 'text-white/70' : 'text-white/30'}`}>
                  {s.title}
                </span>
              </div>
              {index < STEPS.length - 1 && (
                <div className={`flex-1 h-0.5 mx-4 transition-all ${
                  index < step ? 'bg-[#d4af37]' : 'bg-white/10'
                }`} />
              )}
            </React.Fragment>
          ))}
        </div>

        {/* Content Card */}
        <div className="backdrop-blur-xl bg-white/[0.03] border border-white/10 rounded-2xl p-8 shadow-2xl">
          {/* Step 0: Concept */}
          {step === 0 && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-1 flex items-center gap-2">
                  <Clapperboard className="h-5 w-5 text-[#d4af37]" />
                  {STEPS[0].title}
                </h3>
                <p className="text-white/50 text-sm">{STEPS[0].subtitle}</p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Production Title *</label>
                  <input
                    type="text"
                    value={brief.title}
                    onChange={(e) => updateBrief('title', e.target.value)}
                    placeholder="Enter your film's title"
                    className="w-full p-4 rounded-xl bg-black/30 border border-white/10 focus:border-[#d4af37]/50 focus:outline-none focus:ring-2 focus:ring-[#d4af37]/20 transition-all"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Logline * <span className="text-white/40 font-normal">(One sentence that sells your story)</span>
                  </label>
                  <textarea
                    value={brief.logline}
                    onChange={(e) => updateBrief('logline', e.target.value)}
                    placeholder="A [protagonist] must [goal] before [stakes]..."
                    rows={2}
                    className="w-full p-4 rounded-xl bg-black/30 border border-white/10 focus:border-[#d4af37]/50 focus:outline-none focus:ring-2 focus:ring-[#d4af37]/20 transition-all resize-none"
                  />
                  <p className="text-xs text-white/30 mt-1">{brief.logline.length}/150 characters recommended</p>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-3">Genre *</label>
                  <div className="grid grid-cols-4 gap-3">
                    {GENRES.map(genre => (
                      <button
                        key={genre.id}
                        onClick={() => updateBrief('genre', genre.id)}
                        className={`p-3 rounded-xl text-center transition-all ${
                          brief.genre === genre.id
                            ? 'bg-[#d4af37]/20 border-2 border-[#d4af37] text-white'
                            : 'bg-white/[0.02] border border-white/10 hover:bg-white/5 text-white/70'
                        }`}
                      >
                        <span className="text-2xl mb-1 block">{genre.emoji}</span>
                        <span className="text-xs font-medium">{genre.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Target Audience</label>
                  <input
                    type="text"
                    value={brief.targetAudience}
                    onChange={(e) => updateBrief('targetAudience', e.target.value)}
                    placeholder="e.g., Young adults 18-35, fans of psychological thrillers"
                    className="w-full p-4 rounded-xl bg-black/30 border border-white/10 focus:border-[#d4af37]/50 focus:outline-none focus:ring-2 focus:ring-[#d4af37]/20 transition-all"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Step 1: Creative Vision */}
          {step === 1 && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-1 flex items-center gap-2">
                  <Palette className="h-5 w-5 text-[#d4af37]" />
                  {STEPS[1].title}
                </h3>
                <p className="text-white/50 text-sm">{STEPS[1].subtitle}</p>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium mb-3">Tone</label>
                  <div className="grid grid-cols-3 gap-3">
                    {TONES.map(tone => (
                      <button
                        key={tone.id}
                        onClick={() => updateBrief('tone', tone.id)}
                        className={`p-3 rounded-xl text-sm transition-all ${
                          brief.tone === tone.id
                            ? 'bg-[#d4af37]/20 border-2 border-[#d4af37]'
                            : 'bg-white/[0.02] border border-white/10 hover:bg-white/5'
                        }`}
                      >
                        {tone.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-3">Visual Style</label>
                  <div className="grid grid-cols-3 gap-3">
                    {STYLES.map(style => (
                      <button
                        key={style.id}
                        onClick={() => updateBrief('visualStyle', style.id)}
                        className={`p-3 rounded-xl text-sm transition-all ${
                          brief.visualStyle === style.id
                            ? 'bg-[#d4af37]/20 border-2 border-[#d4af37]'
                            : 'bg-white/[0.02] border border-white/10 hover:bg-white/5'
                        }`}
                      >
                        {style.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Reference Films</label>
                  <p className="text-xs text-white/40 mb-3">Films that inspire the look, feel, or storytelling</p>
                  <div className="flex gap-2 mb-3">
                    <input
                      type="text"
                      value={referenceInput}
                      onChange={(e) => setReferenceInput(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleAddReference()}
                      placeholder="Enter a film title..."
                      className="flex-1 p-3 rounded-xl bg-black/30 border border-white/10 focus:border-[#d4af37]/50 focus:outline-none transition-all text-sm"
                    />
                    <button 
                      onClick={handleAddReference}
                      className="px-4 rounded-xl bg-white/5 hover:bg-white/10 transition-colors text-sm"
                    >
                      Add
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {brief.references.map((ref, index) => (
                      <span 
                        key={index}
                        className="px-3 py-1.5 rounded-full bg-white/5 text-sm flex items-center gap-2"
                      >
                        {ref}
                        <button 
                          onClick={() => updateBrief('references', brief.references.filter((_, i) => i !== index))}
                          className="text-white/40 hover:text-white/70"
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Synopsis <span className="text-white/40 font-normal">(2-4 sentences)</span>
                  </label>
                  <textarea
                    value={brief.synopsis}
                    onChange={(e) => updateBrief('synopsis', e.target.value)}
                    placeholder="Expand on your logline with key plot points..."
                    rows={4}
                    className="w-full p-4 rounded-xl bg-black/30 border border-white/10 focus:border-[#d4af37]/50 focus:outline-none focus:ring-2 focus:ring-[#d4af37]/20 transition-all resize-none"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Production Plan */}
          {step === 2 && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-1 flex items-center gap-2">
                  <DollarSign className="h-5 w-5 text-[#d4af37]" />
                  {STEPS[2].title}
                </h3>
                <p className="text-white/50 text-sm">{STEPS[2].subtitle}</p>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium mb-2">Production Budget (USD) *</label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40">$</span>
                    <input
                      type="number"
                      value={brief.budget}
                      onChange={(e) => updateBrief('budget', parseInt(e.target.value) || 0)}
                      min={1000}
                      step={1000}
                      className="w-full p-4 pl-8 rounded-xl bg-black/30 border border-white/10 focus:border-[#d4af37]/50 focus:outline-none focus:ring-2 focus:ring-[#d4af37]/20 transition-all"
                    />
                  </div>
                  <p className="text-xs text-white/30 mt-2">This determines how resources are allocated across departments</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Start Date</label>
                    <input
                      type="date"
                      value={brief.timeline.start}
                      onChange={(e) => updateBrief('timeline', { ...brief.timeline, start: e.target.value })}
                      className="w-full p-4 rounded-xl bg-black/30 border border-white/10 focus:border-[#d4af37]/50 focus:outline-none transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Target Wrap Date *</label>
                    <input
                      type="date"
                      value={brief.timeline.wrap}
                      onChange={(e) => updateBrief('timeline', { ...brief.timeline, wrap: e.target.value })}
                      className="w-full p-4 rounded-xl bg-black/30 border border-white/10 focus:border-[#d4af37]/50 focus:outline-none transition-all"
                    />
                  </div>
                </div>

                {/* Budget Preview */}
                <div className="p-5 rounded-xl bg-white/[0.02] border border-white/5">
                  <h4 className="font-medium mb-4 flex items-center gap-2">
                    <Target className="h-4 w-4 text-[#d4af37]" />
                    Estimated Department Allocation
                  </h4>
                  <div className="space-y-3">
                    {[
                      { name: 'Script & Story', pct: 5 },
                      { name: 'Direction & Planning', pct: 10 },
                      { name: 'Art & Production Design', pct: 20 },
                      { name: 'Camera & Visuals', pct: 25 },
                      { name: 'Sound & Music', pct: 15 },
                      { name: 'Post-Production', pct: 15 },
                      { name: 'Contingency', pct: 10 },
                    ].map(item => (
                      <div key={item.name} className="flex items-center gap-4">
                        <span className="text-sm text-white/60 flex-1">{item.name}</span>
                        <span className="text-sm font-medium w-24 text-right">
                          ${((brief.budget * item.pct) / 100).toLocaleString()}
                        </span>
                        <div className="w-20 h-1.5 bg-white/10 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-[#d4af37]/60 rounded-full"
                            style={{ width: `${item.pct * 2}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Confirm */}
          {step === 3 && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-1 flex items-center gap-2">
                  <Play className="h-5 w-5 text-[#d4af37]" />
                  {STEPS[3].title}
                </h3>
                <p className="text-white/50 text-sm">{STEPS[3].subtitle}</p>
              </div>

              {/* Summary */}
              <div className="p-6 rounded-xl bg-gradient-to-br from-[#d4af37]/10 to-transparent border border-[#d4af37]/20">
                <h4 className="text-2xl font-bold mb-2">{brief.title}</h4>
                <p className="text-white/70 mb-4">{brief.logline}</p>
                
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-white/40">Genre:</span>
                    <span className="ml-2 capitalize">{brief.genre}</span>
                  </div>
                  <div>
                    <span className="text-white/40">Budget:</span>
                    <span className="ml-2">${brief.budget.toLocaleString()}</span>
                  </div>
                  <div>
                    <span className="text-white/40">Tone:</span>
                    <span className="ml-2 capitalize">{brief.tone || 'Not specified'}</span>
                  </div>
                  <div>
                    <span className="text-white/40">Style:</span>
                    <span className="ml-2 capitalize">{brief.visualStyle || 'Not specified'}</span>
                  </div>
                </div>
              </div>

              {/* Crew Ready */}
              <div className="p-5 rounded-xl bg-white/[0.02] border border-white/5">
                <h4 className="font-medium mb-4 flex items-center gap-2">
                  <Users className="h-4 w-4 text-[#d4af37]" />
                  Your Crew is Ready
                </h4>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    'Head Writer',
                    'Director',
                    'DP',
                    'Sound Designer',
                    'Editor',
                    'Production Designer',
                  ].map(role => (
                    <div key={role} className="flex items-center gap-2 text-sm text-white/60">
                      <CheckCircle className="h-4 w-4 text-green-400" />
                      {role}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-between mt-6">
          <button
            onClick={step === 0 ? onCancel : () => setStep(s => s - 1)}
            className="px-6 py-3 rounded-xl bg-white/5 hover:bg-white/10 transition-colors flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            {step === 0 ? 'Cancel' : 'Back'}
          </button>
          
          {step < STEPS.length - 1 ? (
            <button
              onClick={() => setStep(s => s + 1)}
              disabled={!canProceed()}
              className={`px-6 py-3 rounded-xl flex items-center gap-2 font-medium transition-all ${
                canProceed()
                  ? 'bg-gradient-to-r from-[#d4af37] to-[#c9a227] text-[#0a0a0f] hover:shadow-[0_0_30px_rgba(212,175,55,0.3)]'
                  : 'bg-white/10 text-white/30 cursor-not-allowed'
              }`}
            >
              Continue
              <ArrowRight className="h-4 w-4" />
            </button>
          ) : (
            <button
              onClick={handleComplete}
              className="px-8 py-3 rounded-xl bg-gradient-to-r from-[#d4af37] to-[#c9a227] text-[#0a0a0f] font-semibold flex items-center gap-2 hover:shadow-[0_0_30px_rgba(212,175,55,0.3)] transition-all"
            >
              <Sparkles className="h-5 w-5" />
              Start Production
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default NewProductionWizard;
