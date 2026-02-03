import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  ArrowLeft,
  ArrowRight,
  Check,
  Clapperboard,
  Layers,
  Gamepad2,
  Music,
  PenTool,
  Sparkles,
  Users,
  Zap,
  Wand2,
  Glasses,
  BookOpen,
  Camera,
  Podcast,
  Megaphone,
  Tv,
  X,
  Mail,
  UserPlus,
  type LucideIcon
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

// Industry-standard templates with detailed specs
interface Template {
  id: string
  name: string
  description: string
  duration?: string
  specs?: string
  deliverables: string[]
  phases: string[]
  teamRoles: string[]
  estimatedTime: string
  budget?: string
}

const industryTemplates: Record<string, Template[]> = {
  film: [
    {
      id: 'short-film',
      name: 'Short Film (Festival Ready)',
      description: 'Industry-standard short film format optimized for film festival submissions',
      duration: '5-15 minutes',
      specs: '4K ProRes, 24fps, 2.39:1 aspect ratio',
      deliverables: ['Final Cut (DCP)', 'Trailer', 'Behind the Scenes', 'Press Kit'],
      phases: ['Development', 'Pre-production', 'Production', 'Post-production', 'Distribution'],
      teamRoles: ['Vision Prompt Lead', 'Narrative Prompter', 'Visual Prompt Specialist', 'Edit Prompter', 'Audio Prompter'],
      estimatedTime: '3-6 months',
      budget: '$5K - $50K'
    },
    {
      id: 'documentary',
      name: 'Documentary',
      description: 'Professional documentary with interview-driven narrative structure',
      duration: '30-90 minutes',
      specs: '4K, 24/30fps, 16:9',
      deliverables: ['Feature Cut', 'Broadcast Version', 'Social Clips', 'Transcripts'],
      phases: ['Research', 'Pre-production', 'Principal Photography', 'Post-production'],
      teamRoles: ['Creative Director', 'Project Lead', 'Visual Prompter', 'Edit Prompter', 'Research Prompter'],
      estimatedTime: '6-12 months',
      budget: '$20K - $200K'
    },
    {
      id: 'commercial',
      name: 'Commercial (Broadcast)',
      description: 'TV-ready commercial following broadcast standards',
      duration: '15/30/60 seconds',
      specs: '4K ProRes, broadcast-safe colors',
      deliverables: ['Master', ':30 Cut', ':15 Cut', ':06 Bumper', 'Social Versions'],
      phases: ['Brief', 'Concept', 'Pre-production', 'Shoot', 'Post', 'Delivery'],
      teamRoles: ['Creative Director', 'Project Lead', 'Visual Prompter', 'Art Prompt Director', 'Edit Prompter'],
      estimatedTime: '2-4 weeks',
      budget: '$10K - $500K'
    },
    {
      id: 'music-video',
      name: 'Music Video',
      description: 'Performance and narrative music video for streaming platforms',
      duration: '3-5 minutes',
      specs: '4K, 24fps, various aspect ratios',
      deliverables: ['Master', 'Vertical Version', 'Lyric Video', 'BTS Content'],
      phases: ['Concept', 'Treatment', 'Pre-production', 'Shoot', 'Edit', 'Color/VFX'],
      teamRoles: ['Vision Prompt Lead', 'Visual Prompter', 'Motion Prompter', 'Edit Prompter', 'Color Prompter'],
      estimatedTime: '2-6 weeks',
      budget: '$5K - $100K'
    },
    {
      id: 'social-content',
      name: 'Social Media Content Pack',
      description: 'Platform-optimized video content for TikTok, Instagram, YouTube Shorts',
      duration: '15-60 seconds each',
      specs: '4K, 9:16 / 1:1 / 16:9',
      deliverables: ['10+ Short-form Videos', 'Thumbnails', 'Captions'],
      phases: ['Strategy', 'Scripting', 'Production', 'Editing', 'Publishing'],
      teamRoles: ['Content Prompter', 'Edit Prompter', 'Distribution Lead'],
      estimatedTime: '1-2 weeks',
      budget: '$1K - $10K'
    }
  ],
  animation: [
    {
      id: '2d-series',
      name: '2D Animated Series Episode',
      description: 'Broadcast-quality 2D animation episode',
      duration: '11/22 minutes',
      specs: '1080p/4K, 24fps, TV-safe',
      deliverables: ['Animatic', 'Final Episode', 'Assets Library'],
      phases: ['Script', 'Storyboard', 'Animatic', 'Animation', 'Compositing', 'Sound'],
      teamRoles: ['Animation Director', 'Story Prompter', 'Motion Prompter', 'Composite Prompter', 'Audio Prompter'],
      estimatedTime: '8-12 weeks',
      budget: '$50K - $200K'
    },
    {
      id: '3d-cinematic',
      name: '3D Cinematic Trailer',
      description: 'Game/film quality 3D cinematic sequence',
      duration: '1-3 minutes',
      specs: '4K, 24fps, HDR',
      deliverables: ['Final Render', 'Project Files', 'Asset Library'],
      phases: ['Concept', 'Previz', 'Modeling', 'Animation', 'Lighting', 'Render', 'Composite'],
      teamRoles: ['Creative Director', '3D Prompt Artist', 'Motion Prompter', 'Lighting Prompter', 'Composite Prompter'],
      estimatedTime: '2-4 months',
      budget: '$30K - $300K'
    },
    {
      id: 'motion-graphics',
      name: 'Motion Graphics Package',
      description: 'Brand motion system with animated elements',
      specs: '4K, 30/60fps, Alpha channels',
      deliverables: ['Logo Animation', 'Lower Thirds', 'Transitions', 'Social Templates'],
      phases: ['Design', 'Storyboard', 'Animation', 'Delivery'],
      teamRoles: ['Motion Prompt Lead', 'Art Prompt Director'],
      estimatedTime: '2-4 weeks',
      budget: '$5K - $30K'
    },
    {
      id: 'explainer',
      name: 'Explainer Video',
      description: 'Corporate explainer with character animation',
      duration: '60-90 seconds',
      specs: '4K, 30fps',
      deliverables: ['Final Video', 'Script', 'Voiceover', 'Source Files'],
      phases: ['Script', 'Storyboard', 'Voiceover', 'Animation', 'Sound Design'],
      teamRoles: ['Project Lead', 'Script Prompter', 'Animation Prompter', 'Voice Prompt Specialist'],
      estimatedTime: '3-6 weeks',
      budget: '$5K - $25K'
    }
  ],
  games: [
    {
      id: 'mobile-game',
      name: 'Mobile Game (Casual)',
      description: 'Hyper-casual or casual mobile game for iOS/Android',
      specs: 'Unity/Unreal, 60fps target',
      deliverables: ['Game Build', 'Store Assets', 'Marketing Materials'],
      phases: ['Concept', 'Prototype', 'Production', 'Polish', 'Soft Launch', 'Launch'],
      teamRoles: ['Game Vision Lead', 'Code Prompter', 'Asset Prompter', 'Audio Prompter', 'QA Lead'],
      estimatedTime: '3-6 months',
      budget: '$20K - $100K'
    },
    {
      id: 'indie-game',
      name: 'Indie Game (Steam)',
      description: 'Full indie game for PC/Console release',
      specs: 'Unity/Unreal/Godot',
      deliverables: ['Game Build', 'Steam Page', 'Press Kit', 'Trailer'],
      phases: ['Pre-production', 'Vertical Slice', 'Production', 'Alpha', 'Beta', 'Launch'],
      teamRoles: ['Creative Director', 'Design Prompter', 'Code Prompter', 'Asset Prompter', 'Music Prompter', 'QA Lead'],
      estimatedTime: '1-3 years',
      budget: '$50K - $500K'
    },
    {
      id: 'game-jam',
      name: 'Game Jam Project',
      description: 'Rapid prototype for game jam or proof of concept',
      specs: 'Any engine, web-playable',
      deliverables: ['Playable Build', 'Source Code', 'Itch.io Page'],
      phases: ['Ideation', 'Development', 'Polish', 'Submit'],
      teamRoles: ['Design Prompter', 'Code Prompter', 'Art Prompter'],
      estimatedTime: '48-72 hours',
      budget: '$0 - $500'
    }
  ],
  music: [
    {
      id: 'album',
      name: 'Full Album',
      description: 'Professional album production (8-12 tracks)',
      specs: '24-bit/48kHz WAV, Dolby Atmos optional',
      deliverables: ['Master Files', 'Stems', 'Artwork', 'Distribution Ready'],
      phases: ['Pre-production', 'Recording', 'Editing', 'Mixing', 'Mastering'],
      teamRoles: ['Music Director', 'Production Prompter', 'Sound Prompter', 'Mix Prompter', 'Master Prompter'],
      estimatedTime: '3-12 months',
      budget: '$10K - $100K'
    },
    {
      id: 'single',
      name: 'Single Release',
      description: 'Single track with radio and streaming optimization',
      specs: '24-bit/48kHz, streaming optimized',
      deliverables: ['Master', 'Instrumental', 'Acapella', 'Artwork', 'Press Release'],
      phases: ['Production', 'Recording', 'Mix', 'Master', 'Distribution'],
      teamRoles: ['Music Director', 'Production Prompter', 'Sound Prompter'],
      estimatedTime: '2-4 weeks',
      budget: '$1K - $10K'
    },
    {
      id: 'soundtrack',
      name: 'Film/Game Soundtrack',
      description: 'Original score for visual media',
      specs: 'Stems, 5.1/Atmos mix available',
      deliverables: ['Full Score', 'Stems', 'Cue Sheets', 'Sync License Ready'],
      phases: ['Spotting', 'Composition', 'Recording', 'Mixing', 'Delivery'],
      teamRoles: ['Composition Prompter', 'Orchestration Prompter', 'Recording Prompter', 'Mix Prompter'],
      estimatedTime: '1-6 months',
      budget: '$5K - $200K'
    }
  ],
  design: [
    {
      id: 'brand-identity',
      name: 'Complete Brand Identity',
      description: 'Full brand system with guidelines',
      deliverables: ['Logo Suite', 'Color Palette', 'Typography', 'Brand Guidelines', 'Templates'],
      phases: ['Discovery', 'Research', 'Concept', 'Refinement', 'Guidelines'],
      teamRoles: ['Brand Prompt Strategist', 'Visual Prompter', 'Art Prompt Director'],
      estimatedTime: '4-8 weeks',
      budget: '$5K - $50K'
    },
    {
      id: 'ui-design',
      name: 'App/Web UI Design',
      description: 'Complete UI design system for digital products',
      deliverables: ['Wireframes', 'UI Designs', 'Design System', 'Prototype', 'Handoff'],
      phases: ['Research', 'Wireframes', 'Visual Design', 'Prototype', 'Handoff'],
      teamRoles: ['UX Prompt Specialist', 'UI Prompter', 'Research Prompter'],
      estimatedTime: '4-12 weeks',
      budget: '$10K - $100K'
    },
    {
      id: 'social-kit',
      name: 'Social Media Kit',
      description: 'Complete social media design templates',
      deliverables: ['Post Templates', 'Story Templates', 'Highlight Covers', 'Brand Assets'],
      phases: ['Strategy', 'Design', 'Template Creation', 'Delivery'],
      teamRoles: ['Design Prompter', 'Social Strategy Prompter'],
      estimatedTime: '1-2 weeks',
      budget: '$1K - $5K'
    }
  ],
  'vr-xr': [
    {
      id: 'vr-experience',
      name: 'VR Experience',
      description: 'Immersive VR experience for Quest/PC VR',
      specs: '90fps, 4K per eye',
      deliverables: ['VR Build', 'Store Assets', 'Documentation'],
      phases: ['Concept', 'Prototype', 'Production', 'Testing', 'Optimization', 'Launch'],
      teamRoles: ['XR Vision Lead', '3D Prompt Artist', 'Interaction Prompter', 'Spatial Audio Prompter'],
      estimatedTime: '3-12 months',
      budget: '$50K - $500K'
    },
    {
      id: 'ar-filter',
      name: 'AR Filter/Effect',
      description: 'Social AR filter for Instagram/TikTok/Snapchat',
      specs: 'Platform-specific requirements',
      deliverables: ['Filter Files', 'Preview Videos', 'Documentation'],
      phases: ['Concept', 'Design', 'Development', 'Testing', 'Publish'],
      teamRoles: ['AR Prompt Designer', '3D Prompt Artist'],
      estimatedTime: '1-4 weeks',
      budget: '$500 - $10K'
    }
  ],
  podcast: [
    {
      id: 'podcast-series',
      name: 'Podcast Series Launch',
      description: 'Complete podcast series setup with first season',
      specs: 'MP3 192kbps, RSS feed ready',
      deliverables: ['10 Episodes', 'Artwork', 'Intro/Outro', 'Show Notes', 'Transcripts'],
      phases: ['Planning', 'Recording', 'Editing', 'Publishing', 'Promotion'],
      teamRoles: ['Show Director', 'Content Prompter', 'Audio Edit Prompter', 'Marketing Prompter'],
      estimatedTime: '2-3 months',
      budget: '$2K - $20K'
    },
    {
      id: 'audiobook',
      name: 'Audiobook Production',
      description: 'ACX/Audible compliant audiobook',
      specs: 'MP3 192kbps, -18dB RMS, -3dB peak',
      deliverables: ['Chapter Files', 'Master Files', 'Cover Art'],
      phases: ['Prep', 'Recording', 'Editing', 'Proofing', 'Mastering', 'Delivery'],
      teamRoles: ['Voice Prompt Lead', 'Production Prompter', 'QA Prompter', 'Audio Master Prompter'],
      estimatedTime: '4-8 weeks',
      budget: '$1K - $10K'
    }
  ],
  photography: [
    {
      id: 'product-shoot',
      name: 'E-commerce Product Shoot',
      description: 'Professional product photography for online stores',
      specs: 'High-res JPG/TIFF, white background + lifestyle',
      deliverables: ['Hero Images', 'Detail Shots', 'Lifestyle Images', 'Social Crops'],
      phases: ['Planning', 'Shoot', 'Retouching', 'Delivery'],
      teamRoles: ['Image Prompt Lead', 'Style Prompter', 'Retouch Prompter'],
      estimatedTime: '1-2 weeks',
      budget: '$500 - $10K'
    },
    {
      id: 'brand-campaign',
      name: 'Brand Campaign Shoot',
      description: 'Multi-day brand photography campaign',
      deliverables: ['Campaign Images', 'BTS Content', 'Social Assets'],
      phases: ['Creative Brief', 'Pre-production', 'Shoot', 'Post-production', 'Delivery'],
      teamRoles: ['Visual Director', 'Art Prompt Director', 'Style Prompter', 'Retouch Prompter'],
      estimatedTime: '2-4 weeks',
      budget: '$5K - $50K'
    }
  ],
  broadcast: [
    {
      id: 'live-show',
      name: 'Live Stream Show',
      description: 'Professional live streaming setup for recurring shows',
      specs: '1080p60, multi-camera',
      deliverables: ['Stream Setup', 'Graphics Package', 'VOD Versions'],
      phases: ['Setup', 'Testing', 'Rehearsal', 'Live', 'Post'],
      teamRoles: ['Broadcast Director', 'Live Prompt Lead', 'Technical Prompter', 'Graphics Prompter'],
      estimatedTime: 'Ongoing',
      budget: '$2K - $20K/show'
    }
  ],
  advertising: [
    {
      id: 'digital-campaign',
      name: 'Digital Ad Campaign',
      description: 'Multi-platform digital advertising campaign',
      deliverables: ['Ad Creatives', 'Landing Pages', 'A/B Variants', 'Analytics Setup'],
      phases: ['Strategy', 'Creative', 'Production', 'Launch', 'Optimization'],
      teamRoles: ['Strategy Prompter', 'Creative Director', 'Design Prompter', 'Copy Prompter', 'Media Prompter'],
      estimatedTime: '2-6 weeks',
      budget: '$5K - $100K'
    }
  ],
  publishing: [
    {
      id: 'ebook',
      name: 'eBook Publication',
      description: 'Professional eBook formatting and publication',
      specs: 'EPUB3, Kindle, PDF',
      deliverables: ['Formatted Files', 'Cover Design', 'Metadata'],
      phases: ['Manuscript Prep', 'Design', 'Formatting', 'QA', 'Publication'],
      teamRoles: ['Editorial Prompter', 'Cover Prompter', 'Format Specialist'],
      estimatedTime: '2-4 weeks',
      budget: '$500 - $5K'
    }
  ]
}

