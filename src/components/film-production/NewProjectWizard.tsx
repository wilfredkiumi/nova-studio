// src/components/film-production/NewProjectWizard.tsx
import React, { useState } from 'react';
import { useFilmProduction, ProducerBrief } from './FilmProductionProvider';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Film, 
  Sparkles, 
  ArrowRight, 
  ArrowLeft,
  Loader2,
  CheckCircle
} from 'lucide-react';

interface WizardStep {
  id: string;
  title: string;
  description: string;
}

const STEPS: WizardStep[] = [
  { id: 'basics', title: 'Project Basics', description: 'Title and core concept' },
  { id: 'story', title: 'Story Details', description: 'Logline and synopsis' },
  { id: 'creative', title: 'Creative Vision', description: 'Style and references' },
  { id: 'production', title: 'Production', description: 'Budget and timeline' },
];

const GENRES = [
  'action', 'comedy', 'drama', 'horror', 'sci-fi', 
  'romance', 'thriller', 'documentary', 'animation', 'fantasy'
];

const TONES = [
  'serious', 'lighthearted', 'dark', 'inspirational', 
  'suspenseful', 'whimsical', 'gritty', 'epic'
];

const VISUAL_STYLES = [
  'cinematic', 'documentary', 'stylized', 'naturalistic',
  'noir', 'vibrant', 'minimalist', 'retro'
];

/**
 * New Project Wizard - Guided project creation for Producers
 */
