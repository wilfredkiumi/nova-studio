import { useState } from 'react'
import {
  User,
  Bell,
  Palette,
  Shield,
  CreditCard,
  Keyboard,
  Zap,
  ChevronRight,
  Moon,
  Sun,
  Monitor,
  Volume2,
  Mail,
  Smartphone,
  Globe,
  Languages,
  HardDrive,
  Sparkles
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Switch } from '@/components/ui/switch'

const settingsCategories = [
  { id: 'profile', label: 'Profile', icon: User },
  { id: 'notifications', label: 'Notifications', icon: Bell },
  { id: 'appearance', label: 'Appearance', icon: Palette },
  { id: 'ai', label: 'AI Settings', icon: Sparkles },
  { id: 'security', label: 'Security', icon: Shield },
  { id: 'billing', label: 'Billing', icon: CreditCard },
  { id: 'shortcuts', label: 'Keyboard Shortcuts', icon: Keyboard },
  { id: 'integrations', label: 'Integrations', icon: Zap },
]

export default function Settings() {
  const [activeCategory, setActiveCategory] = useState('profile')
  const [settings, setSettings] = useState({
    // Notifications
    emailNotifications: true,
    pushNotifications: false,
    projectUpdates: true,
    teamActivity: true,
    marketingEmails: false,
    // Appearance
    theme: 'dark',
    reducedMotion: false,
    highContrast: false,
    // AI
    aiSuggestions: true,
    autoEnhance: true,
    learningMode: true,
    dataCollection: false,
    // Security
    twoFactor: false,
    sessionTimeout: '30',
  })

  const handleToggle = (key: string) => {
    setSettings(prev => ({ ...prev, [key]: !prev[key as keyof typeof prev] }))
  }

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="border-b border-zinc-800 px-6 py-4">
        <h1 className="text-xl font-semibold">Settings</h1>
        <p className="text-sm text-zinc-400">Manage your account and preferences</p>
      </div>

      {/* Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar */}
        <div className="w-64 border-r border-zinc-800 p-4 overflow-y-auto">
          <nav className="space-y-1">
            {settingsCategories.map((category) => {
              const Icon = category.icon
              const isActive = activeCategory === category.id
              return (
                <button
                  key={category.id}
                  onClick={() => setActiveCategory(category.id)}
                  className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${
                    isActive 
                      ? 'bg-violet-600/20 text-violet-400' 
                      : 'text-zinc-400 hover:bg-zinc-800 hover:text-white'
                  }`}
                >
                  <Icon className="size-4" />
                  {category.label}
                </button>
              )
            })}
          </nav>
        </div>

        {/* Main Content */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="max-w-2xl">
            {/* Profile Settings */}
            {activeCategory === 'profile' && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-lg font-semibold mb-1">Profile Settings</h2>
                  <p className="text-sm text-zinc-400">Manage your personal information</p>
                </div>

                <Card className="bg-zinc-900 border-zinc-800">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-4 mb-6">
                      <div className="size-20 rounded-full bg-violet-600 flex items-center justify-center text-2xl font-semibold">
                        WK
                      </div>
                      <div>
                        <Button variant="outline" className="border-zinc-700 text-zinc-300 mb-2">
                          Change Avatar
                        </Button>
                        <p className="text-xs text-zinc-500">JPG, PNG or GIF. Max 2MB</p>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-zinc-300 mb-2">First Name</label>
                          <input
                            type="text"
                            defaultValue="Wilfred"
                            className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-violet-600"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-zinc-300 mb-2">Last Name</label>
                          <input
                            type="text"
                            defaultValue="Kiumi"
                            className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-violet-600"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-zinc-300 mb-2">Email</label>
                        <input
                          type="email"
                          defaultValue="wilfred@novastudio.com"
                          className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-violet-600"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-zinc-300 mb-2">Bio</label>
                        <textarea
                          rows={3}
                          defaultValue="Creative producer and filmmaker"
                          className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-violet-600 resize-none"
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Button className="bg-violet-600 hover:bg-violet-700">Save Changes</Button>
              </div>
            )}

            {/* Notifications Settings */}
            {activeCategory === 'notifications' && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-lg font-semibold mb-1">Notification Preferences</h2>
                  <p className="text-sm text-zinc-400">Choose how you want to be notified</p>
                </div>

                <Card className="bg-zinc-900 border-zinc-800">
                  <CardHeader>
                    <CardTitle className="text-base">Email Notifications</CardTitle>
                    <CardDescription>Manage email notification settings</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Mail className="size-5 text-zinc-400" />
                        <div>
                          <p className="text-sm font-medium text-white">Email Notifications</p>
                          <p className="text-xs text-zinc-500">Receive updates via email</p>
                        </div>
                      </div>
                      <Switch 
                        checked={settings.emailNotifications}
                        onCheckedChange={() => handleToggle('emailNotifications')}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Smartphone className="size-5 text-zinc-400" />
                        <div>
                          <p className="text-sm font-medium text-white">Push Notifications</p>
                          <p className="text-xs text-zinc-500">Receive push notifications on your device</p>
                        </div>
                      </div>
                      <Switch 
                        checked={settings.pushNotifications}
                        onCheckedChange={() => handleToggle('pushNotifications')}
                      />
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-zinc-900 border-zinc-800">
                  <CardHeader>
                    <CardTitle className="text-base">Activity Alerts</CardTitle>
                    <CardDescription>Stay informed about project and team activity</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-white">Project Updates</p>
                        <p className="text-xs text-zinc-500">When projects you're on are updated</p>
                      </div>
                      <Switch 
                        checked={settings.projectUpdates}
                        onCheckedChange={() => handleToggle('projectUpdates')}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-white">Team Activity</p>
                        <p className="text-xs text-zinc-500">When team members take actions</p>
                      </div>
                      <Switch 
                        checked={settings.teamActivity}
                        onCheckedChange={() => handleToggle('teamActivity')}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-white">Marketing Emails</p>
                        <p className="text-xs text-zinc-500">Product updates and tips</p>
                      </div>
                      <Switch 
                        checked={settings.marketingEmails}
                        onCheckedChange={() => handleToggle('marketingEmails')}
                      />
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Appearance Settings */}
            {activeCategory === 'appearance' && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-lg font-semibold mb-1">Appearance</h2>
                  <p className="text-sm text-zinc-400">Customize how Nova Studio looks</p>
                </div>

                <Card className="bg-zinc-900 border-zinc-800">
                  <CardHeader>
                    <CardTitle className="text-base">Theme</CardTitle>
                    <CardDescription>Select your preferred color theme</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-3 gap-3">
                      {[
                        { id: 'light', label: 'Light', icon: Sun },
                        { id: 'dark', label: 'Dark', icon: Moon },
                        { id: 'system', label: 'System', icon: Monitor },
                      ].map((theme) => {
                        const Icon = theme.icon
                        return (
                          <button
                            key={theme.id}
                            onClick={() => setSettings(prev => ({ ...prev, theme: theme.id }))}
                            className={`flex flex-col items-center gap-2 p-4 rounded-lg border transition-colors ${
                              settings.theme === theme.id
                                ? 'border-violet-600 bg-violet-600/10'
                                : 'border-zinc-700 bg-zinc-800 hover:border-zinc-600'
                            }`}
                          >
                            <Icon className="size-6 text-zinc-400" />
                            <span className="text-sm text-white">{theme.label}</span>
                          </button>
                        )
                      })}
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-zinc-900 border-zinc-800">
                  <CardHeader>
                    <CardTitle className="text-base">Accessibility</CardTitle>
                    <CardDescription>Adjust visual settings for better accessibility</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-white">Reduced Motion</p>
                        <p className="text-xs text-zinc-500">Minimize animations</p>
                      </div>
                      <Switch 
                        checked={settings.reducedMotion}
                        onCheckedChange={() => handleToggle('reducedMotion')}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-white">High Contrast</p>
                        <p className="text-xs text-zinc-500">Increase color contrast</p>
                      </div>
                      <Switch 
                        checked={settings.highContrast}
                        onCheckedChange={() => handleToggle('highContrast')}
                      />
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* AI Settings */}
            {activeCategory === 'ai' && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-lg font-semibold mb-1">AI Settings</h2>
                  <p className="text-sm text-zinc-400">Configure AI behavior and privacy</p>
                </div>

                <Card className="bg-zinc-900 border-zinc-800">
                  <CardHeader>
                    <CardTitle className="text-base">AI Features</CardTitle>
                    <CardDescription>Control how AI assists your work</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Sparkles className="size-5 text-violet-400" />
                        <div>
                          <p className="text-sm font-medium text-white">AI Suggestions</p>
                          <p className="text-xs text-zinc-500">Get intelligent suggestions while working</p>
                        </div>
                      </div>
                      <Switch 
                        checked={settings.aiSuggestions}
                        onCheckedChange={() => handleToggle('aiSuggestions')}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Zap className="size-5 text-amber-400" />
                        <div>
                          <p className="text-sm font-medium text-white">Auto Enhancement</p>
                          <p className="text-xs text-zinc-500">Automatically improve content quality</p>
                        </div>
                      </div>
                      <Switch 
                        checked={settings.autoEnhance}
                        onCheckedChange={() => handleToggle('autoEnhance')}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Globe className="size-5 text-blue-400" />
                        <div>
                          <p className="text-sm font-medium text-white">Learning Mode</p>
                          <p className="text-xs text-zinc-500">AI learns from your style and preferences</p>
                        </div>
                      </div>
                      <Switch 
                        checked={settings.learningMode}
                        onCheckedChange={() => handleToggle('learningMode')}
                      />
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-zinc-900 border-zinc-800">
                  <CardHeader>
                    <CardTitle className="text-base">Data & Privacy</CardTitle>
                    <CardDescription>Control how your data is used</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <HardDrive className="size-5 text-zinc-400" />
                        <div>
                          <p className="text-sm font-medium text-white">Data Collection</p>
                          <p className="text-xs text-zinc-500">Allow anonymous usage data collection</p>
                        </div>
                      </div>
                      <Switch 
                        checked={settings.dataCollection}
                        onCheckedChange={() => handleToggle('dataCollection')}
                      />
                    </div>
                    <Button variant="outline" className="w-full border-zinc-700 text-zinc-300">
                      Download My Data
                    </Button>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Other categories would follow similar patterns */}
            {activeCategory === 'security' && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-lg font-semibold mb-1">Security</h2>
                  <p className="text-sm text-zinc-400">Protect your account</p>
                </div>
                <Card className="bg-zinc-900 border-zinc-800">
                  <CardContent className="p-6 space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-white">Two-Factor Authentication</p>
                        <p className="text-xs text-zinc-500">Add an extra layer of security</p>
                      </div>
                      <Switch 
                        checked={settings.twoFactor}
                        onCheckedChange={() => handleToggle('twoFactor')}
                      />
                    </div>
                    <Button variant="outline" className="w-full border-zinc-700 text-zinc-300">
                      Change Password
                    </Button>
                    <Button variant="outline" className="w-full border-zinc-700 text-zinc-300">
                      Manage Sessions
                    </Button>
                  </CardContent>
                </Card>
              </div>
            )}

            {(activeCategory === 'billing' || activeCategory === 'shortcuts' || activeCategory === 'integrations') && (
              <div className="flex flex-col items-center justify-center h-64 text-center">
                <div className="size-16 rounded-full bg-zinc-800 flex items-center justify-center mb-4">
                  {activeCategory === 'billing' && <CreditCard className="size-8 text-zinc-500" />}
                  {activeCategory === 'shortcuts' && <Keyboard className="size-8 text-zinc-500" />}
                  {activeCategory === 'integrations' && <Zap className="size-8 text-zinc-500" />}
                </div>
                <h3 className="text-lg font-medium text-zinc-300 mb-1">Coming Soon</h3>
                <p className="text-sm text-zinc-500">This section is under development</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
