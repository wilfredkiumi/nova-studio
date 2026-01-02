// src/components/film-production/studio/ReviewScreen.tsx
// Dailies Review Screen - Producer reviews deliverables from crew
// Film Industry Language: "Dailies", "Screening Room", "Notes", "Approved Take"

import React, { useState } from 'react';
import {
  Eye,
  CheckCircle,
  XCircle,
  RotateCcw,
  MessageSquare,
  Play,
  Pause,
  Volume2,
  Maximize,
  ChevronLeft,
  ChevronRight,
  Download,
  Clock,
  User,
  Star,
  Flag,
  Send,
} from 'lucide-react';

interface Deliverable {
  id: string;
  name: string;
  type: 'script' | 'storyboard' | 'footage' | 'audio' | 'design';
  department: string;
  creator: string;
  version: string;
  timestamp: Date;
  duration?: string;
  notes?: string;
  status: 'pending' | 'approved' | 'revision';
}

interface ReviewScreenProps {
  deliverable: Deliverable;
  onClose: () => void;
  onApprove: () => void;
  onRequestRevision: (notes: string) => void;
  onReject: (notes: string) => void;
}

export function ReviewScreen({
  deliverable,
  onClose,
  onApprove,
  onRequestRevision,
  onReject,
}: ReviewScreenProps) {
  const [notes, setNotes] = useState('');
  const [isPlaying, setIsPlaying] = useState(false);
  const [activeTab, setActiveTab] = useState<'preview' | 'details' | 'history'>('preview');

  return (
    <div className="fixed inset-0 bg-black/95 z-50 flex">
      {/* Left: Preview Area */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="flex items-center justify-between px-6 py-4 border-b border-white/5">
          <div className="flex items-center gap-4">
            <button 
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-white/5 transition-colors"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <div>
              <h2 className="font-semibold text-lg">{deliverable.name}</h2>
              <p className="text-sm text-white/50">{deliverable.department} • {deliverable.version}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <button className="p-2 rounded-lg hover:bg-white/5 transition-colors text-white/60">
              <Download className="h-5 w-5" />
            </button>
            <button className="p-2 rounded-lg hover:bg-white/5 transition-colors text-white/60">
              <Maximize className="h-5 w-5" />
            </button>
          </div>
        </header>

        {/* Preview Content */}
        <div className="flex-1 flex items-center justify-center p-8">
          <div className="w-full max-w-4xl aspect-video bg-gradient-to-br from-white/5 to-white/[0.02] rounded-2xl border border-white/10 relative overflow-hidden">
            {/* Placeholder preview */}
            <div className="absolute inset-0 flex items-center justify-center">
              {deliverable.type === 'script' ? (
                <div className="max-w-2xl p-8 font-mono text-sm text-white/80 leading-relaxed">
                  <p className="text-center mb-8 uppercase tracking-wider text-white/40">Scene 12 - INT. APARTMENT - NIGHT</p>
                  <p className="mb-4">SARAH sits at her desk, the glow of multiple monitors casting harsh shadows across her face. Her fingers hover over the keyboard.</p>
                  <p className="mb-4 ml-8">SARAH<br/>(whispered)<br/>One last puzzle...</p>
                  <p>She begins to type. Numbers cascade across the screen. Something CLICKS into place.</p>
                </div>
              ) : deliverable.type === 'storyboard' ? (
                <div className="grid grid-cols-3 gap-4 p-8">
                  {[1, 2, 3, 4, 5, 6].map(i => (
                    <div key={i} className="aspect-video bg-white/5 rounded-lg border border-white/10 flex items-center justify-center">
                      <span className="text-white/20 text-xs">Frame {i}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center">
                  <Play className="h-16 w-16 text-white/20 mx-auto mb-4" />
                  <p className="text-white/40">Preview not available</p>
                </div>
              )}
            </div>

            {/* Video Controls (if applicable) */}
            {(deliverable.type === 'footage' || deliverable.type === 'audio') && (
              <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent">
                <div className="flex items-center gap-4">
                  <button 
                    onClick={() => setIsPlaying(!isPlaying)}
                    className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
                  >
                    {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
                  </button>
                  <div className="flex-1 h-1 bg-white/20 rounded-full">
                    <div className="w-1/3 h-full bg-[#d4af37] rounded-full" />
                  </div>
                  <span className="text-sm text-white/60">{deliverable.duration || '00:00'}</span>
                  <button className="p-2 rounded-full hover:bg-white/10 transition-colors">
                    <Volume2 className="h-4 w-4 text-white/60" />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-center gap-4 py-4 border-t border-white/5">
          <button className="p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-colors">
            <ChevronLeft className="h-5 w-5" />
          </button>
          <span className="text-sm text-white/50">1 of 3 deliverables</span>
          <button className="p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-colors">
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Right: Review Panel */}
      <div className="w-[420px] bg-[#0a0a0f] border-l border-white/5 flex flex-col">
        {/* Panel Header */}
        <div className="p-6 border-b border-white/5">
          <h3 className="font-semibold text-lg mb-1">Screening Room</h3>
          <p className="text-sm text-white/50">Review and approve deliverables</p>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-white/5">
          {[
            { id: 'preview', label: 'Details' },
            { id: 'details', label: 'Specs' },
            { id: 'history', label: 'History' },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex-1 py-3 text-sm font-medium transition-colors ${
                activeTab === tab.id
                  ? 'text-[#d4af37] border-b-2 border-[#d4af37]'
                  : 'text-white/50 hover:text-white/70'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Panel Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {activeTab === 'preview' && (
            <div className="space-y-6">
              {/* Creator Info */}
              <div className="flex items-center gap-4 p-4 rounded-xl bg-white/[0.02] border border-white/5">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#d4af37]/30 to-transparent flex items-center justify-center">
                  <User className="h-5 w-5 text-[#d4af37]" />
                </div>
                <div>
                  <p className="font-medium">{deliverable.creator}</p>
                  <p className="text-sm text-white/50">{deliverable.department}</p>
                </div>
              </div>

              {/* Quick Info */}
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 rounded-lg bg-white/[0.02] border border-white/5">
                  <p className="text-xs text-white/40 mb-1">Submitted</p>
                  <p className="text-sm font-medium flex items-center gap-1">
                    <Clock className="h-3 w-3 text-white/40" />
                    {deliverable.timestamp.toLocaleDateString()}
                  </p>
                </div>
                <div className="p-3 rounded-lg bg-white/[0.02] border border-white/5">
                  <p className="text-xs text-white/40 mb-1">Version</p>
                  <p className="text-sm font-medium">{deliverable.version}</p>
                </div>
              </div>

              {/* Creator Notes */}
              {deliverable.notes && (
                <div>
                  <p className="text-sm text-white/50 mb-2">Creator Notes</p>
                  <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5">
                    <p className="text-sm text-white/80 leading-relaxed">{deliverable.notes}</p>
                  </div>
                </div>
              )}

              {/* Quick Actions */}
              <div className="flex gap-2">
                <button className="flex-1 p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors flex items-center justify-center gap-1 text-sm">
                  <Star className="h-4 w-4" />
                  Favorite
                </button>
                <button className="flex-1 p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors flex items-center justify-center gap-1 text-sm">
                  <Flag className="h-4 w-4" />
                  Flag
                </button>
              </div>
            </div>
          )}

          {activeTab === 'details' && (
            <div className="space-y-4">
              {[
                { label: 'File Type', value: deliverable.type.toUpperCase() },
                { label: 'Department', value: deliverable.department },
                { label: 'Version', value: deliverable.version },
                { label: 'Created', value: deliverable.timestamp.toLocaleString() },
                { label: 'Duration', value: deliverable.duration || 'N/A' },
              ].map(item => (
                <div key={item.label} className="flex justify-between py-2 border-b border-white/5">
                  <span className="text-white/50">{item.label}</span>
                  <span className="font-medium">{item.value}</span>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'history' && (
            <div className="space-y-3">
              {[
                { action: 'Submitted for review', time: '2 hours ago', by: deliverable.creator },
                { action: 'Revision completed', time: '1 day ago', by: deliverable.creator },
                { action: 'Revision requested', time: '2 days ago', by: 'Producer' },
                { action: 'Initial submission', time: '3 days ago', by: deliverable.creator },
              ].map((item, index) => (
                <div key={index} className="flex items-start gap-3 p-3 rounded-lg bg-white/[0.02]">
                  <div className="w-2 h-2 rounded-full bg-[#d4af37] mt-1.5" />
                  <div>
                    <p className="text-sm">{item.action}</p>
                    <p className="text-xs text-white/40">{item.by} • {item.time}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Notes Input */}
        <div className="p-4 border-t border-white/5">
          <div className="relative">
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Add production notes..."
              className="w-full p-4 pr-12 rounded-xl bg-white/[0.02] border border-white/10 focus:border-[#d4af37]/50 focus:outline-none resize-none text-sm"
              rows={3}
            />
            <button className="absolute right-3 bottom-3 p-2 rounded-lg bg-[#d4af37]/20 text-[#d4af37] hover:bg-[#d4af37]/30 transition-colors">
              <Send className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="p-4 border-t border-white/5 space-y-3">
          <button 
            onClick={onApprove}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-[#d4af37] to-[#c9a227] text-[#0a0a0f] font-semibold flex items-center justify-center gap-2 hover:shadow-[0_0_30px_rgba(212,175,55,0.3)] transition-all"
          >
            <CheckCircle className="h-5 w-5" />
            Approve Take
          </button>
          
          <div className="grid grid-cols-2 gap-3">
            <button 
              onClick={() => notes && onRequestRevision(notes)}
              className="py-2.5 rounded-xl bg-white/5 hover:bg-white/10 transition-colors text-sm font-medium flex items-center justify-center gap-2"
            >
              <RotateCcw className="h-4 w-4" />
              Request Revision
            </button>
            <button 
              onClick={() => notes && onReject(notes)}
              className="py-2.5 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 transition-colors text-sm font-medium flex items-center justify-center gap-2"
            >
              <XCircle className="h-4 w-4" />
              Reject
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ReviewScreen;
