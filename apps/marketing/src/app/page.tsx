import Link from 'next/link'
import { ArrowRight, Film, Sparkles, Zap, Users, Play } from 'lucide-react'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-950 via-gray-900 to-black text-white">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 border-b border-white/10 bg-gray-950/80 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Film className="w-8 h-8 text-violet-500" />
            <span className="text-xl font-bold">Nova Studio</span>
          </div>
          <div className="hidden md:flex items-center gap-8">
            <Link href="#features" className="text-gray-400 hover:text-white transition">Features</Link>
            <Link href="#pricing" className="text-gray-400 hover:text-white transition">Pricing</Link>
            <Link href="#about" className="text-gray-400 hover:text-white transition">About</Link>
          </div>
          <div className="flex items-center gap-4">
            <Link 
              href="https://app.novastudio.com" 
              className="text-gray-400 hover:text-white transition"
            >
              Sign In
            </Link>
            <Link 
              href="https://app.novastudio.com" 
              className="bg-violet-600 hover:bg-violet-500 px-4 py-2 rounded-lg font-medium transition"
            >
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-6">
        <div className="max-w-7xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-violet-500/10 border border-violet-500/20 rounded-full px-4 py-2 mb-8">
            <Sparkles className="w-4 h-4 text-violet-400" />
            <span className="text-sm text-violet-300">AI-Powered Film Production</span>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
            From Script to Screen,<br />
            <span className="bg-gradient-to-r from-violet-400 to-pink-400 bg-clip-text text-transparent">
              Powered by AI
            </span>
          </h1>
          
          <p className="text-xl text-gray-400 mb-10 max-w-2xl mx-auto">
            Nova Studio brings together AI agents for writing, cinematography, production design, 
            and post-production — all working in harmony to bring your vision to life.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link 
              href="https://app.novastudio.com" 
              className="flex items-center gap-2 bg-violet-600 hover:bg-violet-500 px-8 py-4 rounded-xl font-semibold text-lg transition"
            >
              Start Creating <ArrowRight className="w-5 h-5" />
            </Link>
            <button className="flex items-center gap-2 border border-white/20 hover:border-white/40 px-8 py-4 rounded-xl font-semibold text-lg transition">
              <Play className="w-5 h-5" /> Watch Demo
            </button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Everything You Need to Create</h2>
            <p className="text-gray-400 text-lg">AI agents specialized for every stage of production</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: <Sparkles className="w-8 h-8" />,
                title: "AI Writing Assistant",
                description: "Generate scripts, dialogue, and story outlines with our advanced writing AI. From concept to final draft."
              },
              {
                icon: <Film className="w-8 h-8" />,
                title: "Virtual Cinematography",
                description: "AI-powered shot planning, storyboarding, and visual composition tools for perfect framing."
              },
              {
                icon: <Zap className="w-8 h-8" />,
                title: "Automated Post-Production",
                description: "Color grading, audio mixing, and VFX suggestions powered by machine learning."
              },
              {
                icon: <Users className="w-8 h-8" />,
                title: "Production Management",
                description: "Intelligent scheduling, budgeting, and resource allocation for your entire production."
              },
              {
                icon: <Play className="w-8 h-8" />,
                title: "Video Generation",
                description: "Transform concepts into video content with Veo 2, Runway, and other cutting-edge AI tools."
              },
              {
                icon: <Sparkles className="w-8 h-8" />,
                title: "Voice & Audio AI",
                description: "Generate voiceovers, sound effects, and music scores with ElevenLabs and audio AI."
              }
            ].map((feature, i) => (
              <div key={i} className="bg-white/5 border border-white/10 rounded-2xl p-8 hover:border-violet-500/50 transition">
                <div className="w-14 h-14 bg-violet-500/20 rounded-xl flex items-center justify-center text-violet-400 mb-6">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                <p className="text-gray-400">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto text-center bg-gradient-to-r from-violet-600/20 to-pink-600/20 border border-violet-500/20 rounded-3xl p-12">
          <h2 className="text-4xl font-bold mb-4">Ready to Transform Your Production?</h2>
          <p className="text-gray-400 text-lg mb-8">
            Join creators who are already using AI to bring their stories to life.
          </p>
          <Link 
            href="https://app.novastudio.com" 
            className="inline-flex items-center gap-2 bg-white text-gray-900 hover:bg-gray-100 px-8 py-4 rounded-xl font-semibold text-lg transition"
          >
            Get Started Free <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10 py-12 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            <Film className="w-6 h-6 text-violet-500" />
            <span className="font-semibold">Nova Studio</span>
          </div>
          <div className="flex items-center gap-8 text-sm text-gray-400">
            <Link href="/privacy" className="hover:text-white transition">Privacy</Link>
            <Link href="/terms" className="hover:text-white transition">Terms</Link>
            <Link href="/contact" className="hover:text-white transition">Contact</Link>
          </div>
          <p className="text-sm text-gray-500">© 2026 Nova Studio. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}
