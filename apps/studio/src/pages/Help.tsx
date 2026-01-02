import { useState } from 'react'
import {
  Search,
  Book,
  Video,
  MessageCircle,
  Mail,
  ExternalLink,
  ChevronRight,
  Sparkles,
  FileText,
  HelpCircle,
  Lightbulb,
  Rocket,
  Keyboard,
  Users,
  Zap
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

const helpCategories = [
  {
    id: 'getting-started',
    title: 'Getting Started',
    description: 'Learn the basics of Nova Studio',
    icon: Rocket,
    color: 'violet',
    articles: [
      'Creating your first project',
      'Understanding the dashboard',
      'Inviting team members',
      'Setting up AI features',
    ]
  },
  {
    id: 'ai-tools',
    title: 'AI Tools',
    description: 'Master our AI-powered features',
    icon: Sparkles,
    color: 'amber',
    articles: [
      'Introduction to AI Director',
      'Using content generation',
      'Customizing AI behavior',
      'Best practices for AI prompts',
    ]
  },
  {
    id: 'projects',
    title: 'Projects & Workflows',
    description: 'Manage your creative projects',
    icon: FileText,
    color: 'blue',
    articles: [
      'Project organization tips',
      'Using templates effectively',
      'Version control basics',
      'Exporting your work',
    ]
  },
  {
    id: 'collaboration',
    title: 'Team Collaboration',
    description: 'Work together seamlessly',
    icon: Users,
    color: 'green',
    articles: [
      'Sharing projects with team',
      'Managing permissions',
      'Real-time collaboration',
      'Review and feedback workflows',
    ]
  },
  {
    id: 'keyboard',
    title: 'Keyboard Shortcuts',
    description: 'Work faster with shortcuts',
    icon: Keyboard,
    color: 'cyan',
    articles: [
      'Essential shortcuts',
      'Navigation shortcuts',
      'Editing shortcuts',
      'Custom keybindings',
    ]
  },
  {
    id: 'integrations',
    title: 'Integrations',
    description: 'Connect with other tools',
    icon: Zap,
    color: 'pink',
    articles: [
      'Available integrations',
      'Setting up connections',
      'API documentation',
      'Webhooks guide',
    ]
  },
]

const faqItems = [
  {
    question: 'How does AI content generation work?',
    answer: 'Our AI analyzes your project context and creative direction to generate relevant content. You can fine-tune the output by providing more specific prompts or adjusting the AI settings.',
  },
  {
    question: 'Can I collaborate with team members in real-time?',
    answer: 'Yes! Nova Studio supports real-time collaboration. Multiple team members can work on the same project simultaneously, with changes syncing instantly.',
  },
  {
    question: 'What file formats can I export?',
    answer: 'Export options vary by project type. Film projects support MP4, MOV, and ProRes. Design projects support PNG, SVG, PDF, and more. Check the export panel for all available options.',
  },
  {
    question: 'How do I upgrade my plan?',
    answer: 'Go to Settings > Billing to view available plans and upgrade. Your new features will be available immediately after payment is processed.',
  },
]

export default function Help() {
  const [searchQuery, setSearchQuery] = useState('')
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null)

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="border-b border-zinc-800 px-6 py-4">
        <h1 className="text-xl font-semibold">Help & Support</h1>
        <p className="text-sm text-zinc-400">Find answers and get help with Nova Studio</p>
      </div>

      {/* Search */}
      <div className="border-b border-zinc-800 px-6 py-6 bg-gradient-to-b from-violet-600/10 to-transparent">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-2xl font-semibold mb-2">How can we help?</h2>
          <p className="text-zinc-400 mb-4">Search our knowledge base or browse categories below</p>
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 size-5 text-zinc-500" />
            <input
              type="text"
              placeholder="Search for help..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-zinc-800 border border-zinc-700 rounded-xl pl-12 pr-4 py-3 text-white placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-violet-600"
            />
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-6">
        <div className="max-w-5xl mx-auto">
          {/* Quick Actions */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <Card className="bg-zinc-900 border-zinc-800 hover:border-zinc-700 cursor-pointer transition-colors">
              <CardContent className="p-4 flex items-center gap-4">
                <div className="size-12 rounded-lg bg-violet-600/20 flex items-center justify-center">
                  <MessageCircle className="size-6 text-violet-400" />
                </div>
                <div>
                  <h3 className="font-medium text-white">Live Chat</h3>
                  <p className="text-sm text-zinc-400">Talk to our team</p>
                </div>
              </CardContent>
            </Card>
            <Card className="bg-zinc-900 border-zinc-800 hover:border-zinc-700 cursor-pointer transition-colors">
              <CardContent className="p-4 flex items-center gap-4">
                <div className="size-12 rounded-lg bg-blue-600/20 flex items-center justify-center">
                  <Video className="size-6 text-blue-400" />
                </div>
                <div>
                  <h3 className="font-medium text-white">Video Tutorials</h3>
                  <p className="text-sm text-zinc-400">Learn visually</p>
                </div>
              </CardContent>
            </Card>
            <Card className="bg-zinc-900 border-zinc-800 hover:border-zinc-700 cursor-pointer transition-colors">
              <CardContent className="p-4 flex items-center gap-4">
                <div className="size-12 rounded-lg bg-green-600/20 flex items-center justify-center">
                  <Mail className="size-6 text-green-400" />
                </div>
                <div>
                  <h3 className="font-medium text-white">Email Support</h3>
                  <p className="text-sm text-zinc-400">Get help via email</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Help Categories */}
          <div className="mb-8">
            <h2 className="text-lg font-semibold mb-4">Browse by Topic</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {helpCategories.map((category) => {
                const Icon = category.icon
                return (
                  <Card key={category.id} className="bg-zinc-900 border-zinc-800 hover:border-zinc-700 cursor-pointer transition-colors">
                    <CardContent className="p-4">
                      <div className={`size-10 rounded-lg bg-${category.color}-600/20 flex items-center justify-center mb-3`}>
                        <Icon className={`size-5 text-${category.color}-400`} />
                      </div>
                      <h3 className="font-medium text-white mb-1">{category.title}</h3>
                      <p className="text-sm text-zinc-400 mb-3">{category.description}</p>
                      <ul className="space-y-1">
                        {category.articles.slice(0, 3).map((article) => (
                          <li key={article}>
                            <a href="#" className="flex items-center gap-2 text-sm text-zinc-500 hover:text-violet-400 transition-colors">
                              <ChevronRight className="size-3" />
                              {article}
                            </a>
                          </li>
                        ))}
                      </ul>
                      <a href="#" className="flex items-center gap-1 text-sm text-violet-400 mt-3 hover:text-violet-300">
                        View all articles
                        <ExternalLink className="size-3" />
                      </a>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </div>

          {/* FAQ */}
          <div className="mb-8">
            <h2 className="text-lg font-semibold mb-4">Frequently Asked Questions</h2>
            <Card className="bg-zinc-900 border-zinc-800">
              <CardContent className="p-0 divide-y divide-zinc-800">
                {faqItems.map((item, index) => (
                  <div key={index}>
                    <button
                      onClick={() => setExpandedFaq(expandedFaq === index ? null : index)}
                      className="w-full flex items-center justify-between p-4 text-left hover:bg-zinc-800/50 transition-colors"
                    >
                      <span className="font-medium text-white">{item.question}</span>
                      <ChevronRight className={`size-5 text-zinc-400 transition-transform ${
                        expandedFaq === index ? 'rotate-90' : ''
                      }`} />
                    </button>
                    {expandedFaq === index && (
                      <div className="px-4 pb-4">
                        <p className="text-sm text-zinc-400">{item.answer}</p>
                      </div>
                    )}
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Contact */}
          <Card className="bg-gradient-to-br from-violet-600/20 to-fuchsia-600/20 border-zinc-800">
            <CardContent className="p-6 text-center">
              <div className="size-14 rounded-full bg-violet-600/20 flex items-center justify-center mx-auto mb-4">
                <Lightbulb className="size-7 text-violet-400" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Can't find what you're looking for?</h3>
              <p className="text-sm text-zinc-400 mb-4">
                Our support team is here to help. Reach out and we'll get back to you within 24 hours.
              </p>
              <div className="flex items-center justify-center gap-3">
                <Button className="bg-violet-600 hover:bg-violet-700">
                  <MessageCircle className="size-4 mr-2" />
                  Contact Support
                </Button>
                <Button variant="outline" className="border-zinc-700 text-zinc-300">
                  <Book className="size-4 mr-2" />
                  View Documentation
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