// Project types with their details
const projectTypes: {
  id: string
  title: string
  description: string
  icon: LucideIcon
  color: string
  bgGradient: string
  tools: string[]
}[] = [
  {
    id: 'film',
    title: 'Film & Video',
    description: 'Create films, documentaries, commercials, and video content with AI assistance',
    icon: Clapperboard,
    color: 'violet',
    bgGradient: 'from-violet-600/20 to-purple-600/20',
    tools: ['AI Director', 'Script Writer', 'Video Generation', 'Voice Synthesis'],
  },
  {
    id: 'music-video',
    title: 'Music Video',
    description: 'Create captivating music videos with synchronized visuals and audio effects',
    icon: Music,
    color: 'fuchsia',
    bgGradient: 'from-fuchsia-600/20 to-purple-600/20',
    tools: ['Video Sync', 'Beat Matching', 'Visual Effects', 'Color Grading'],
  },
  {
    id: 'animation',
    title: 'Animation',
    description: 'Bring characters and stories to life with 2D and 3D animation tools',
    icon: Layers,
    color: 'pink',
    bgGradient: 'from-pink-600/20 to-rose-600/20',
    tools: ['2D Animation', '3D Modeling', 'Character Rigging', 'Motion Capture'],
  },
  {
    id: 'games',
    title: 'Game Development',
    description: 'Design and develop games with AI-powered asset generation and level design',
    icon: Gamepad2,
    color: 'emerald',
    bgGradient: 'from-emerald-600/20 to-green-600/20',
    tools: ['Level Designer', 'Asset Generator', 'Character Creator', 'Sound Effects'],
  },
  {
    id: 'music',
    title: 'Music Production',
    description: 'Compose, produce, and mix music with AI-assisted creativity tools',
    icon: Music,
    color: 'amber',
    bgGradient: 'from-amber-600/20 to-yellow-600/20',
    tools: ['AI Composer', 'Beat Maker', 'Voice Synthesis', 'Mixing Studio'],
  },
  {
    id: 'design',
    title: 'Graphic Design',
    description: 'Create stunning visuals, brand identities, and digital art with AI',
    icon: PenTool,
    color: 'cyan',
    bgGradient: 'from-cyan-600/20 to-blue-600/20',
    tools: ['AI Designer', 'Image Generator', 'Brand Kit', 'Layout Editor'],
  },
  {
    id: 'vr-xr',
    title: 'VR / XR / Mixed Reality',
    description: 'Build immersive virtual and mixed reality experiences',
    icon: Glasses,
    color: 'indigo',
    bgGradient: 'from-indigo-600/20 to-violet-600/20',
    tools: ['3D Environment', 'Spatial Audio', 'Interaction Design', 'Asset Library'],
  },
  {
    id: 'podcast',
    title: 'Podcast & Audio',
    description: 'Produce professional podcasts and audio content',
    icon: Podcast,
    color: 'orange',
    bgGradient: 'from-orange-600/20 to-red-600/20',
    tools: ['Audio Editor', 'Voice Enhancement', 'Transcript Generator', 'Sound Library'],
  },
  {
    id: 'photography',
    title: 'Photography',
    description: 'Edit, enhance, and manage photography projects',
    icon: Camera,
    color: 'rose',
    bgGradient: 'from-rose-600/20 to-pink-600/20',
    tools: ['AI Retouching', 'Batch Editor', 'Style Transfer', 'Gallery Builder'],
  },
  {
    id: 'broadcast',
    title: 'Broadcast & Streaming',
    description: 'Create content for TV, streaming, and live broadcasts',
    icon: Tv,
    color: 'blue',
    bgGradient: 'from-blue-600/20 to-cyan-600/20',
    tools: ['Live Graphics', 'Stream Manager', 'Replay Editor', 'Multi-cam'],
  },
  {
    id: 'advertising',
    title: 'Advertising & Marketing',
    description: 'Create compelling ads and marketing campaigns',
    icon: Megaphone,
    color: 'yellow',
    bgGradient: 'from-yellow-600/20 to-orange-600/20',
    tools: ['Ad Creator', 'A/B Testing', 'Analytics', 'Campaign Manager'],
  },
  {
    id: 'publishing',
    title: 'Digital Publishing',
    description: 'Create eBooks, magazines, and digital publications',
    icon: BookOpen,
    color: 'teal',
    bgGradient: 'from-teal-600/20 to-green-600/20',
    tools: ['Layout Editor', 'Typography', 'Interactive Elements', 'Export Tools'],
  },
]