export function NewProjectWizard({ onComplete }: { onComplete?: () => void }) {
  const { startProject, isLoading } = useFilmProduction();
  const [currentStep, setCurrentStep] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  
  // Form state
  const [formData, setFormData] = useState({
    title: '',
    genre: '',
    targetAudience: '',
    logline: '',
    synopsis: '',
    tone: '',
    visualStyle: '',
    references: '',
    budget: 50000,
    startDate: new Date().toISOString().split('T')[0],
    releaseDate: '',
  });

  const updateField = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const canProceed = () => {
    switch (currentStep) {
      case 0: return formData.title && formData.genre && formData.targetAudience;
      case 1: return formData.logline;
      case 2: return true; // Optional
      case 3: return formData.budget > 0 && formData.releaseDate;
      default: return false;
    }
  };

  const handleNext = () => {
    if (currentStep < STEPS.length - 1) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const handleSubmit = async () => {
    const brief: ProducerBrief = {
      title: formData.title,
      logline: formData.logline,
      synopsis: formData.synopsis || undefined,
      genre: formData.genre,
      targetAudience: formData.targetAudience,
      budget: formData.budget,
      timeline: {
        startDate: new Date(formData.startDate),
        targetReleaseDate: new Date(formData.releaseDate),
      },
      creativeBrief: formData.tone || formData.visualStyle ? {
        tone: formData.tone,
        visualStyle: formData.visualStyle,
        references: formData.references.split('\n').filter(r => r.trim()),
      } : undefined,
    };

    try {
      await startProject(brief);
      setIsComplete(true);
      setTimeout(() => onComplete?.(), 1500);
    } catch (err) {
      console.error('Failed to create project:', err);
    }
  };

  if (isComplete) {
    return (
      <Card className="max-w-2xl mx-auto">
        <CardContent className="pt-12 pb-12 text-center">
          <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-2">Project Created!</h2>
          <p className="text-muted-foreground">
            Your production team is being assembled...
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <div className="flex items-center gap-2 mb-4">
          <Film className="h-6 w-6" />
          <CardTitle>Create New Film Project</CardTitle>
        </div>
        
        {/* Step Indicator */}
        <div className="flex items-center justify-between">
          {STEPS.map((step, index) => (
            <React.Fragment key={step.id}>
              <div className={`flex flex-col items-center ${
                index <= currentStep ? 'text-primary' : 'text-muted-foreground'
              }`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  index < currentStep 
                    ? 'bg-primary text-primary-foreground' 
                    : index === currentStep
                    ? 'bg-primary/20 border-2 border-primary'
                    : 'bg-muted'
                }`}>
                  {index < currentStep ? <CheckCircle className="h-4 w-4" /> : index + 1}
                </div>
                <span className="text-xs mt-1 hidden sm:block">{step.title}</span>
              </div>
              {index < STEPS.length - 1 && (
                <div className={`flex-1 h-0.5 mx-2 ${
                  index < currentStep ? 'bg-primary' : 'bg-muted'
                }`} />
              )}
            </React.Fragment>
          ))}
        </div>
        
        <CardDescription className="mt-4">
          {STEPS[currentStep].description}
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Step 1: Basics */}
        {currentStep === 0 && (
          <>
            <div className="space-y-2">
              <Label htmlFor="title">Project Title *</Label>
              <Input
                id="title"
                placeholder="Enter your film title"
                value={formData.title}
                onChange={(e) => updateField('title', e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="genre">Genre *</Label>
              <Select value={formData.genre} onValueChange={(v) => updateField('genre', v)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select genre" />
                </SelectTrigger>
                <SelectContent>
                  {GENRES.map(genre => (
                    <SelectItem key={genre} value={genre} className="capitalize">
                      {genre}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="audience">Target Audience *</Label>
              <Input
                id="audience"
                placeholder="e.g., Young adults 18-35, sci-fi enthusiasts"
                value={formData.targetAudience}
                onChange={(e) => updateField('targetAudience', e.target.value)}
              />
            </div>
          </>
        )}

        {/* Step 2: Story */}
        {currentStep === 1 && (
          <>
            <div className="space-y-2">
              <Label htmlFor="logline">
                Logline * <span className="text-muted-foreground">(one sentence hook)</span>
              </Label>
              <Textarea
                id="logline"
                placeholder="A one-sentence summary that captures the essence of your story. e.g., 'A retired hitman is pulled back into the underworld when his car is stolen.'"
                value={formData.logline}
                onChange={(e) => updateField('logline', e.target.value)}
                rows={2}
              />
              <p className="text-xs text-muted-foreground">
                {formData.logline.length}/150 characters recommended
              </p>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="synopsis">
                Synopsis <span className="text-muted-foreground">(2-4 sentences, optional)</span>
              </Label>
              <Textarea
                id="synopsis"
                placeholder="Expand on your logline with key plot points and character arcs..."
                value={formData.synopsis}
                onChange={(e) => updateField('synopsis', e.target.value)}
                rows={4}
              />
            </div>
            
            <div className="bg-muted/50 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <Sparkles className="h-4 w-4 text-primary" />
                <span className="font-medium text-sm">AI Tip</span>
              </div>
              <p className="text-sm text-muted-foreground">
                A strong logline includes: a protagonist, their goal, the obstacle, and what's at stake.
              </p>
            </div>
          </>
        )}

        {/* Step 3: Creative Vision */}
        {currentStep === 2 && (
          <>
            <div className="space-y-2">
              <Label htmlFor="tone">Tone</Label>
              <Select value={formData.tone} onValueChange={(v) => updateField('tone', v)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select tone" />
                </SelectTrigger>
                <SelectContent>
                  {TONES.map(tone => (
                    <SelectItem key={tone} value={tone} className="capitalize">
                      {tone}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="visualStyle">Visual Style</Label>
              <Select value={formData.visualStyle} onValueChange={(v) => updateField('visualStyle', v)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select visual style" />
                </SelectTrigger>
                <SelectContent>
                  {VISUAL_STYLES.map(style => (
                    <SelectItem key={style} value={style} className="capitalize">
                      {style}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="references">Reference Films (one per line)</Label>
              <Textarea
                id="references"
                placeholder="Blade Runner&#10;Her&#10;Ex Machina"
                value={formData.references}
                onChange={(e) => updateField('references', e.target.value)}
                rows={3}
              />
              <p className="text-xs text-muted-foreground">
                Films that inspire the look, feel, or story of your project
              </p>
            </div>
          </>
        )}

        {/* Step 4: Production */}
        {currentStep === 3 && (
          <>
            <div className="space-y-2">
              <Label htmlFor="budget">Budget (USD) *</Label>
              <Input
                id="budget"
                type="number"
                min={1000}
                step={1000}
                value={formData.budget}
                onChange={(e) => updateField('budget', parseInt(e.target.value) || 0)}
              />
              <p className="text-xs text-muted-foreground">
                This determines AI resource allocation across departments
              </p>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="startDate">Start Date *</Label>
                <Input
                  id="startDate"
                  type="date"
                  value={formData.startDate}
                  onChange={(e) => updateField('startDate', e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="releaseDate">Target Release *</Label>
                <Input
                  id="releaseDate"
                  type="date"
                  value={formData.releaseDate}
                  onChange={(e) => updateField('releaseDate', e.target.value)}
                />
              </div>
            </div>
            
            {/* Budget Breakdown Preview */}
            <div className="bg-muted/50 rounded-lg p-4 mt-4">
              <h4 className="font-medium mb-3">Estimated Budget Allocation</h4>
              <div className="space-y-2 text-sm">
                {[
                  { dept: 'Writing', pct: 5 },
                  { dept: 'Direction', pct: 10 },
                  { dept: 'Production Design', pct: 20 },
                  { dept: 'Cinematography', pct: 25 },
                  { dept: 'Audio', pct: 10 },
                  { dept: 'Editing', pct: 15 },
                  { dept: 'Production', pct: 15 },
                ].map(({ dept, pct }) => (
                  <div key={dept} className="flex justify-between">
                    <span className="text-muted-foreground">{dept}</span>
                    <span>${((formData.budget * pct) / 100).toLocaleString()}</span>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </CardContent>

      <CardFooter className="flex justify-between">
        <Button
          variant="outline"
          onClick={handleBack}
          disabled={currentStep === 0}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
        
        {currentStep < STEPS.length - 1 ? (
          <Button onClick={handleNext} disabled={!canProceed()}>
            Next
            <ArrowRight className="h-4 w-4 ml-2" />
          </Button>
        ) : (
          <Button onClick={handleSubmit} disabled={!canProceed() || isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Creating...
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4 mr-2" />
                Create Project
              </>
            )}
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}
