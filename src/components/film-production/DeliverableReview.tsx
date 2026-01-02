// src/components/film-production/DeliverableReview.tsx
import React, { useState } from 'react';
import { useFilmProduction } from './FilmProductionProvider';
import { ProductionArtifact } from '@/services/types';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  CheckCircle,
  XCircle,
  MessageSquare,
  FileText,
  Image,
  Film,
  Music,
  File,
  Download,
  Clock,
  User,
  Sparkles,
  ThumbsUp,
  ThumbsDown,
  RotateCcw,
} from 'lucide-react';

interface DeliverableReviewProps {
  artifact: ProductionArtifact | null;
  isOpen: boolean;
  onClose: () => void;
  onApprove: (id: string, feedback?: string) => void;
  onReject: (id: string, feedback: string) => void;
  onRequestRevision: (id: string, feedback: string) => void;
}

const ARTIFACT_ICONS: Record<string, React.ComponentType<any>> = {
  script: FileText,
  storyboard: Image,
  shot_list: FileText,
  footage: Film,
  audio: Music,
  document: File,
};

/**
 * Deliverable Review Dialog - Producer reviews and approves work
 */
export function DeliverableReview({
  artifact,
  isOpen,
  onClose,
  onApprove,
  onReject,
  onRequestRevision,
}: DeliverableReviewProps) {
  const [feedback, setFeedback] = useState('');
  const [activeTab, setActiveTab] = useState('preview');

  if (!artifact) return null;

  const Icon = ARTIFACT_ICONS[artifact.type] || File;

  const handleApprove = () => {
    onApprove(artifact.id, feedback || undefined);
    setFeedback('');
    onClose();
  };

  const handleReject = () => {
    if (!feedback.trim()) {
      // Show validation
      return;
    }
    onReject(artifact.id, feedback);
    setFeedback('');
    onClose();
  };

  const handleRequestRevision = () => {
    if (!feedback.trim()) {
      return;
    }
    onRequestRevision(artifact.id, feedback);
    setFeedback('');
    onClose();
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, { color: string; icon: React.ComponentType<any> }> = {
      pending_review: { color: 'bg-yellow-500', icon: Clock },
      approved: { color: 'bg-green-500', icon: CheckCircle },
      rejected: { color: 'bg-red-500', icon: XCircle },
      revision_requested: { color: 'bg-orange-500', icon: RotateCcw },
    };
    
    const config = variants[status] || variants.pending_review;
    const StatusIcon = config.icon;
    
    return (
      <Badge className={`${config.color} text-white`}>
        <StatusIcon className="h-3 w-3 mr-1" />
        {status.replace('_', ' ')}
      </Badge>
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Icon className="h-6 w-6 text-primary" />
            </div>
            <div className="flex-1">
              <DialogTitle className="flex items-center gap-2">
                {artifact.name}
                {getStatusBadge(artifact.status)}
              </DialogTitle>
              <DialogDescription className="flex items-center gap-4 mt-1">
                <span className="flex items-center gap-1">
                  <User className="h-3 w-3" />
                  {artifact.createdBy}
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  {new Date(artifact.createdAt).toLocaleDateString()}
                </span>
                <span className="capitalize">{artifact.type.replace('_', ' ')}</span>
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="preview">Preview</TabsTrigger>
            <TabsTrigger value="details">Details</TabsTrigger>
            <TabsTrigger value="history">History</TabsTrigger>
          </TabsList>

          <TabsContent value="preview" className="mt-4">
            <div className="border rounded-lg bg-muted/30 min-h-[300px] p-4">
              {/* Preview based on artifact type */}
              {artifact.type === 'script' && (
                <div className="font-mono text-sm whitespace-pre-wrap">
                  {typeof artifact.content === 'string' 
                    ? artifact.content.slice(0, 2000) + (artifact.content.length > 2000 ? '...' : '')
                    : 'Content preview not available'}
                </div>
              )}
              
              {artifact.type === 'storyboard' && (
                <div className="grid grid-cols-3 gap-4">
                  {Array.isArray(artifact.content) && artifact.content.slice(0, 6).map((frame: any, idx: number) => (
                    <div key={idx} className="aspect-video bg-background rounded border flex items-center justify-center">
                      {frame.imageUrl ? (
                        <img src={frame.imageUrl} alt={`Frame ${idx + 1}`} className="object-cover" />
                      ) : (
                        <Image className="h-8 w-8 text-muted-foreground" />
                      )}
                    </div>
                  ))}
                </div>
              )}
              
              {artifact.type === 'footage' && (
                <div className="flex items-center justify-center h-full">
                  <div className="text-center">
                    <Film className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">Video Preview</p>
                    <Button variant="outline" size="sm" className="mt-2">
                      <Download className="h-4 w-4 mr-2" />
                      Download to View
                    </Button>
                  </div>
                </div>
              )}
              
              {artifact.type === 'audio' && (
                <div className="flex items-center justify-center h-full">
                  <div className="text-center">
                    <Music className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">Audio File</p>
                    {/* Audio player would go here */}
                    <Button variant="outline" size="sm" className="mt-2">
                      <Download className="h-4 w-4 mr-2" />
                      Download
                    </Button>
                  </div>
                </div>
              )}
              
              {!['script', 'storyboard', 'footage', 'audio'].includes(artifact.type) && (
                <div className="flex items-center justify-center h-full">
                  <div className="text-center text-muted-foreground">
                    <File className="h-16 w-16 mx-auto mb-4" />
                    <p>Preview not available for this file type</p>
                  </div>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="details" className="mt-4 space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <Label className="text-muted-foreground">File Type</Label>
                <p className="capitalize">{artifact.type.replace('_', ' ')}</p>
              </div>
              <div className="space-y-1">
                <Label className="text-muted-foreground">Created By</Label>
                <p>{artifact.createdBy}</p>
              </div>
              <div className="space-y-1">
                <Label className="text-muted-foreground">Created At</Label>
                <p>{new Date(artifact.createdAt).toLocaleString()}</p>
              </div>
              <div className="space-y-1">
                <Label className="text-muted-foreground">Version</Label>
                <p>{artifact.version || 'v1'}</p>
              </div>
            </div>
            
            {artifact.metadata && (
              <div className="space-y-2">
                <Label className="text-muted-foreground">Metadata</Label>
                <pre className="bg-muted p-3 rounded text-xs overflow-auto">
                  {JSON.stringify(artifact.metadata, null, 2)}
                </pre>
              </div>
            )}
          </TabsContent>

          <TabsContent value="history" className="mt-4">
            <div className="space-y-3">
              {/* Placeholder for version history */}
              <div className="flex items-start gap-3 p-3 bg-muted/30 rounded-lg">
                <div className="p-1 bg-green-500/20 rounded">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                </div>
                <div className="flex-1">
                  <p className="font-medium text-sm">Created</p>
                  <p className="text-xs text-muted-foreground">
                    {artifact.createdBy} • {new Date(artifact.createdAt).toLocaleString()}
                  </p>
                </div>
              </div>
              
              {artifact.approvedBy && (
                <div className="flex items-start gap-3 p-3 bg-muted/30 rounded-lg">
                  <div className="p-1 bg-blue-500/20 rounded">
                    <ThumbsUp className="h-4 w-4 text-blue-500" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-sm">Approved</p>
                    <p className="text-xs text-muted-foreground">
                      {artifact.approvedBy} • {artifact.approvedAt && new Date(artifact.approvedAt).toLocaleString()}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>

        {/* Feedback Section */}
        {artifact.status === 'pending_review' && (
          <div className="space-y-3 pt-4 border-t">
            <Label htmlFor="feedback">
              <MessageSquare className="h-4 w-4 inline mr-2" />
              Feedback (required for rejection/revision)
            </Label>
            <Textarea
              id="feedback"
              placeholder="Provide feedback for the team..."
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              rows={3}
            />
          </div>
        )}

        <DialogFooter className="flex gap-2 sm:gap-2">
          {artifact.status === 'pending_review' && (
            <>
              <Button variant="outline" onClick={handleReject} disabled={!feedback.trim()}>
                <ThumbsDown className="h-4 w-4 mr-2" />
                Reject
              </Button>
              <Button variant="outline" onClick={handleRequestRevision} disabled={!feedback.trim()}>
                <RotateCcw className="h-4 w-4 mr-2" />
                Request Revision
              </Button>
              <Button onClick={handleApprove}>
                <ThumbsUp className="h-4 w-4 mr-2" />
                Approve
              </Button>
            </>
          )}
          
          {artifact.status !== 'pending_review' && (
            <Button variant="outline" onClick={onClose}>
              Close
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

/**
 * Deliverable List - Shows all artifacts pending review
 */
export function DeliverableList() {
  const { currentProject } = useFilmProduction();
  const [selectedArtifact, setSelectedArtifact] = useState<ProductionArtifact | null>(null);
  
  if (!currentProject) return null;
  
  const artifacts = currentProject.context.artifacts;
  
  const handleApprove = (id: string, feedback?: string) => {
    // Call production system to approve
    console.log('Approving:', id, feedback);
  };
  
  const handleReject = (id: string, feedback: string) => {
    console.log('Rejecting:', id, feedback);
  };
  
  const handleRequestRevision = (id: string, feedback: string) => {
    console.log('Requesting revision:', id, feedback);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Deliverables</h3>
        <Badge variant="secondary">
          {artifacts.filter(a => a.status === 'pending_review').length} pending
        </Badge>
      </div>
      
      <div className="space-y-2">
        {artifacts.map(artifact => {
          const Icon = ARTIFACT_ICONS[artifact.type] || File;
          
          return (
            <div
              key={artifact.id}
              className="flex items-center gap-3 p-3 border rounded-lg hover:bg-muted/50 cursor-pointer transition-colors"
              onClick={() => setSelectedArtifact(artifact)}
            >
              <div className="p-2 bg-muted rounded">
                <Icon className="h-4 w-4" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium truncate">{artifact.name}</p>
                <p className="text-xs text-muted-foreground">
                  {artifact.createdBy} • {new Date(artifact.createdAt).toLocaleDateString()}
                </p>
              </div>
              <Badge variant={
                artifact.status === 'approved' ? 'default' :
                artifact.status === 'rejected' ? 'destructive' :
                'secondary'
              }>
                {artifact.status.replace('_', ' ')}
              </Badge>
            </div>
          );
        })}
        
        {artifacts.length === 0 && (
          <p className="text-center text-muted-foreground py-8">
            No deliverables yet
          </p>
        )}
      </div>
      
      <DeliverableReview
        artifact={selectedArtifact}
        isOpen={!!selectedArtifact}
        onClose={() => setSelectedArtifact(null)}
        onApprove={handleApprove}
        onReject={handleReject}
        onRequestRevision={handleRequestRevision}
      />
    </div>
  );
}