const aiFeatures = [
  { id: 'director', title: 'AI Director', description: 'Get intelligent creative direction', icon: Sparkles },
  { id: 'generation', title: 'Content Generation', description: 'Auto-generate assets and media', icon: Wand2 },
  { id: 'enhancement', title: 'Auto Enhancement', description: 'Automatic quality improvements', icon: Zap },
  { id: 'collaboration', title: 'Smart Collaboration', description: 'AI-assisted team coordination', icon: Users },
]

// Team member roles based on project type - all roles work with AI sub-agents
const suggestedRoles: Record<string, string[]> = {
  film: ['Creative Director', 'Vision Prompt Lead', 'Narrative Prompter', 'Visual Prompt Specialist', 'Audio Prompt Engineer', 'Edit Prompt Specialist', 'Color & Grade Prompter'],
  animation: ['Animation Director', 'Motion Prompt Lead', 'Character Prompt Designer', 'Scene Prompt Artist', 'VFX Prompter'],
  games: ['Game Vision Lead', 'Gameplay Prompter', 'Asset Prompt Artist', 'World Prompt Designer', 'Audio Prompter', 'QA Lead'],
  music: ['Music Director', 'Composition Prompter', 'Sound Design Prompter', 'Vocal Prompt Engineer', 'Mix Prompt Specialist'],
  design: ['Creative Lead', 'Visual Prompt Director', 'Brand Prompt Specialist', 'Layout Prompter', 'Copy Prompter'],
  'vr-xr': ['XR Vision Lead', 'Spatial Prompt Designer', '3D Prompt Artist', 'Interaction Prompter', 'Experience Architect'],
  podcast: ['Show Director', 'Content Prompter', 'Audio Prompt Engineer', 'Research Prompter'],
  photography: ['Visual Director', 'Image Prompt Specialist', 'Style Prompter', 'Retouch Prompt Artist'],
  broadcast: ['Broadcast Director', 'Live Prompt Lead', 'Technical Prompter', 'Graphics Prompter'],
  advertising: ['Campaign Director', 'Strategy Prompter', 'Creative Prompter', 'Copy Prompt Specialist', 'Media Prompter'],
  publishing: ['Editorial Director', 'Content Prompter', 'Design Prompter', 'Format Specialist'],
}

