import { useState } from 'react'
import {
  Plus,
  Search,
  MoreVertical,
  Mail,
  Shield,
  Clock,
  CheckCircle2,
  XCircle,
  UserPlus,
  Users,
  Crown,
  Clapperboard,
  Layers,
  Gamepad2,
  Music,
  PenTool
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

// Mock team data
const teamMembers = [
  {
    id: 1,
    name: 'Wilfred Kiumi',
    email: 'wilfred@novastudio.com',
    avatar: '/avatars/wilfred.jpg',
    role: 'Owner',
    department: 'Production',
    status: 'active',
    specialties: ['film', 'animation'],
    projects: 4,
    joinedAt: 'Jan 2024',
  },
  {
    id: 2,
    name: 'Sarah Chen',
    email: 'sarah@novastudio.com',
    avatar: '/avatars/sarah.jpg',
    role: 'Admin',
    department: 'Design',
    status: 'active',
    specialties: ['design', 'animation'],
    projects: 3,
    joinedAt: 'Feb 2024',
  },
  {
    id: 3,
    name: 'Marcus Johnson',
    email: 'marcus@novastudio.com',
    avatar: '/avatars/marcus.jpg',
    role: 'Editor',
    department: 'Post-Production',
    status: 'active',
    specialties: ['film', 'music'],
    projects: 5,
    joinedAt: 'Mar 2024',
  },
  {
    id: 4,
    name: 'Emma Wilson',
    email: 'emma@novastudio.com',
    avatar: '/avatars/emma.jpg',
    role: 'Member',
    department: 'Development',
    status: 'active',
    specialties: ['games'],
    projects: 2,
    joinedAt: 'Apr 2024',
  },
  {
    id: 5,
    name: 'David Park',
    email: 'david@novastudio.com',
    avatar: '/avatars/david.jpg',
    role: 'Member',
    department: 'Audio',
    status: 'away',
    specialties: ['music', 'film'],
    projects: 3,
    joinedAt: 'Mar 2024',
  },
]

const pendingInvites = [
  {
    id: 1,
    email: 'alex@example.com',
    role: 'Member',
    sentAt: '2 days ago',
    expiresAt: '5 days left',
  },
  {
    id: 2,
    email: 'jordan@example.com',
    role: 'Editor',
    sentAt: '1 week ago',
    expiresAt: 'Expired',
  },
]

const specialtyIcons: Record<string, typeof Clapperboard> = {
  film: Clapperboard,
  animation: Layers,
  games: Gamepad2,
  music: Music,
  design: PenTool,
}

const roleColors: Record<string, string> = {
  Owner: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
  Admin: 'bg-violet-500/20 text-violet-400 border-violet-500/30',
  Editor: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
  Member: 'bg-zinc-500/20 text-zinc-400 border-zinc-500/30',
}

const statusColors: Record<string, string> = {
  active: 'bg-green-500',
  away: 'bg-yellow-500',
  offline: 'bg-zinc-500',
}

export default function Team() {
  const [searchQuery, setSearchQuery] = useState('')

  const filteredMembers = teamMembers.filter(member =>
    member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    member.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    member.department.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-zinc-800 px-6 py-4">
        <div>
          <h1 className="text-xl font-semibold">Team</h1>
          <p className="text-sm text-zinc-400">Manage your team members and permissions</p>
        </div>
        <Button className="bg-violet-600 hover:bg-violet-700">
          <UserPlus className="size-4 mr-2" />
          Invite Member
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4 px-6 py-4 border-b border-zinc-800">
        <Card className="bg-zinc-900 border-zinc-800">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-zinc-400">Total Members</p>
                <p className="text-2xl font-semibold">{teamMembers.length}</p>
              </div>
              <div className="size-10 rounded-lg bg-violet-600/20 flex items-center justify-center">
                <Users className="size-5 text-violet-400" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-zinc-900 border-zinc-800">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-zinc-400">Active Now</p>
                <p className="text-2xl font-semibold">{teamMembers.filter(m => m.status === 'active').length}</p>
              </div>
              <div className="size-10 rounded-lg bg-green-600/20 flex items-center justify-center">
                <CheckCircle2 className="size-5 text-green-400" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-zinc-900 border-zinc-800">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-zinc-400">Pending Invites</p>
                <p className="text-2xl font-semibold">{pendingInvites.length}</p>
              </div>
              <div className="size-10 rounded-lg bg-amber-600/20 flex items-center justify-center">
                <Mail className="size-5 text-amber-400" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-zinc-900 border-zinc-800">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-zinc-400">Admins</p>
                <p className="text-2xl font-semibold">{teamMembers.filter(m => m.role === 'Admin' || m.role === 'Owner').length}</p>
              </div>
              <div className="size-10 rounded-lg bg-cyan-600/20 flex items-center justify-center">
                <Shield className="size-5 text-cyan-400" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <div className="px-6 py-4 border-b border-zinc-800">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-zinc-500" />
          <input
            type="text"
            placeholder="Search team members..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-zinc-800 border border-zinc-700 rounded-lg pl-10 pr-4 py-2 text-sm text-white placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-violet-600"
          />
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Team Members */}
          <div className="lg:col-span-2 space-y-4">
            <h2 className="text-sm font-medium text-zinc-400">Team Members</h2>
            <div className="space-y-2">
              {filteredMembers.map((member) => (
                <Card key={member.id} className="bg-zinc-900 border-zinc-800">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-4">
                      <div className="relative">
                        <Avatar className="size-12">
                          <AvatarImage src={member.avatar} />
                          <AvatarFallback className="bg-violet-600">
                            {member.name.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        <div className={`absolute bottom-0 right-0 size-3 rounded-full border-2 border-zinc-900 ${statusColors[member.status]}`} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <h3 className="font-medium text-white">{member.name}</h3>
                          {member.role === 'Owner' && <Crown className="size-4 text-amber-400" />}
                          <Badge variant="outline" className={`text-xs ${roleColors[member.role]}`}>
                            {member.role}
                          </Badge>
                        </div>
                        <p className="text-sm text-zinc-500">{member.email}</p>
                        <div className="flex items-center gap-3 mt-2">
                          <span className="text-xs text-zinc-500">{member.department}</span>
                          <span className="text-zinc-700">•</span>
                          <span className="text-xs text-zinc-500">{member.projects} projects</span>
                          <span className="text-zinc-700">•</span>
                          <span className="text-xs text-zinc-500">Joined {member.joinedAt}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {member.specialties.map(specialty => {
                          const Icon = specialtyIcons[specialty]
                          return Icon ? (
                            <div 
                              key={specialty}
                              className="size-8 rounded-lg bg-zinc-800 flex items-center justify-center"
                              title={specialty}
                            >
                              <Icon className="size-4 text-zinc-400" />
                            </div>
                          ) : null
                        })}
                      </div>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <button className="p-2 rounded-lg text-zinc-400 hover:bg-zinc-800">
                            <MoreVertical className="size-4" />
                          </button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="bg-zinc-900 border-zinc-800">
                          <DropdownMenuItem className="text-zinc-300 focus:bg-zinc-800">View Profile</DropdownMenuItem>
                          <DropdownMenuItem className="text-zinc-300 focus:bg-zinc-800">Edit Role</DropdownMenuItem>
                          <DropdownMenuItem className="text-zinc-300 focus:bg-zinc-800">View Activity</DropdownMenuItem>
                          <DropdownMenuSeparator className="bg-zinc-800" />
                          <DropdownMenuItem className="text-red-400 focus:bg-zinc-800">Remove from Team</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Pending Invites */}
          <div className="space-y-4">
            <h2 className="text-sm font-medium text-zinc-400">Pending Invites</h2>
            <Card className="bg-zinc-900 border-zinc-800">
              <CardContent className="p-4 space-y-4">
                {pendingInvites.length === 0 ? (
                  <div className="text-center py-6">
                    <Mail className="size-10 text-zinc-600 mx-auto mb-2" />
                    <p className="text-sm text-zinc-500">No pending invitations</p>
                  </div>
                ) : (
                  pendingInvites.map((invite) => (
                    <div key={invite.id} className="flex items-center justify-between p-3 rounded-lg bg-zinc-800/50">
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-white truncate">{invite.email}</p>
                        <div className="flex items-center gap-2 text-xs text-zinc-500">
                          <span>{invite.role}</span>
                          <span>•</span>
                          <span>Sent {invite.sentAt}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {invite.expiresAt === 'Expired' ? (
                          <Badge variant="secondary" className="bg-red-500/20 text-red-400">Expired</Badge>
                        ) : (
                          <Badge variant="secondary" className="bg-zinc-700 text-zinc-300">{invite.expiresAt}</Badge>
                        )}
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <button className="p-1.5 rounded text-zinc-400 hover:bg-zinc-700">
                              <MoreVertical className="size-4" />
                            </button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="bg-zinc-900 border-zinc-800">
                            <DropdownMenuItem className="text-zinc-300 focus:bg-zinc-800">Resend Invite</DropdownMenuItem>
                            <DropdownMenuItem className="text-zinc-300 focus:bg-zinc-800">Copy Link</DropdownMenuItem>
                            <DropdownMenuSeparator className="bg-zinc-800" />
                            <DropdownMenuItem className="text-red-400 focus:bg-zinc-800">Cancel Invite</DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>
                  ))
                )}
                <Button variant="outline" className="w-full border-zinc-700 text-zinc-400 hover:text-white">
                  <Plus className="size-4 mr-2" />
                  Send New Invite
                </Button>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card className="bg-zinc-900 border-zinc-800">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm text-zinc-400">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <button className="w-full flex items-center gap-3 p-3 rounded-lg text-left text-sm text-zinc-300 hover:bg-zinc-800 transition-colors">
                  <Shield className="size-4 text-violet-400" />
                  Manage Permissions
                </button>
                <button className="w-full flex items-center gap-3 p-3 rounded-lg text-left text-sm text-zinc-300 hover:bg-zinc-800 transition-colors">
                  <Users className="size-4 text-blue-400" />
                  Create Team Group
                </button>
                <button className="w-full flex items-center gap-3 p-3 rounded-lg text-left text-sm text-zinc-300 hover:bg-zinc-800 transition-colors">
                  <Mail className="size-4 text-green-400" />
                  Bulk Invite
                </button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