interface TeamInvite {
  email: string
  role: string
}

interface ProjectSettings {
  type: string
  name: string
  description: string
  template: string
  aiFeatures: string[]
  visibility: 'private' | 'team' | 'public'
  teamInvites: TeamInvite[]
}

export default function NewProject() {
  const [step, setStep] = useState(1)
  const navigate = useNavigate()
  const [inviteEmail, setInviteEmail] = useState('')
  const [inviteRole, setInviteRole] = useState('')
  const [settings, setSettings] = useState<ProjectSettings>({
    type: '',
    name: '',
    description: '',
    template: '',
    aiFeatures: ['director', 'enhancement'],
    visibility: 'team',
    teamInvites: [],
  })

  const selectedType = projectTypes.find(t => t.id === settings.type)
  const templates = settings.type ? industryTemplates[settings.type] || [] : []
  const selectedTemplate = templates.find(t => t.id === settings.template)
  const roles = settings.type ? suggestedRoles[settings.type] || [] : []

  const handleTypeSelect = (typeId: string) => {
    setSettings(prev => ({ ...prev, type: typeId, template: '' }))
  }

  const handleNext = () => {
    if (step < 4) setStep(step + 1)
  }

  const handleBack = () => {
    if (step > 1) setStep(step - 1)
  }

  const handleCreate = () => {
    console.log('Creating project:', settings)
    // TODO: Implement actual project creation API call
    // For now, navigate to projects page
    navigate('/projects')
  }

  const handleAddInvite = () => {
    if (inviteEmail && inviteRole) {
      setSettings(prev => ({
        ...prev,
        teamInvites: [...prev.teamInvites, { email: inviteEmail, role: inviteRole }]
      }))
      setInviteEmail('')
      setInviteRole('')
    }
  }

  const handleRemoveInvite = (index: number) => {
    setSettings(prev => ({
      ...prev,
      teamInvites: prev.teamInvites.filter((_, i) => i !== index)
    }))
  }

  const canProceed = () => {
    if (step === 1) return settings.type !== ''
    if (step === 2) return settings.name.trim() !== ''
    return true
  }

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-zinc-800 px-6 py-4">
        <div className="flex items-center gap-4">
          <Link to="/projects" className="p-2 rounded-lg text-zinc-400 hover:bg-zinc-800 hover:text-white">
            <ArrowLeft className="size-5" />
          </Link>
          <div>
            <h1 className="text-xl font-semibold">New Project</h1>
            <p className="text-sm text-zinc-400">Create a new creative project</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {[1, 2, 3, 4].map((s) => (
            <div 
              key={s}
              className={`flex items-center ${s < 4 ? 'gap-2' : ''}`}
            >
              <div className={`size-8 rounded-full flex items-center justify-center text-sm font-medium ${
                s < step ? 'bg-violet-600 text-white' :
                s === step ? 'bg-violet-600/20 text-violet-400 ring-2 ring-violet-600' :
                'bg-zinc-800 text-zinc-500'
              }`}>
                {s < step ? <Check className="size-4" /> : s}
              </div>
              {s < 4 && (
                <div className={`w-8 h-0.5 ${s < step ? 'bg-violet-600' : 'bg-zinc-800'}`} />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        {/* Step 1: Choose Project Type */}
        {step === 1 && (
          <div className="p-6">
            <div className="max-w-2xl mx-auto">
              <div className="text-center mb-8">
                <h2 className="text-2xl font-semibold mb-2">What do you want to create?</h2>
                <p className="text-zinc-400">Choose the type of project you're working on</p>
              </div>
              
              {/* Project Type Dropdown */}
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-zinc-300 mb-2">
                    Project Type
                  </label>
                  <Select value={settings.type} onValueChange={handleTypeSelect}>
                    <SelectTrigger className="w-full bg-zinc-800 border-zinc-700 text-white h-12">
                      <SelectValue placeholder="Select a project type..." />
                    </SelectTrigger>
                    <SelectContent className="bg-zinc-900 border-zinc-800 max-h-80">
                      {projectTypes.map((type) => {
                        const Icon = type.icon
                        return (
                          <SelectItem 
                            key={type.id} 
                            value={type.id}
                            className="text-zinc-300 focus:bg-zinc-800 focus:text-white py-3"
                          >
                            <div className="flex items-center gap-3">
                              <Icon className="size-5 text-zinc-400" />
                              <span>{type.title}</span>
                            </div>
                          </SelectItem>
                        )
                      })}
                    </SelectContent>
                  </Select>
                </div>

                {/* Selected Type Preview */}
                {selectedType && (
                  <Card className="bg-zinc-900 border-zinc-800">
                    <CardContent className="p-6">
                      <div className="flex items-start gap-4">
                        <div className={`size-14 rounded-xl bg-gradient-to-br ${selectedType.bgGradient} flex items-center justify-center shrink-0`}>
                          <selectedType.icon className="size-7 text-white" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="text-lg font-medium text-white mb-1">{selectedType.title}</h3>
                          <p className="text-sm text-zinc-400 mb-4">{selectedType.description}</p>
                          <div>
                            <p className="text-xs font-medium text-zinc-500 mb-2">Available Tools</p>
                            <div className="flex flex-wrap gap-1.5">
                              {selectedType.tools.map((tool) => (
                                <Badge key={tool} variant="secondary" className="bg-zinc-800 text-zinc-400 text-xs">
                                  {tool}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Quick Type Icons */}
                {!selectedType && (
                  <div>
                    <p className="text-xs font-medium text-zinc-500 mb-3">Popular project types</p>
                    <div className="grid grid-cols-4 md:grid-cols-6 gap-2">
                      {projectTypes.slice(0, 6).map((type) => {
                        const Icon = type.icon
                        return (
                          <button
                            key={type.id}
                            onClick={() => handleTypeSelect(type.id)}
                            className="flex flex-col items-center gap-2 p-4 rounded-lg bg-zinc-900 border border-zinc-800 hover:border-zinc-700 hover:bg-zinc-800/50 transition-colors"
                          >
                            <div className={`size-10 rounded-lg bg-gradient-to-br ${type.bgGradient} flex items-center justify-center`}>
                              <Icon className="size-5 text-white" />
                            </div>
                            <span className="text-xs text-zinc-400 text-center line-clamp-1">{type.title.split(' ')[0]}</span>
                          </button>
                        )
                      })}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Step 2: Project Details */}
        {step === 2 && selectedType && (
          <div className="p-6">
            <div className="max-w-2xl mx-auto">
              <div className="text-center mb-8">
                <div className={`size-16 rounded-xl bg-gradient-to-br ${selectedType.bgGradient} flex items-center justify-center mx-auto mb-4`}>
                  <selectedType.icon className={`size-8 text-${selectedType.color}-400`} />
                </div>
                <h2 className="text-2xl font-semibold mb-2">Project Details</h2>
                <p className="text-zinc-400">Tell us about your {selectedType.title.toLowerCase()} project</p>
              </div>

              <div className="space-y-6">
                {/* Project Name */}
                <div>
                  <label className="block text-sm font-medium text-zinc-300 mb-2">
                    Project Name
                  </label>
                  <input
                    type="text"
                    value={settings.name}
                    onChange={(e) => setSettings(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="Enter project name..."
                    className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-3 text-white placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-violet-600"
                  />
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-medium text-zinc-300 mb-2">
                    Description <span className="text-zinc-500">(optional)</span>
                  </label>
                  <textarea
                    value={settings.description}
                    onChange={(e) => setSettings(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Describe your project..."
                    rows={3}
                    className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-3 text-white placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-violet-600 resize-none"
                  />
                </div>

                {/* Template Selection */}
                <div>
                  <label className="block text-sm font-medium text-zinc-300 mb-3">
                    Start from Industry Template
                  </label>
                  
                  {/* Blank Project Option */}
                  <button
                    onClick={() => setSettings(prev => ({ ...prev, template: '' }))}
                    className={`w-full mb-3 p-4 rounded-lg border text-left transition-colors ${
                      settings.template === '' 
                        ? 'border-violet-600 bg-violet-600/10 text-white' 
                        : 'border-zinc-700 bg-zinc-800 text-zinc-400 hover:border-zinc-600'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-white">Blank Project</p>
                        <p className="text-sm text-zinc-500">Start from scratch with full flexibility</p>
                      </div>
                      {settings.template === '' && (
                        <div className="size-6 rounded-full bg-violet-600 flex items-center justify-center">
                          <Check className="size-4 text-white" />
                        </div>
                      )}
                    </div>
                  </button>

                  {/* Industry Templates */}
                  <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2">
                    {templates.map((template) => (
                      <button
                        key={template.id}
                        onClick={() => setSettings(prev => ({ ...prev, template: template.id }))}
                        className={`w-full p-4 rounded-lg border text-left transition-colors ${
                          settings.template === template.id 
                            ? 'border-violet-600 bg-violet-600/10' 
                            : 'border-zinc-700 bg-zinc-800 hover:border-zinc-600'
                        }`}
                      >
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <p className="font-medium text-white">{template.name}</p>
                            <p className="text-sm text-zinc-500 mt-1">{template.description}</p>
                          </div>
                          {settings.template === template.id && (
                            <div className="size-6 rounded-full bg-violet-600 flex items-center justify-center shrink-0">
                              <Check className="size-4 text-white" />
                            </div>
                          )}
                        </div>
                        
                        {/* Template Details */}
                        <div className="grid grid-cols-2 gap-3 mb-3">
                          <div className="bg-zinc-900/50 rounded-lg p-2">
                            <p className="text-xs text-zinc-500">Duration</p>
                            <p className="text-sm text-zinc-300">{template.duration}</p>
                          </div>
                          <div className="bg-zinc-900/50 rounded-lg p-2">
                            <p className="text-xs text-zinc-500">Timeline</p>
                            <p className="text-sm text-zinc-300">{template.estimatedTime}</p>
                          </div>
                        </div>

                        <div className="bg-zinc-900/50 rounded-lg p-2 mb-3">
                          <p className="text-xs text-zinc-500 mb-1">Specs</p>
                          <p className="text-sm text-zinc-300">{template.specs}</p>
                        </div>

                        <div className="bg-zinc-900/50 rounded-lg p-2 mb-3">
                          <p className="text-xs text-zinc-500 mb-1">Deliverables</p>
                          <div className="flex flex-wrap gap-1">
                            {template.deliverables.map((d, i) => (
                              <Badge key={i} variant="outline" className="text-xs border-zinc-700 text-zinc-400">
                                {d}
                              </Badge>
                            ))}
                          </div>
                        </div>

                        <div className="flex items-center justify-between text-xs">
                          <div className="flex items-center gap-2 text-zinc-500">
                            <Users className="size-3.5" />
                            <span>{template.teamRoles.length} roles</span>
                          </div>
                          <div className="text-zinc-400 font-medium">{template.budget}</div>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Visibility */}
                <div>
                  <label className="block text-sm font-medium text-zinc-300 mb-2">
                    Visibility
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { id: 'private', label: 'Private', desc: 'Only you' },
                      { id: 'team', label: 'Team', desc: 'Your team members' },
                      { id: 'public', label: 'Public', desc: 'Anyone with link' },
                    ].map((opt) => (
                      <button
                        key={opt.id}
                        onClick={() => setSettings(prev => ({ ...prev, visibility: opt.id as any }))}
                        className={`p-3 rounded-lg border text-left transition-colors ${
                          settings.visibility === opt.id 
                            ? 'border-violet-600 bg-violet-600/10' 
                            : 'border-zinc-700 bg-zinc-800 hover:border-zinc-600'
                        }`}
                      >
                        <p className="text-sm font-medium text-white">{opt.label}</p>
                        <p className="text-xs text-zinc-500">{opt.desc}</p>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Step 3: AI Features */}
        {step === 3 && selectedType && (
          <div className="p-6">
            <div className="max-w-2xl mx-auto">
              <div className="text-center mb-8">
                <div className="size-16 rounded-xl bg-gradient-to-br from-violet-600/20 to-fuchsia-600/20 flex items-center justify-center mx-auto mb-4">
                  <Sparkles className="size-8 text-violet-400" />
                </div>
                <h2 className="text-2xl font-semibold mb-2">AI Features</h2>
                <p className="text-zinc-400">Choose which AI capabilities to enable for this project</p>
              </div>

              <div className="space-y-4">
                {aiFeatures.map((feature) => {
                  const Icon = feature.icon
                  const isEnabled = settings.aiFeatures.includes(feature.id)
                  return (
                    <Card 
                      key={feature.id}
                      className={`bg-zinc-900 cursor-pointer transition-all ${
                        isEnabled 
                          ? 'border-violet-600 ring-1 ring-violet-600/20' 
                          : 'border-zinc-800 hover:border-zinc-700'
                      }`}
                      onClick={() => {
                        setSettings(prev => ({
                          ...prev,
                          aiFeatures: isEnabled
                            ? prev.aiFeatures.filter(f => f !== feature.id)
                            : [...prev.aiFeatures, feature.id]
                        }))
                      }}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-center gap-4">
                          <div className={`size-12 rounded-lg flex items-center justify-center ${
                            isEnabled ? 'bg-violet-600/20' : 'bg-zinc-800'
                          }`}>
                            <Icon className={`size-6 ${isEnabled ? 'text-violet-400' : 'text-zinc-500'}`} />
                          </div>
                          <div className="flex-1">
                            <h3 className="font-medium text-white">{feature.title}</h3>
                            <p className="text-sm text-zinc-400">{feature.description}</p>
                          </div>
                          <div className={`size-6 rounded-full border-2 flex items-center justify-center ${
                            isEnabled ? 'bg-violet-600 border-violet-600' : 'border-zinc-600'
                          }`}>
                            {isEnabled && <Check className="size-4 text-white" />}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )
                })}
              </div>
            </div>
          </div>
        )}

        {/* Step 4: Team & Review */}
        {step === 4 && selectedType && (
          <div className="p-6">
            <div className="max-w-2xl mx-auto">
              <div className="text-center mb-8">
                <div className="size-16 rounded-xl bg-gradient-to-br from-blue-600/20 to-cyan-600/20 flex items-center justify-center mx-auto mb-4">
                  <Users className="size-8 text-blue-400" />
                </div>
                <h2 className="text-2xl font-semibold mb-2">Invite Your Team</h2>
                <p className="text-zinc-400">Collaborate with team members on this project</p>
              </div>

              {/* Invite Form */}
              <Card className="bg-zinc-900 border-zinc-800 mb-6">
                <CardContent className="p-4">
                  <div className="flex gap-3">
                    <div className="flex-1">
                      <input
                        type="email"
                        value={inviteEmail}
                        onChange={(e) => setInviteEmail(e.target.value)}
                        placeholder="Enter email address..."
                        className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2.5 text-white placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-violet-600"
                      />
                    </div>
                    <Select value={inviteRole} onValueChange={setInviteRole}>
                      <SelectTrigger className="w-40 bg-zinc-800 border-zinc-700 text-white">
                        <SelectValue placeholder="Role" />
                      </SelectTrigger>
                      <SelectContent className="bg-zinc-900 border-zinc-800">
                        {roles.map((role) => (
                          <SelectItem 
                            key={role} 
                            value={role}
                            className="text-zinc-300 focus:bg-zinc-800 focus:text-white"
                          >
                            {role}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Button
                      onClick={handleAddInvite}
                      disabled={!inviteEmail.includes('@') || !inviteRole}
                      className="bg-violet-600 hover:bg-violet-700"
                    >
                      <UserPlus className="size-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Pending Invites */}
              {settings.teamInvites.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-sm font-medium text-zinc-400 mb-3">Pending Invites ({settings.teamInvites.length})</h3>
                  <div className="space-y-2">
                    {settings.teamInvites.map((invite, index) => (
                      <div 
                        key={index}
                        className="flex items-center justify-between bg-zinc-800/50 rounded-lg px-4 py-3"
                      >
                        <div className="flex items-center gap-3">
                          <div className="size-9 rounded-full bg-zinc-700 flex items-center justify-center">
                            <Mail className="size-4 text-zinc-400" />
                          </div>
                          <div>
                            <p className="text-sm text-white">{invite.email}</p>
                            <p className="text-xs text-zinc-500">{invite.role}</p>
                          </div>
                        </div>
                        <button
                          onClick={() => handleRemoveInvite(index)}
                          className="p-1.5 rounded-lg text-zinc-500 hover:text-white hover:bg-zinc-700"
                        >
                          <X className="size-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Suggested Roles */}
              {selectedTemplate && (
                <Card className="bg-zinc-900/50 border-zinc-800 mb-6">
                  <CardContent className="p-4">
                    <h3 className="text-sm font-medium text-zinc-400 mb-3">
                      Recommended team for "{selectedTemplate.name}"
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {selectedTemplate.teamRoles.map((role) => (
                        <Badge 
                          key={role} 
                          variant="outline" 
                          className="border-zinc-700 text-zinc-400 cursor-pointer hover:border-violet-600 hover:text-violet-400"
                          onClick={() => setInviteRole(role)}
                        >
                          {role}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Project Summary */}
              <Card className="bg-zinc-800/50 border-zinc-700">
                <CardContent className="p-4">
                  <h3 className="text-sm font-medium text-zinc-400 mb-3">Project Summary</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-zinc-500">Type</span>
                      <span className="text-white">{selectedType.title}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-zinc-500">Name</span>
                      <span className="text-white">{settings.name || 'Untitled'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-zinc-500">Template</span>
                      <span className="text-white">{selectedTemplate?.name || 'Blank'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-zinc-500">Visibility</span>
                      <span className="text-white capitalize">{settings.visibility}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-zinc-500">AI Features</span>
                      <span className="text-white">{settings.aiFeatures.length} enabled</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-zinc-500">Team Members</span>
                      <span className="text-white">{settings.teamInvites.length} invited</span>
                    </div>
                    {selectedTemplate && (
                      <>
                        <div className="border-t border-zinc-700 my-2 pt-2">
                          <div className="flex justify-between">
                            <span className="text-zinc-500">Est. Timeline</span>
                            <span className="text-white">{selectedTemplate.estimatedTime}</span>
                          </div>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-zinc-500">Budget Range</span>
                          <span className="text-white">{selectedTemplate.budget}</span>
                        </div>
                      </>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="border-t border-zinc-800 px-6 py-4">
        <div className="flex items-center justify-between max-w-4xl mx-auto">
          <Button
            variant="ghost"
            onClick={handleBack}
            disabled={step === 1}
            className="text-zinc-400"
          >
            <ArrowLeft className="size-4 mr-2" />
            Back
          </Button>
          <div className="flex items-center gap-2">
            {step < 4 ? (
              <Button
                onClick={handleNext}
                disabled={!canProceed()}
                className="bg-violet-600 hover:bg-violet-700"
              >
                Continue
                <ArrowRight className="size-4 ml-2" />
              </Button>
            ) : (
              <Button
                onClick={handleCreate}
                className="bg-violet-600 hover:bg-violet-700"
              >
                <Sparkles className="size-4 mr-2" />
                Create Project
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
